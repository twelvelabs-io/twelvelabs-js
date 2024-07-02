import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const engines = await client.engine.list();
  console.log('Available engines: ');
  engines.forEach((engine) => {
    console.log(`  id=${engine.id} allowedEngineOptions=${engine.allowedEngineOptions}`);
  });

  const pegasus = await client.engine.retrieve('pegasus1.1');
  console.log(pegasus);
})();
