import * as fs from 'fs';
import path from 'path';
import { TwelveLabs, Task } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.index.retrieve('<YOUR_INDEX_ID>');

  console.log('Uploading an example video(example.mp4) and waiting for done');

  const videoPath = path.join(__dirname, 'assets/example.mp4');
  const task = await client.task.create({
    indexId: index.id,
    file: fs.createReadStream(videoPath),
  });

  console.log(`Created task: id=${task.id} status=${task.status}`);

  await task.waitForDone(500, (task: Task) => {
    console.log(`  Status=${task.status}`);
  });

  if (task.status !== 'ready') {
    throw new Error(`Indexing failed with status ${task.status}`);
  }

  console.log('Uploaded a video');

  console.log(`Tasks in index ${index.id}`);
  const tasks = await client.task.list({ indexId: index.id });
  tasks.forEach((task) => {
    console.log(`  id=${task.id} status=${task.status}`);
  });

  console.log('Tasks with pagination:');
  const pagination = await client.task.listPagination();
  pagination.data.forEach((task: Task) => {
    console.log(`  id=${task.id} status=${task.status}`);
  });
  while (true) {
    const nextPageData = await pagination.next();
    if (!nextPageData) {
      console.log('  no more pages');
      break;
    }
    nextPageData.forEach((task: Task) => {
      console.log(`  id=${task.id} status=${task.status}`);
    });
  }
})();
