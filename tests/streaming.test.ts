import { Readable } from "stream";

import { TwelveLabs, TwelvelabsApi } from "../src";
import { Stream } from "../src/core/streaming-fetcher/Stream";

type JsonRecord = Record<string, unknown>;
type SourceKind = "web" | "node";

const encoder = new TextEncoder();
const encode = (value: string): Uint8Array => encoder.encode(value);

function concatenate(...parts: Uint8Array[]): Uint8Array {
    const length = parts.reduce((total, part) => total + part.length, 0);
    const result = new Uint8Array(length);
    let offset = 0;
    for (const part of parts) {
        result.set(part, offset);
        offset += part.length;
    }
    return result;
}

function responseFromChunks(chunks: Uint8Array[], contentType = "application/x-ndjson"): Response {
    return new Response(
        new ReadableStream<Uint8Array>({
            start(controller) {
                for (const chunk of chunks) {
                    controller.enqueue(chunk);
                }
                controller.close();
            },
        }),
        { status: 200, headers: { "Content-Type": contentType } },
    );
}

function jsonResponse(body: unknown): Response {
    return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

function createOpenSource(
    kind: SourceKind,
    chunks: Uint8Array[],
    close = false,
): {
    stream: Readable | ReadableStream<Uint8Array>;
    cancel: jest.Mock;
} {
    const cancel = jest.fn();
    if (kind === "web") {
        const stream = new ReadableStream<Uint8Array>({
            start(controller) {
                for (const chunk of chunks) {
                    controller.enqueue(chunk);
                }
                if (close) {
                    controller.close();
                }
            },
            cancel,
        });
        return { stream, cancel };
    }

    const stream = new Readable({ read() {} });
    for (const chunk of chunks) {
        stream.push(Buffer.from(chunk));
    }
    if (close) {
        stream.push(null);
    }
    return { stream, cancel };
}

async function collect<T>(stream: AsyncIterable<T>): Promise<T[]> {
    const values: T[] = [];
    for await (const value of stream) {
        values.push(value);
    }
    return values;
}

const parseIdentity = async (value: unknown): Promise<JsonRecord> => value as JsonRecord;

describe("stream decoding and framing", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("preserves valid multibyte identifiers split at every byte boundary on the public batch route", async () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const expectedCustomId = "clip_é水🧪";
        const line = encode(
            `${JSON.stringify({ task_id: "task_utf8", custom_id: expectedCustomId, status: "ready" })}\n`,
        );
        const oneByteChunks = Array.from(line, (byte) => Uint8Array.of(byte));
        const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(responseFromChunks(oneByteChunks));

        const results = await client.embed.v2.batches.results("batch_utf8");
        const items = await collect(results);

        expect(items).toHaveLength(1);
        expect(items[0].customId).toBe(expectedCustomId);
        expect(fetchSpy.mock.calls[0][0]).toContain("/embed-v2/batches/batch_utf8/results");
    });

    it("uses LF JSONL framing, ignores blank lines, accepts CRLF, and parses an EOF record", async () => {
        const chunks = [
            encode('{"value":"first"}\r\n\r\n'),
            encode('{"value":"second"}\r\n'),
            encode('{"value":"third"}'),
        ];
        const source = createOpenSource("web", chunks, true);
        const stream = new Stream<JsonRecord>({
            stream: source.stream,
            parse: parseIdentity,
            eventShape: { type: "json", messageTerminator: "\n" },
        });

        await expect(collect(stream)).resolves.toEqual([{ value: "first" }, { value: "second" }, { value: "third" }]);
        expect((source.stream as ReadableStream).locked).toBe(false);
    });

    const invalidUtf8 = concatenate(
        encode('{"task_id":"task_bad","custom_id":"clip_'),
        Uint8Array.of(0xff),
        encode('","status":"ready"}\n'),
    );
    const truncatedUtf8 = concatenate(encode('{"task_id":"task_truncated","custom_id":"clip_'), Uint8Array.of(0xe2));

    it.each([
        { kind: "invalid", raw: false },
        { kind: "invalid", raw: true },
        { kind: "truncated", raw: false },
        { kind: "truncated", raw: true },
    ])("rejects $kind UTF-8 through the $raw HttpResponsePromise surface", async ({ kind, raw }) => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const bytes = kind === "invalid" ? invalidUtf8 : truncatedUtf8;
        const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(responseFromChunks([bytes]));
        const responsePromise = client.embed.v2.batches.results(`batch_${kind}`);
        const results = raw ? (await responsePromise.withRawResponse()).data : await responsePromise;

        await expect(collect(results)).rejects.toHaveProperty("name", "TypeError");
        expect(fetchSpy.mock.calls[0][0]).toContain(`/embed-v2/batches/batch_${kind}/results`);
    });

    it("keeps batch and task HTTP status error mapping outside the stream decoder", async () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const notFound = () =>
            new Response(JSON.stringify({ message: "not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        const fetchSpy = jest
            .spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(notFound())
            .mockResolvedValueOnce(notFound());

        await expect(client.embed.v2.batches.results("missing_batch")).rejects.toBeInstanceOf(
            TwelvelabsApi.NotFoundError,
        );
        await expect(client.embed.v2.tasks.cancel("missing_task")).rejects.toBeInstanceOf(TwelvelabsApi.NotFoundError);
        expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("preserves unknown output item types and extra fields through the public response create route", async () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const outputItem = {
            type: "jockey:future_tool",
            id: "future_tool_1",
            status: "in_progress",
            future_tool_payload: { requestId: "req_123", flags: ["experimental"] },
        };
        jest.spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse({
                id: "resp_unknown",
                type: "response",
                object: "response",
                status: "completed",
                output: [outputItem],
            }),
        );

        const response = await client.responses.create({ knowledgeStoreId: "ks_test", input: [] });

        expect(response.output).toEqual([outputItem]);
    });

    it.each([
        ["completed", "response.completed"],
        ["failed", "response.failed"],
    ] as const)("preserves unknown output items in the public %s stream terminal event", async (status, eventType) => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const outputItem = {
            type: "jockey:future_tool",
            id: "future_tool_1",
            status: "in_progress",
            future_tool_payload: { requestId: "req_123", flags: ["experimental"] },
        };
        const event = {
            type: eventType,
            sequence_number: 1,
            response: {
                id: "resp_unknown",
                type: "response",
                object: "response",
                status,
                output: [outputItem],
            },
        };
        const sse = `event: ${eventType}\ndata: ${JSON.stringify(event)}\n\ndata: [DONE]\n\n`;
        jest.spyOn(globalThis, "fetch").mockResolvedValue(responseFromChunks([encode(sse)], "text/event-stream"));

        const stream = await client.responses.createStream({ knowledgeStoreId: "ks_test", input: [] });
        const events = await collect(stream);

        expect(events).toHaveLength(1);
        expect(events[0].type).toBe(eventType);
        const terminalEvent = events[0] as
            TwelvelabsApi.ResponseStreamEvent.ResponseCompleted | TwelvelabsApi.ResponseStreamEvent.ResponseFailed;
        expect(terminalEvent.response?.output).toEqual([outputItem]);
    });

    it.each(["web", "node"] as const)("releases %s streams after decoding and parsing failures", async (kind) => {
        const cases = [
            { name: "invalid UTF-8", bytes: [invalidUtf8], close: false, parse: parseIdentity },
            { name: "truncated UTF-8", bytes: [truncatedUtf8], close: true, parse: parseIdentity },
            { name: "JSON syntax", bytes: [encode("not-json\n")], close: false, parse: parseIdentity },
            {
                name: "schema parsing",
                bytes: [encode('{"value":"valid"}\n')],
                close: false,
                parse: async (): Promise<JsonRecord> => {
                    throw new Error("schema mismatch");
                },
            },
        ];

        for (const testCase of cases) {
            const source = createOpenSource(kind, testCase.bytes, testCase.close);
            const stream = new Stream<JsonRecord>({
                stream: source.stream,
                parse: testCase.parse,
                eventShape: { type: "json", messageTerminator: "\n" },
            });

            await expect(collect(stream)).rejects.toThrow();
            if (kind === "web") {
                expect((source.stream as ReadableStream).locked).toBe(false);
                if (!testCase.close) {
                    expect(source.cancel).toHaveBeenCalled();
                }
            } else {
                const nodeStream = source.stream as Readable;
                expect(nodeStream.destroyed || nodeStream.readableEnded).toBe(true);
            }
        }
    });

    it.each(["web", "node"] as const)("releases %s streams after transport errors", async (kind) => {
        const transportError = new Error("transport failed");
        const source =
            kind === "web"
                ? {
                      stream: new ReadableStream<Uint8Array>({
                          start: (controller) => controller.error(transportError),
                      }),
                  }
                : {
                      stream: new Readable({
                          read() {
                              this.destroy(transportError);
                          },
                      }),
                  };
        const stream = new Stream<JsonRecord>({
            stream: source.stream,
            parse: parseIdentity,
            eventShape: { type: "json", messageTerminator: "\n" },
        });

        await expect(collect(stream)).rejects.toBe(transportError);
        if (kind === "web") {
            expect((source.stream as ReadableStream).locked).toBe(false);
        } else {
            expect((source.stream as Readable).destroyed).toBe(true);
        }
    });

    it("cancels and unlocks the browser ReadableStream polyfill after decoder failure", async () => {
        const cancel = jest.fn();
        const nativeStream = new ReadableStream<Uint8Array>({
            start(controller) {
                controller.enqueue(invalidUtf8);
            },
            cancel,
        });
        const polyfillInput = {
            getReader: () => nativeStream.getReader(),
        } as unknown as ReadableStream<Uint8Array>;
        const stream = new Stream<JsonRecord>({
            stream: polyfillInput,
            parse: parseIdentity,
            eventShape: { type: "json", messageTerminator: "\n" },
        });

        await expect(collect(stream)).rejects.toHaveProperty("name", "TypeError");
        expect(cancel).toHaveBeenCalled();
        expect(nativeStream.locked).toBe(false);
    });

    it.each(["web", "node"] as const)("cancels %s streams when the consumer stops early", async (kind) => {
        const chunks = [encode('{"value":"first"}\n'), encode('{"value":"second"}\n')];
        const source = createOpenSource(kind, chunks);
        const stream = new Stream<JsonRecord>({
            stream: source.stream,
            parse: parseIdentity,
            eventShape: { type: "json", messageTerminator: "\n" },
        });
        const received: JsonRecord[] = [];

        for await (const value of stream) {
            received.push(value);
            break;
        }

        expect(received).toEqual([{ value: "first" }]);
        if (kind === "web") {
            expect(source.cancel).toHaveBeenCalled();
            expect((source.stream as ReadableStream).locked).toBe(false);
        } else {
            expect((source.stream as Readable).destroyed).toBe(true);
        }
    });

    it("uses SSE field and event boundaries and only stops on the complete terminal data payload", async () => {
        const cancel = jest.fn();
        const bytes = encode(
            [
                'xdata: {"text":"not a data field"}',
                "",
                'data: {"text":"contains 水🧪 and [DONE] as ordinary JSON text"}',
                "",
                'data: {"text":"second event"}',
                "",
                "data: [DONE]",
                "",
                'data: {"text":"must remain unread"}',
                "",
            ].join("\r\n"),
        );
        const oneByteChunks = Array.from(bytes, (byte) => Uint8Array.of(byte));
        const source = new ReadableStream<Uint8Array>({
            start(controller) {
                for (const chunk of oneByteChunks) {
                    controller.enqueue(chunk);
                }
            },
            cancel,
        });
        const stream = new Stream<{ text: string }>({
            stream: source,
            parse: async (value) => value as { text: string },
            eventShape: { type: "sse", streamTerminator: "[DONE]" },
        });

        await expect(collect(stream)).resolves.toEqual([
            { text: "contains 水🧪 and [DONE] as ordinary JSON text" },
            { text: "second event" },
        ]);
        expect(cancel).toHaveBeenCalled();
        expect(source.locked).toBe(false);
    });
});
