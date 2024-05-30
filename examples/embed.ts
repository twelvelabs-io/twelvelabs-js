import * as fs from 'fs';
import path from 'path';
import { TwelveLabs, EmbeddingsTask } from 'twelvelabs';

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
  let task = await client.embed.task.create(engineName, {
    file: fs.createReadStream(videoPath),
  });
  console.log(`Created task: id=${task.id} engineName=${task.engineName} status=${task.status}`);

  const status = await task.waitForDone(5000, (task: EmbeddingsTask) => {
    console.log(`  Status=${task.status}`);
  });
  console.log(`Embedding done: ${status}`);

  task = await client.embed.task.retrieve(task.id);
  if (task.videoEmbeddings) {
    for (const v of task.videoEmbeddings) {
      console.log(
        `embeddingScope=${v.embeddingScope} startOffsetSec=${v.startOffsetSec} endOffsetSec=${v.endOffsetSec}`,
      );
      console.log(`embeddings: ${v.embedding.float.join(', ')}`);
    }
  }
})();
