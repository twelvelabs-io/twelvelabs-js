import { TwelveLabs } from "twelvelabs-js";

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const indexName = `${new Date().toISOString()}`;
  const index = await client.indexes.create({
    indexName: indexName,
    models: [
      {
        modelName: "marengo3.0",
        modelOptions: ["visual", "audio"],
      },
      {
        modelName: "pegasus1.2",
        modelOptions: ["visual", "audio"],
      },
    ],
    addons: ["thumbnail"],
  });
  console.log(`Created index: id=${index.id}`);

  console.log("All Indexes: ");
  const indexesPager = await client.indexes.list();
  for await (const index of indexesPager) {
    console.log(`  id=${index.id} name=${index.indexName}`);
  }

  await client.indexes.update(index.id!, {
    indexName: indexName.concat("-updated"),
  });
  const updatedIndex = await client.indexes.retrieve(index.id!);
  console.log(`Updated index name to ${updatedIndex.indexName}`);
})();
