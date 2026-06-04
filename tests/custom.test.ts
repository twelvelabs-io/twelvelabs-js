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
import * as TwelvelabsApi from "../src/api";

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
