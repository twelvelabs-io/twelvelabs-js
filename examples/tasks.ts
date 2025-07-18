import * as fs from "fs";
import path from "path";
import { TwelveLabs, TwelvelabsApi } from "twelvelabs-js";

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.indexes.retrieve("<YOUR_INDEX_ID>");

  console.log("Uploading an example video(example.mp4) and waiting for done");

  const videoPath = path.join(__dirname, "assets/example.mp4");
  const createTaskResponse = await client.tasks.create({
    indexId: index.id!,
    videoFile: fs.createReadStream(videoPath),
  });

  console.log(`Created task: id=${createTaskResponse.id}`);

  const task = await client.tasks.waitForDone(createTaskResponse.id!, {
    callback: (task: TwelvelabsApi.TasksRetrieveResponse) => {
      console.log(`  Status=${task.status}`);
    },
  });

  if (task.status !== "ready") {
    throw new Error(`Indexing failed with status ${task.status}`);
  }

  console.log("Uploaded a video");

  console.log(`Tasks in index ${index.id}`);
  const tasksPager = await client.tasks.list({ indexId: index.id });
  for await (const task of tasksPager) {
    console.log(`  id=${task.id} status=${task.status}`);
  }
})();
