/**
 * Pegasus 1.5 asynchronous analysis and video segmentation.
 *
 * Use the async endpoint for long videos or when you do not want to hold a
 * connection open. Segmentation (analysisMode "time_based_metadata") is async only.
 *
 * Run:
 *   export TWELVE_LABS_API_KEY=...
 *   export ASSET_ID=...
 *   npx ts-node examples/analyzeAsync.ts
 */
import { TwelveLabs, TwelvelabsApi } from "twelvelabs-js";

const MODEL = "pegasus1.5" as const;

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.TWELVE_LABS_API_KEY });
  const assetId = process.env.ASSET_ID ?? "<YOUR_ASSET_ID>";
  const video: TwelvelabsApi.VideoContext = { type: "asset_id", assetId };

  // A task is done once it leaves these states.
  const IN_FLIGHT = ["queued", "pending", "processing"];

  const waitFor = async (taskId: string, timeoutMs = 900_000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const task = await client.analyzeAsync.tasks.retrieve(taskId);
      if (!IN_FLIGHT.includes(task.status!)) return task;
      await new Promise((r) => setTimeout(r, 5_000));
    }
    throw new Error(`task ${taskId} did not finish`);
  };

  // --- Async analysis ------------------------------------------------------
  // `customId` is echoed back so you can correlate results with your own records.
  // Async analysis takes maxTokens from 512 upward; the sync endpoint allows 1-4096.
  console.log("Async analysis:");
  let task = await client.analyzeAsync.tasks.create({
    video,
    modelName: MODEL,
    analysisMode: "general",
    prompt: "Summarize this video in three sentences.",
    customId: "example-general-1",
    maxTokens: 1024,
  });
  let done = await waitFor(task.taskId!);
  console.log(`  status=${done.status} customId=${done.customId}`);
  if (done.result) console.log(`  ${done.result.data}`);

  // --- Video segmentation --------------------------------------------------
  // Define the segments you want and the fields to extract for each one. The
  // platform returns timestamped segments carrying those fields.
  console.log("\nSegmentation:");
  task = await client.analyzeAsync.tasks.create({
    video,
    modelName: MODEL,
    analysisMode: "time_based_metadata",
    responseFormat: {
      type: "segment_definitions",
      segmentDefinitions: [
        {
          id: "scene",
          description: "A distinct scene or setting change in the video",
          fields: [
            {
              name: "sentiment",
              type: "string",
              description: "The emotional tone of this segment",
              enum: ["positive", "negative", "neutral"],
            },
          ],
        },
      ],
    },
    minSegmentDuration: 5.0,
  });
  done = await waitFor(task.taskId!);
  console.log(`  status=${done.status}`);
  if (done.result) {
    // result.data is a JSON-encoded string keyed by segment definition id.
    const parsed = JSON.parse(done.result.data!) as Record<string, unknown[]>;
    for (const [definitionId, segments] of Object.entries(parsed)) {
      console.log(`  '${definitionId}': ${segments.length} segments`);
      for (const seg of segments.slice(0, 3)) console.log(`    ${JSON.stringify(seg)}`);
    }
  }
})();
