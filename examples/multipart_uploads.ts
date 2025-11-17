/**
 * Example: Using the MultipartUploadWrapper for easy multipart uploads
 *
 * This example demonstrates how to use the high-level upload functionality
 * provided by the MultipartUploadWrapper, which abstracts away the complexity
 * of multipart uploads with robust error handling, retry logic, and progress tracking.
 *
 * Features demonstrated:
 * - Simple file uploads with progress tracking
 * - Error handling and retry mechanisms
 * - Batch uploads and monitoring
 * - Timeout handling
 * - Multiple concurrent uploads
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import { TwelveLabs } from "twelvelabs-js";
import { UploadError, UploadProgress } from "twelvelabs-js";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.log("⚠️  Please set API_KEY environment variable with your actual API key.");
    console.log("   You can get your API key from: https://dashboard.twelvelabs.io");
}

/**
 * Example of file upload with progress tracking and error handling.
 */
async function uploadExample(): Promise<void> {
    console.log("=== Upload Example ===");

    // Initialize client
    const client = new TwelveLabs({
        apiKey: API_KEY,
    });

    // Progress callback function with enhanced reporting
    let lastProgressPercent = -1;
    const progressCallback = (progress: UploadProgress): void => {
        const percent = Math.floor(progress.percentage);
        // Only show progress at 25%, 50%, 75%, 100%
        if (
            percent !== lastProgressPercent &&
            (percent === 25 || percent === 50 || percent === 75 || percent === 100)
        ) {
            console.log(`   Upload Progress: ${percent}% (${progress.completedChunks}/${progress.totalChunks} chunks)`);
            lastProgressPercent = percent;
        }
    };

    try {
        // Upload with custom parameters and progress tracking
        const filePath = "downloads/example_video.mp4"; // Downloaded video file
        console.log(`\nStarting upload of ${filePath}...`);

        const result = await client.multipartUpload.uploadFile(filePath, {
            filename: "my-uploaded-video.mp4",
            fileType: "video",
            batchSize: 5, // Process chunks in smaller batches
            maxWorkers: 3, // Use fewer concurrent workers for stability
            maxRetries: 3, // Retry failed chunks up to 3 times
            retryDelay: 1.0, // Wait 1 second between retries (exponential backoff)
            progressCallback,
        });

        console.log(`✅ Upload completed! Asset ID: ${result.assetId}`);
        if (result.assetUrl) {
            console.log(`📁 Asset URL: ${result.assetUrl}`);
        }
    } catch (error) {
        if (error instanceof Error && error.message.includes("ENOENT")) {
            console.log(`❌ File not found: ${error.message}`);
        } else if (error instanceof UploadError) {
            console.log(`❌ Upload failed: ${error.message}`);
            if (error.chunkIndex) {
                console.log(`   Failed at chunk: ${error.chunkIndex}`);
            }
            if (error.originalError) {
                console.log(`   Original error: ${error.originalError.message}`);
            }
        } else {
            console.log(`❌ Unexpected error: ${error}`);
        }
    }
}

/**
 * Example of starting an upload and waiting for completion with timeout.
 */
async function uploadWithWaitExample(): Promise<void> {
    console.log("\n=== Upload with Wait Example ===");

    const client = new TwelveLabs({
        apiKey: API_KEY,
    });

    try {
        // Start upload
        console.log("Starting upload...");
        const result = await client.multipartUpload.uploadFile("downloads/example_video.mp4");
        console.log(`✅ Upload completed! Asset ID: ${result.assetId}`);

        // Example of waiting for upload completion (if you had an upload_id from a background process)
        // This is useful when you want to monitor an upload that was started elsewhere
        /*
    const uploadId = "some_upload_id_from_background_process";
    console.log(`Waiting for upload ${uploadId} to complete...`);
    
    const completedUpload = await client.multipartUpload.waitForUploadCompletion(uploadId, {
        sleepInterval: 5.0,
        maxWaitTime: 3600.0,  // 1 hour timeout
        callback: statusCallback
    });
    console.log(`✅ Upload monitoring completed! Status: ${completedUpload.status}`);
    */

        console.log("💡 Tip: Use waitForUploadCompletion() to monitor uploads started in background processes");
    } catch (error) {
        if (error instanceof UploadError) {
            console.log(`❌ Upload failed: ${error.message}`);
        } else {
            console.log(`❌ Unexpected error: ${error}`);
        }
    }
}

/**
 * Download video files from Google's sample video URLs to the downloads directory.
 */
async function downloadSampleVideos(): Promise<string> {
    const videoUrls = [
        {
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            filename: "example_video.mp4",
            title: "For Bigger Blazes",
        },
        {
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            filename: "video1.mp4",
            title: "For Bigger Escape",
        },
        {
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            filename: "video2.mp4",
            title: "For Bigger Fun",
        },
    ];

    // Create downloads directory if it doesn't exist
    const downloadsDir = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
    }

    for (const videoInfo of videoUrls) {
        const videoPath = path.join(downloadsDir, videoInfo.filename);

        if (fs.existsSync(videoPath)) {
            console.log(`📁 Video already exists: ${videoPath}`);
            continue;
        }

        console.log(`📥 Downloading ${videoInfo.title} (${videoInfo.filename})...`);

        try {
            await downloadFile(videoInfo.url, videoPath);
            console.log(`✅ Downloaded: ${videoPath}`);
        } catch (error) {
            console.log(`\n❌ Failed to download ${videoInfo.filename}: ${error}`);
            console.log(
                `💥 Exiting due to download failure. Please check your internet connection or download the files manually.`,
            );
            process.exit(1);
        }
    }

    // Also create video3.mp4 as a copy of one of the downloaded files for batch upload example
    const video3Path = path.join(downloadsDir, "video3.mp4");
    if (!fs.existsSync(video3Path)) {
        const sourceVideo = path.join(downloadsDir, "video2.mp4");
        if (fs.existsSync(sourceVideo)) {
            fs.copyFileSync(sourceVideo, video3Path);
            console.log(`📋 Created copy for batch upload: ${video3Path}`);
        }
    }

    return downloadsDir;
}

/**
 * Download a file from URL with progress indication.
 */
function downloadFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        let downloadedBytes = 0;
        let totalBytes = 0;
        let lastPercent = -1;

        const request = https.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                const redirectUrl = response.headers.location;
                if (redirectUrl) {
                    file.close();
                    fs.unlink(filePath, () => {}); // Delete partial file
                    downloadFile(redirectUrl, filePath).then(resolve).catch(reject);
                    return;
                }
            }

            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }

            totalBytes = parseInt(response.headers["content-length"] || "0", 10);

            response.on("data", (chunk) => {
                downloadedBytes += chunk.length;
                if (totalBytes > 0) {
                    const percent = Math.min(100, Math.floor((downloadedBytes * 100) / totalBytes));
                    // Only show progress at 25%, 50%, 75%, 100%
                    if (
                        percent !== lastPercent &&
                        (percent === 25 || percent === 50 || percent === 75 || percent === 100)
                    ) {
                        const sizeStr = `${(downloadedBytes / 1024 / 1024).toFixed(1)}MB/${(
                            totalBytes /
                            1024 /
                            1024
                        ).toFixed(1)}MB`;
                        console.log(`   Progress: ${percent}% (${sizeStr})`);
                        lastPercent = percent;
                    }
                }
            });

            response.pipe(file);

            file.on("finish", () => {
                file.close();
                console.log(); // New line after progress bar
                resolve();
            });
        });

        request.on("error", (error) => {
            fs.unlink(filePath, () => {}); // Delete partial file
            reject(error);
        });

        file.on("error", (error) => {
            fs.unlink(filePath, () => {}); // Delete partial file
            reject(error);
        });
    });
}

/**
 * Check if we have valid video files for testing.
 */
function checkVideoFiles(): boolean {
    const requiredFiles = ["downloads/example_video.mp4", "downloads/video1.mp4", "downloads/video2.mp4"];

    let hasValidFiles = false;
    for (const filePath of requiredFiles) {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            // Check if file has reasonable size for a video
            if (stats.size > 1000) {
                hasValidFiles = true;
                console.log(`✅ Found valid video file: ${filePath} (${stats.size.toLocaleString()} bytes)`);
            }
        }
    }

    if (!hasValidFiles) {
        console.log("\n❌ No valid video files found for upload testing.");
        console.log("   Please ensure video files were downloaded successfully.");
        return false;
    }

    return hasValidFiles;
}

/**
 * Example showing upload status monitoring.
 */
async function uploadStatusExample(): Promise<void> {
    console.log("\n=== Upload Status Monitoring Example ===");

    const client = new TwelveLabs({
        apiKey: API_KEY,
    });

    try {
        // Get list of incomplete uploads (if any)
        console.log("📋 Checking for incomplete uploads...");

        const incompleteUploads = await client.multipartUpload.listIncompleteUploads({
            pageLimit: 10,
        });

        let hasIncomplete = false;
        for await (const upload of incompleteUploads) {
            hasIncomplete = true;
            console.log(`📤 Incomplete upload found:`);
            console.log(`   Upload ID: ${upload.uploadId}`);
            console.log(`   Status: ${upload.status}`);
            console.log(`   Total Size: ${upload.totalSize.toLocaleString()} bytes`);
            console.log(`   Total Chunks: ${upload.totalChunks}`);

            // You could resume monitoring here:
            // await client.multipartUpload.waitForUploadCompletion(upload.uploadId);
        }

        if (!hasIncomplete) {
            console.log("✅ No incomplete uploads found");
        }
    } catch (error) {
        console.log(`❌ Status check failed: ${error}`);
    }
}

/**
 * Main function to run all examples.
 */
async function main(): Promise<void> {
    console.log("🚀 MultipartUploadWrapper Examples");
    console.log("=" + "=".repeat(59));

    try {
        // Download sample videos if they don't exist
        await downloadSampleVideos();

        // Check if we have valid video files
        if (!checkVideoFiles()) {
            console.log("💥 Exiting due to missing valid video files.");
            process.exit(1);
        }

        // Run examples
        console.log("\n" + "=".repeat(60));
        await uploadExample();

        console.log("\n" + "=".repeat(60));
        await uploadWithWaitExample();

        console.log("\n" + "=".repeat(60));
        await uploadStatusExample();
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            console.log("\n\n⏹️  Examples interrupted by user");
        } else {
            console.log(`\n\n❌ Examples failed with error: ${error}`);
        }
    }

    console.log("\n🎉 All examples completed!");
    console.log("\n📝 Note: Set API_KEY environment variable with your actual API key.");
    console.log("📝 Note: Replace file paths with your actual video files for real uploads.");
    console.log("📝 Note: Some examples are commented out to avoid API rate limits during testing.");
}

process.on("SIGINT", () => {
    console.log("\n\n⏹️  Examples interrupted by user (Ctrl+C)");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("\n\n⏹️  Examples terminated");
    process.exit(0);
});

if (require.main === module) {
    main().catch((error) => {
        console.error("❌ Fatal error:", error);
        process.exit(1);
    });
}
