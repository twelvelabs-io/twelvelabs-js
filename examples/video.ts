import { TwelveLabs, Video, SegmentEmbedding } from 'twelvelabs';

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

  // Example of retrieving video with embeddings using embedding_option
  console.log('\nRetrieving video with embeddings:');
  const videoWithEmbeddings = await client.index.video.retrieve(index.id, videos[0].id, {
    embeddingOption: ['visual-text', 'audio']
  });

  if (videoWithEmbeddings.embedding) {
    console.log(`Retrieved embeddings for video: ${videoWithEmbeddings.id}`);
    const printEmbeddings = (segments: SegmentEmbedding[]) => {
      segments.forEach((segment) => {
        // Print embedding info and first few values of the embeddings
        const truncatedEmbeddings = segment.embeddingsFloat ?
          segment.embeddingsFloat.slice(0, 5).map(v => v.toFixed(4)) : [];

        console.log(`  Segment: startTime=${segment.startOffsetSec}s endTime=${segment.endOffsetSec}s`);
        console.log(`  Scope: ${segment.embeddingScope}, Option: ${segment.embeddingOption}`);
        console.log(`  Embeddings (truncated): [${truncatedEmbeddings.join(', ')}...]`);
        console.log(`  Total embedding values: ${segment.embeddingsFloat?.length || 0}`);
        console.log('---');
      });
    };

    if (videoWithEmbeddings.embedding.videoEmbedding?.segments) {
      console.log('Video embeddings:');
      printEmbeddings(videoWithEmbeddings.embedding.videoEmbedding.segments);
    }
  } else {
    console.log('No embeddings found for the video');
  }
})();
