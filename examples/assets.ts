/**
 * Assets — the input path for analysis and embeddings.
 *
 * Both Pegasus 1.5 analysis and Marengo 3.5 embeddings take an `assetId`, so this is
 * where most workflows start. Covers direct upload (file and URL), polling for
 * readiness, listing, user metadata, transcription, and multipart upload.
 *
 * Run:
 *   export TWELVE_LABS_API_KEY=...
 *   npx ts-node examples/assets.ts
 */
import fs from "fs";
import path from "path";
import { TwelveLabs } from "twelvelabs-js";

const IMAGE_URL = "https://www.gstatic.com/webp/gallery/1.jpg";

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.TWELVE_LABS_API_KEY });
  const videoPath = path.join(__dirname, "assets/example.mp4");

  /** An asset must be `ready` before analyze or embed will accept it. */
  const waitUntilReady = async (assetId: string, timeoutMs = 600_000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const asset = await client.assets.retrieve(assetId);
      if (asset.status !== "processing") return asset;
      await new Promise((r) => setTimeout(r, 5_000));
    }
    throw new Error(`asset ${assetId} still processing`);
  };

  // --- Upload a local file --------------------------------------------------
  // `enableHls` gives you a playable manifest; `enableThumbnail` a poster frame.
  console.log("Upload from a local file:");
  let video = await client.assets.create({
    method: "direct",
    file: fs.createReadStream(videoPath),
    enableHls: true,
    enableThumbnail: true,
    // userMetadata is a JSON-encoded string on this endpoint, not an object.
    userMetadata: JSON.stringify({ source: "examples", kind: "demo" }),
  });
  console.log(`  id=${video.id} status=${video.status} filename=${video.filename}`);
  video = await waitUntilReady(video.id!);
  console.log(`  ready: fileType=${video.fileType}`);

  // --- Upload from a URL ----------------------------------------------------
  // Note method "url", not "direct" — "direct" requires a file.
  console.log("\nUpload from a URL:");
  let image = await client.assets.create({ method: "url", url: IMAGE_URL });
  image = await waitUntilReady(image.id!);
  console.log(`  id=${image.id} status=${image.status} fileType=${image.fileType}`);

  // --- List -----------------------------------------------------------------
  // assets.list pages through everything, so stop after a few.
  console.log("\nRecent assets:");
  let shown = 0;
  for await (const asset of await client.assets.list({ pageLimit: 5 })) {
    if (shown++ >= 5) break;
    console.log(`  ${asset.id} ${asset.status} ${asset.filename}`);
  }

  // --- User metadata --------------------------------------------------------
  console.log("\nUser metadata:");
  await client.assets.updateUserMetadata(video.id!, {
    userMetadata: { source: "examples", reviewed: true },
  });
  console.log(`  ${JSON.stringify((await client.assets.retrieve(video.id!)).userMetadata)}`);

  // --- Transcription --------------------------------------------------------
  // Three granularities: words, sentences and utterances (utterances add speaker).
  console.log("\nTranscription:");
  const transcription = await client.assets.retrieveTranscription(video.id!);
  console.log(`  status=${transcription.status}`);
  for (const sentence of (transcription.sentences ?? []).slice(0, 2)) {
    console.log(`    [${sentence.start}-${sentence.end}] ${sentence.value}`);
  }

  // --- Multipart upload -----------------------------------------------------
  // For large files. The wrapper handles chunking, retries and progress.
  console.log("\nMultipart upload:");
  const large = await client.multipartUpload.uploadFile(videoPath, {
    filename: "example-multipart.mp4",
  });
  console.log(`  assetId=${large.assetId}`);

  // --- Clean up -------------------------------------------------------------
  // `force` deletes even when the asset is referenced elsewhere.
  console.log("\nCleanup:");
  await client.assets.delete(image.id!, { force: true });
  console.log(`  deleted ${image.id}`);
})();
