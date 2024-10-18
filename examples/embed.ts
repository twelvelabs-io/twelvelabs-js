import * as fs from 'fs';
import path from 'path';
import { TwelveLabs, EmbeddingsTask } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const embedTasks = await client.embed.task.list();
  embedTasks.forEach((task) => {
    console.log(`Embedding task: id=${task.id} status=${task.status} createdAt=${task.createdAt}`);
    if (task.metadata) {
      console.table(task.metadata);
    }
  });

  const engineName = 'Marengo-retrieval-2.6';

  let res = await client.embed.create({
    engineName,
    text: 'man walking across the street',
    textTruncate: 'start',
  });
  console.log(`Created text embedding: engineName=${res.engineName}`);
  if (res.textEmbedding) {
    console.log(`  embeddings: ${res.textEmbedding.float.join(', ')}`);
  }

  res = await client.embed.create({
    engineName,
    imageFile: fs.createReadStream(path.join(__dirname, 'assets/search_sample.png')),
  });
  console.log(`Created image embedding: engineName=${res.engineName}`);
  if (res.imageEmbedding) {
    console.log(`  embeddings: ${res.imageEmbedding.float.join(', ')}`);
  }

  res = await client.embed.create({
    engineName,
    audioFile: fs.createReadStream(path.join(__dirname, 'assets/audio_sample.mp3')),
  });
  console.log(`Created audio embedding: engineName=${res.engineName}`);
  if (res.audioEmbedding?.segments) {
    res.audioEmbedding.segments.forEach((segment) => {
      console.log(
        `  embeddingScope=${segment.embeddingScope} startOffsetSec=${segment.startOffsetSec} endOffsetSec=${segment.endOffsetSec}`,
      );
      console.log(`  embeddings: ${segment.float.join(', ')}`);
    });
  }

  let task = await client.embed.task.create(engineName, {
    file: fs.createReadStream(path.join(__dirname, 'assets/example.mp4')),
  });
  console.log(`Created task: id=${task.id} engineName=${task.engineName} status=${task.status}`);

  const status = await task.waitForDone(5000, (task: EmbeddingsTask) => {
    console.log(`  Status=${task.status}`);
  });
  console.log(`Embedding done: ${status}`);

  task = await task.retrieve();
  if (task.videoEmbeddings) {
    for (const v of task.videoEmbeddings) {
      console.log(
        `embeddingScope=${v.embeddingScope} startOffsetSec=${v.startOffsetSec} endOffsetSec=${v.endOffsetSec}`,
      );
      console.log(`embeddings: ${v.float.join(', ')}`);
    }
  }
})();
