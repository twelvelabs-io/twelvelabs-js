/**
 * This is a custom test file, if you wish to add more tests
 * to your SDK.
 * Be sure to mark this file in `.fernignore`.
 *
 * If you include example requests/responses in your fern definition,
 * you will have tests automatically generated for you.
 */
import { TasksWrapper } from "../src/wrapper/resources/TasksWrapper";
import { EmbedTasksWrapper } from "../src/wrapper/resources/EmbedTasksWrapper";
import { TwelveLabs, TwelvelabsApi, TwelvelabsApiClient } from "../src";

const makeIndexingTask = (
    status: string,
    overrides: Partial<TwelvelabsApi.TasksRetrieveResponse> = {},
): TwelvelabsApi.TasksRetrieveResponse => ({
    id: "task_123",
    status,
    ...overrides,
});

const makeEmbedStatus = (
    status: string,
    overrides: Partial<TwelvelabsApi.embed.TasksStatusResponse> = {},
): TwelvelabsApi.embed.TasksStatusResponse => ({
    id: "embed_task_123",
    status,
    ...overrides,
});

describe("TwelveLabs Embed v2 task legacy forbidden errors", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it.each([
        ["retrieve", "GET", "/embed-v2/tasks/task_legacy_403"],
        ["cancel", "POST", "/embed-v2/tasks/task_legacy_403/cancel"],
    ] as const)("preserves ForbiddenError for task %s", async (operation, method, path) => {
        const body = { code: "read_not_allowed", message: "Task is outside the account." };
        const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify(body), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }),
        );
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        let caught: unknown;

        try {
            const response =
                operation === "retrieve"
                    ? client.embed.v2.tasks.retrieve("task_legacy_403")
                    : client.embed.v2.tasks.cancel("task_legacy_403");
            await response;
        } catch (error) {
            caught = error;
        }

        expect(caught).toBeInstanceOf(TwelvelabsApi.ForbiddenError);
        expect(caught).toMatchObject({ statusCode: 403, body });
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(String(fetchSpy.mock.calls[0][0])).toContain(path);
        expect(fetchSpy.mock.calls[0][1]?.method).toBe(method);
    });
});

describe("TwelveLabs public Embed v2 batch resource", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("creates a Batch through the package entry point and preserves fractional offsets", async () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const request: Parameters<typeof client.embed.v2.batches.create>[0] = {
            modelName: "marengo3.5",
            serviceTier: "flex",
            inputType: "video",
            requests: [
                {
                    customId: "clip_001",
                    video: {
                        mediaSource: { url: "https://example.com/clip.mp4" },
                        startSec: 2.5,
                        endSec: 7.5,
                    },
                },
            ],
        };
        const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(
                JSON.stringify({
                    batch_id: "batch_001",
                    model_name: "marengo3.5",
                    service_tier: "flex",
                    input_type: "video",
                    status: "pending",
                    total_items: 1,
                    queued_items: 1,
                    processing_items: 0,
                    ready_items: 0,
                    failed_items: 0,
                    canceled_items: 0,
                    created_at: "2026-10-28T00:00:00Z",
                    expires_at: "2026-10-29T00:00:00Z",
                    items: [{ task_id: "task_001", custom_id: "clip_001", status: "queued" }],
                }),
                { status: 201, headers: { "Content-Type": "application/json" } },
            ),
        );

        const batch = await client.embed.v2.batches.create(request);

        expect(batch.batchId).toBe("batch_001");
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy.mock.calls[0][0]).toContain("/embed-v2/batches");
        expect(fetchSpy.mock.calls[0][1]?.method).toBe("POST");
        expect(JSON.parse(String(fetchSpy.mock.calls[0][1]?.body))).toMatchObject({
            requests: [
                {
                    custom_id: "clip_001",
                    video: { start_sec: 2.5, end_sec: 7.5 },
                },
            ],
        });
    });

    it("preserves unknown batch and item statuses from the API", async () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(
                JSON.stringify({
                    batch_id: "batch_002",
                    model_name: "marengo3.5",
                    service_tier: "flex",
                    input_type: "video",
                    status: "future_batch_status",
                    total_items: 1,
                    queued_items: 1,
                    processing_items: 0,
                    ready_items: 0,
                    failed_items: 0,
                    canceled_items: 0,
                    created_at: "2026-10-28T00:00:00Z",
                    expires_at: "2026-10-29T00:00:00Z",
                    items: [{ task_id: "task_002", custom_id: "clip_002", status: "future_item_status" }],
                }),
                { status: 200, headers: { "Content-Type": "application/json" } },
            ),
        );

        const batch = await client.embed.v2.batches.retrieve("batch_002");

        expect(batch.status).toBe("future_batch_status");
        expect(batch.items?.[0]?.status).toBe("future_item_status");
        expect(fetchSpy.mock.calls[0][0]).toContain("/embed-v2/batches/batch_002");
        expect(fetchSpy.mock.calls[0][1]?.method).toBe("GET");
    });

    it("keeps the list status request filter limited to documented values", async () => {
        const futureResponseStatus: TwelvelabsApi.EmbeddingTaskResponseStatus = "future_task_status";
        const futureBatchStatus: TwelvelabsApi.EmbeddingBatchStatus = "future_batch_status";
        const legacyTaskError: TwelvelabsApi.EmbeddingTaskResponseError = { message: "failed" };
        const taskError: TwelvelabsApi.EmbeddingTaskError = { code: "INTERNAL_SERVER_ERROR", message: "failed" };
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const request: NonNullable<Parameters<typeof client.embed.v2.batches.list>[0]> = {
            // @ts-expect-error Request filters stay strict even when response statuses are forward compatible.
            status: "future_batch_status",
        };
        const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ data: [], page_info: { page: 1, total_page: 1, total_results: 0 } }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }),
        );
        const validRequest: Parameters<typeof client.embed.v2.batches.list>[0] = {
            clientBatchId: "batch_external_001",
            page: 1,
            pageLimit: 1,
        };
        await client.embed.v2.batches.list(validRequest);

        expect(request.status).toBe("future_batch_status");
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy.mock.calls[0][0]).toContain("/embed-v2/batches");
        expect(fetchSpy.mock.calls[0][0]).toContain("client_batch_id=batch_external_001");
        expect(fetchSpy.mock.calls[0][1]?.method).toBe("GET");
        expect([futureResponseStatus, futureBatchStatus, legacyTaskError.message, taskError.code]).toEqual([
            "future_task_status",
            "future_batch_status",
            "failed",
            "INTERNAL_SERVER_ERROR",
        ]);
    });

    it("keeps the existing public task status constants", () => {
        expect(TwelvelabsApi.EmbeddingTaskResponseStatus.Processing).toBe("processing");
        expect(TwelvelabsApi.EmbeddingTaskResponseStatus.Ready).toBe("ready");
        expect(TwelvelabsApi.EmbeddingTaskResponseStatus.Failed).toBe("failed");
        expect(TwelvelabsApi.EmbeddingTaskResponseStatus.Queued).toBe("queued");
        expect(TwelvelabsApi.EmbeddingTaskResponseStatus.Canceled).toBe("canceled");
        expect(TwelvelabsApi.embed.v2.TasksCreateResponseStatus.Queued).toBe("queued");
        expect(TwelvelabsApi.embed.v2.TasksCreateResponseStatus.Processing).toBe("processing");
        expect(TwelvelabsApi.embed.v2.tasks.TasksCreateResponseStatus.Processing).toBe("processing");
        expect(TwelvelabsApi.EmbeddingBatchStatus.Pending).toBe("pending");
        expect(TwelvelabsApi.EmbeddingBatchItemStatus.Queued).toBe("queued");
    });

    it("streams multiple JSONL results through the Embed v2 batch resource", async () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const lines = [
            { task_id: "task_003", custom_id: "clip_003", status: "ready" },
            { task_id: "task_004", custom_id: "clip_004", status: "future_item_status" },
            {
                task_id: "task_005",
                custom_id: "clip_005",
                status: "failed",
                error: { code: "source_error", message: "The source could not be processed." },
            },
        ];
        const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(`${lines.map((line) => JSON.stringify(line)).join("\n")}\n`, {
                status: 200,
                headers: { "Content-Type": "application/x-ndjson" },
            }),
        );

        const results = await client.embed.v2.batches.results("batch_003");
        const items = [];
        for await (const item of results) {
            items.push(item);
        }

        expect(items).toHaveLength(3);
        expect(items.map((item) => item.status)).toEqual(["ready", "future_item_status", "failed"]);
        expect(items.map((item) => item.customId)).toEqual(["clip_003", "clip_004", "clip_005"]);
        expect(items[2].error).toEqual({ code: "source_error", message: "The source could not be processed." });
        expect(fetchSpy.mock.calls[0][0]).toContain("/embed-v2/batches/batch_003/results");
        expect(fetchSpy.mock.calls[0][1]?.method).toBe("GET");
    });

    it("forwards batch and task cancellation through their Embed v2 resources", async () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const fetchSpy = jest
            .spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        batch_id: "batch_004",
                        model_name: "marengo3.5",
                        service_tier: "flex",
                        input_type: "video",
                        status: "canceling",
                        total_items: 1,
                        queued_items: 1,
                        processing_items: 0,
                        ready_items: 0,
                        failed_items: 0,
                        canceled_items: 0,
                        created_at: "2026-10-28T00:00:00Z",
                        expires_at: "2026-10-29T00:00:00Z",
                        items: [{ task_id: "task_004", custom_id: "clip_004", status: "queued" }],
                    }),
                    { status: 200, headers: { "Content-Type": "application/json" } },
                ),
            )
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({ _id: "task_005", status: "canceled", cancellation_reason: "user_requested" }),
                    { status: 200, headers: { "Content-Type": "application/json" } },
                ),
            );

        const batch = await client.embed.v2.batches.cancel("batch_004");
        const task = await client.embed.v2.tasks.cancel("task_005");

        expect(batch.status).toBe("canceling");
        expect(task.id).toBe("task_005");
        expect(task.cancellationReason).toBe("user_requested");
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(fetchSpy.mock.calls[0][0]).toContain("/embed-v2/batches/batch_004/cancel");
        expect(fetchSpy.mock.calls[0][1]?.method).toBe("POST");
        expect(fetchSpy.mock.calls[1][0]).toContain("/embed-v2/tasks/task_005/cancel");
        expect(fetchSpy.mock.calls[1][1]?.method).toBe("POST");
    });

    it("deletes batches through the Embed v2 batch resource", async () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

        await client.embed.v2.batches.delete("batch_006");

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy.mock.calls[0][0]).toContain("/embed-v2/batches/batch_006");
        expect(fetchSpy.mock.calls[0][1]?.method).toBe("DELETE");
    });

    it("exposes knowledge store item tags through the public wrapper", async () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ data: [], page_info: { page: 1, total_page: 1, total_results: 0 } }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }),
        );

        await client.knowledgeStoreItemTags.list("ks_001", "item_001");

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy.mock.calls[0][0]).toContain("/knowledge-stores/ks_001/items/item_001/tags");
        expect(fetchSpy.mock.calls[0][1]?.method).toBe("GET");
    });
});

describe("TwelveLabs public resource forwarding", () => {
    it("forwards every generated resource getter through the public client", () => {
        const client = new TwelveLabs({ apiKey: "test-api-key" });
        const publicResources = client as unknown as Record<string, unknown>;
        const generatedResourceGetters = Object.entries(Object.getOwnPropertyDescriptors(TwelvelabsApiClient.prototype))
            .filter(([, descriptor]) => typeof descriptor.get === "function")
            .map(([name]) => name);
        const missingResources = generatedResourceGetters.filter((name) => publicResources[name] === undefined);

        expect(missingResources).toEqual([]);
    });
});

describe("public Responses enum compatibility", () => {
    it("keeps the package-root TwelvelabsApi runtime constants and type imports", () => {
        const outputType: TwelvelabsApi.ResponseOutputItemType = TwelvelabsApi.ResponseOutputItemType.Message;
        const outputRole: TwelvelabsApi.ResponseOutputItemRole = TwelvelabsApi.ResponseOutputItemRole.Assistant;
        const annotationType: TwelvelabsApi.ResponseAnnotationType = TwelvelabsApi.ResponseAnnotationType.VideoCitation;
        const expandedOutputItem: TwelvelabsApi.ResponseOutputItem = {
            id: "ws_007",
            type: "jockey:web_search",
            status: "searching",
        };
        const expandedAnnotation: TwelvelabsApi.ResponseAnnotation = {
            type: "url_citation",
            startIndex: 0,
            endIndex: 9,
            title: "Example",
            url: "https://example.com",
        };
        // @ts-expect-error The legacy exported output type remains the base-branch enum, not the expanded union.
        const addedOutputType: TwelvelabsApi.ResponseOutputItemType = "jockey:web_search";
        // @ts-expect-error URL citations were added later and are not in the legacy exported annotation type.
        const addedAnnotationType: TwelvelabsApi.ResponseAnnotationType = "url_citation";

        expect(TwelvelabsApi.ResponseOutputItemType).toEqual({
            Message: "message",
            FunctionCall: "function_call",
            FunctionCallOutput: "function_call_output",
        });
        expect(TwelvelabsApi.ResponseOutputItemRole).toEqual({ Assistant: "assistant" });
        expect(TwelvelabsApi.ResponseAnnotationType).toEqual({
            VideoCitation: "video_citation",
            ImageCitation: "image_citation",
            CollectionCitation: "collection_citation",
        });
        expect([outputType, outputRole, annotationType]).toEqual(["message", "assistant", "video_citation"]);
        expect([expandedOutputItem.type, expandedAnnotation.type]).toEqual(["jockey:web_search", "url_citation"]);
        expect([addedOutputType, addedAnnotationType]).toEqual(["jockey:web_search", "url_citation"]);
    });
});

describe("TasksWrapper.waitForDone", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    // Regression (QA-3371): a task that is already terminal at entry must still
    // fire the callback exactly once. `retrieve` being called exactly once proves
    // the polling loop body — and therefore its `setTimeout` sleep — never ran.
    it("fires the callback once for a task that is already ready at entry", async () => {
        const wrapper = new TasksWrapper({ apiKey: "test-api-key" });
        const retrieveSpy = jest.spyOn(wrapper, "retrieve").mockResolvedValueOnce(makeIndexingTask("ready"));
        const callback = jest.fn();

        const result = await wrapper.waitForDone("task_123", { callback });

        expect(retrieveSpy).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ status: "ready" }));
        expect(result.status).toBe("ready");
    });

    it("fires the callback once for a task that is already failed at entry", async () => {
        const wrapper = new TasksWrapper({ apiKey: "test-api-key" });
        const retrieveSpy = jest.spyOn(wrapper, "retrieve").mockResolvedValueOnce(makeIndexingTask("failed"));
        const callback = jest.fn();

        const result = await wrapper.waitForDone("task_123", { callback });

        expect(retrieveSpy).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ status: "failed" }));
        expect(result.status).toBe("failed");
    });

    it("invokes the callback for each observed status, including the initial and terminal ones", async () => {
        jest.useFakeTimers();
        const wrapper = new TasksWrapper({ apiKey: "test-api-key" });
        const retrieveSpy = jest
            .spyOn(wrapper, "retrieve")
            .mockResolvedValueOnce(makeIndexingTask("pending"))
            .mockResolvedValueOnce(makeIndexingTask("indexing"))
            .mockResolvedValueOnce(makeIndexingTask("ready"));
        const observed: string[] = [];

        const promise = wrapper.waitForDone("task_123", {
            sleepInterval: 5,
            callback: (task) => {
                observed.push(task.status!);
            },
        });
        await jest.runAllTimersAsync();
        const result = await promise;

        expect(retrieveSpy).toHaveBeenCalledTimes(3);
        expect(observed).toEqual(["pending", "indexing", "ready"]);
        expect(result.status).toBe("ready");
    });

    it("resolves without throwing when no callback is provided and the task is already ready", async () => {
        const wrapper = new TasksWrapper({ apiKey: "test-api-key" });
        jest.spyOn(wrapper, "retrieve").mockResolvedValueOnce(makeIndexingTask("ready"));

        await expect(wrapper.waitForDone("task_123")).resolves.toEqual(expect.objectContaining({ status: "ready" }));
    });

    it("awaits an async callback before resolving", async () => {
        const wrapper = new TasksWrapper({ apiKey: "test-api-key" });
        jest.spyOn(wrapper, "retrieve").mockResolvedValueOnce(makeIndexingTask("ready"));
        const order: string[] = [];
        const callback = jest.fn(async () => {
            // Defer the side effect by a microtask so the ordering only holds if
            // `waitForDone` actually awaits the returned promise.
            await Promise.resolve();
            order.push("callback");
        });

        await wrapper.waitForDone("task_123", { callback });
        order.push("after-await");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(order).toEqual(["callback", "after-await"]);
    });
});

describe("EmbedTasksWrapper.waitForDone", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    it("fires the callback once for a task that is already ready at entry", async () => {
        const wrapper = new EmbedTasksWrapper({ apiKey: "test-api-key" });
        const statusSpy = jest.spyOn(wrapper, "status").mockResolvedValueOnce(makeEmbedStatus("ready"));
        const callback = jest.fn();

        const result = await wrapper.waitForDone("embed_task_123", { callback });

        expect(statusSpy).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ status: "ready" }));
        expect(result.status).toBe("ready");
    });

    it("fires the callback once for a task that is already failed at entry", async () => {
        const wrapper = new EmbedTasksWrapper({ apiKey: "test-api-key" });
        const statusSpy = jest.spyOn(wrapper, "status").mockResolvedValueOnce(makeEmbedStatus("failed"));
        const callback = jest.fn();

        const result = await wrapper.waitForDone("embed_task_123", { callback });

        expect(statusSpy).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ status: "failed" }));
        expect(result.status).toBe("failed");
    });

    it("invokes the callback for each observed status, including the initial and terminal ones", async () => {
        jest.useFakeTimers();
        const wrapper = new EmbedTasksWrapper({ apiKey: "test-api-key" });
        const statusSpy = jest
            .spyOn(wrapper, "status")
            .mockResolvedValueOnce(makeEmbedStatus("processing"))
            .mockResolvedValueOnce(makeEmbedStatus("ready"));
        const observed: string[] = [];

        const promise = wrapper.waitForDone("embed_task_123", {
            sleepInterval: 5,
            callback: (task) => {
                observed.push(task.status!);
            },
        });
        await jest.runAllTimersAsync();
        const result = await promise;

        expect(statusSpy).toHaveBeenCalledTimes(2);
        expect(observed).toEqual(["processing", "ready"]);
        expect(result.status).toBe("ready");
    });

    it("resolves without throwing when no callback is provided and the task is already ready", async () => {
        const wrapper = new EmbedTasksWrapper({ apiKey: "test-api-key" });
        jest.spyOn(wrapper, "status").mockResolvedValueOnce(makeEmbedStatus("ready"));

        await expect(wrapper.waitForDone("embed_task_123")).resolves.toEqual(
            expect.objectContaining({ status: "ready" }),
        );
    });

    it("awaits an async callback before resolving", async () => {
        const wrapper = new EmbedTasksWrapper({ apiKey: "test-api-key" });
        jest.spyOn(wrapper, "status").mockResolvedValueOnce(makeEmbedStatus("ready"));
        const order: string[] = [];
        const callback = jest.fn(async () => {
            await Promise.resolve();
            order.push("callback");
        });

        await wrapper.waitForDone("embed_task_123", { callback });
        order.push("after-await");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(order).toEqual(["callback", "after-await"]);
    });
});
