# Reference

<details><summary><code>client.<a href="/src/Client.ts">analyze</a>({ ...params }) -> TwelvelabsApi.NonStreamAnalyzeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint analyzes your videos and creates fully customizable text based on your prompts, including but not limited to tables of content, action items, memos, and detailed analyses.

<Note title="Notes">
- This endpoint is rate-limited. For details, see the [Rate limits](/v1.3/docs/get-started/rate-limits) page.
- This endpoint supports streaming responses. For details on integrating this feature into your application, refer to the [Open-ended analysis](/v1.3/docs/guides/analyze-videos/open-ended-analysis#streaming-responses).
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.analyze({
    videoId: "6298d673f1090f1100476d4c",
    prompt: "I want to generate a description for my video with the following format - Title of the video, followed by a summary in 2-3 sentences, highlighting the main topic, key events, and concluding remarks.",
    temperature: 0.2,
    responseFormat: {
        type: "json_schema",
        jsonSchema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                },
                summary: {
                    type: "string",
                },
                keywords: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        },
    },
    maxTokens: 2000,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.AnalyzeRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TwelvelabsApiClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

##

## Tasks

<details><summary><code>client.tasks.<a href="/src/api/resources/tasks/client/Client.ts">list</a>({ ...params }) -> core.Page<TwelvelabsApi.VideoIndexingTask></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the video indexing tasks in your account. The platform returns your video indexing tasks sorted by creation date, with the newest at the top of the list.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.tasks.list({
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    indexId: "630aff993fcee0532cb809d0",
    filename: "01.mp4",
    duration: 531.998133,
    width: 640,
    height: 360,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.tasks.list({
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    indexId: "630aff993fcee0532cb809d0",
    filename: "01.mp4",
    duration: 531.998133,
    width: 640,
    height: 360,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.TasksListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tasks.<a href="/src/api/resources/tasks/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.TasksCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method creates a video indexing task that uploads and indexes a video in a single operation.

<Warning title="Legacy endpoint">
This endpoint bundles two operations (upload and indexing) together. In the next major API release, this endpoint will be removed in favor of a separated workflow:
1. Upload your video using the [`POST /assets`](/v1.3/api-reference/upload-content/direct-uploads/create) endpoint
2. Index the uploaded video using the [`POST /indexes/{index-id}/indexed-assets`](/v1.3/api-reference/index-content/create) endpoint

This separation provides better control, reusability of assets, and improved error handling. New implementations should use the new workflow.
</Warning>

Upload options:

- **Local file**: Use the `video_file` parameter.
- **Publicly accessible URL**: Use the `video_url` parameter.

Your video files must meet requirements based on your workflow:

- **Search**: [Marengo requirements](/v1.3/docs/concepts/models/marengo#video-file-requirements).
- **Video analysis**: [Pegasus requirements](/v1.3/docs/concepts/models/pegasus#video-file-requirements).
- If you want to both search and analyze your videos, the most restrictive requirements apply.
- This method allows you to upload files up to 2 GB in size. To upload larger files, use the [Multipart Upload API](/v1.3/api-reference/upload-content/multipart-uploads)

<Note title="Note">
This endpoint is rate-limited. For details, see the [Rate limits](/v1.3/docs/get-started/rate-limits) page.
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tasks.create({
    indexId: "index_id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.TasksCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tasks.<a href="/src/api/resources/tasks/client/Client.ts">retrieve</a>(taskId) -> TwelvelabsApi.TasksRetrieveResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves a video indexing task.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tasks.retrieve("6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**taskId:** `string` — The unique identifier of the video indexing task to retrieve.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tasks.<a href="/src/api/resources/tasks/client/Client.ts">delete</a>(taskId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This action cannot be undone.
Note the following about deleting a video indexing task:

- You can only delete video indexing tasks for which the status is `ready` or `failed`.
- If the status of your video indexing task is `ready`, you must first delete the video vector associated with your video indexing task by calling the [`DELETE`](/v1.3/api-reference/videos/delete) method of the `/indexes/videos` endpoint.
  </dd>
  </dl>
  </dd>
  </dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tasks.delete("6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**taskId:** `string` — The unique identifier of the video indexing task you want to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Indexes

<details><summary><code>client.indexes.<a href="/src/api/resources/indexes/client/Client.ts">list</a>({ ...params }) -> core.Page<TwelvelabsApi.IndexSchema></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the indexes in your account. The platform returns indexes sorted by creation date, with the oldest indexes at the top of the list.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.indexes.list({
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    indexName: "myIndex",
    modelOptions: "visual,audio",
    modelFamily: "marengo",
    createdAt: "2024-08-16T16:53:59Z",
    updatedAt: "2024-08-16T16:55:59Z",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.indexes.list({
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    indexName: "myIndex",
    modelOptions: "visual,audio",
    modelFamily: "marengo",
    createdAt: "2024-08-16T16:53:59Z",
    updatedAt: "2024-08-16T16:55:59Z",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.IndexesListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Indexes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.<a href="/src/api/resources/indexes/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.IndexesCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method creates an index.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.create({
    indexName: "myIndex",
    models: [
        {
            modelName: "marengo3.0",
            modelOptions: ["visual", "audio"],
        },
        {
            modelName: "pegasus1.2",
            modelOptions: ["visual", "audio"],
        },
    ],
    addons: ["thumbnail"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.IndexesCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Indexes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.<a href="/src/api/resources/indexes/client/Client.ts">retrieve</a>(indexId) -> TwelvelabsApi.IndexSchema</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves details about the specified index.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.retrieve("6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — Unique identifier of the index to retrieve.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Indexes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.<a href="/src/api/resources/indexes/client/Client.ts">update</a>(indexId, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method updates the name of the specified index.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.update("6298d673f1090f1100476d4c", {
    indexName: "myIndex",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — Unique identifier of the index to update.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.IndexesUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Indexes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.<a href="/src/api/resources/indexes/client/Client.ts">delete</a>(indexId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes the specified index and all the videos within it. This action cannot be undone.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.delete("6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — Unique identifier of the index to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Indexes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Assets

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">list</a>({ ...params }) -> core.Page<TwelvelabsApi.Asset></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of assets in your account.

<Note title="Note">
- The platform returns your assets sorted by creation date, with the newest at the top of the list.
- The platform automatically deletes assets that are not associated with any entity after 72 hours.
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.assets.list({
    page: 1,
    pageLimit: 10,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.assets.list({
    page: 1,
    pageLimit: 10,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.AssetsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Assets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.Asset</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method creates an asset by uploading a file to the platform. Assets are files (such as images, audio, or video) that you can use in downstream workflows, including indexing, analyzing video content, and creating entities.

**Supported content**: Video, audio, and images.

**Upload methods**:

- **Local file**: Set the `method` parameter to `direct` and use the `file` parameter to specify the file.
- **Publicly accessible URL**: Set the `method` parameter to `url` and use the `url` parameter to specify the URL of your file.

**File size**: 200MB maximum for local file uploads, 4GB maximum for URL uploads.

**Additional requirements** depend on your workflow:

- **Search**: [Marengo requirements](/v1.3/docs/concepts/models/marengo#video-file-requirements)
- **Video analysis**: [Pegasus requirements](/v1.3/docs/concepts/models/pegasus#input-requirements)
- **Entity search**: [Marengo image requirements](/v1.3/docs/concepts/models/marengo#image-file-requirements)
- **Create embeddings**: [Marengo requirements](/v1.3/docs/concepts/models/marengo#input-requirements)
  </dd>
  </dl>
  </dd>
  </dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.assets.create({
    method: "direct",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.AssetsCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Assets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">retrieve</a>(assetId) -> TwelvelabsApi.Asset</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves details about the specified asset.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.assets.retrieve("6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**assetId:** `string` — The unique identifier of the asset to retrieve.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Assets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">delete</a>(assetId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes the specified asset. This action cannot be undone.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.assets.delete("6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**assetId:** `string` — The unique identifier of the asset to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Assets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## MultipartUpload

<details><summary><code>client.multipartUpload.<a href="/src/api/resources/multipartUpload/client/Client.ts">listIncompleteUploads</a>({ ...params }) -> core.Page<TwelvelabsApi.IncompleteUploadSummary></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of all incomplete multipart upload sessions in your account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.multipartUpload.listIncompleteUploads({
    page: 1,
    pageLimit: 10,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.multipartUpload.listIncompleteUploads({
    page: 1,
    pageLimit: 10,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.MultipartUploadListIncompleteUploadsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MultipartUpload.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.multipartUpload.<a href="/src/api/resources/multipartUpload/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.CreateAssetUploadResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method creates a multipart upload session.

**Supported content**: Video and audio

**File size**: 4GB maximum.

**Additional requirements** depend on your workflow:

- **Search**: [Marengo requirements](/v1.3/docs/concepts/models/marengo#video-file-requirements)
- **Video analysis**: [Pegasus requirements](/v1.3/docs/concepts/models/pegasus#input-requirements)
- **Create embeddings**: [Marengo requirements](/v1.3/docs/concepts/models/marengo#input-requirements)
  </dd>
  </dl>
  </dd>
  </dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.multipartUpload.create({
    filename: "my-video.mp4",
    totalSize: 104857600,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.CreateAssetUploadRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MultipartUpload.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.multipartUpload.<a href="/src/api/resources/multipartUpload/client/Client.ts">getStatus</a>(uploadId, { ...params }) -> core.Page<TwelvelabsApi.ChunkInfo></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method provides information about an upload session, including its current status, chunk-level progress, and completion state.

Use this endpoint to:

- Verify upload completion (`status` = `completed`)
- Identify any failed chunks that require a retry
- Monitor the upload progress by comparing `uploaded_size` with `total_size`
- Determine if the session has expired
- Retrieve the status information for each chunk

You must call this method after reporting chunk completion to confirm the upload has transitioned to the `completed` status before using the asset.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.multipartUpload.getStatus("507f1f77bcf86cd799439011", {
    page: 1,
    pageLimit: 10,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.multipartUpload.getStatus("507f1f77bcf86cd799439011", {
    page: 1,
    pageLimit: 10,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**uploadId:** `string` — The unique identifier of the upload session.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.MultipartUploadGetStatusRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MultipartUpload.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.multipartUpload.<a href="/src/api/resources/multipartUpload/client/Client.ts">reportChunkBatch</a>(uploadId, { ...params }) -> TwelvelabsApi.ReportChunkBatchResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method notifies the platform which chunks have been successfully uploaded. When all chunks are reported, the platform finalizes the upload.

<Note title="Note">
For optimal performance, report chunks in batches and in any order.
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.multipartUpload.reportChunkBatch("507f1f77bcf86cd799439011", {
    completedChunks: [
        {
            chunkIndex: 1,
            proof: "d41d8cd98f00b204e9800998ecf8427e",
            proofType: "etag",
            chunkSize: 5242880,
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**uploadId:** `string` — The unique identifier of the upload session.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.ReportChunkBatchRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MultipartUpload.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.multipartUpload.<a href="/src/api/resources/multipartUpload/client/Client.ts">getAdditionalPresignedUrls</a>(uploadId, { ...params }) -> TwelvelabsApi.RequestAdditionalPresignedUrLsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method generates new presigned URLs for specific chunks that require uploading. Use this endpoint in the following situations:

- Your initial URLs have expired (URLs expire after one hour).
- The initial set of presigned URLs does not include URLs for all chunks.
- You need to retry failed chunk uploads with new URLs.
To specify which chunks need URLs, use the `start` and `count` parameters. For example, to generate URLs for chunks 21 to 30, use `start=21` and `count=10`.
The response will provide new URLs, each with a fresh expiration time of one hour.
  </dd>
  </dl>
  </dd>
  </dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.multipartUpload.getAdditionalPresignedUrls("507f1f77bcf86cd799439011", {
    start: 1,
    count: 10,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**uploadId:** `string` — The unique identifier of the upload session.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.RequestAdditionalPresignedUrLsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MultipartUpload.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## EntityCollections

<details><summary><code>client.entityCollections.<a href="/src/api/resources/entityCollections/client/Client.ts">list</a>({ ...params }) -> core.Page<TwelvelabsApi.EntityCollection></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the entity collections in your account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.entityCollections.list({
    page: 1,
    pageLimit: 10,
    name: "My entity collection",
    sortBy: "created_at",
    sortOption: "desc",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.entityCollections.list({
    page: 1,
    pageLimit: 10,
    name: "My entity collection",
    sortBy: "created_at",
    sortOption: "desc",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.EntityCollectionsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EntityCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.<a href="/src/api/resources/entityCollections/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.EntityCollection</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method creates an entity collection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.create({
    name: "My entity collection",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.EntityCollectionsCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EntityCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.<a href="/src/api/resources/entityCollections/client/Client.ts">retrieve</a>(entityCollectionId) -> TwelvelabsApi.EntityCollection</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves details about the specified entity collection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.retrieve("6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection to retrieve.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EntityCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.<a href="/src/api/resources/entityCollections/client/Client.ts">delete</a>(entityCollectionId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes the specified entity collection. This action cannot be undone.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.delete("6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EntityCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.<a href="/src/api/resources/entityCollections/client/Client.ts">update</a>(entityCollectionId, { ...params }) -> TwelvelabsApi.EntityCollection</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method updates the specified entity collection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.update("6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection to update.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.EntityCollectionsUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EntityCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Manage entities

<details><summary><code>client.manageEntities.<a href="/src/api/resources/manageEntities/client/Client.ts">listAllEntities</a>({ ...params }) -> TwelvelabsApi.ListAllEntitiesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of entities from all entity collections.
This is an internal API primarily used by the search interface.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.manageEntities.listAllEntities({
    page: 1,
    pageLimit: 10,
    name: "foo",
    status: "processing",
    sortBy: "created_at",
    sortOption: "desc",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.ListAllEntitiesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ManageEntities.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Embed

<details><summary><code>client.embed.<a href="/src/api/resources/embed/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.EmbeddingResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<Note title="Note">
  This endpoint will be deprecated in a future version. Migrate to the [Embed API v2](/v1.3/api-reference/create-embeddings-v2) for continued support and access to new features.
</Note>

This method creates embeddings for text, image, and audio content.

Ensure your media files meet the following requirements:

- [Audio files](/v1.3/docs/concepts/models/marengo#audio-requirements).
- [Image files](/v1.3/docs/concepts/models/marengo#image-requirements).

Parameters for embeddings:

- **Common parameters**:
    - `model_name`: The video understanding model you want to use. Example: "marengo3.0".
- **Text embeddings**:
    - `text`: Text for which to create an embedding.
- **Image embeddings**:
  Provide one of the following:
    - `image_url`: Publicly accessible URL of your image file.
    - `image_file`: Local image file.
- **Audio embeddings**:
  Provide one of the following:
    - `audio_url`: Publicly accessible URL of your audio file.
    - `audio_file`: Local audio file.

<Note title="Notes">
- The Marengo video understanding model generates embeddings for all modalities in the same latent space. This shared space enables any-to-any searches across different types of content.
- You can create multiple types of embeddings in a single API call.
- Audio embeddings combine generic sound and human speech in a single embedding. For videos with transcriptions, you can retrieve transcriptions and then [create text embeddings](/v1.3/api-reference/create-embeddings-v1/text-image-audio-embeddings/create-text-image-audio-embeddings) from these transcriptions.
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.embed.create({
    modelName: "model_name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.EmbedCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Embed.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Search

<details><summary><code>client.search.<a href="/src/api/resources/search/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.SearchResults</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this endpoint to search for relevant matches in an index using text, media, or a combination of both as your query.

**Text queries**:

- Use the `query_text` parameter to specify your query.

**Media queries**:

- Set the `query_media_type` parameter to the corresponding media type (example: `image`).
- Specify either one of the following parameters:
    - `query_media_url`: Publicly accessible URL of your media file.
    - `query_media_file`: Local media file.
      If both `query_media_url` and `query_media_file` are specified in the same request, `query_media_url` takes precedence.

**Composed text and media queries** (Marengo 3.0 only):

- Use the `query_text` parameter for your text query.
- Set `query_media_type` to `image`.
- Specify the image using either the `query_media_url` or the `query_media_file` parameter.

    Example: Provide an image of a car and include "red color" in your query to find red instances of that car model.

**Entity search** (Marengo 3.0 only and in beta):

- To find a specific person in your videos, enclose the unique identifier of the entity you want to find in the `query_text` parameter.

<Note title="Note">
  When using images in your search queries (either as media queries or in composed searches), ensure your image files meet the [format requirements](/v1.3/docs/concepts/models/marengo#image-file-requirements).
</Note>

<Note title="Note">
This endpoint is rate-limited. For details, see the [Rate limits](/v1.3/docs/get-started/rate-limits) page.
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.search.create({
    indexId: "index_id",
    searchOptions: ["visual"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.SearchCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Search.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.search.<a href="/src/api/resources/search/client/Client.ts">retrieve</a>(pageToken, { ...params }) -> TwelvelabsApi.SearchRetrieveResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this endpoint to retrieve a specific page of search results.

<Note title="Note">
When you use pagination, you will not be charged for retrieving subsequent pages of results.
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.search.retrieve("1234567890", {
    includeUserMetadata: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**pageToken:** `string` — A token that identifies the page to retrieve.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.SearchRetrieveRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Search.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Embed Tasks

<details><summary><code>client.embed.tasks.<a href="/src/api/resources/embed/resources/tasks/client/Client.ts">list</a>({ ...params }) -> core.Page<TwelvelabsApi.MediaEmbeddingTask></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<Note title="Note">
  This method will be deprecated in a future version. Migrate to the [Embed API v2](/v1.3/api-reference/create-embeddings-v2) for continued support and access to new features.
</Note>
This method returns a list of the video embedding tasks in your account. The platform returns your video embedding tasks sorted by creation date, with the newest at the top of the list.

<Note title="Notes">
- Video embeddings are stored for seven days
- When you invoke this method without specifying the `started_at` and `ended_at` parameters, the platform returns all the video embedding tasks created within the last seven days.
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.embed.tasks.list({
    startedAt: "2024-03-01T00:00:00Z",
    endedAt: "2024-03-01T00:00:00Z",
    status: "processing",
    page: 1,
    pageLimit: 10,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.embed.tasks.list({
    startedAt: "2024-03-01T00:00:00Z",
    endedAt: "2024-03-01T00:00:00Z",
    status: "processing",
    page: 1,
    pageLimit: 10,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.embed.TasksListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.embed.tasks.<a href="/src/api/resources/embed/resources/tasks/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.TasksCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<Note title="Note">
  This endpoint will be deprecated in a future version. Migrate to the [Embed API v2](/v1.3/api-reference/create-embeddings-v2) for continued support and access to new features.
</Note>

This method creates a new video embedding task that uploads a video to the platform and creates one or multiple video embeddings.

Upload options:

- **Local file**: Use the `video_file` parameter
- **Publicly accessible URL**: Use the `video_url` parameter.

Specify at least one option. If both are provided, `video_url` takes precedence.

Your video files must meet the [format requirements](/v1.3/docs/concepts/models/marengo#video-file-requirements).
This endpoint allows you to upload files up to 2 GB in size. To upload larger files, use the [Multipart Upload API](/v1.3/api-reference/upload-content/multipart-uploads)

<Note title="Notes">
- The Marengo video understanding model generates embeddings for all modalities in the same latent space. This shared space enables any-to-any searches across different types of content.
- Video embeddings are stored for seven days.
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.embed.tasks.create({
    modelName: "model_name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.embed.TasksCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.embed.tasks.<a href="/src/api/resources/embed/resources/tasks/client/Client.ts">status</a>(taskId) -> TwelvelabsApi.TasksStatusResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<Note title="Note">
  This endpoint will be deprecated in a future version. Migrate to the [Embed API v2](/v1.3/api-reference/create-embeddings-v2) for continued support and access to new features.
</Note>
This method retrieves the status of a video embedding task. Check the task status of a video embedding task to determine when you can retrieve the embedding.

A task can have one of the following statuses:

- `processing`: The platform is creating the embeddings.
- `ready`: Processing is complete. Retrieve the embeddings by invoking the [`GET`](/v1.3/api-reference/create-embeddings-v1/video-embeddings/retrieve-video-embeddings) method of the `/embed/tasks/{task_id} endpoint`.
- `failed`: The task could not be completed, and the embeddings haven't been created.
  </dd>
  </dl>
  </dd>
  </dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.embed.tasks.status("663da73b31cdd0c1f638a8e6");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**taskId:** `string` — The unique identifier of your video embedding task.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.embed.tasks.<a href="/src/api/resources/embed/resources/tasks/client/Client.ts">retrieve</a>(taskId, { ...params }) -> TwelvelabsApi.TasksRetrieveResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves embeddings for a specific video embedding task. Ensure the task status is `ready` before invoking this method. Refer to the [Retrieve the status of a video embedding tasks](/v1.3/api-reference/create-embeddings-v1/video-embeddings/retrieve-video-embedding-task-status) page for instructions on checking the task status.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.embed.tasks.retrieve("663da73b31cdd0c1f638a8e6");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**taskId:** `string` — The unique identifier of your video embedding task.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.embed.TasksRetrieveRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Embed V2

<details><summary><code>client.embed.v2.<a href="/src/api/resources/embed/resources/v2/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.EmbeddingSuccessResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint synchronously creates embeddings for multimodal content and returns the results immediately in the response.

<Note title="Note">
  This method only supports Marengo version 3.0 or newer.
</Note>

**When to use this endpoint**:

- Create embeddings for text, images, audio, or video content
- Get immediate results without waiting for background processing
- Process audio or video content up to 10 minutes in duration

**Do not use this endpoint for**:

- Audio or video content longer than 10 minutes. Use the [`POST`](/v1.3/api-reference/create-embeddings-v2/create-async-embedding-task) method of the `/embed-v2/tasks` endpoint instead.

<Accordion title="Input requirements">
  **Text**:
  - Maximum length: 500 tokens

**Images**:

- Formats: JPEG, PNG
- Minimum size: 128x128 pixels
- Maximum file size: 5 MB

**Audio and video**:

- Maximum duration: 10 minutes
- Maximum file size for base64 encoded strings: 36 MB
- Audio formats: WAV (uncompressed), MP3 (lossy), FLAC (lossless)
- Video formats: [FFmpeg supported formats](https://ffmpeg.org/ffmpeg-formats.html)
- Video resolution: 360x360 to 3840x2160 pixels
- Aspect ratio: Between 1:1 and 1:2.4, or between 2.4:1 and 1:1
</Accordion>
  </dd>
  </dl>
  </dd>
  </dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.embed.v2.create({
    inputType: "text",
    modelName: "marengo3.0",
    text: {
        inputText: "man walking a dog",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.embed.CreateEmbeddingsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `V2.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Embed V2 Tasks

<details><summary><code>client.embed.v2.tasks.<a href="/src/api/resources/embed/resources/v2/resources/tasks/client/Client.ts">list</a>({ ...params }) -> core.Page<TwelvelabsApi.MediaEmbeddingTask></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the async embedding tasks in your account. The platform returns your async embedding tasks sorted by creation date, with the newest at the top of the list.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.embed.v2.tasks.list({
    startedAt: "2024-03-01T00:00:00Z",
    endedAt: "2024-03-01T00:00:00Z",
    status: "processing",
    page: 1,
    pageLimit: 10,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.embed.v2.tasks.list({
    startedAt: "2024-03-01T00:00:00Z",
    endedAt: "2024-03-01T00:00:00Z",
    status: "processing",
    page: 1,
    pageLimit: 10,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.embed.v2.TasksListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.embed.v2.tasks.<a href="/src/api/resources/embed/resources/v2/resources/tasks/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.TasksCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint creates embeddings for audio and video content asynchronously.

<Note title="Note">
  This method only supports Marengo version 3.0 or newer.
</Note>

**When to use this endpoint**:

- Process audio or video files longer than 10 minutes
- Process files up to 4 hours in duration

<Accordion title="Input requirements">
  **Video**:
  - Minimum duration: 4 seconds
  - Maximum duration: 4 hours
  - Maximum file size: 4 GB
  - Formats: [FFmpeg supported formats](https://ffmpeg.org/ffmpeg-formats.html)
  - Resolution: 360x360 to 3840x2160 pixels
  - Aspect ratio: Between 1:1 and 1:2.4, or between 2.4:1 and 1:1

**Audio**:

- Minimum duration: 4 seconds
- Maximum duration: 4 hours
- Maximum file size: 2 GB
- Formats: WAV (uncompressed), MP3 (lossy), FLAC (lossless)
  </Accordion>

Creating embeddings asynchronously requires three steps:

1. Create a task using this endpoint. The platform returns a task ID.
2. Poll for the status of the task using the [`GET`](/v1.3/api-reference/create-embeddings-v2/retrieve-embeddings) method of the `/embed-v2/tasks/{task_id}` endpoint. Wait until the status is `ready`.
3. Retrieve the embeddings from the response when the status is `ready` using the [`GET`](/v1.3/api-reference/create-embeddings-v2/retrieve-embeddings) method of the `/embed-v2/tasks/{task_id}` endpoint.
 </dd>
 </dl>
 </dd>
 </dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.embed.v2.tasks.create({
    inputType: "audio",
    modelName: "marengo3.0",
    audio: {
        mediaSource: {
            url: "https://user-bucket.com/audio/long-audio.wav",
        },
        startSec: 0,
        endSec: 3600,
        segmentation: {
            strategy: "fixed",
            fixed: {
                durationSec: 6,
            },
        },
        embeddingOption: ["audio", "transcription"],
        embeddingScope: ["clip", "asset"],
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.embed.v2.CreateAsyncEmbeddingRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.embed.v2.tasks.<a href="/src/api/resources/embed/resources/v2/resources/tasks/client/Client.ts">retrieve</a>(taskId) -> TwelvelabsApi.EmbeddingTaskResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves the status and the results of an async embedding task.

**Task statuses**:

- `processing`: The platform is creating the embeddings.
- `ready`: Processing is complete. Embeddings are available in the response.
- `failed`: The task failed. Embeddings were not created.

Invoke this method repeatedly until the `status` field is `ready`. When `status` is `ready`, use the embeddings from the response.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.embed.v2.tasks.retrieve("64f8d2c7e4a1b37f8a9c5d12");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**taskId:** `string` — The unique identifier of the embedding task.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tasks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## EntityCollections Entities

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">list</a>(entityCollectionId, { ...params }) -> core.Page<TwelvelabsApi.Entity></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the entities in the specified entity collection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.entityCollections.entities.list("6298d673f1090f1100476d4c", {
    page: 1,
    pageLimit: 10,
    name: "My entity",
    status: "processing",
    sortBy: "created_at",
    sortOption: "desc",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.entityCollections.entities.list("6298d673f1090f1100476d4c", {
    page: 1,
    pageLimit: 10,
    name: "My entity",
    status: "processing",
    sortBy: "created_at",
    sortOption: "desc",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection for which the platform will retrieve the entities.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.entityCollections.EntitiesListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Entities.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">create</a>(entityCollectionId, { ...params }) -> TwelvelabsApi.Entity</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method creates an entity within a specified entity collection. Each entity must be associated with at least one asset.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.entities.create("6298d673f1090f1100476d4c", {
    name: "My entity",
    assetIds: ["6298d673f1090f1100476d4c", "6298d673f1090f1100476d4d"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection in which to create the entity.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.entityCollections.EntitiesCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Entities.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">createBulk</a>(entityCollectionId, { ...params }) -> TwelvelabsApi.BulkCreateEntityResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method creates multiple entities within a specified entity collection in a single request. Each entity must be associated with at least one asset. This endpoint is useful for efficiently adding multiple entities, such as a roster of players or a group of characters.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.entities.createBulk("6298d673f1090f1100476d4c", {
    entities: [
        {
            name: "My entity",
            assetIds: ["6298d673f1090f1100476d4c", "6298d673f1090f1100476d4d"],
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection in which to create the entities.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.entityCollections.EntitiesCreateBulkRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Entities.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">retrieve</a>(entityCollectionId, entityId) -> TwelvelabsApi.Entity</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves details about the specified entity.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.entities.retrieve("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection.

</dd>
</dl>

<dl>
<dd>

**entityId:** `string` — The unique identifier of the entity to retrieve.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Entities.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">delete</a>(entityCollectionId, entityId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes a specific entity from an entity collection. It permanently removes the entity and its associated data, but does not affect the assets associated with this entity.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.entities.delete("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection containing the entity to be deleted.

</dd>
</dl>

<dl>
<dd>

**entityId:** `string` — The unique identifier of the entity to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Entities.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">update</a>(entityCollectionId, entityId, { ...params }) -> TwelvelabsApi.Entity</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method updates the specified entity within an entity collection. This operation allows modification of the entity's name, description, or metadata. Note that this endpoint does not affect the assets associated with the entity.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.entities.update("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection containing the entity to be updated.

</dd>
</dl>

<dl>
<dd>

**entityId:** `string` — The unique identifier of the entity to update.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.entityCollections.EntitiesUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Entities.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">createAssets</a>(entityCollectionId, entityId, { ...params }) -> TwelvelabsApi.Entity</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method adds assets to the specified entity within an entity collection. Assets are used to identify the entity in media content, and adding multiple assets can improve the accuracy of entity recognition in searches.

When assets are added, the entity may temporarily enter the "processing" state while the platform updates the necessary data. Once processing is complete, the entity status will return to "ready."

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.entities.createAssets("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c", {
    assetIds: ["6298d673f1090f1100476d4c", "6298d673f1090f1100476d4d"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection that contains the entity to which assets will be added.

</dd>
</dl>

<dl>
<dd>

**entityId:** `string` — The unique identifier of the entity within the specified entity collection to which the assets will be added.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.entityCollections.EntitiesCreateAssetsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Entities.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">deleteAssets</a>(entityCollectionId, entityId, { ...params }) -> TwelvelabsApi.Entity</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method removes from the specified entity. Assets are used to identify the entity in media content, and removing assets may impact the accuracy of entity recognition in searches if too few assets remain.

When assets are removed, the entity may temporarily enter a "processing" state while the system updates the necessary data. Once processing is complete, the entity status will return to "ready."

<Note title="Notes">
  - This operation only removes the association between the entity and the specified assets; it does not delete the assets themselves.
  - An entity must always have at least one asset associated with it. You can't remove the last asset from an entity.
</Note>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.entityCollections.entities.deleteAssets("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c", {
    assetIds: ["6298d673f1090f1100476d4e", "6298d673f1090f1100476d4f"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**entityCollectionId:** `string` — The unique identifier of the entity collection that contains the entity from which assets will be removed.

</dd>
</dl>

<dl>
<dd>

**entityId:** `string` — The unique identifier of the entity within the specified entity collection from which the assets will be removed.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.entityCollections.EntitiesDeleteAssetsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Entities.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Indexes IndexedAssets

<details><summary><code>client.indexes.indexedAssets.<a href="/src/api/resources/indexes/resources/indexedAssets/client/Client.ts">list</a>(indexId, { ...params }) -> core.Page<TwelvelabsApi.IndexedAsset></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the indexed assets in the specified index. By default, the platform returns your indexed assets sorted by creation date, with the newest at the top of the list.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.indexes.indexedAssets.list("6298d673f1090f1100476d4c", {
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    filename: "01.mp4",
    duration: 1.1,
    fps: 1.1,
    width: 1.1,
    height: 1,
    size: 1.1,
    createdAt: "2024-08-16T16:53:59Z",
    updatedAt: "2024-08-16T16:53:59Z",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.indexes.indexedAssets.list("6298d673f1090f1100476d4c", {
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    filename: "01.mp4",
    duration: 1.1,
    fps: 1.1,
    width: 1.1,
    height: 1,
    size: 1.1,
    createdAt: "2024-08-16T16:53:59Z",
    updatedAt: "2024-08-16T16:53:59Z",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — The unique identifier of the index for which the platform will retrieve the indexed assets.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.indexes.IndexedAssetsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IndexedAssets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.indexedAssets.<a href="/src/api/resources/indexes/resources/indexedAssets/client/Client.ts">create</a>(indexId, { ...params }) -> TwelvelabsApi.IndexedAssetsCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method indexes an uploaded asset to make it searchable and analyzable. Indexing processes your content and extracts information that enables the platform to search and analyze your videos.

This operation is asynchronous. The platform returns an indexed asset ID immediately and processes your content in the background. Monitor the indexing status to know when your content is ready to use.

Your asset must meet the requirements based on your workflow:

- **Search**: [Marengo requirements](/v1.3/docs/concepts/models/marengo#video-file-requirements)
- **Video analysis**: [Pegasus requirements](/v1.3/docs/concepts/models/pegasus#input-requirements).

If you want to both search and analyze your videos, the most restrictive requirements apply.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.indexedAssets.create("6298d673f1090f1100476d4c", {
    assetId: "6298d673f1090f1100476d4c",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — The unique identifier of the index to which the asset will be indexed.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.indexes.IndexedAssetsCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IndexedAssets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.indexedAssets.<a href="/src/api/resources/indexes/resources/indexedAssets/client/Client.ts">retrieve</a>(indexId, indexedAssetId, { ...params }) -> TwelvelabsApi.IndexedAssetDetailed</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves information about an indexed asset, including its status, metadata, and optional embeddings or transcription.

**Common use cases**:

- Monitor indexing progress:
    - Call this endpoint after creating an indexed asset
    - Check the `status` field until it shows `ready`
    - Once ready, your content is available for search and analysis

- Retrieve asset metadata:
    - Retrieve system metadata (duration, resolution, filename)
    - Access user-defined metadata

- Retrieve embeddings:
    - Include the `embedding_option` parameter to retrieve video embeddings
    - Requires the Marengo video understanding model to be enabled in your index

- Retrieve transcriptions:
    - Set the `transcription` parameter to `true` to retrieve spoken words from your video
      </dd>
      </dl>
      </dd>
      </dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.indexedAssets.retrieve("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c", {
    transcription: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — The unique identifier of the index to which the indexed asset has been uploaded.

</dd>
</dl>

<dl>
<dd>

**indexedAssetId:** `string` — The unique identifier of the indexed asset to retrieve.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.indexes.IndexedAssetsRetrieveRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IndexedAssets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.indexedAssets.<a href="/src/api/resources/indexes/resources/indexedAssets/client/Client.ts">delete</a>(indexId, indexedAssetId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes all the information about the specified indexed asset. This action cannot be undone.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.indexedAssets.delete("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — The unique identifier of the index to which the indexed asset has been uploaded.

</dd>
</dl>

<dl>
<dd>

**indexedAssetId:** `string` — The unique identifier of the indexed asset to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IndexedAssets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.indexedAssets.<a href="/src/api/resources/indexes/resources/indexedAssets/client/Client.ts">update</a>(indexId, indexedAssetId, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this method to update one or more fields of the metadata of an indexed asset. Also, can delete a field by setting it to null.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.indexedAssets.update("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c", {
    userMetadata: {
        category: "recentlyAdded",
        batchNumber: 5,
        rating: 9.3,
        needsReview: true,
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — The unique identifier of the index to which the indexed asset has been uploaded.

</dd>
</dl>

<dl>
<dd>

**indexedAssetId:** `string` — The unique identifier of the indexed asset to update.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.indexes.IndexedAssetsUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IndexedAssets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Indexes Videos

<details><summary><code>client.indexes.videos.<a href="/src/api/resources/indexes/resources/videos/client/Client.ts">list</a>(indexId, { ...params }) -> core.Page<TwelvelabsApi.VideoVector></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<Info>This method will be deprecated in a future version. New implementations should use the [List indexed assets](/v1.3/api-reference/index-content/list) method.</Info>

This method returns a list of the videos in the specified index. By default, the platform returns your videos sorted by creation date, with the newest at the top of the list.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.indexes.videos.list("6298d673f1090f1100476d4c", {
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    filename: "01.mp4",
    duration: 1.1,
    fps: 1.1,
    width: 1.1,
    height: 1,
    size: 1.1,
    createdAt: "2024-08-16T16:53:59Z",
    updatedAt: "2024-08-16T16:53:59Z",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.indexes.videos.list("6298d673f1090f1100476d4c", {
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    filename: "01.mp4",
    duration: 1.1,
    fps: 1.1,
    width: 1.1,
    height: 1,
    size: 1.1,
    createdAt: "2024-08-16T16:53:59Z",
    updatedAt: "2024-08-16T16:53:59Z",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — The unique identifier of the index for which the platform will retrieve the videos.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.indexes.VideosListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Videos.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.videos.<a href="/src/api/resources/indexes/resources/videos/client/Client.ts">retrieve</a>(indexId, videoId, { ...params }) -> TwelvelabsApi.VideosRetrieveResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<Info> This method will be deprecated in a future version. New implementations should use the [Retrieve an indexed asset](/v1.3/api-reference/index-content/retrieve) method.</Info>

This method retrieves information about the specified video.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.videos.retrieve("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c", {
    transcription: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — The unique identifier of the index to which the video has been uploaded.

</dd>
</dl>

<dl>
<dd>

**videoId:** `string` — The unique identifier of the video to retrieve.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.indexes.VideosRetrieveRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Videos.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.videos.<a href="/src/api/resources/indexes/resources/videos/client/Client.ts">delete</a>(indexId, videoId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<Info>This method will be deprecated in a future version. New implementations should use the [Delete an indexed asset](/v1.3/api-reference/index-content/delete) method.</Info>

This method deletes all the information about the specified video. This action cannot be undone.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.videos.delete("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — The unique identifier of the index to which the video has been uploaded.

</dd>
</dl>

<dl>
<dd>

**videoId:** `string` — The unique identifier of the video to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Videos.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.indexes.videos.<a href="/src/api/resources/indexes/resources/videos/client/Client.ts">update</a>(indexId, videoId, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<Info>This method will be deprecated in a future version. New implementations should use the [Partial update indexed asset](/v1.3/api-reference/index-content/update) method.</Info>

Use this method to update one or more fields of the metadata of a video. Also, can delete a field by setting it to null.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.indexes.videos.update("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c", {
    userMetadata: {
        category: "recentlyAdded",
        batchNumber: 5,
        rating: 9.3,
        needsReview: true,
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**indexId:** `string` — The unique identifier of the index to which the video has been uploaded.

</dd>
</dl>

<dl>
<dd>

**videoId:** `string` — The unique identifier of the video to update.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.indexes.VideosUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Videos.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Tasks Transfers

<details><summary><code>client.tasks.transfers.<a href="/src/api/resources/tasks/resources/transfers/client/Client.ts">create</a>(integrationId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tasks.transfers.create("integration-id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**integrationId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Transfers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tasks.transfers.<a href="/src/api/resources/tasks/resources/transfers/client/Client.ts">getStatus</a>(integrationId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tasks.transfers.getStatus("integration-id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**integrationId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Transfers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tasks.transfers.<a href="/src/api/resources/tasks/resources/transfers/client/Client.ts">getLogs</a>(integrationId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tasks.transfers.getLogs("integration-id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**integrationId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Transfers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
