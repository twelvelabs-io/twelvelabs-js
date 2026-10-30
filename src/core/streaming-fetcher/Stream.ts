import { Readable } from "stream";

export declare namespace Stream {
    interface Args {
        /**
         * The HTTP response stream to read from.
         */
        stream: Readable | ReadableStream;
        /**
         * The event shape to use for parsing the stream data.
         */
        eventShape: JsonEvent | SseEvent;
        /**
         * An abort signal to stop the stream.
         */
        signal?: AbortSignal;
    }

    interface JsonEvent {
        type: "json";
        messageTerminator: string;
    }

    interface SseEvent {
        type: "sse";
        streamTerminator?: string;
    }
}

export class Stream<T> implements AsyncIterable<T> {
    private stream: Readable | ReadableStream;
    private parse: (val: unknown) => Promise<T>;
    private eventShape: Stream.Args["eventShape"];
    private controller: AbortController = new AbortController();

    constructor({ stream, parse, eventShape, signal }: Stream.Args & { parse: (val: unknown) => Promise<T> }) {
        this.stream = stream;
        this.parse = parse;
        this.eventShape = eventShape;
        signal?.addEventListener("abort", () => this.controller.abort());
    }

    private async *iterMessages(): AsyncGenerator<T, void> {
        // This decoder is maintained as protocol code: decoding each transport chunk
        // independently corrupts valid UTF-8 characters split across chunks and can
        // silently replace malformed bytes in identifiers and JSON strings.
        const decoder = new TextDecoder("utf-8", { fatal: true });
        const streamIterator = readableStreamAsyncIterable<Uint8Array>(this.stream);
        const eventShape = this.eventShape;
        const messageTerminator = eventShape.type === "json" ? eventShape.messageTerminator : "\n";
        const streamTerminator = eventShape.type === "sse" ? eventShape.streamTerminator : undefined;
        let sourceEnded = false;
        let buf = "";
        const sseDataLines: string[] = [];
        let sseHasData = false;

        const processSseLine = async (
            line: string,
        ): Promise<{ type: "none" } | { type: "message"; value: T } | { type: "terminator" }> => {
            if (line === "") {
                if (!sseHasData) {
                    return { type: "none" };
                }

                const data = sseDataLines.join("\n");
                sseDataLines.length = 0;
                sseHasData = false;
                if (streamTerminator != null && data === streamTerminator) {
                    return { type: "terminator" };
                }
                return { type: "message", value: await this.parse(JSON.parse(data)) };
            }

            // SSE fields are recognized only at the start of a line. Comments and
            // fields other than data are ignored by the event-stream protocol.
            if (line.startsWith(":")) {
                return { type: "none" };
            }
            const colonIndex = line.indexOf(":");
            const field = colonIndex === -1 ? line : line.slice(0, colonIndex);
            if (field !== "data") {
                return { type: "none" };
            }
            let data = colonIndex === -1 ? "" : line.slice(colonIndex + 1);
            if (data.startsWith(" ")) {
                data = data.slice(1);
            }
            sseHasData = true;
            sseDataLines.push(data);
            return { type: "none" };
        };

        const takeSseLine = (atEndOfStream: boolean): string | undefined => {
            const lineFeedIndex = buf.indexOf("\n");
            const carriageReturnIndex = buf.indexOf("\r");
            let lineEndIndex: number;
            if (lineFeedIndex === -1) {
                lineEndIndex = carriageReturnIndex;
            } else if (carriageReturnIndex === -1) {
                lineEndIndex = lineFeedIndex;
            } else {
                lineEndIndex = Math.min(lineFeedIndex, carriageReturnIndex);
            }

            if (lineEndIndex === -1) {
                return undefined;
            }
            if (buf[lineEndIndex] === "\r" && lineEndIndex === buf.length - 1 && !atEndOfStream) {
                // Wait for the next chunk to distinguish CRLF from a lone CR line ending.
                return undefined;
            }

            const line = buf.slice(0, lineEndIndex);
            const terminatorLength = buf.startsWith("\r\n", lineEndIndex) ? 2 : 1;
            buf = buf.slice(lineEndIndex + terminatorLength);
            return line;
        };

        try {
            while (true) {
                const { value, done } = await streamIterator.next();
                if (done) {
                    sourceEnded = true;
                    break;
                }

                // Keep decoder state between chunks so multibyte code points remain intact.
                buf += decoder.decode(value, { stream: true });

                if (eventShape.type === "json") {
                    let terminatorIndex: number;
                    while ((terminatorIndex = buf.indexOf(messageTerminator)) >= 0) {
                        const line = buf.slice(0, terminatorIndex + messageTerminator.length);
                        buf = buf.slice(terminatorIndex + messageTerminator.length);
                        if (line.trim()) {
                            yield await this.parseJsonMessage(line);
                        }
                    }
                    continue;
                }

                let line: string | undefined;
                while ((line = takeSseLine(false)) !== undefined) {
                    const result = await processSseLine(line);
                    if (result.type === "terminator") {
                        return;
                    }
                    if (result.type === "message") {
                        yield result.value;
                    }
                }
            }

            // Flush the decoder so an incomplete UTF-8 sequence at EOF is reported.
            buf += decoder.decode();

            if (eventShape.type === "json") {
                let terminatorIndex: number;
                while ((terminatorIndex = buf.indexOf(messageTerminator)) >= 0) {
                    const line = buf.slice(0, terminatorIndex + messageTerminator.length);
                    buf = buf.slice(terminatorIndex + messageTerminator.length);
                    if (line.trim()) {
                        yield await this.parseJsonMessage(line);
                    }
                }
                // JSONL permits the final record to end at EOF without a line feed.
                if (buf.trim()) {
                    yield await this.parseJsonMessage(buf);
                }
            } else {
                // A CR can terminate the final SSE line. Incomplete event blocks without
                // a blank-line dispatch boundary remain undispatched at EOF.
                let line: string | undefined;
                while ((line = takeSseLine(true)) !== undefined) {
                    const result = await processSseLine(line);
                    if (result.type === "terminator") {
                        return;
                    }
                    if (result.type === "message") {
                        yield result.value;
                    }
                }
            }
        } finally {
            if (!sourceEnded) {
                try {
                    // Node Readable iterators destroy on return; Web ReadableStream
                    // iterators cancel and release their reader lock on return.
                    await streamIterator.return?.();
                } catch {
                    // Preserve the original decode, parse, transport, or consumer error.
                }
            }
        }
    }

    private async parseJsonMessage(line: string): Promise<T> {
        return this.parse(JSON.parse(line));
    }

    async *[Symbol.asyncIterator](): AsyncIterator<T, void, unknown> {
        yield* this.iterMessages();
    }
}

/**
 * Browser polyfill for ReadableStream
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readableStreamAsyncIterable<T>(stream: any): AsyncIterableIterator<T> {
    if (stream[Symbol.asyncIterator]) {
        return stream[Symbol.asyncIterator]();
    }

    const reader = stream.getReader();
    let released = false;
    const releaseReader = (): void => {
        if (!released) {
            released = true;
            reader.releaseLock();
        }
    };
    return {
        async next() {
            if (released) {
                return { done: true, value: undefined };
            }
            try {
                const result = await reader.read();
                if (result.done) {
                    releaseReader();
                }
                return result;
            } catch (e) {
                releaseReader();
                throw e;
            }
        },
        async return() {
            if (!released) {
                try {
                    await reader.cancel();
                } finally {
                    releaseReader();
                }
            }
            return { done: true, value: undefined };
        },
        [Symbol.asyncIterator]() {
            return this;
        },
    };
}
