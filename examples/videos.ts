import { TwelveLabs, TwelvelabsApi } from "twelvelabs-js";

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.indexes.retrieve("<YOUR_INDEX_ID>");

  console.log(`Videos in index id=${index.id}`);
  const videosPager = await client.indexes.videos.list(index.id!);
  if (videosPager.data.length === 0) {
    console.log("No videos in the index, exiting");
    return;
  }
  for await (const video of videosPager.data) {
    console.log(
      `  filename=${video.systemMetadata?.filename} duration=${video.systemMetadata?.duration}`
    );
  }

  const videoId = videosPager.data[0].id;

  await client.indexes.videos.update(index.id!, videoId!, {
    userMetadata: { from_sdk: true },
  });
  const video = await client.indexes.videos.retrieve(index.id!, videoId!);
  console.log("userMetadata", video.userMetadata);

  // Example of retrieving video with embeddings using embedding_option
  console.log("\nRetrieving video with embeddings:");
  const videoWithEmbeddings = await client.indexes.videos.retrieve(
    index.id!,
    videoId!,
    {
      embeddingOption: ["visual", "audio"],
    }
  );

  if (videoWithEmbeddings.embedding) {
    console.log(`Retrieved embeddings for video: ${videoWithEmbeddings.id}`);
    const printEmbeddings = (segments: TwelvelabsApi.VideoSegment[]) => {
      segments.forEach((segment) => {
        console.log(
          `  embeddingScope=${segment.embeddingScope} embeddingOption=${segment.embeddingOption} startOffsetSec=${segment.startOffsetSec} endOffsetSec=${segment.endOffsetSec}`
        );
      });
    };

    if (videoWithEmbeddings.embedding.videoEmbedding?.segments) {
      console.log("Video embeddings:");
      printEmbeddings(videoWithEmbeddings.embedding.videoEmbedding.segments);
    }
  } else {
    console.log("No embeddings found for the video");
  }
})();
