import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.index.retrieve('65a75560efa0814ef2edc77a');

  console.log(`Videos in index id=${index.id}`);
  const videos = await client.index.video.list(index.id);
  videos.forEach((video) => {
    console.log(`  filename=${video.metadata.filename} duration=${video.metadata.duration}`);
  });

  let video = await client.index.video.retrieve(index.id, videos[0].id);
  await client.index.video.update(index.id, video.id, { metadata: { from_sdk: true } });
  video = await client.index.video.retrieve(index.id, videos[0].id);
  console.log(`Updated first video's metadata`, video.metadata);

  const transcriptions = await client.index.video.transcription(index.id, video.id, { start: 0, end: 30 });
  console.log(`There are ${transcriptions.length} transcriptions`);
  transcriptions.forEach((transcription) => {
    console.log(`  value=${transcription.value} start=${transcription.start} end=${transcription.end}`);
  });

  const textInVideos = await client.index.video.textInVideo(index.id, video.id);
  console.log(`There are ${textInVideos.length} textInVideos`);
  textInVideos.forEach((text) => {
    console.log(`  value=${text.value} start=${text.start} end=${text.end}`);
  });

  const logos = await client.index.video.logo(index.id, video.id);
  console.log(`There are ${logos.length} logos`);
  logos.forEach((logo) => {
    console.log(`  value=${logo.value} start=${logo.start} end=${logo.end}`);
  });

  const thumbnail = await client.index.video.thumbnail(index.id, video.id);
  console.log(`Thumbnail: ${thumbnail}`);
})();
