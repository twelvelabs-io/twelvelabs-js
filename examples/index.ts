import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const indexName = `${new Date().toISOString()}`;
  let index = await client.index.create({
    name: indexName,
    engines: [
      {
        name: 'marengo2.5',
        options: ['visual', 'conversation', 'text_in_video'],
      },
    ],
    addons: ['thumbnail'],
  });
  console.log(`Created index: id=${index.id} name=${index.name}`);

  const indexes = await client.index.list();
  console.log('All Indexes: ');
  for (const index of indexes) {
    console.log(`  id=${index.id} name=${index.name} engines=${index.engines}`);
  }

  await client.index.update(index.id, indexName.concat('-updated'));
  index = await client.index.retrieve(index.id);
  console.log(`Updated index name to ${index.name}`);
})();
