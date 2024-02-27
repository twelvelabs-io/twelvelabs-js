import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.index.retrieve('65a75560efa0814ef2edc77a');
  const videos = await client.index.video.list(index.id);
  if (videos.length === 0) {
    throw new Error(`No videos in index ${index.id}, exit`);
  }
  const [video] = videos;

  const gist = await client.generate.gist(video.id, ['title']);
  console.log(`Gist: title=${gist.title} topics=${gist.topics} hashtags=${gist.hashtags}`);

  const summary = await client.generate.summarize(video.id, 'summary');
  console.log(`Summary: ${summary.summary}`);

  const text = await client.generate.text(video.id, 'What happened?');
  console.log(`Open-ended Text: ${text.data}`);
})();
