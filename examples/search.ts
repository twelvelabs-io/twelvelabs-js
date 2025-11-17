import * as fs from "fs";
import path from "path";
import { TwelveLabs } from "twelvelabs-js";

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.indexes.retrieve("<YOUR_INDEX_ID>");

  console.log("Search (group by video): ");
  let searchPager = await client.search.query({
    indexId: index.id!,
    queryText: "A man talking",
    searchOptions: ["visual", "audio", "transcription"],
    groupBy: "video",
  });
  for await (const group of searchPager) {
    if (!group.clips) {
      continue;
    }
    console.log(`  videoId=${group.id}`);
    group.clips?.forEach((clip) => {
      console.log(`     rank=${clip.rank} start=${clip.start} end=${clip.end}`);
    });
  }

  console.log("Search (no grouping): ");
  searchPager = await client.search.query({
    indexId: index.id!,
    queryText: "A man talking",
    searchOptions: ["visual", "audio", "transcription"],
  });
  for await (const clip of searchPager) {
    console.log(
      `  videoId=${clip.videoId} rank=${clip.rank} start=${clip.start} end=${clip.end}`
    );
  }

  console.log("Search (semantic transcription only): ");
  searchPager = await client.search.query({
    indexId: index.id!,
    queryText: "couple of chemicals",
    searchOptions: ["transcription"],
    transcriptionOptions: ["semantic"], // also supports "lexical"
  });
  for await (const clip of searchPager) {
    console.log(
      `  videoId=${clip.videoId} rank=${clip.rank} start=${clip.start} end=${clip.end} transcription=${clip.transcription}`
    );
  }

  console.log("Search by image: ");
  const imagePath = path.join(__dirname, "assets/search_sample.png");
  searchPager = await client.search.query({
    indexId: index.id!,
    queryMediaFile: fs.createReadStream(imagePath),
    queryMediaType: "image",
    searchOptions: ["visual", "audio"],
  });
  for await (const clip of searchPager) {
    console.log(
      `  videoId=${clip.videoId} rank=${clip.rank} start=${clip.start} end=${clip.end}`
    );
  }

  console.log("Composed text and image search: ");
  searchPager = await client.search.query({
    indexId: index.id!,
    queryText: "A man talking",
    queryMediaFile: fs.createReadStream(imagePath),
    queryMediaType: "image",
    searchOptions: ["visual", "audio"],
  });
  for await (const clip of searchPager) {
    console.log(
      `  videoId=${clip.videoId} rank=${clip.rank} start=${clip.start} end=${clip.end}`
    );
  }
})();
