/**
 * Pegasus 1.5 analysis — synchronous and streaming.
 *
 * Run:
 *   export TWELVE_LABS_API_KEY=...
 *   export ASSET_ID=...
 *   npx ts-node examples/analyze.ts
 */
import { TwelveLabs, TwelvelabsApi } from "twelvelabs-js";

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.TWELVE_LABS_API_KEY });
  const assetId = process.env.ASSET_ID ?? "<YOUR_ASSET_ID>";

  // `video` is a discriminated union — `type` is required. tsc rejects the object
  // if you omit it.
  const video: TwelvelabsApi.VideoContext = { type: "asset_id", assetId };
  // Also available: { type: "url", url: ... }, { type: "base64_string", base64String: ... }

  // --- Analyze -------------------------------------------------------------
  console.log("Analysis:");
  const res = await client.analyze({
    modelName: "pegasus1.5",
    video,
    prompt: "Describe this video in one sentence.",
  });
  console.log(`  ${res.data}`);
  console.log(`  usage=${JSON.stringify(res.usage)}`);

  // --- Stream the same analysis --------------------------------------------
  console.log("\nStreaming:");
  const stream = await client.analyzeStream({
    modelName: "pegasus1.5",
    video,
    prompt: "List three facts about this video.",
  });
  for await (const chunk of stream) {
    if (chunk.eventType === "text_generation") {
      process.stdout.write(chunk.text ?? "");
    } else if (chunk.eventType === "stream_end") {
      console.log(`\n  finishReason=${chunk.finishReason}`);
    }
  }
})();
