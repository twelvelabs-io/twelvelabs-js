import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { MultipartUpload } from "../../api/resources/multipartUpload/client/Client";
import * as TwelvelabsApi from "../../api/index";

/**
 * Progress information for upload operations.
 */
export interface UploadProgress {
    /** Total number of chunks */
    totalChunks: number;
    /** Number of completed chunks */
    completedChunks: number;
    /** Upload percentage (0-100) */
    percentage: number;
    /** Current upload status */
    status: string;
}

/**
 * Result of a successful multipart upload.
 */
export interface UploadResult {
    /** The unique identifier of the uploaded asset */
    assetId: string;
    /** The URL to access the uploaded asset */
    assetUrl: string;
}

/**
 * Status information for upload operations.
 */
export interface UploadStatus {
    /** Upload status */
    status: string;
    /** Number of completed chunks */
    completedChunks: number;
    /** Total number of chunks */
    totalChunks: number;
}

/**
 * Custom exception for upload-related errors.
 */
export class UploadError extends Error {
    public readonly chunkIndex?: number;
    public readonly originalError?: Error;

    constructor(message: string, chunkIndex?: number, originalError?: Error) {
        super(message);
        this.name = "UploadError";
        this.chunkIndex = chunkIndex;
        this.originalError = originalError;
    }
}

/**
 * Options for uploading a file.
 */
export interface UploadFileOptions {
    /** Name to use for the asset (defaults to file basename) */
    filename?: string;
    /** Asset type (default: "video") */
    fileType?: TwelvelabsApi.CreateAssetUploadRequestType;
    /** Number of chunks to report in each batch (default: 10) */
    batchSize?: number;
    /** Maximum number of concurrent upload workers (default: 5) */
    maxWorkers?: number;
    /** Optional callback function to track upload progress */
    progressCallback?: (progress: UploadProgress) => void;
    /** Maximum number of retry attempts for failed chunks (default: 3) */
    maxRetries?: number;
    /** Delay in seconds between retry attempts (default: 1.0) */
    retryDelay?: number;
    /** Request-specific configuration */
    requestOptions?: MultipartUpload.RequestOptions;
}

/**
 * Options for waiting for upload completion.
 */
export interface WaitForCompletionOptions {
    /** The time in seconds to wait between status checks (default: 5.0) */
    sleepInterval?: number;
    /** Maximum time to wait in seconds before timing out (default: none) */
    maxWaitTime?: number;
    /** A function to call after each status check with the upload status */
    callback?: (status: UploadStatus) => void;
    /** Request-specific configuration */
    requestOptions?: MultipartUpload.RequestOptions;
}

/**
 * Wrapper for the MultipartUpload client that adds high-level upload functionality.
 */
export class MultipartUploadWrapper extends MultipartUpload {
    constructor(options: MultipartUpload.Options) {
        super(options);
    }

    /**
     * Upload a file using multipart upload with automatic chunking and progress tracking.
     *
     * @param filePath - Path to the file to upload.
     * @param options - Upload configuration options.
     * @returns A promise that resolves to the upload result.
     *
     * @example
     * ```typescript
     * import { TwelveLabs } from "twelvelabs";
     *
     * const client = new TwelveLabs({
     *     apiKey: "YOUR_API_KEY",
     * });
     *
     * // Simple upload
     * const result = await client.multipartUpload.uploadFile("video.mp4");
     * console.log(`Asset ID: ${result.assetId}`);
     * console.log(`Asset URL: ${result.assetUrl}`);
     *
     * // Upload with progress tracking
     * const progressCallback = (progress: UploadProgress) => {
     *     console.log(`Progress: ${progress.percentage.toFixed(1)}% (${progress.completedChunks}/${progress.totalChunks} chunks)`);
     * };
     *
     * const result = await client.multipartUpload.uploadFile("large_video.mp4", {
     *     filename: "my-video.mp4",
     *     progressCallback,
     *     batchSize: 5
     * });
     * console.log(`Upload completed! Asset ID: ${result.assetId}`);
     * ```
     */
    public async uploadFile(filePath: string, options: UploadFileOptions = {}): Promise<UploadResult> {
        const {
            filename = path.basename(filePath),
            fileType = TwelvelabsApi.CreateAssetUploadRequestType.Video,
            batchSize = 10,
            maxWorkers = 5,
            progressCallback,
            maxRetries = 3,
            retryDelay = 1.0,
            requestOptions,
        } = options;

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const totalSize = fs.statSync(filePath).size;
        let chunkFiles: string[] = [];

        try {
            console.log(`Creating upload session for ${filename} (${totalSize.toLocaleString()} bytes)`);

            // Step 1: Create upload session
            const uploadSession = await this.create(
                {
                    filename,
                    type: fileType,
                    totalSize,
                },
                requestOptions,
            );

            if (!uploadSession.uploadId || !uploadSession.chunkSize) {
                throw new UploadError("Invalid upload session response: missing uploadId or chunkSize");
            }

            const uploadId = uploadSession.uploadId;
            const chunkSize = uploadSession.chunkSize;
            console.log(`Upload session created: ${uploadId} (chunk size: ${chunkSize.toLocaleString()} bytes)`);

            // Step 2: Split file into chunks
            chunkFiles = await this._splitFile(filePath, chunkSize);
            const totalChunks = chunkFiles.length;
            console.log(`File split into ${totalChunks} chunks`);

            if (totalChunks === 0) {
                throw new UploadError("No chunks created from file");
            }

            // Step 3: Upload chunks in batches
            const currentUrls: Record<number, string> = {};
            if (uploadSession.uploadUrls) {
                for (const url of uploadSession.uploadUrls) {
                    if (url.chunkIndex && url.url) {
                        currentUrls[url.chunkIndex] = url.url;
                    }
                }
            }

            let completedChunksCount = 0;

            for (let batchStart = 0; batchStart < totalChunks; batchStart += batchSize) {
                const batchEnd = Math.min(batchStart + batchSize, totalChunks);
                const batchChunkFiles = chunkFiles.slice(batchStart, batchEnd);
                const batchIndices = Array.from({ length: batchEnd - batchStart }, (_, i) => batchStart + i + 1); // 1-based indexing

                // Ensure we have URLs for all chunks in this batch
                const missingUrls = batchIndices.filter((idx) => !(idx in currentUrls));
                if (missingUrls.length > 0) {
                    const minChunk = Math.min(...missingUrls);
                    const maxChunk = Math.max(...missingUrls);

                    console.log(`Fetching URLs for chunks ${minChunk}-${maxChunk} (${missingUrls.length} missing)`);
                    const start = minChunk;
                    const count = maxChunk - minChunk + 1;

                    const additionalUrls = await this.getAdditionalPresignedUrls(
                        uploadId,
                        {
                            start,
                            count,
                        },
                        requestOptions,
                    );

                    if (additionalUrls.uploadUrls) {
                        for (const urlInfo of additionalUrls.uploadUrls) {
                            if (urlInfo.chunkIndex && urlInfo.url && missingUrls.includes(urlInfo.chunkIndex)) {
                                currentUrls[urlInfo.chunkIndex] = urlInfo.url;
                            }
                        }
                    }
                }

                // Upload batch chunks in parallel with retry logic
                const batchCompletedChunks = await this._uploadChunkBatchWithRetry(
                    batchChunkFiles,
                    batchIndices,
                    currentUrls,
                    maxWorkers,
                    maxRetries,
                    retryDelay,
                );

                // Report completed batch
                const result = await this.reportChunkBatch(
                    uploadId,
                    {
                        completedChunks: batchCompletedChunks,
                    },
                    requestOptions,
                );

                completedChunksCount += batchCompletedChunks.length;

                // Update progress
                if (progressCallback) {
                    const progress: UploadProgress = {
                        totalChunks,
                        completedChunks: completedChunksCount,
                        percentage: (completedChunksCount / totalChunks) * 100,
                        status: "uploading",
                    };
                    progressCallback(progress);
                }

                // Check if upload is complete
                if (result.url) {
                    console.log(`Upload completed successfully! Asset ID: ${uploadSession.assetId}`);
                    return {
                        assetId: uploadSession.assetId || "",
                        assetUrl: result.url,
                    };
                }
            }

            // All chunks have been uploaded and reported
            console.log(`Upload completed successfully! Asset ID: ${uploadSession.assetId}`);
            return {
                assetId: uploadSession.assetId || "",
                assetUrl: "", // URL will be available after processing
            };
        } catch (error) {
            if (error instanceof UploadError) {
                throw error;
            }
            throw new UploadError(
                `Upload failed: ${error instanceof Error ? error.message : String(error)}`,
                undefined,
                error instanceof Error ? error : undefined,
            );
        } finally {
            // Cleanup temporary files
            if (chunkFiles.length > 0) {
                try {
                    await this._cleanupChunks(chunkFiles);
                } catch (error) {
                    console.warn(`Failed to cleanup chunk files: ${error}`);
                }
            }
        }
    }

    /**
     * Wait for a multipart upload to complete by periodically checking its status.
     *
     * @param uploadId - The unique identifier of the upload session.
     * @param options - Wait configuration options.
     * @returns A promise that resolves to the final upload status.
     *
     * @example
     * ```typescript
     * import { TwelveLabs } from "twelvelabs";
     *
     * const client = new TwelveLabs({
     *     apiKey: "YOUR_API_KEY",
     * });
     *
     * // Start upload in background
     * const uploadId = "507f1f77bcf86cd799439011";
     *
     * // Wait for completion with timeout
     * const completedUpload = await client.multipartUpload.waitForUploadCompletion(uploadId, {
     *     sleepInterval: 10.0,
     *     maxWaitTime: 3600.0, // 1 hour timeout
     * });
     * ```
     */
    public async waitForUploadCompletion(
        uploadId: string,
        options: WaitForCompletionOptions = {},
    ): Promise<UploadStatus> {
        const { sleepInterval = 5.0, maxWaitTime, callback, requestOptions } = options;

        if (sleepInterval <= 0) {
            throw new Error("sleepInterval must be greater than 0");
        }

        const startTime = Date.now();

        while (true) {
            try {
                // Get chunk status
                const chunkStatusPage = await this.getStatus(uploadId, {}, requestOptions);
                const chunkStatusItems: TwelvelabsApi.ChunkInfo[] = [];

                // Collect all chunks from paginated response
                for await (const chunk of chunkStatusPage) {
                    chunkStatusItems.push(chunk);
                }

                let completedChunks = 0;
                let totalChunks = 0;
                const failedChunks: number[] = [];

                // Count completed and failed chunks
                for (const chunk of chunkStatusItems) {
                    totalChunks += 1;
                    if (chunk.status?.valueOf() === "completed") {
                        completedChunks += 1;
                    } else if (chunk.status?.valueOf() === "failed") {
                        if (chunk.index) {
                            failedChunks.push(chunk.index);
                        }
                    }
                }

                // Check for failed chunks
                if (failedChunks.length > 0) {
                    throw new UploadError(`Chunks ${failedChunks.join(", ")} failed to upload`);
                }

                // Create status object
                const status: UploadStatus = {
                    status: completedChunks === totalChunks ? "completed" : "in_progress",
                    completedChunks,
                    totalChunks,
                };

                // Call callback if provided
                if (callback) {
                    callback(status);
                }

                // Check if complete
                if (completedChunks === totalChunks) {
                    return status;
                }

                // Check timeout
                if (maxWaitTime && Date.now() - startTime > maxWaitTime * 1000) {
                    throw new UploadError(`Upload timed out after ${maxWaitTime} seconds`);
                }

                await this._sleep(sleepInterval * 1000);
            } catch (error) {
                if (error instanceof UploadError) {
                    throw error;
                }
                console.warn(`Error checking upload status: ${error}`);
                await this._sleep(sleepInterval * 1000);
            }
        }
    }

    /**
     * Split file into chunks and return list of chunk file paths.
     */
    private async _splitFile(filePath: string, chunkSize: number): Promise<string[]> {
        const chunkFiles: string[] = [];
        const chunkDir = path.join(
            os.tmpdir(),
            `${path.basename(filePath, path.extname(filePath))}_chunks_${Date.now()}`,
        );

        try {
            await fs.promises.mkdir(chunkDir, { recursive: true });

            const fileHandle = await fs.promises.open(filePath, "r");
            let chunkNum = 1;
            let position = 0;

            try {
                while (true) {
                    const buffer = Buffer.alloc(chunkSize);
                    const { bytesRead } = await fileHandle.read(buffer, 0, chunkSize, position);

                    if (bytesRead === 0) {
                        break;
                    }

                    const chunkFile = path.join(chunkDir, `chunk_${chunkNum.toString().padStart(4, "0")}`);
                    await fs.promises.writeFile(chunkFile, buffer.subarray(0, bytesRead));

                    chunkFiles.push(chunkFile);
                    chunkNum++;
                    position += bytesRead;
                }
            } finally {
                await fileHandle.close();
            }
        } catch (error) {
            // Clean up any partial chunks on error
            await this._cleanupChunks(chunkFiles);
            throw new UploadError(
                `Failed to split file into chunks: ${error instanceof Error ? error.message : String(error)}`,
                undefined,
                error instanceof Error ? error : undefined,
            );
        }

        return chunkFiles;
    }

    /**
     * Upload a single chunk to S3 and return ETag.
     */
    private async _uploadChunkToS3(chunkFile: string, presignedUrl: string): Promise<string> {
        try {
            const chunkData = await fs.promises.readFile(chunkFile);

            const response = await fetch(presignedUrl, {
                method: "PUT",
                body: chunkData as unknown as BodyInit,
                headers: {
                    "Content-Type": "application/octet-stream",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const etag = response.headers.get("ETag")?.replace(/"/g, "");
            if (!etag) {
                throw new UploadError("No ETag received from S3 upload");
            }
            return etag;
        } catch (error) {
            throw new UploadError(
                `Failed to upload chunk: ${error instanceof Error ? error.message : String(error)}`,
                undefined,
                error instanceof Error ? error : undefined,
            );
        }
    }

    /**
     * Upload a batch of chunks in parallel with retry logic.
     */
    private async _uploadChunkBatchWithRetry(
        chunkFiles: string[],
        chunkIndices: number[],
        presignedUrls: Record<number, string>,
        maxWorkers: number,
        maxRetries: number,
        retryDelay: number,
    ): Promise<TwelvelabsApi.CompletedChunk[]> {
        const completedChunks: TwelvelabsApi.CompletedChunk[] = [];
        const actualMaxWorkers = Math.min(chunkFiles.length, maxWorkers);

        const uploadChunkWithRetry = async (
            chunkFile: string,
            chunkIndex: number,
        ): Promise<TwelvelabsApi.CompletedChunk> => {
            const presignedUrl = presignedUrls[chunkIndex];
            let lastError: Error | undefined;

            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    const etag = await this._uploadChunkToS3(chunkFile, presignedUrl);
                    const chunkSizeBytes = (await fs.promises.stat(chunkFile)).size;
                    return {
                        chunkIndex,
                        proof: etag,
                        proofType: "etag" as const,
                        chunkSize: chunkSizeBytes,
                    };
                } catch (error) {
                    lastError = error instanceof Error ? error : new Error(String(error));
                    if (attempt < maxRetries) {
                        console.warn(
                            `Chunk ${chunkIndex} upload failed (attempt ${attempt + 1}/${maxRetries + 1}): ${lastError.message}`,
                        );
                        await this._sleep(retryDelay * 1000 * Math.pow(2, attempt)); // Exponential backoff
                    } else {
                        console.error(`Chunk ${chunkIndex} upload failed after ${maxRetries + 1} attempts`);
                    }
                }
            }

            throw new UploadError(
                `Chunk ${chunkIndex} upload failed after ${maxRetries + 1} attempts`,
                chunkIndex,
                lastError,
            );
        };

        // Create promises for all chunks
        const uploadPromises = chunkFiles.map((chunkFile, i) => {
            const chunkIndex = chunkIndices[i];
            return uploadChunkWithRetry(chunkFile, chunkIndex);
        });

        // Process uploads with concurrency limit
        const results = await this._processConcurrently(uploadPromises, actualMaxWorkers);

        for (const result of results) {
            if (result.status === "fulfilled") {
                completedChunks.push(result.value);
            } else {
                const error = result.reason;
                if (error instanceof UploadError) {
                    throw error;
                }
                throw new UploadError(
                    `Chunk upload failed: ${error instanceof Error ? error.message : String(error)}`,
                    undefined,
                    error instanceof Error ? error : undefined,
                );
            }
        }

        return completedChunks;
    }

    /**
     * Process promises with concurrency limit.
     */
    private async _processConcurrently<T>(
        promises: Promise<T>[],
        maxConcurrency: number,
    ): Promise<PromiseSettledResult<T>[]> {
        const results: PromiseSettledResult<T>[] = [];

        for (let i = 0; i < promises.length; i += maxConcurrency) {
            const batch = promises.slice(i, i + maxConcurrency);
            const batchResults = await Promise.allSettled(batch);
            results.push(...batchResults);
        }

        return results;
    }

    /**
     * Clean up temporary chunk files.
     */
    private async _cleanupChunks(chunkFiles: string[]): Promise<void> {
        if (chunkFiles.length === 0) {
            return;
        }

        let chunkDir: string | undefined;

        for (const chunkFile of chunkFiles) {
            try {
                if (fs.existsSync(chunkFile)) {
                    await fs.promises.unlink(chunkFile);
                }
                if (!chunkDir) {
                    chunkDir = path.dirname(chunkFile);
                }
            } catch (error) {
                console.warn(`Failed to delete chunk file ${chunkFile}: ${error}`);
            }
        }

        // Remove chunk directory if empty
        if (chunkDir && fs.existsSync(chunkDir)) {
            try {
                await fs.promises.rmdir(chunkDir);
            } catch {
                // Directory not empty or other error, ignore
            }
        }
    }

    /**
     * Sleep for the specified number of milliseconds.
     */
    private _sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export declare namespace MultipartUploadWrapper {
    interface Options extends MultipartUpload.Options {}
    interface RequestOptions extends MultipartUpload.RequestOptions {}
}
