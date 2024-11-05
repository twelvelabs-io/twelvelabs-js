import * as fs from 'fs';
import path from 'path';
import { TwelveLabs, EmbeddingsTask, SegmentEmbedding } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const printSegments = (segments: SegmentEmbedding[]) => {
    segments.forEach((segment) => {
      console.log(
        `embeddingScope=${segment.embeddingScope} startOffsetSec=${segment.startOffsetSec} endOffsetSec=${segment.endOffsetSec}`,
      );
      console.log('embeddings: ', segment.float);
    });
  };

  const embedTasks = await client.embed.task.list();
  embedTasks.forEach((task) => {
    console.log(`Embedding task: id=${task.id} status=${task.status} createdAt=${task.createdAt}`);
    if (task.videoEmbedding) {
      if (task.videoEmbedding.segments) {
        printSegments(task.videoEmbedding.segments);
      }
    }
  });

  const engineName = 'Marengo-retrieval-2.6';

  let res = await client.embed.create({
    engineName,
    text: 'man walking across the street',
    textTruncate: 'start',
  });
  console.log(`Created text embedding: engineName=${res.engineName}`);
  if (res.textEmbedding?.segments) {
    printSegments(res.textEmbedding.segments);
  }

  res = await client.embed.create({
    engineName,
    imageFile: fs.createReadStream(path.join(__dirname, 'assets/search_sample.png')),
  });
  console.log(`Created image embedding: engineName=${res.engineName}`);
  if (res.imageEmbedding?.segments) {
    printSegments(res.imageEmbedding.segments);
  }

  res = await client.embed.create({
    engineName,
    audioFile: fs.createReadStream(path.join(__dirname, 'assets/audio_sample.mp3')),
  });
  console.log(`Created audio embedding: engineName=${res.engineName}`);
  if (res.audioEmbedding?.segments) {
    printSegments(res.audioEmbedding.segments);
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
  if (task.videoEmbedding) {
    if (task.videoEmbedding.segments) {
      printSegments(task.videoEmbedding.segments);
    }
  }
})();
