import { TwelveLabs } from "twelvelabs-js";

(async () => {
    const client = new TwelveLabs({ apiKey: process.env.API_KEY });

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

    const text = await client.analyze({
        videoId,
        prompt: "What happened?",
    });
    console.log(`Open-ended Text: ${text.data}`);

    const textStream = await client.analyzeStream({
        videoId,
        prompt: "What happened?",
    });

    for await (const chunk of textStream) {
        if ("text" in chunk) {
            console.log(chunk.text!);
        }
    }
})();
