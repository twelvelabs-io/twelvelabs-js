/**
 * Marengo 3.5 embeddings — one example per modality.
 *
 * Run:
 *   export TWELVE_LABS_API_KEY=...
 *   export VIDEO_ASSET_ID=... AUDIO_ASSET_ID=... PDF_ASSET_ID=...
 *   npx ts-node examples/embedV2.ts
 */
import { TwelveLabs, TwelvelabsApi } from "twelvelabs-js";

const MODEL = "marengo3.5" as const;

// Dynamic segmentation, shared by the video and audio examples.
const SEGMENTATION: TwelvelabsApi.AsyncTemporalSegmentation = {
  temporal: { strategy: "dynamic", dynamic: { minDurationSec: 3 } },
};

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.TWELVE_LABS_API_KEY });

  const videoAssetId = process.env.VIDEO_ASSET_ID ?? "<YOUR_VIDEO_ASSET_ID>";
  const audioAssetId = process.env.AUDIO_ASSET_ID ?? "<YOUR_AUDIO_ASSET_ID>";
  const pdfAssetId = process.env.PDF_ASSET_ID ?? "<YOUR_PDF_ASSET_ID>";

  const waitFor = async (taskId: string, timeoutMs = 600_000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const task = await client.embed.v2.tasks.retrieve(taskId);
      if (task.status !== "processing") return task;
      await new Promise((r) => setTimeout(r, 5_000));
    }
    throw new Error(`task ${taskId} still processing`);
  };

  const show = (task: TwelvelabsApi.EmbeddingTaskResponse) => {
    console.log(`  status=${task.status}`);
    if (task.status !== "ready") {
      console.log(`  error=${task.error?.message}`);
      return;
    }
    for (const item of (task.data ?? []).slice(0, 3)) {
      console.log(
        `    option=${item.embeddingOption} scope=${item.embeddingScope} ` +
          `dim=${item.embedding?.length}`,
      );
    }
  };

  // --- Query embedding (synchronous) ---------------------------------------
  // With Marengo 3.5 the sync endpoint takes `multiInput`. Use it for the query
  // side of a retrieval flow; embed your library asynchronously below.
  console.log("Text query:");
  const res = await client.embed.v2.create({
    inputType: "multi_input",
    modelName: MODEL,
    multiInput: { inputText: "a man walking a dog on the beach" },
  });
  console.log(`  dim=${res.data[0].embedding?.length} usage=${JSON.stringify(res.usage)}`);

  // --- Video ---------------------------------------------------------------
  // `embeddingOption` must be set explicitly: the default includes
  // `transcription`, which is Marengo 3.0 only.
  console.log("\nVideo:");
  let task = await client.embed.v2.tasks.create({
    inputType: "video",
    modelName: MODEL,
    video: {
      mediaSource: { assetId: videoAssetId },
      segmentation: SEGMENTATION,
      embeddingOption: ["visual", "audio"],
      embeddingScope: ["local"],
    },
  });
  show(await waitFor(task.id!));

  // --- Audio ---------------------------------------------------------------
  // On Marengo 3.5 the `audio` option covers speech, music and non-dialog audio.
  console.log("\nAudio:");
  task = await client.embed.v2.tasks.create({
    inputType: "audio",
    modelName: MODEL,
    audio: {
      mediaSource: { assetId: audioAssetId },
      segmentation: SEGMENTATION,
      embeddingOption: ["audio"],
      embeddingScope: ["local"],
    },
  });
  show(await waitFor(task.id!));

  // --- Document ------------------------------------------------------------
  // PDF pages are embedded as images, so the option is `visual` and `local` yields
  // one embedding per page. For plain text or Markdown, use embeddingOption
  // ["text"] with embeddingScope ["asset"].
  console.log("\nDocument (PDF, one embedding per page):");
  task = await client.embed.v2.tasks.create({
    inputType: "document",
    modelName: MODEL,
    document: {
      mediaSource: { assetId: pdfAssetId },
      embeddingOption: ["visual"],
      embeddingScope: ["local"],
    },
  });
  show(await waitFor(task.id!));
})();
