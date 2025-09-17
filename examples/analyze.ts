import { TwelveLabs } from "twelvelabs-js";

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.TWELVE_LABS_API_KEY });

    const videoId = "<YOUR_VIDEO_ID>";

  let summarizeResp = await client.summarize({
    videoId,
    type: "summary",
  });
  if (summarizeResp.summarizeType === "summary") {
    console.log(`Summary: ${summarizeResp.summary}`);
  }

  summarizeResp = await client.summarize({
    videoId,
    type: "chapter",
  });
  if (summarizeResp.summarizeType === "chapter") {
    for (const chapter of summarizeResp.chapters!) {
      console.log(
        `Chapter: ${chapter.chapterNumber} ${chapter.chapterTitle} ${chapter.chapterSummary}`
      );
    }
  }

  const gist = await client.gist({
    videoId,
    types: ["title", "topic", "hashtag"],
  });
  console.log(`Gist: title=${gist.title} topics=${gist.topics} hashtags=${gist.hashtags}`);

  // Basic streaming analyze example
  const textStream = await client.analyzeStream({
    videoId,
    prompt: "What happened?",
  });

  console.log("Streaming analyze result:");
  for await (const chunk of textStream) {
    if (chunk.eventType === "stream_start") {
      console.log("Stream started");
    } else if (chunk.eventType === "text_generation" && "text" in chunk) {
      process.stdout.write(chunk.text!);
    } else if (chunk.eventType === "stream_end") {
      console.log(`\nFinish reason: ${chunk.finishReason}`);
      if (chunk.metadata && chunk.metadata.usage) {
        console.log(`Usage: ${JSON.stringify(chunk.metadata.usage)}`);
      }
    }
  }

  // Streaming with structured output
  const structuredStream = await client.analyzeStream({
    videoId,
    prompt: "Analyze this video and provide a structured breakdown of the main topics, key insights, and action items.",
    temperature: 0.3,
    responseFormat: {
      type: "json_schema",
      jsonSchema: {
        type: "object",
        properties: {
          main_topics: { type: "array", items: { type: "string" } },
          key_insights: { type: "array", items: { type: "string" } },
          action_items: { type: "array", items: { type: "string" } },
        },
      },
    },
    maxTokens: 1500,
  });

  console.log("\nStreaming structured analyze result:");
  for await (const chunk of structuredStream) {
    if (chunk.eventType === "text_generation" && "text" in chunk) {
      process.stdout.write(chunk.text!);
    } else if (chunk.eventType === "stream_end") {
      console.log(`\nFinish reason: ${chunk.finishReason}`);
      if (chunk.metadata && chunk.metadata.usage) {
        console.log(`Usage: ${JSON.stringify(chunk.metadata.usage)}`);
      }
    }
  }
})();
