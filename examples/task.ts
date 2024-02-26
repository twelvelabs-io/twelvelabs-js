import * as fs from 'fs';
import path from 'path';
import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.index.retrieve('65a75560efa0814ef2edc77a');

  console.log('Uploading an example video(example.mp4) and waiting for done');

  const videoPath = path.join(__dirname, 'assets/example.mp4');
  const task = await client.task.create({
    indexId: index.id,
    file: fs.createReadStream(videoPath),
    language: 'en',
  });

  console.log(`Created task: id=${task.id} status=${task.status}`);

  await task.waitForDone();

  if (task.status !== 'ready') {
    throw new Error(`Indexing failed with status ${task.status}`);
  }

  console.log('Uploaded a video');

  console.log(`Tasks in index ${index.id}`);
  const tasks = await client.task.list({ indexId: index.id });
  tasks.forEach((task) => {
    console.log(`  id=${task.id} status=${task.status}`);
  });

  // Handling next pages would depend on your pagination implementation

  const status = await client.task.status(index.id);
  console.log(
    `Tasks by status: ready=${status.ready} validating=${status.validating} pending=${status.pending} failed=${status.failed} totalResult=${status.totalResult}`,
  );
})();
