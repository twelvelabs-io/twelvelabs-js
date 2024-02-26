import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const engines = await client.engine.list();
  console.log('Available engines: ');
  for (const engine of engines) {
    console.log(`  id=${engine.id} allowedIndexOptions=${engine.allowedIndexOptions}`);
  }

  const pegasus = await client.engine.retrieve('pegasus1');
  console.log(pegasus);
})();
