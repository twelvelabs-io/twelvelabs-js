import { Index, TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const indexName = `${new Date().toISOString()}`;
  let index = await client.index.create({
    name: indexName,
    models: [
      {
        name: 'marengo2.7',
        options: ['visual', 'audio'],
      },
      {
        name: 'pegasus1.2',
        options: ['visual', 'audio'],
      },
    ],
    addons: ['thumbnail'],
  });
  console.log(`Created index: id=${index.id} name=${index.name}`);

  const indexes = await client.index.list();
  console.log('All Indexes: ');
  indexes.forEach((index) => {
    console.log(`  id=${index.id} name=${index.name}`);
  });

  await client.index.update(index.id, indexName.concat('-updated'));
  index = await client.index.retrieve(index.id);
  console.log(`Updated index name to ${index.name}`);

  console.log('Indexes with pagination:');
  const pagination = await client.index.listPagination();
  pagination.data.forEach((index: Index) => {
    console.log(`  id=${index.id} name=${index.name}`);
  });
  while (true) {
    const nextPageData = await pagination.next();
    if (!nextPageData) {
      console.log('  no more pages');
      break;
    }
    nextPageData.forEach((index: Index) => {
      console.log(`  id=${index.id} name=${index.name}`);
    });
  }
})();
