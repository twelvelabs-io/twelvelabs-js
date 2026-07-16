/// <reference types="node" />
/**
 * Responses API examples over a knowledge store.
 *
 * Covers:
 *   - non-streaming response
 *   - streaming response (SSE)
 *   - structured output (text.format = json_schema)
 *   - selections targeting a single item ({{sel:N}} tokens)
 *   - selections targeting an item collection
 *   - multi-turn conversation via sessionId
 *   - include: ["intermediate_outputs"]
 *
 * Streaming uses responses.createStream(), which returns a
 * Stream<ResponseStreamEvent> — an async-iterable of typed SSE events (see
 * demoStreaming).
 *
 * Run:
 *   npx ts-node examples/responses.ts
 */
import { TwelveLabs, TwelvelabsApiError } from "twelvelabs-js";
import {
  cleanupKnowledgeStore,
  makeClient,
  setupReadyKnowledgeStore,
  sleep,
} from "./_ksHelpers";


function headerValue(rawResponse: any, name: string): string | undefined {
  const h = rawResponse?.headers;
  if (!h) return undefined;
  if (typeof h.get === "function") return h.get(name) ?? undefined;
  return h[name] ?? h[name.toLowerCase()];
}

/**
 * createResponse with automatic retry on HTTP 429. The /responses endpoint is
 * rate-limited, so a script that fires several calls in a row may get a 429.
 * This honors the retry-after header and retries.
 */
async function createResponse(client: TwelveLabs, request: any): Promise<any> {
  for (;;) {
    try {
      return await client.responses.create(request);
    } catch (err) {
      if (err instanceof TwelvelabsApiError && err.statusCode === 429) {
        const retryAfter = headerValue(err.rawResponse, "retry-after");
        const waitMs = (retryAfter ? parseInt(retryAfter, 10) + 1 : 16) * 1000;
        console.log(`  [rate limited] waiting ${waitMs / 1000}s then retrying ...`);
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
}

function printResponse(resp: any, label: string) {
  console.log(`\n[${label}]`);
  console.log(`  id=${resp.id} sessionId=${resp.sessionId} status=${resp.status}`);
  if (resp.usage) {
    console.log(`  usage: input=${resp.usage.inputTokens} output=${resp.usage.outputTokens}`);
  }
  for (const item of resp.output ?? []) {
    if (item.content) {
      for (const part of item.content) {
        const text = (part.text ?? "").trim();
        if (text) console.log(`  [${item.type}] ${text.slice(0, 400)}`);
      }
    } else if (item.type === "function_call") {
      console.log(`  [function_call] name=${item.name} args=${item.arguments}`);
    }
  }
}

async function demoNonStreaming(client: TwelveLabs, ksId: string): Promise<string | undefined> {
  const resp = await createResponse(client, {
    knowledgeStoreId: ksId,
    input: [
      {
        type: "message",
        role: "user",
        content: "Summarize what happens in this knowledge store in two sentences.",
      },
    ],
  });
  printResponse(resp, "non-streaming");
  return resp.sessionId;
}

async function demoMultiTurn(client: TwelveLabs, ksId: string, sessionId?: string) {
  if (!sessionId) {
    console.log("\n[multi-turn] skipped (no sessionId from previous turn)");
    return;
  }
  const resp = await createResponse(client, {
    knowledgeStoreId: ksId,
    sessionId,
    input: [
      {
        type: "message",
        role: "user",
        content: "Now list the three most important moments as bullet points.",
      },
    ],
  });
  printResponse(resp, "multi-turn (same session)");
}

async function demoIncludeIntermediate(client: TwelveLabs, ksId: string) {
  const resp = await createResponse(client, {
    knowledgeStoreId: ksId,
    input: [{ type: "message", role: "user", content: "What is the overall mood, and how did you decide?" }],
    include: ["intermediate_outputs"],
  });
  printResponse(resp, "include=intermediate_outputs");
}

async function demoStructuredOutput(client: TwelveLabs, ksId: string) {
  const resp = await createResponse(client, {
    knowledgeStoreId: ksId,
    input: [
      {
        type: "message",
        role: "user",
        content: "Extract a title and a list of up to 3 tags for this content.",
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "content_summary",
        description: "A short structured summary of the knowledge store content.",
        schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "A short title." },
            tags: {
              type: "array",
              description: "Up to three descriptive tags.",
              items: { type: "string", description: "A single tag." },
            },
          },
          required: ["title", "tags"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });
  printResponse(resp, "structured output (json_schema)");
  for (const item of resp.output ?? []) {
    for (const part of item.content ?? []) {
      if (part.text) {
        try {
          console.log(`  parsed JSON: ${JSON.stringify(JSON.parse(part.text))}`);
        } catch {
          console.log("  (final text was not valid JSON)");
        }
      }
    }
  }
}

async function demoSelectionsItem(client: TwelveLabs, ksId: string, items: Record<string, string>) {
  if (!items.video) {
    console.log("\n[selections:item] skipped (no video item)");
    return;
  }
  const resp = await createResponse(client, {
    knowledgeStoreId: ksId,
    input: [{ type: "message", role: "user", content: "Describe {{sel:0}} in one sentence." }],
    selections: [{ kind: "item", id: items.video }],
  });
  printResponse(resp, "selections -> single item ({{sel:0}})");
}

async function demoSelectionsCollection(
  client: TwelveLabs,
  ksId: string,
  items: Record<string, string>
) {
  const collection = await client.knowledgeStoreItemCollections.create(
    ksId,
    { name: `resp-collection-${Date.now()}` }
  );
  await client.knowledgeStoreItemCollections.addItems(
    ksId,
    collection.id!,
    { itemIds: Object.values(items) }
  );
  console.log(`\n  created collection ${collection.id} with ${Object.keys(items).length} item(s)`);
  const resp = await createResponse(client, {
    knowledgeStoreId: ksId,
    input: [{ type: "message", role: "user", content: "Summarize the contents of {{sel:0}}." }],
    selections: [{ kind: "collection", id: collection.id! }],
  });
  printResponse(resp, "selections -> collection ({{sel:0}})");
  await client.knowledgeStoreItemCollections.delete(ksId, collection.id!);
}

async function demoStreaming(client: TwelveLabs, ksId: string) {
  // createStream() returns a Stream<ResponseStreamEvent> — an async-iterable of
  // typed SSE events. Assemble the incremental response.output_text.delta chunks
  // into the final text as they arrive.
  console.log("\n[streaming] responses.createStream():");
  let stream: Awaited<ReturnType<typeof client.responses.createStream>>;
  for (;;) {
    try {
      stream = await client.responses.createStream({
        knowledgeStoreId: ksId,
        input: [{ type: "message", role: "user", content: "Give a one-sentence summary." }],
      });
      break;
    } catch (err) {
      if (err instanceof TwelvelabsApiError && err.statusCode === 429) {
        const retryAfter = headerValue(err.rawResponse, "retry-after");
        const waitMs = (retryAfter ? parseInt(retryAfter, 10) + 1 : 16) * 1000;
        console.log(`  [rate limited] waiting ${waitMs / 1000}s then retrying ...`);
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }

  const textParts: string[] = [];
  let eventCount = 0;
  for await (const event of stream) {
    eventCount += 1;
    if (event.type === "response.output_text.delta") {
      textParts.push((event as any).delta ?? "");
    } else if (event.type === "response.completed") {
      console.log("  received response.completed");
    }
  }
  console.log(`  streamed ${eventCount} event(s)`);
  console.log(`  assembled text: ${textParts.join("").slice(0, 400)}`);
}

async function main() {
  const client = makeClient();

  // Create a knowledge store with a ready video and image item to reason over.
  const setup = await setupReadyKnowledgeStore(client, {
    name: `ks-responses-${Date.now()}`,
  });
  const { knowledgeStoreId: ksId, items } = setup;
  try {
    const sessionId = await demoNonStreaming(client, ksId);
    await demoMultiTurn(client, ksId, sessionId);
    await demoIncludeIntermediate(client, ksId);
    await demoStructuredOutput(client, ksId);
    await demoSelectionsItem(client, ksId, items);
    await demoSelectionsCollection(client, ksId, items);
    await demoStreaming(client, ksId);
  } finally {
    await cleanupKnowledgeStore(client, ksId);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
