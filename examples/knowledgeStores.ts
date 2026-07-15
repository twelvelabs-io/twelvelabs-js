/// <reference types="node" />
/**
 * Knowledge store examples: assets, stores, items, item collections, and search.
 *
 * Covers, end to end:
 *   - creating a knowledge store with each ingestionConfig variant
 *     (none / description enrichment / json_schema enrichment)
 *   - knowledge store CRUD (create, retrieve, update, list, delete)
 *   - adding assets as items and polling until ready
 *   - listing / filtering items by status
 *   - item collections (create, add items, list, update, remove, delete)
 *   - search: basic, groupBy=item, assetType filter, itemId filter,
 *     modality options, includeMetadata, and pagination
 *
 * Run:
 *   npx ts-node examples/knowledgeStores.ts
 */
import { TwelveLabs, TwelvelabsApi } from "twelvelabs-js";
import {
  cleanupKnowledgeStore,
  createAssetFromFile,
  makeClient,
  waitForAssetReady,
  waitForItemReady,
  VIDEO_PATH,
  IMAGE_PATH,
} from "./_ksHelpers";

function printSearchResponse(resp: any, label: string) {
  console.log(
    `\n[${label}] ${resp.data.length} result(s); next_page_token=${
      resp.nextPageToken ? "set" : "none"
    }`
  );
  for (const hit of resp.data) {
    if (hit.assetType === "video") {
      console.log(`  video rank=${hit.rank} item=${hit.itemId} matches=${hit.matches.length}`);
      for (const m of hit.matches.slice(0, 3)) {
        console.log(`    ${m.startSec}-${m.endSec}s modalities=${JSON.stringify(m.modalities)}`);
      }
    } else {
      console.log(`  image rank=${hit.rank} item=${hit.itemId}`);
    }
    if (hit.metadata) console.log(`    metadata=${JSON.stringify(hit.metadata)}`);
  }
}

async function demoIngestionConfigVariants(client: TwelveLabs) {
  console.log("\n=== Ingestion config variants ===");

  const ksPlain = await client.knowledgeStores.create({
    name: `ks-plain-${Date.now()}`,
    description: "No enrichment config",
    metadata: { team: "qa", purpose: "sdk-test" },
  });
  console.log(`  plain: id=${ksPlain.id} metadata=${JSON.stringify(ksPlain.metadata)}`);

  const ksDesc = await client.knowledgeStores.create({
    name: `ks-desc-${Date.now()}`,
    ingestionConfig: {
      enrichmentConfig: {
        type: "description",
        description: "Extract the main subject, setting, and mood of each shot.",
      },
    },
  });
  console.log(`  description-enrichment: id=${ksDesc.id}`);

  const ksSchema = await client.knowledgeStores.create({
    name: `ks-schema-${Date.now()}`,
    ingestionConfig: {
      enrichmentConfig: {
        type: "json_schema",
        jsonSchema: {
          type: "object",
          properties: {
            subject: { type: "string", description: "The primary subject visible in the shot." },
            setting: { type: "string", description: "Where the shot takes place." },
          },
        },
      },
    },
  });
  console.log(`  json-schema-enrichment: id=${ksSchema.id}`);

  for (const ks of [ksPlain, ksDesc, ksSchema]) {
    await cleanupKnowledgeStore(client, ks.id!);
  }
}

async function demoCrud(client: TwelveLabs) {
  console.log("\n=== Knowledge store CRUD ===");
  const ks = await client.knowledgeStores.create({ name: `ks-crud-${Date.now()}` });
  console.log(`  created: id=${ks.id} name=${ks.name}`);

  const retrieved = await client.knowledgeStores.retrieve(ks.id!);
  console.log(`  retrieved: id=${retrieved.id} itemCount=${retrieved.itemCount}`);

  const updated = await client.knowledgeStores.update(ks.id!, {
    name: `ks-crud-updated-${Date.now()}`,
    description: "Updated description",
    metadata: { stage: "updated" },
  });
  console.log(
    `  updated: name=${updated.name} description=${updated.description} metadata=${JSON.stringify(
      updated.metadata
    )}`
  );

  // list() returns an auto-paginating Page (consistent with assets.list() /
  // indexes.list()); `.data` is the current page, and it is also async-iterable
  // for all pages.
  console.log("  listing knowledge stores (first page):");
  const listed = await client.knowledgeStores.list({ pageLimit: 5 });
  for (const item of listed.data ?? []) {
    console.log(`    id=${item.id} name=${item.name} itemCount=${item.itemCount}`);
  }

  await cleanupKnowledgeStore(client, ks.id!);
}

async function demoItems(client: TwelveLabs, ksId: string): Promise<Record<string, string>> {
  console.log("\n=== Items ===");
  const items: Record<string, string> = {};

  // Add a video and an image to the knowledge store. Upload each file as an
  // asset, wait for it to be ready, then create a knowledge store item from it.
  const videoAssetId = await createAssetFromFile(client, VIDEO_PATH);
  await waitForAssetReady(client, videoAssetId);
  const videoItem = await client.knowledgeStoreItems.create(ksId, {
    assetId: videoAssetId,
    assetType: "video",
  });
  items.video = videoItem.id!;
  console.log(`  created video item: id=${videoItem.id}`);

  const imageAssetId = await createAssetFromFile(client, IMAGE_PATH);
  await waitForAssetReady(client, imageAssetId);
  const imageItem = await client.knowledgeStoreItems.create(ksId, {
    assetId: imageAssetId,
    assetType: "image",
  });
  items.image = imageItem.id!;
  console.log(`  created image item: id=${imageItem.id}`);

  // Wait for both items to finish processing.
  for (const [kind, itemId] of Object.entries(items)) {
    console.log(`  waiting for ${kind} item ${itemId} to be ready ...`);
    await waitForItemReady(client, ksId, itemId);
  }

  console.log("  list all items:");
  const listed = await client.knowledgeStoreItems.list(ksId, {
    page: 1,
    pageLimit: 50,
    sortBy: "created_at",
    sortOption: "desc",
  });
  for (const it of listed.data ?? []) {
    console.log(`    id=${it.id} type=${it.assetType} status=${it.status}`);
  }

  console.log("  filter items by status=ready:");
  const ready = await client.knowledgeStoreItems.list(ksId, {
    status: ["ready"],
  });
  console.log(`    ${(ready.data ?? []).length} ready item(s)`);

  const single = await client.knowledgeStoreItems.retrieve(ksId, items.video);
  console.log(
    `  retrieved item ${single.id}: type=${single.assetType} systemMetadata=${
      single.systemMetadata !== undefined
    }`
  );

  return items;
}

async function demoItemCollections(
  client: TwelveLabs,
  ksId: string,
  items: Record<string, string>
) {
  console.log("\n=== Item collections ===");
  const collection = await client.knowledgeStoreItemCollections.create(
    ksId,
    {
      name: `collection-${Date.now()}`,
      description: "A subset of items",
      metadata: { group: "highlights" },
    }
  );
  console.log(`  created collection: id=${collection.id} name=${collection.name}`);

  const allItemIds = Object.values(items);
  await client.knowledgeStoreItemCollections.addItems(
    ksId,
    collection.id!,
    { itemIds: allItemIds }
  );
  console.log(`  added ${allItemIds.length} item(s) to collection`);

  const members =
    await client.knowledgeStoreItemCollections.listItems(
      ksId,
      collection.id!
    );
  console.log(`  collection now has ${(members.data ?? []).length} member item(s)`);

  const updated = await client.knowledgeStoreItemCollections.update(
    ksId,
    collection.id!,
    { description: "Updated collection description" }
  );
  console.log(`  updated collection description=${updated.description}`);

  if (allItemIds.length > 0) {
    await client.knowledgeStoreItemCollections.removeItems(
      ksId,
      collection.id!,
      { itemIds: [allItemIds[0]] }
    );
    console.log(`  removed 1 item from collection`);
  }

  console.log("  listing collections:");
  const cols = await client.knowledgeStoreItemCollections.list(ksId);
  for (const c of cols.data ?? []) {
    console.log(`    id=${c.id} name=${c.name}`);
  }

  await client.knowledgeStoreItemCollections.delete(
    ksId,
    collection.id!
  );
  console.log(`  deleted collection ${collection.id}`);
}

async function demoSearch(client: TwelveLabs, ksId: string, items: Record<string, string>) {
  console.log("\n=== Search ===");

  // `searchOptions` selects which video modalities to match on.
  const visualOnly: TwelvelabsApi.SearchKnowledgeStoreOptions = {
    video: { modalities: ["visual"] },
  };

  let resp = await client.knowledgeStores.search(ksId, {
    query: { text: "a person or animal moving" },
    searchOptions: visualOnly,
  });
  printSearchResponse(resp, "basic (visual)");

  resp = await client.knowledgeStores.search(ksId, {
    query: { text: "a person or animal moving" },
    searchOptions: visualOnly,
    groupBy: "item",
  });
  printSearchResponse(resp, "groupBy=item");

  resp = await client.knowledgeStores.search(ksId, {
    query: { text: "dialogue or narration" },
    filter: { assetType: { eq: "video" } },
    searchOptions: {
      video: {
        modalities: ["visual", "audio"],
      },
    },
    includeMetadata: true,
  });
  printSearchResponse(resp, "video-only + all modalities + metadata");

  if (items.video) {
    resp = await client.knowledgeStores.search(ksId, {
      query: { text: "anything" },
      filter: { itemId: { in: [items.video] } },
      searchOptions: visualOnly,
    });
    printSearchResponse(resp, `itemId in [${items.video}]`);
  }

  // Paginate with a small page size, then fetch the next page with the token.
  resp = await client.knowledgeStores.search(ksId, {
    query: { text: "a person or animal moving" },
    searchOptions: visualOnly,
    pageSize: 1,
  });
  printSearchResponse(resp, "pageSize=1");
  if (resp.nextPageToken) {
    const page2 = await client.knowledgeStores.search(ksId, {
      query: { text: "a person or animal moving" },
      searchOptions: visualOnly,
      pageSize: 1,
      pageToken: resp.nextPageToken,
    });
    printSearchResponse(page2, "page 2 (via nextPageToken)");
  }
}

async function main() {
  const client = makeClient();

  await demoIngestionConfigVariants(client);
  await demoCrud(client);

  // Full flow: create a store, add a video and an image item, then exercise
  // items, collections, and search against it.
  const ks = await client.knowledgeStores.create({ name: `ks-search-${Date.now()}` });
  console.log(`\nCreated knowledge store: id=${ks.id} name=${ks.name}`);
  try {
    const items = await demoItems(client, ks.id!);
    await demoItemCollections(client, ks.id!, items);
    await demoSearch(client, ks.id!, items);
  } finally {
    await cleanupKnowledgeStore(client, ks.id!);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
