import * as fs from "fs";
import path from "path";
import { TwelveLabs, TwelvelabsApi } from "twelvelabs-js";

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const printSegments = (segments: TwelvelabsApi.BaseSegment[]) => {
    segments.forEach((segment) => {
      const first_few = segment.float?.slice(0, 5);
      console.log(
        `  embeddings: [${first_few?.join(", ")}...] (total: ${
          segment.float?.length
        } values)`
      );
    });
  };

  const embedTasks = await client.embed.tasks.list();
  for await (const task of embedTasks) {
    console.log(
      `Embedding task: id=${task.id} status=${task.status} createdAt=${task.createdAt}`
    );
  }

  const modelName = "marengo3.0";

  let res = await client.embed.create({
    modelName,
    text: "man walking across the street",
    textTruncate: "start",
  });
  console.log("Created text embedding");
  if ("textEmbedding" in res && res.textEmbedding?.segments) {
    printSegments(res.textEmbedding.segments);
  }

  res = await client.embed.create({
    modelName,
    imageFile: fs.createReadStream(
      path.join(__dirname, "assets/search_sample.png")
    ),
  });
  console.log("Created image embedding");
  if ("imageEmbedding" in res && res.imageEmbedding?.segments) {
    printSegments(res.imageEmbedding.segments);
  }

  res = await client.embed.create({
    modelName,
    audioFile: fs.createReadStream(
      path.join(__dirname, "assets/audio_sample.mp3")
    ),
  });
  console.log("Created audio embedding");
  if ("audioEmbedding" in res && res.audioEmbedding?.segments) {
    printSegments(res.audioEmbedding.segments);
  }

  let task = await client.embed.tasks.create({
    modelName,
    videoFile: fs.createReadStream(path.join(__dirname, "assets/example.mp4")),
  });
  console.log(`Created task: id=${task.id}`);

  const status = await client.embed.tasks.waitForDone(task.id!, {
    callback: (task: TwelvelabsApi.embed.TasksStatusResponse) => {
      console.log(`  Status=${task.status}`);
    },
  });
  console.log(`Embedding done: ${status.status}`);

  const videoWithEmbeddings = await client.embed.tasks.retrieve(task.id!, {
    embeddingOption: ["visual-text", "audio"],
  });
  if (videoWithEmbeddings.videoEmbedding?.segments) {
    printSegments(videoWithEmbeddings.videoEmbedding.segments);
  }
})();
