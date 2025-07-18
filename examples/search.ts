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
    searchOptions: ["visual", "audio"],
    groupBy: "video",
  });
  for await (const group of searchPager) {
    if (!group.clips) {
      continue;
    }
    console.log(`  videoId=${group.id}`);
    group.clips?.forEach((clip) => {
      console.log(
        `     score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`
      );
    });
  }

  console.log("Search (no grouping): ");
  searchPager = await client.search.query({
    indexId: index.id!,
    queryText: "A man talking",
    searchOptions: ["visual", "audio"],
  });
  for await (const clip of searchPager) {
    console.log(
      `  videoId=${clip.videoId} score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`
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
      `  videoId=${clip.videoId} score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`
    );
  }
})();
