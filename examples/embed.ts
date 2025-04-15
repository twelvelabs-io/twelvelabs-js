import * as fs from 'fs';
import path from 'path';
import { TwelveLabs, EmbeddingsTask, SegmentEmbedding } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const printSegments = (segments: SegmentEmbedding[]) => {
    segments.forEach((segment) => {
      console.log(
        `embeddingScope=${segment.embeddingScope} embeddingOption=${segment.embeddingOption} startOffsetSec=${segment.startOffsetSec} endOffsetSec=${segment.endOffsetSec}`,
      );
      console.log('embeddings: ', segment.embeddingsFloat);
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

  const modelName = 'Marengo-retrieval-2.7';

  let res = await client.embed.create({
    modelName,
    text: 'man walking across the street',
    textTruncate: 'start',
  });
  console.log(`Created text embedding: modelName=${res.modelName}`);
  if (res.textEmbedding?.segments) {
    printSegments(res.textEmbedding.segments);
  }

  res = await client.embed.create({
    modelName,
    imageFile: fs.createReadStream(path.join(__dirname, 'assets/search_sample.png')),
  });
  console.log(`Created image embedding: modelName=${res.modelName}`);
  if (res.imageEmbedding?.segments) {
    printSegments(res.imageEmbedding.segments);
  }

  res = await client.embed.create({
    modelName,
    audioFile: fs.createReadStream(path.join(__dirname, 'assets/audio_sample.mp3')),
  });
  console.log(`Created audio embedding: modelName=${res.modelName}`);
  if (res.audioEmbedding?.segments) {
    printSegments(res.audioEmbedding.segments);
  }

  let task = await client.embed.task.create(modelName, {
    file: fs.createReadStream(path.join(__dirname, 'assets/example.mp4')),
  });
  console.log(`Created task: id=${task.id} modelName=${task.modelName} status=${task.status}`);

  const status = await task.waitForDone(5000, (task: EmbeddingsTask) => {
    console.log(`  Status=${task.status}`);
  });
  console.log(`Embedding done: ${status}`);

  task = await task.retrieve({ embeddingOption: ['visual-text', 'audio'] });
  if (task.videoEmbedding) {
    if (task.videoEmbedding.segments) {
      printSegments(task.videoEmbedding.segments);
    }
  }
})();
