import { Tasks } from "../../api/resources/tasks/client/Client";
import * as TwelvelabsApi from "../../api/index";

/**
 * Wrapper for the Tasks client that adds additional functionality.
 */
export class TasksWrapper extends Tasks {
    constructor(options: Tasks.Options) {
        super(options);
    }

    /**
     * This method creates multiple video indexing tasks that upload and index videos in bulk.
     * Ensure your videos meet the requirements in the Prerequisites section of the Upload single videos page.
     *
     * Upload options:
     * - **Local files**: Use the `videoFiles` parameter to provide an array of files.
     * - **Publicly accessible URLs**: Use the `videoUrls` parameter to provide an array of URLs.
     *
     * @param {Object} request Request parameters
     * @param {string} request.indexId The unique identifier of the index to which the videos are being uploaded.
     * @param {File[]} [request.videoFiles] An array of video files to upload and index.
     * @param {string[]} [request.videoUrls] An array of publicly accessible URLs of videos to upload and index.
     * @param {boolean} [request.enableVideoStream] This parameter indicates if the platform stores the videos for streaming.
     * @param {Tasks.RequestOptions} [requestOptions] Request-specific configuration.
     *
     * @returns {Promise<TwelvelabsApi.TasksCreateResponse[]>} A list of video indexing tasks that were successfully created.
     *
     * @throws {Error} If neither videoFiles nor videoUrls is provided
     *
     * @example
     *     const tasks = await client.tasks.createBulk({
     *         indexId: "index_id",
     *         videoUrls: ["https://example.com/video1.mp4", "https://example.com/video2.mp4"]
     *     });
     */
    public async createBulk(
        request: {
            indexId: string;
            videoFiles?: File[];
            videoUrls?: string[];
            enableVideoStream?: boolean;
        },
        requestOptions?: Tasks.RequestOptions
    ): Promise<TwelvelabsApi.TasksCreateResponse[]> {
        const { indexId, videoFiles, videoUrls, enableVideoStream } = request;

        if (!videoFiles && !videoUrls) {
            throw new Error("Either videoFiles or videoUrls must be provided");
        }

        const tasks: TwelvelabsApi.TasksCreateResponse[] = [];

        if (videoFiles) {
            for (const videoFile of videoFiles) {
                try {
                    const task = await this.create(
                        {
                            indexId,
                            videoFile,
                            enableVideoStream,
                        },
                        requestOptions
                    );
                    tasks.push(task);
                } catch (e) {
                    console.error(`Error processing file: ${e}`);
                    continue;
                }
            }
        }

        if (videoUrls) {
            for (const videoUrl of videoUrls) {
                try {
                    const task = await this.create(
                        {
                            indexId,
                            videoUrl,
                            enableVideoStream,
                        },
                        requestOptions
                    );
                    tasks.push(task);
                } catch (e) {
                    console.error(`Error processing url ${videoUrl}: ${e}`);
                    continue;
                }
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
     * @returns {Promise<TwelvelabsApi.TasksRetrieveResponse>} The completed task response
     *
     * @throws {Error} If sleepInterval is less than or equal to 0
     *
     * @example
     *     const task = await client.tasks.create({
     *         indexId: "index_id",
     *         videoUrl: "https://example.com/video.mp4"
     *     });
     *
     *     const completedTask = await client.tasks.waitForDone(
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
            callback?: (task: TwelvelabsApi.TasksRetrieveResponse) => void | Promise<void>;
        },
        requestOptions?: Tasks.RequestOptions
    ): Promise<TwelvelabsApi.TasksRetrieveResponse> {
        const sleepInterval = options?.sleepInterval ?? 5.0;
        const callback = options?.callback;

        if (sleepInterval <= 0) {
            throw new Error("sleepInterval must be greater than 0");
        }

        // Get initial task
        let task = await this.retrieve(taskId, requestOptions);

        // Check if it's already done
        const doneStatuses = ["ready", "failed"];

        // Continue checking until it's done
        while (!task.status || doneStatuses.indexOf(task.status) === -1) {
            await new Promise((resolve) => setTimeout(resolve, sleepInterval * 1000));

            try {
                task = await this.retrieve(taskId, requestOptions);
            } catch (e) {
                console.error(`Retrieving task failed: ${e}. Retrying...`);
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

export declare namespace TasksWrapper {
    interface Options extends Tasks.Options {}
    interface RequestOptions extends Tasks.RequestOptions {}
}
