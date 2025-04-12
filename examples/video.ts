import { TwelveLabs, Video } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.index.retrieve('<YOUR_INDEX_ID>');

  console.log(`Videos in index id=${index.id}`);
  const videos = await client.index.video.list(index.id);
  if (videos.length === 0) {
    console.log('No videos in the index, exiting');
    return;
  }
  videos.forEach((video) => {
    console.log(`  filename=${video.systemMetadata.filename} duration=${video.systemMetadata.duration}`);
  });

  await client.index.video.update(index.id, videos[0].id, { userMetadata: { from_sdk: true } });
  const video = await client.index.video.retrieve(index.id, videos[0].id);
  console.log(`Updated first video's metadata`, video.userMetadata);

  console.log('Videos with pagination:');
  const pagination = await client.index.video.listPagination(index.id);
  pagination.data.forEach((video: Video) => {
    console.log(`  filename=${video.systemMetadata.filename} duration=${video.systemMetadata.duration}`);
  });
  while (true) {
    const nextPageData = await pagination.next();
    if (!nextPageData) {
      console.log('  no more pages');
      break;
    }
    nextPageData.forEach((video: Video) => {
      console.log(`  filename=${video.systemMetadata.filename} duration=${video.systemMetadata.duration}`);
    });
  }
})();
