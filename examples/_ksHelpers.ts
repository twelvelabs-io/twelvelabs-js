/// <reference types="node" />
/**
 * Shared helpers for the knowledge-store and responses examples.
 *
 * These utilities create assets, spin up a knowledge store, add items, and poll
 * until everything is ready so the search / responses examples have real content
 * to run against. Import them from `knowledgeStores.ts` and `responses.ts`.
 *
 * Environment:
 *   API_KEY               (required) your TwelveLabs API key
 *   TWELVELABS_BASE_URL   (optional) override the API base URL. When unset the
 *                         SDK default (https://api.twelvelabs.io/v1.3) is used.
 */
import * as fs from "fs";
import path from "path";
import { TwelveLabs } from "twelvelabs-js";

export const ASSETS_DIR = path.join(__dirname, "assets");
export const VIDEO_PATH = path.join(ASSETS_DIR, "example.mp4");
export const IMAGE_PATH = path.join(ASSETS_DIR, "search_sample.png");

export const PUBLIC_VIDEO_URL =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function makeClient(): TwelveLabs {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Set your API key in an environment variable named API_KEY.");
  }

  return new TwelveLabs({ apiKey });
}

export async function createAssetFromFile(
  client: TwelveLabs,
  filePath: string
): Promise<string> {
  const asset = await client.assets.create({
    method: "direct",
    file: fs.createReadStream(filePath),
  });
  console.log(`  Created asset (direct): id=${asset.id} from ${path.basename(filePath)}`);
  return asset.id!;
}

export async function createAssetFromUrl(client: TwelveLabs, url: string): Promise<string> {
  const asset = await client.assets.create({ method: "url", url });
  console.log(`  Created asset (url): id=${asset.id}`);
  return asset.id!;
}

export async function waitForAssetReady(
  client: TwelveLabs,
  assetId: string,
  timeoutMs = 600_000,
  intervalMs = 5_000
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const asset = await client.assets.retrieve(assetId);
    if (asset.status === "ready" || asset.status === "failed") {
      console.log(`  Asset ${assetId} status=${asset.status}`);
      if (asset.status === "failed") throw new Error(`Asset ${assetId} failed to process`);
      return;
    }
    if (Date.now() > deadline)
      throw new Error(`Asset ${assetId} not ready after ${timeoutMs}ms (status=${asset.status})`);
    console.log(`  Asset ${assetId} status=${asset.status} ... waiting`);
    await sleep(intervalMs);
  }
}

export async function waitForItemReady(
  client: TwelveLabs,
  knowledgeStoreId: string,
  itemId: string,
  timeoutMs = 900_000,
  intervalMs = 10_000
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const item = await client.knowledgeStoreItems.retrieve(
      knowledgeStoreId,
      itemId
    );
    if (item.status === "ready" || item.status === "failed") {
      console.log(`  Item ${itemId} status=${item.status}`);
      if (item.status === "failed") throw new Error(`Item ${itemId} failed to process`);
      return;
    }
    if (Date.now() > deadline)
      throw new Error(`Item ${itemId} not ready after ${timeoutMs}ms (status=${item.status})`);
    console.log(`  Item ${itemId} status=${item.status} ... waiting`);
    await sleep(intervalMs);
  }
}

export interface KnowledgeStoreSetup {
  knowledgeStoreId: string;
  items: Record<string, string>; // { video: itemId, image: itemId }
}

export async function setupReadyKnowledgeStore(
  client: TwelveLabs,
  opts: {
    name?: string;
    ingestionConfig?: any;
    addVideo?: boolean;
    addImage?: boolean;
    wait?: boolean;
  } = {}
): Promise<KnowledgeStoreSetup> {
  const {
    name = `ks-example-${Date.now()}`,
    ingestionConfig,
    addVideo = true,
    addImage = true,
    wait = true,
  } = opts;

  const ks = await client.knowledgeStores.create({ name, ingestionConfig });
  console.log(`Created knowledge store: id=${ks.id} name=${ks.name}`);

  const items: Record<string, string> = {};

  if (addVideo) {
    const videoAssetId = await createAssetFromFile(client, VIDEO_PATH);
    await waitForAssetReady(client, videoAssetId);
    const videoItem = await client.knowledgeStoreItems.create(ks.id!, {
      assetId: videoAssetId,
      assetType: "video",
    });
    items.video = videoItem.id!;
    console.log(`  Added video item: id=${videoItem.id}`);
  }

  if (addImage) {
    const imageAssetId = await createAssetFromFile(client, IMAGE_PATH);
    await waitForAssetReady(client, imageAssetId);
    const imageItem = await client.knowledgeStoreItems.create(ks.id!, {
      assetId: imageAssetId,
      assetType: "image",
    });
    items.image = imageItem.id!;
    console.log(`  Added image item: id=${imageItem.id}`);
  }

  if (wait) {
    for (const [kind, itemId] of Object.entries(items)) {
      console.log(`Waiting for ${kind} item ${itemId} to be ready ...`);
      await waitForItemReady(client, ks.id!, itemId);
    }
  }

  return { knowledgeStoreId: ks.id!, items };
}

export async function cleanupKnowledgeStore(
  client: TwelveLabs,
  knowledgeStoreId: string
): Promise<void> {
  try {
    await client.knowledgeStores.delete(knowledgeStoreId);
    console.log(`Deleted knowledge store ${knowledgeStoreId}`);
  } catch (err) {
    console.log(`  (cleanup) failed to delete ${knowledgeStoreId}: ${err}`);
  }
}
