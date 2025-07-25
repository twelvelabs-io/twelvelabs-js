import * as fs from 'fs';
import path from 'path';
import { TwelveLabs, SearchData, GroupByVideoSearchData } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.index.retrieve('<YOUR_INDEX_ID>');

  console.log('Search: ');
  const result = await client.search.query({
    indexId: index.id,
    queryText: 'A man talking',
    options: ['visual', 'audio'],
  });
  (result.data as SearchData[]).forEach((clip) => {
    console.log(`  score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`);
  });

  let nextPageData = await result.next();
  while (nextPageData !== null) {
    (nextPageData as SearchData[]).forEach((clip) => {
      console.log(`  score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`);
    });
    nextPageData = await result.next();
  }

  console.log('Search (group by video): ');
  const groupByResult = await client.search.query({
    indexId: index.id,
    queryText: 'A man talking',
    options: ['visual', 'audio'],
    groupBy: 'video',
  });
  (groupByResult.data as GroupByVideoSearchData[]).forEach((group) => {
    console.log(`  videoId=${group.id}`);
    group.clips?.forEach((clip) => {
      console.log(
        `     score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`,
      );
    });
  });

  let nextPageDataGroupBy = await groupByResult.next();
  while (nextPageDataGroupBy !== null) {
    (nextPageDataGroupBy as GroupByVideoSearchData[]).forEach((group) => {
      console.log(`  videoId=${group.id}`);
      group.clips?.forEach((clip) => {
        console.log(
          `     score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`,
        );
      });
    });
    nextPageDataGroupBy = await groupByResult.next();
  }

  console.log('Search by image: ');
  const imagePath = path.join(__dirname, 'assets/search_sample.png');
  const imageResult = await client.search.query({
    indexId: index.id,
    queryMediaFile: fs.createReadStream(imagePath),
    queryMediaType: 'image',
    options: ['visual', 'audio'],
  });
  (imageResult.data as SearchData[]).forEach((clip) => {
    console.log(`  score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`);
  });

  let nextPageDataByImage = await imageResult.next();
  while (nextPageDataByImage !== null) {
    (nextPageDataByImage as SearchData[]).forEach((clip) => {
      console.log(`  score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`);
    });
    nextPageDataByImage = await imageResult.next();
  }
})();
