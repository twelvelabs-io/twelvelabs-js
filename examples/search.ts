/**
 * Search your content with Marengo 3.0.
 *
 * An index makes your content searchable. Marengo 3.0 is the index model; Pegasus
 * 1.5 analyzes video directly without an index, so see analyze.ts for that.
 *
 * The flow is: upload an asset, index it, then search.
 *
 * Run:
 *   export TWELVE_LABS_API_KEY=...
 *   export INDEX_ID=...      # optional: reuse an index instead of creating one
 *   npx ts-node examples/search.ts
 */
import fs from "fs";
import path from "path";
import { TwelveLabs } from "twelvelabs-js";

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.TWELVE_LABS_API_KEY });
  const videoPath = path.join(__dirname, "assets/example.mp4");
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  let indexId = process.env.INDEX_ID;

  if (indexId) {
    const index = await client.indexes.retrieve(indexId);
    console.log(`Using index: id=${index.id} name=${index.indexName}`);
  } else {
    const index = await client.indexes.create({
      indexName: `idx-${Date.now()}`,
      models: [{ modelName: "marengo3.0", modelOptions: ["visual", "audio"] }],
      addons: ["thumbnail"],
    });
    indexId = index.id!;
    console.log(`Created index: id=${indexId}`);

    // Upload the video as an asset, then index that asset. See assets.ts for
    // uploading from a URL and for large files.
    let asset = await client.assets.create({
      method: "direct",
      file: fs.createReadStream(videoPath),
    });
    while (asset.status === "processing") {
      await sleep(5_000);
      asset = await client.assets.retrieve(asset.id!);
    }
    console.log(`Uploaded asset: id=${asset.id} status=${asset.status}`);

    const indexed = await client.indexes.indexedAssets.create(indexId, {
      assetId: asset.id!,
    });
    console.log(`Indexing: indexedAssetId=${indexed.id}`);

    // Indexing takes a few minutes. The asset is searchable once it is ready.
    let detail = await client.indexes.indexedAssets.retrieve(indexId, indexed.id!);
    while (detail.status !== "ready" && detail.status !== "failed") {
      await sleep(10_000);
      detail = await client.indexes.indexedAssets.retrieve(indexId, indexed.id!);
      console.log(`  status=${detail.status}`);
    }
    if (detail.status === "failed") throw new Error("indexing failed");
  }

  // --- Search, grouped by video --------------------------------------------
  console.log("\nSearch (group by video):");
  const grouped = await client.search.query({
    indexId,
    searchOptions: ["visual", "audio"],
    queryText: "A man talking",
    groupBy: "video",
  });
  for await (const group of grouped) {
    if (!group.clips) continue;
    console.log(`  video_id=${group.id}`);
    for (const clip of group.clips.slice(0, 3)) {
      console.log(`    rank=${clip.rank} start=${clip.start} end=${clip.end}`);
    }
  }

  // --- Search, ungrouped clips ---------------------------------------------
  console.log("\nSearch (no grouping):");
  const flat = await client.search.query({
    indexId,
    searchOptions: ["visual", "audio"],
    queryText: "A man talking",
  });
  let shown = 0;
  for await (const clip of flat) {
    if (shown++ >= 5) break;
    console.log(
      `  video_id=${clip.videoId} rank=${clip.rank} start=${clip.start} end=${clip.end}`,
    );
  }
})();
