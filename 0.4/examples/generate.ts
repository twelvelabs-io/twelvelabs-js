import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const videoId = '<YOUR_VIDEO_ID>';

  const summary = await client.summarize(videoId, 'summary');
  console.log(`Summary: ${summary.summary}`);

  const gist = await client.gist(videoId, ['title', 'topic', 'hashtag']);
  console.log(`Gist: title=${gist.title} topics=${gist.topics} hashtags=${gist.hashtags}`);

  const analysis = await client.analyze(videoId, 'What happened?');
  console.log(`Analysis: ${analysis.data}`);

  const analysisStream = await client.analyzeStream({ videoId, prompt: 'What happened?' });

  for await (const text of analysisStream) {
    console.log(text);
  }

  console.log(`Aggregated analysis: ${analysisStream.aggregatedText}`);
})();
