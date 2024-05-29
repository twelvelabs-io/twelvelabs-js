import * as fs from 'fs';
import path from 'path';
import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const engineName = 'Marengo-retrieval-2.6';
  const embedding = await client.embed.create({
    engineName,
    text: 'man walking across the street',
    textTruncate: 'start',
  });
  console.log(`Created embedding: engineName=${embedding.engineName}`);

  const videoPath = path.join(__dirname, 'assets/example.mp4');
  const taskId = await client.embed.task.create(engineName, {
    file: fs.createReadStream(videoPath),
  });

  const task = await client.embed.task.retrieve(taskId);
  console.log(`Created task: id=${task.id} engineName=${task.engineName} status=${task.status}`);

  const taskStatus = await client.embed.task.status(task.id);
  console.log(`Task status: ${taskStatus.status}`);
})();
