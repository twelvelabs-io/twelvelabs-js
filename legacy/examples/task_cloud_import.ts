import { TwelveLabs } from 'twelvelabs';

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const indexId = '<YOUR_INDEX_ID>';
  const integrationId = '<INTEGRATION_ID>';

  const res = await client.task.transfers.importVideos({ indexId, integrationId, incrementalImport: false });
  res.videos.forEach((v) => {
    console.log(`video: ${v.videoId} ${v.filename}`);
  });
  res.failedFiles?.forEach((f) => {
    console.log(`failed file: ${f.filename} ${f.errorMessage}`);
  });

  const status = await client.task.transfers.importStatus(integrationId, indexId);
  status.ready.forEach((v) => {
    console.log(`ready: ${v.videoId} ${v.filename} ${v.createdAt}`);
  });
  status.failed.forEach((f) => {
    console.log(`failed: ${f.filename} ${f.errorMessage}`);
  });

  const logs = await client.task.transfers.importLogs(integrationId);
  logs.forEach((l) => {
    console.log(
      `indexId: ${l.indexId} indexName: ${l.indexName} createdAt: ${l.createdAt} endedAt: ${l.endedAt} videoStatus: ${l.videoStatus}`,
    );
    l.failedFiles?.forEach((f) => {
      console.log(`failed file: ${f.filename} ${f.errorMessage}`);
    });
  });
})();
