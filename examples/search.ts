import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.index.retrieve('65a75560efa0814ef2edc77a');

  const result = await client.search.query({
    indexId: index.id,
    query: 'A man talking',
    options: ['visual', 'conversation'],
  });
  result.data.forEach((clip) => {
    console.log(`  score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`);
  });
})();
