import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const videoId = '<YOUR_VIDEO_ID>';

  const gist = await client.generate.gist(videoId, ['title']);
  console.log(`Gist: title=${gist.title} topics=${gist.topics} hashtags=${gist.hashtags}`);

  const summary = await client.generate.summarize(videoId, 'summary');
  console.log(`Summary: ${summary.summary}`);

  const text = await client.generate.text(videoId, 'What happened?');
  console.log(`Open-ended Text: ${text.data}`);

  const textStream = await client.generate.textStream({ videoId, prompt: 'What happened?' });

  for await (const text of textStream) {
    console.log(text);
  }

  console.log(`Aggregated text: ${textStream.aggregatedText}`);
})();
