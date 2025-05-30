import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const videoId = '<YOUR_VIDEO_ID>';

  const summary = await client.generate.summarize(videoId, 'summary');
  console.log(`Summary: ${summary.summary}`);

  const gist = await client.generate.gist(videoId, ['title', 'topic', 'hashtag']);
  console.log(`Gist: title=${gist.title} topics=${gist.topics} hashtags=${gist.hashtags}`);

  const analysis = await client.generate.analyze(videoId, 'What happened?');
  console.log(`Analysis: ${analysis.data}`);

  const analysisStream = await client.generate.analyzeStream({ videoId, prompt: 'What happened?' });

  for await (const text of analysisStream) {
    console.log(text);
  }

  console.log(`Aggregated analysis: ${analysisStream.aggregatedText}`);
})();
