import { Tasks } from "../../api/resources/embed/resources/tasks/client/Client";
import * as TwelvelabsApi from "../../api/index";

/**
 * Interface defining the parameters for creating a video embedding task
 */
export interface CreateEmbeddingsTaskVideoParams extends Omit<TwelvelabsApi.embed.TasksCreateRequest, "modelName"> {}

/**
 * Wrapper for the EmbedTasks client that adds additional functionality.
 */
export class EmbedTasksWrapper extends Tasks {
    constructor(options: Tasks.Options) {
        super(options);
    }

    /**
     * This method creates multiple video embedding tasks in bulk.
     *
     * @param {Object} request Request parameters
     * @param {string} request.modelName The name of the embedding model to use (e.g., "Marengo-retrieval-2.7").
     * @param {Array<CreateEmbeddingsTaskVideoParams>} request.videos A list of video parameters for creating embedding tasks.
     * @param {Tasks.RequestOptions} [requestOptions] Request-specific configuration.
     *
     * @returns {Promise<TwelvelabsApi.embed.TasksCreateResponse[]>} A list of video embedding tasks that were successfully created.
     *
     * @example
     *     const tasks = await client.embed.tasks.createBulk({
     *         modelName: "Marengo-retrieval-2.7",
     *         videos: [
     *             {
     *                 videoUrl: "https://example.com/video1.mp4",
     *                 videoEmbeddingScopes: ["clip", "video"]
     *             },
     *             {
     *                 videoUrl: "https://example.com/video2.mp4",
     *                 videoEmbeddingScopes: ["clip"]
     *             }
     *         ]
     *     });
     */
    public async createBulk(
        request: {
            modelName: string;
            videos: CreateEmbeddingsTaskVideoParams[];
        },
        requestOptions?: Tasks.RequestOptions,
    ): Promise<TwelvelabsApi.embed.TasksCreateResponse[]> {
        const { modelName, videos } = request;

        if (!videos || videos.length === 0) {
            throw new Error("At least one video must be provided");
        }

        const tasks: TwelvelabsApi.embed.TasksCreateResponse[] = [];

        for (const videoParams of videos) {
            try {
                const req = {} as CreateEmbeddingsTaskVideoParams;
                if (videoParams.videoFile) {
                    req.videoFile = videoParams.videoFile;
                }
                if (videoParams.videoUrl) {
                    req.videoUrl = videoParams.videoUrl;
                }
                if (videoParams.videoStartOffsetSec !== undefined && videoParams.videoStartOffsetSec !== null) {
                    req.videoStartOffsetSec = videoParams.videoStartOffsetSec;
                }
                if (videoParams.videoEndOffsetSec !== undefined && videoParams.videoEndOffsetSec !== null) {
                    req.videoEndOffsetSec = videoParams.videoEndOffsetSec;
                }
                if (videoParams.videoClipLength !== undefined && videoParams.videoClipLength !== null) {
                    req.videoClipLength = videoParams.videoClipLength;
                }
                if (videoParams.videoEmbeddingScope) {
                    req.videoEmbeddingScope = videoParams.videoEmbeddingScope;
                }

                const task = await this.create(
                    {
                        modelName,
                        ...req,
                    },
                    requestOptions,
                );
                tasks.push(task);
            } catch (e) {
                console.error(`Error creating embedding task: ${e}`);
                continue;
            }
        }

        return tasks;
    }

    /**
     * Wait for a task to complete by periodically checking its status.
     *
     * @param {string} taskId The unique identifier of the task to wait for.
     * @param {Object} [options] Options for the wait operation
     * @param {number} [options.sleepInterval=5.0] The time in seconds to wait between status checks
     * @param {Function} [options.callback] A function to call after each status check with the task response
     * @param {Tasks.RequestOptions} [requestOptions] Request-specific configuration
     *
     * @returns {Promise<TwelvelabsApi.embed.TasksStatusResponse>} The completed task response
     *
     * @throws {Error} If sleepInterval is less than or equal to 0
     *
     * @example
     *     const task = await client.embed.tasks.create({
     *         modelName: "Marengo-retrieval-2.7",
     *         videoUrl: "https://example.com/video.mp4"
     *     });
     *
     *     const completedTask = await client.embed.tasks.waitForDone(
     *         task._id,
     *         {
     *             sleepInterval: 10.0,
     *             callback: (task) => console.log(`Current status: ${task.status}`)
     *         }
     *     );
     */
    public async waitForDone(
        taskId: string,
        options?: {
            sleepInterval?: number;
            callback?: (task: TwelvelabsApi.embed.TasksStatusResponse) => void | Promise<void>;
        },
        requestOptions?: Tasks.RequestOptions,
    ): Promise<TwelvelabsApi.embed.TasksStatusResponse> {
        const sleepInterval = options?.sleepInterval ?? 5.0;
        const callback = options?.callback;

        if (sleepInterval <= 0) {
            throw new Error("sleepInterval must be greater than 0");
        }

        // Get initial task
        let task = await this.status(taskId, requestOptions);

        // Check if it's already done
        const doneStatuses = ["ready", "failed"];

        // Continue checking until it's done
        while (!task.status || doneStatuses.indexOf(task.status) === -1) {
            await new Promise((resolve) => setTimeout(resolve, sleepInterval * 1000));

            try {
                task = await this.status(taskId, requestOptions);
            } catch (e) {
                console.error(`Retrieving task status failed: ${e}. Retrying...`);
                continue;
            }

            if (callback) {
                const result = callback(task);
                if (result instanceof Promise) {
                    await result;
                }
            }
        }

        return task;
    }
}

export declare namespace EmbedTasksWrapper {
    interface Options extends Tasks.Options {}
    interface RequestOptions extends Tasks.RequestOptions {}
}
