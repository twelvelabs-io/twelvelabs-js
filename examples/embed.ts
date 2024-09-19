import * as fs from 'fs';
import path from 'path';
import { TwelveLabs, EmbeddingsTask } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const printVideoEmbeddings = async (id: string) => {
    const task = await client.embed.task.retrieve(id);
    if (task.videoEmbeddings) {
      for (const v of task.videoEmbeddings) {
        console.log(
          `embeddingScope=${v.embeddingScope} startOffsetSec=${v.startOffsetSec} endOffsetSec=${v.endOffsetSec}`,
        );
        console.log(`embeddings: ${v.embedding.float.join(', ')}`);
      }
    }
  };

  const engineName = 'Marengo-retrieval-2.6';
  const videoPath = path.join(__dirname, 'assets/example.mp4');

  const textEmbedding = await client.embed.create({
    engineName,
    text: 'man walking across the street',
    textTruncate: 'start',
  });
  console.log(`Created text embedding: engineName=${textEmbedding.engineName}`);

  const textEmbeddingTask = await client.embed.task.create(engineName, {
    file: fs.createReadStream(videoPath),
  });
  console.log(
    `Created task of text embedding: id=${textEmbeddingTask.id} engineName=${textEmbeddingTask.engineName} status=${textEmbeddingTask.status}`,
  );

  const textEmbeddingTaskStatus = await textEmbeddingTask.waitForDone(5000, (task: EmbeddingsTask) => {
    console.log(`  Status=${task.status}`);
  });
  console.log(`Embedding done: ${textEmbeddingTaskStatus}`);
  printVideoEmbeddings(textEmbeddingTask.id);

  const imageEmbedding = await client.embed.create({
    engineName,
    text: 'man walking across the street',
    textTruncate: 'start',
  });
  console.log(`Created image embedding: engineName=${imageEmbedding.engineName}`);

  const imageEmbeddingTask = await client.embed.task.create(engineName, {
    file: fs.createReadStream(videoPath),
  });
  console.log(
    `Created task of image embedding: id=${imageEmbeddingTask.id} engineName=${imageEmbeddingTask.engineName} status=${imageEmbeddingTask.status}`,
  );

  const imageEmbeddingTaskStatus = await imageEmbeddingTask.waitForDone(5000, (task: EmbeddingsTask) => {
    console.log(`  Status=${task.status}`);
  });
  console.log(`Embedding done: ${imageEmbeddingTaskStatus}`);
  printVideoEmbeddings(imageEmbeddingTask.id);
})();
