import { TwelveLabs, SearchData, GroupByVideoSearchData } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.index.retrieve('65a75560efa0814ef2edc77a');

  console.log('Search (group by video): ');
  let result = await client.search.query({
    indexId: index.id,
    query: 'A man talking',
    options: ['visual', 'conversation'],
    groupBy: 'video',
  });
  (result.data as GroupByVideoSearchData[]).forEach((group) => {
    console.log(`  videoId=${group.id}`);
    group.clips?.forEach((clip) => {
      console.log(
        `     score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`,
      );
    });
  });

  console.log('Search: ');
  result = await client.search.query({
    indexId: index.id,
    query: 'A man talking',
    options: ['visual', 'conversation'],
  });
  (result.data as SearchData[]).forEach((clip) => {
    console.log(`  score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`);
  });
})();
