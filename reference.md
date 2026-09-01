# Reference

<details><summary><code>client.<a href="/src/Client.ts">analyze</a>({ ...params }) -> TwelvelabsApi.NonStreamAnalyzeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method analyzes your videos and returns the results directly in the response. It supports general analysis (prompt-based text generation).

<Accordion title="Input requirements">
- Minimum duration: 4 seconds
- Maximum duration: 1 hour
- Formats: [FFmpeg supported formats](https://ffmpeg.org/ffmpeg-formats.html)
- Resolution: 360x360 to 5184x2160 pixels
- Aspect ratio: Between 1:1 and 1:2.4, or between 2.4:1 and 1:1.
</Accordion>

**When to use this method**:

- Analyze videos up to 1 hour
- Retrieve immediate results without polling for task completion
- Stream text fragments in real time for immediate processing and feedback

**Do not use this method for**:

- Videos longer than 1 hour. Use the [`POST`](/v1.3/api-reference/analyze-videos/create-async-analysis-task) method of the `/analyze/tasks` endpoint instead.
- Video segmentation with custom segment definitions. Use the [`POST`](/v1.3/api-reference/analyze-videos/create-async-analysis-task) method of the `/analyze/tasks` endpoint instead.

On the Free plan, you have a total of 600 minutes (10 hours) shared across indexing, analysis, and segmentation. For details, see the [Video hours and video count limits](/v1.3/docs/concepts/indexes#video-hours-and-video-count-limits) section.

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
await client.analyze({});
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

<details><summary><code>client.tasks.<a href="/src/api/resources/tasks/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;TwelvelabsApi.VideoIndexingTask&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<Info>This method will be removed in a future version.</Info>

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
    status: ["ready", "failed"],
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
    status: ["ready", "failed"],
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

<Info>This method will be removed in a future version. New implementations should use [direct](/v1.3/api-reference/upload-content/direct-uploads) or [multipart](/v1.3/api-reference/upload-content/multipart-uploads) uploads followed by [separate indexing](/v1.3/api-reference/index-content/create).</Info>

This method creates a video indexing task that uploads and indexes a video in a single operation.

<Note title="Adding videos to existing indexes">
You can no longer add videos to an index that has only Pegasus 1.2 enabled. When you add videos to an index that has both Marengo and Pegasus 1.2 enabled, the platform indexes them with Marengo only.
</Note>

Upload options:

- **Local file**: Use the `video_file` parameter.
- **Publicly accessible URL**: Use the `video_url` parameter.

Your video files must meet requirements based on your workflow:

- **Search**: [Marengo requirements](/v1.3/docs/concepts/models/marengo/marengo-3-0#video-file-requirements).
- **Video analysis**: [Pegasus requirements](/v1.3/docs/concepts/models/pegasus#video-file-requirements).
- If you want to both search and analyze your videos, the most restrictive requirements apply.
- This method allows you to upload files up to 2 GB in size. To upload larger files, use the [Multipart Upload API](/v1.3/api-reference/upload-content/multipart-uploads)

Indexes have limits on video hours and video count. For details, see the [Video hours and video count limits](/v1.3/docs/concepts/indexes#video-hours-and-video-count-limits) section.

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

<Info>This method will be removed in a future version.</Info>

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

<Info>This method will be removed in a future version.</Info>

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

<details><summary><code>client.indexes.<a href="/src/api/resources/indexes/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;TwelvelabsApi.IndexSchema&gt;</code></summary>
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

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;TwelvelabsApi.AssetDetail&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of assets in your account.

The platform returns your assets sorted by creation date, with the newest at the top of the list.
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
    assetIds: ["6298d673f1090f1100476d4c", "6298d673f1090f1100476d4d"],
    assetTypes: ["image", "video", "document"],
    filename: "meeting",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.assets.list({
    page: 1,
    pageLimit: 10,
    assetIds: ["6298d673f1090f1100476d4c", "6298d673f1090f1100476d4d"],
    assetTypes: ["image", "video", "document"],
    filename: "meeting",
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

This method creates an asset by uploading a file to the platform. Assets are reusable files that you can use in different workflows.

The platform processes uploads asynchronously. This method returns immediately with the asset in the `processing` status, which then transitions to the `ready` status on success or to the `failed` status when the file is invalid, corrupt, or unreadable. Poll the [Retrieve an asset](/v1.3/api-reference/upload-content/direct-uploads/retrieve) endpoint until the status of the asset is `ready` before you use it. This applies to every upload, including small files.

**Supported content**:

- Video, audio, and image files.
- PDF, text, and Markdown files.

Filename extension matching is case-insensitive; for example, `notes.MD` and `notes.md` are treated the same. The platform rejects unsupported formats. For documents, it also rejects files whose extensions don't match the detected content.

**Upload methods**:

- **Local file**: Set the `method` parameter to `direct` and use the `file` parameter to specify the file.
- **Publicly accessible URL**: Set the `method` parameter to `url` and use the `url` parameter to specify the URL of your file.

**Upload limits**:

- **Video and audio, local files**: Up to 200 MB
- **Video and audio, public URLs**: Up to 4 GB
- **Images**: Up to 32 MB
- **Documents, local files**: Up to 200 MB
- **Documents, public URLs**: Up to 512 MB

Asset creation does not enforce a maximum duration for video and audio files. Each model applies its own file size and duration limits. For details, see the requirements below.

**Additional requirements** depend on your workflow:

- **Search**: [Marengo requirements](/v1.3/docs/concepts/models/marengo/marengo-3-0#video-file-requirements)
- **Video analysis**: [Pegasus requirements](/v1.3/docs/concepts/models/pegasus#input-requirements)
- **Entity search**: [Marengo image requirements](/v1.3/docs/concepts/models/marengo/marengo-3-0#image-file-requirements)
- **Create embeddings**: [Marengo requirements](/v1.3/docs/concepts/models/marengo/marengo-3-5#input-requirements)

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

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">retrieve</a>(assetId) -> TwelvelabsApi.AssetDetail</code></summary>
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

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">delete</a>(assetId, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes the specified asset. This action cannot be undone.

By default, the platform checks whether any indexed assets reference the asset. If references exist, the platform rejects the request with a `409 Conflict` error. To skip this check and delete the asset anyway, set the `force` query parameter to `true`. The platform unlinks any entity associations.

Before deleting, you can inspect existing references:

- [`GET`](/v1.3/api-reference/index-content/list-indexed-assets-by-asset) `/assets/{asset_id}/indexed-assets` returns a list of the indexed assets that will block deletion unless the `force` query parameter is set to `true`.
- [`GET`](/v1.3/api-reference/entities/list-entities-by-asset) `/assets/{asset_id}/entities` returns a list of the entities whose associations the platform will unlink.

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
await client.assets.delete("6298d673f1090f1100476d4c", {
    force: true,
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

**assetId:** `string` — The unique identifier of the asset to delete.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.AssetsDeleteRequest`

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

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">retrieveTranscription</a>(assetId, { ...params }) -> TwelvelabsApi.AssetTranscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves the transcription of a video or audio asset. An asset that has a transcription returns `200` with the current transcription status. The endpoint returns `404` when the asset cannot be found or has no transcription.

The platform generates transcriptions asynchronously. Poll this endpoint to monitor the transcription status.

When the status is `ready`, the response contains the segmentations you requested that the transcription supports. A transcription does not always support every segmentation, so read the segmentations the response returns rather than assuming every requested one is present.
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
await client.assets.retrieveTranscription("6298d673f1090f1100476d4c", {
    include: ["words", "utterances"],
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

**assetId:** `string` — The unique identifier of the asset.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.AssetsRetrieveTranscriptionRequest`

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

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">replaceUserMetadata</a>(assetId, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method replaces the entire user-defined metadata of the specified asset. Unlike the [`PATCH`](/v1.3/api-reference/upload-content/direct-uploads/update-user-metadata) method, which merges your changes with the existing metadata, this method overwrites the stored value in full:

- A key with a value creates or replaces that key.
- A key set to an empty string (`""`) or `null` is ignored.
- A key you omit from the request body is removed.

To clear all metadata, send an empty object (`{}`) in the `user_metadata` field. This produces the same result as the [`DELETE`](/v1.3/api-reference/upload-content/direct-uploads/delete-user-metadata) method.
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
await client.assets.replaceUserMetadata("6298d673f1090f1100476d4c", {
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

**assetId:** `string` — The unique identifier of the asset whose user-defined metadata to replace.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.AssetsReplaceUserMetadataRequest`

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

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">deleteUserMetadata</a>(assetId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes the user-defined metadata of the specified asset. To achieve the same result, you can also send an empty object (`{}`) in the `user_metadata` field of the [`PUT`](/v1.3/api-reference/upload-content/direct-uploads/replace-user-metadata) method.

This action cannot be undone.
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
await client.assets.deleteUserMetadata("6298d673f1090f1100476d4c");
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

**assetId:** `string` — The unique identifier of the asset whose user-defined metadata to delete.

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

<details><summary><code>client.assets.<a href="/src/api/resources/assets/client/Client.ts">updateUserMetadata</a>(assetId, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method updates the user-defined metadata of the specified asset. The platform merges your changes with the existing metadata:

- A key with a value creates or replaces that key.
- A key set to `null` deletes that key.
- A key set to an empty string (`""`) is ignored.
- A key you omit from the request keeps its current value.

To replace all metadata in a single call, use the [`PUT`](/v1.3/api-reference/upload-content/direct-uploads/replace-user-metadata) method of the `/assets/{asset_id}/user-metadata` endpoint instead.
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
await client.assets.updateUserMetadata("6298d673f1090f1100476d4c", {
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

**assetId:** `string` — The unique identifier of the asset whose user-defined metadata to update.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.AssetsUpdateUserMetadataRequest`

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

<details><summary><code>client.multipartUpload.<a href="/src/api/resources/multipartUpload/client/Client.ts">listIncompleteUploads</a>({ ...params }) -> core.Page&lt;TwelvelabsApi.IncompleteUploadSummary&gt;</code></summary>
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

This method creates a multipart upload session for a local file.

**Supported content**: Video, audio, and images.

**Upload limits**:

- **Video and audio**: Up to 10 GB
- **Images**: Up to 32 MB

**Additional requirements** depend on your workflow:

- **Search**: [Marengo requirements](/v1.3/docs/concepts/models/marengo/marengo-3-0#video-file-requirements)
- **Video analysis**: [Pegasus requirements](/v1.3/docs/concepts/models/pegasus#input-requirements)
- **Entity search**: [Marengo image requirements](/v1.3/docs/concepts/models/marengo/marengo-3-0#image-file-requirements)
- **Create embeddings**: [Marengo requirements](/v1.3/docs/concepts/models/marengo/marengo-3-5#input-requirements)

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
    type: "video",
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

<details><summary><code>client.multipartUpload.<a href="/src/api/resources/multipartUpload/client/Client.ts">getStatus</a>(uploadId, { ...params }) -> core.Page&lt;TwelvelabsApi.ChunkInfo&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method provides information about an upload session, including its current status, chunk-level progress, and completion state.

Use this method to:

- Verify upload completion (`status` = `completed`)
- Identify any failed chunks that require a retry
- Monitor the upload progress by comparing `uploaded_size` with `total_size`
- Determine if the session has expired
- Retrieve the status information for each chunk

After you report chunk completion, call this method to confirm the upload session reached the `completed` status. This status means the platform received the file, not that the asset is ready to use. The platform then validates the asset asynchronously. Poll the [Retrieve an asset](/v1.3/api-reference/upload-content/direct-uploads/retrieve) endpoint until the status of the asset is `ready` before you use it.
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

This method reports successfully uploaded chunks to the platform. The platform finalizes the upload after you report all chunks.

For optimal performance, report chunks in batches and in any order.
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

<details><summary><code>client.entityCollections.<a href="/src/api/resources/entityCollections/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;TwelvelabsApi.EntityCollection&gt;</code></summary>
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

## Knowledge stores

<details><summary><code>client.knowledgeStores.<a href="/src/api/resources/knowledgeStores/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;TwelvelabsApi.KnowledgeStore&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the knowledge stores in your account.
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
const response = await client.knowledgeStores.list({
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.knowledgeStores.list({
    page: 1,
    pageLimit: 10,
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

**request:** `TwelvelabsApi.KnowledgeStoresListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStores.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStores.<a href="/src/api/resources/knowledgeStores/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.KnowledgeStore</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method creates a knowledge store.

Provide a name. Optionally include a description, a metadata map, and an `ingestion_config` object that controls how content added to the store is processed. The `ingestion_config` object is immutable after creation.
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
await client.knowledgeStores.create({
    name: "Product Demo Analysis",
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

**request:** `TwelvelabsApi.KnowledgeStoresCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStores.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStores.<a href="/src/api/resources/knowledgeStores/client/Client.ts">retrieve</a>(knowledgeStoreId) -> TwelvelabsApi.KnowledgeStore</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves the details of a specific knowledge store.
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
await client.knowledgeStores.retrieve("ks_069e9869-1ea3-7481-8000-dae72bf6be6e");
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStores.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStores.<a href="/src/api/resources/knowledgeStores/client/Client.ts">delete</a>(knowledgeStoreId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes the specified knowledge store and all its items.
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
await client.knowledgeStores.delete("ks_069e9869-1ea3-7481-8000-dae72bf6be6e");
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStores.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStores.<a href="/src/api/resources/knowledgeStores/client/Client.ts">update</a>(knowledgeStoreId, { ...params }) -> TwelvelabsApi.KnowledgeStore</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method updates the specified knowledge store. Only the `name`, `description`, and `metadata` fields can be updated.
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
await client.knowledgeStores.update("ks_069e9869-1ea3-7481-8000-dae72bf6be6e");
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.KnowledgeStoresUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStores.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStores.<a href="/src/api/resources/knowledgeStores/client/Client.ts">search</a>(knowledgeStoreId, { ...params }) -> TwelvelabsApi.SearchKnowledgeStoreResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method searches a knowledge store using natural language and returns matching video clips and images ranked by relevance.

Provide your natural-language query in the `query.text` field. Use the `filter` parameter to choose which items to search: by type of item (the `asset_type` field) or by specific items (the `item_id` field). Use the optional `search_options` parameter to control how videos are matched (by visual content, audio, or both). If you omit it, videos are matched on their visual content. Images are always matched on their visual content.

By default, each result is an individual match: a video clip or an image. Set the `group_by` parameter to `item` to group clips under their parent item.

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
await client.knowledgeStores.search("ks_069e9869-1ea3-7481-8000-dae72bf6be6e", {
    query: {
        text: "A person cooking pasta",
    },
    searchOptions: {
        video: {
            modalities: ["visual", "audio"],
        },
    },
    groupBy: "none",
    pageSize: 10,
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.SearchKnowledgeStoreRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStores.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Knowledge store items

<details><summary><code>client.knowledgeStoreItems.<a href="/src/api/resources/knowledgeStoreItems/client/Client.ts">list</a>(knowledgeStoreId, { ...params }) -> core.Page&lt;TwelvelabsApi.KnowledgeStoreItem&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of items in the specified knowledge store.
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
const response = await client.knowledgeStoreItems.list("ks_069e9869-1ea3-7481-8000-dae72bf6be6e", {
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    status: ["queued"],
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.knowledgeStoreItems.list("ks_069e9869-1ea3-7481-8000-dae72bf6be6e", {
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
    status: ["queued"],
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.KnowledgeStoreItemsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItems.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItems.<a href="/src/api/resources/knowledgeStoreItems/client/Client.ts">create</a>(knowledgeStoreId, { ...params }) -> TwelvelabsApi.KnowledgeStoreItem</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method adds an asset to a knowledge store for processing.
The operation is asynchronous. The item is created immediately with the `queued`
status and processed in the background.

The asset must not exceed 5 GB.
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
await client.knowledgeStoreItems.create("ks_069e9869-1ea3-7481-8000-dae72bf6be6e", {
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.KnowledgeStoreItemsCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItems.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItems.<a href="/src/api/resources/knowledgeStoreItems/client/Client.ts">retrieve</a>(knowledgeStoreId, itemId) -> TwelvelabsApi.KnowledgeStoreItem</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves the details of a specific knowledge store item.
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
await client.knowledgeStoreItems.retrieve(
    "ks_069e9869-1ea3-7481-8000-dae72bf6be6e",
    "ksi_069e9870-3c4d-7abc-9012-3456789abcde",
);
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**itemId:** `string` — The unique identifier of the knowledge store item.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItems.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItems.<a href="/src/api/resources/knowledgeStoreItems/client/Client.ts">delete</a>(knowledgeStoreId, itemId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes the specified knowledge store item.
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
await client.knowledgeStoreItems.delete(
    "ks_069e9869-1ea3-7481-8000-dae72bf6be6e",
    "ksi_069e9870-3c4d-7abc-9012-3456789abcde",
);
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**itemId:** `string` — The unique identifier of the knowledge store item.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItems.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Knowledge store item collections

<details><summary><code>client.knowledgeStoreItemCollections.<a href="/src/api/resources/knowledgeStoreItemCollections/client/Client.ts">list</a>(knowledgeStoreId, { ...params }) -> core.Page&lt;TwelvelabsApi.KnowledgeStoreItemCollection&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of the item collections in the specified knowledge store.
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
const response = await client.knowledgeStoreItemCollections.list("ks_069e9869-1ea3-7481-8000-dae72bf6be6e", {
    page: 1,
    pageLimit: 10,
    sortBy: "created_at",
    sortOption: "desc",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.knowledgeStoreItemCollections.list("ks_069e9869-1ea3-7481-8000-dae72bf6be6e", {
    page: 1,
    pageLimit: 10,
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.KnowledgeStoreItemCollectionsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItemCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItemCollections.<a href="/src/api/resources/knowledgeStoreItemCollections/client/Client.ts">create</a>(knowledgeStoreId, { ...params }) -> TwelvelabsApi.KnowledgeStoreItemCollection</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an item collection in the specified knowledge store. An item collection is a named collection of items. Use item collections to organize and reference subsets of items together.
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
await client.knowledgeStoreItemCollections.create("ks_069e9869-1ea3-7481-8000-dae72bf6be6e", {
    name: "Q1 highlights",
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.KnowledgeStoreItemCollectionsCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItemCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItemCollections.<a href="/src/api/resources/knowledgeStoreItemCollections/client/Client.ts">retrieve</a>(knowledgeStoreId, collectionId) -> TwelvelabsApi.KnowledgeStoreItemCollection</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves the details of a specific item collection.
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
await client.knowledgeStoreItemCollections.retrieve(
    "ks_069e9869-1ea3-7481-8000-dae72bf6be6e",
    "ksic_069e9870-3c4d-7abc-9012-3456789abcde",
);
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**collectionId:** `string` — The unique identifier of the knowledge store item collection.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItemCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItemCollections.<a href="/src/api/resources/knowledgeStoreItemCollections/client/Client.ts">delete</a>(knowledgeStoreId, collectionId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified item collection. The items themselves remain in the knowledge store.
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
await client.knowledgeStoreItemCollections.delete(
    "ks_069e9869-1ea3-7481-8000-dae72bf6be6e",
    "ksic_069e9870-3c4d-7abc-9012-3456789abcde",
);
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**collectionId:** `string` — The unique identifier of the knowledge store item collection.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItemCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItemCollections.<a href="/src/api/resources/knowledgeStoreItemCollections/client/Client.ts">update</a>(knowledgeStoreId, collectionId, { ...params }) -> TwelvelabsApi.KnowledgeStoreItemCollection</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the `name`, `description`, and `metadata` fields of the specified item collection.
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
await client.knowledgeStoreItemCollections.update(
    "ks_069e9869-1ea3-7481-8000-dae72bf6be6e",
    "ksic_069e9870-3c4d-7abc-9012-3456789abcde",
);
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**collectionId:** `string` — The unique identifier of the knowledge store item collection.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.KnowledgeStoreItemCollectionsUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItemCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItemCollections.<a href="/src/api/resources/knowledgeStoreItemCollections/client/Client.ts">listItems</a>(knowledgeStoreId, collectionId, { ...params }) -> core.Page&lt;TwelvelabsApi.KnowledgeStoreItem&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of the items in the specified item collection.
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
const response = await client.knowledgeStoreItemCollections.listItems(
    "ks_069e9869-1ea3-7481-8000-dae72bf6be6e",
    "ksic_069e9870-3c4d-7abc-9012-3456789abcde",
    {
        page: 1,
        pageLimit: 10,
    },
);
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.knowledgeStoreItemCollections.listItems(
    "ks_069e9869-1ea3-7481-8000-dae72bf6be6e",
    "ksic_069e9870-3c4d-7abc-9012-3456789abcde",
    {
        page: 1,
        pageLimit: 10,
    },
);
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**collectionId:** `string` — The unique identifier of the knowledge store item collection.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.KnowledgeStoreItemCollectionsListItemsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItemCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItemCollections.<a href="/src/api/resources/knowledgeStoreItemCollections/client/Client.ts">addItems</a>(knowledgeStoreId, collectionId, { ...params }) -> TwelvelabsApi.KnowledgeStoreItemCollection</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Adds one or more items to the specified item collection. This operation is idempotent — items already in the collection are skipped. Every identifier must reference an existing item in the knowledge store.
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
await client.knowledgeStoreItemCollections.addItems(
    "ks_069e9869-1ea3-7481-8000-dae72bf6be6e",
    "ksic_069e9870-3c4d-7abc-9012-3456789abcde",
    {
        itemIds: ["ksi_069e9870-3c4d-7abc-9012-3456789abcde"],
    },
);
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**collectionId:** `string` — The unique identifier of the knowledge store item collection.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.KnowledgeStoreItemCollectionsAddItemsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItemCollections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.knowledgeStoreItemCollections.<a href="/src/api/resources/knowledgeStoreItemCollections/client/Client.ts">removeItems</a>(knowledgeStoreId, collectionId, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes one or more items from the specified item collection. This operation is idempotent — identifiers that do not match a member of the collection are ignored. The items themselves remain in the knowledge store.
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
await client.knowledgeStoreItemCollections.removeItems(
    "ks_069e9869-1ea3-7481-8000-dae72bf6be6e",
    "ksic_069e9870-3c4d-7abc-9012-3456789abcde",
    {
        itemIds: ["ksi_069e9870-3c4d-7abc-9012-3456789abcde"],
    },
);
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

**knowledgeStoreId:** `string` — The unique identifier of the knowledge store.

</dd>
</dl>

<dl>
<dd>

**collectionId:** `string` — The unique identifier of the knowledge store item collection.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.KnowledgeStoreItemCollectionsRemoveItemsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeStoreItemCollections.RequestOptions`

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

- [Audio files](/v1.3/docs/concepts/models/marengo/marengo-3-0#audio-file-requirements).
- [Image files](/v1.3/docs/concepts/models/marengo/marengo-3-0#image-file-requirements).

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
- Audio embeddings combine generic sound and human speech in a single embedding. For videos with transcriptions, you can retrieve transcriptions and then [create text embeddings](/v1.3/api-reference/create-embeddings-v1/text-image-audio-embeddings/create-text-image-audio-embeddings) from these
- This endpoint is rate-limited. For details, see the [Rate limits](/v1.3/docs/get-started/rate-limits) page.
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
- Provide up to 10 images by specifying the following parameters multiple times:
    - `query_media_url`: Publicly accessible URL of your media file.
    - `query_media_file`: Local media file.
      **Composed text and media queries**:
- Use the `query_text` parameter for your text query.
- Set `query_media_type` to `image`.
- Provide up to 10 images by specifying the `query_media_url` and `query_media_file` parameters multiple times.

**Entity search** (beta):

- To find a specific person in your videos, enclose the unique identifier of the entity you want to find in the `query_text` parameter.

<Note title="Notes">
- When using images in your search queries (either as media queries or in composed searches), ensure your image files meet the [requirements](/v1.3/docs/concepts/models/marengo/marengo-3-0#image-file-requirements).
- This endpoint is rate-limited. For details, see the [Rate limits](/v1.3/docs/get-started/rate-limits) page.
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

## Responses

<details><summary><code>client.responses.<a href="/src/api/resources/responses/client/Client.ts">createStream</a>({ ...params }) -> core.Stream&lt;TwelvelabsApi.ResponseStreamEvent&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method uses [Jockey](/v1.3/agents/concepts/jockey) to reason over content in a knowledge store and create a response. It uses [Open Responses](https://www.openresponses.org/specification) conventions for input items and streaming events.

Before you use this method, you must create an asset, create a knowledge store, and add the asset to the knowledge store as an item.

**Multi-turn conversations**: Supported via a session identifier. The first request implicitly creates a session; subsequent requests pass the returned identifier to continue the conversation.

**Selections**: By default, Jockey reasons over every item in the knowledge store. To narrow the scope, set the optional `selections` parameter to specific items or item collections, then reference each one with a `{{sel:N}}` token in the `content` field of an `input` item (`N` is the zero-based position in the `selections` array). The narrowing is applied at the prompt level; the knowledge store does not block access to other items.

**Streaming**: Set the `stream` parameter to `true` to receive the response as [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) (SSE). The reply streams in as a sequence of typed events and ends with a `data: [DONE]` message.

<Accordion title="Example response">
```json
{
  "id": "resp_019f4f2a-b69e-7812-b20f-6ea6d644ceff",
  "type": "response",
  "object": "response",
  "status": "completed",
  "incomplete_details": null,
  "session_id": "sess_019f4f2a-b69b-7a01-9018-cc51681121ea",
  "knowledge_store_id": "ks_019ebcf4-7e08-7201-b69c-69e0c1e6ae56",
  "output": [
    {
      "type": "message",
      "id": "msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0",
      "status": "completed",
      "role": "assistant",
      "phase": "final_answer",
      "content": [
        {
          "type": "output_text",
          "text": "The video captures a heated sideline moment during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid, visibly frustrated, and briefly bumps him before being restrained by a teammate [1].",
          "annotations": [
            {
              "type": "video_citation",
              "start_index": 211,
              "end_index": 213,
              "item_id": "ksi_069e9870-3c4d-7abc-9012-3456789abcde",
              "start_sec": 0.0,
              "end_sec": 9.0,
              "title": "Super Bowl LVIII sideline",
              "thumbnail_url": "https://example.com/thumbnail.jpg",
              "hls_url": "https://example.com/stream.m3u8"
            }
          ]
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 12625,
    "output_tokens": 289
  },
  "created_at": "2026-07-11T03:13:57Z"
}
```
</Accordion>

<Accordion title="Example streamed response (SSE)">
```
event: response.created
data: {"type":"response.created","sequence_number":0,"response":{"id":"resp_019f4f2a-b69e-7812-b20f-6ea6d644ceff","type":"response","object":"response","status":"in_progress","incomplete_details":null,"output":[],"session_id":"sess_019f4f2a-b69b-7a01-9018-cc51681121ea","knowledge_store_id":"ks_019ebcf4-7e08-7201-b69c-69e0c1e6ae56","created_at":"2026-07-11T03:13:47Z"}}

event: response.output_item.added
data: {"type":"response.output_item.added","sequence_number":2,"output_index":0,"item":{"type":"message","id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","status":"in_progress","role":"assistant","phase":"final_answer","content":[{"type":"output_text","text":"","annotations":[]}]}}

event: response.content_part.added
data: {"type":"response.content_part.added","sequence_number":3,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"part":{"type":"output_text","text":"","annotations":[]}}

event: response.output_text.delta
data: {"type":"response.output_text.delta","sequence_number":4,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"delta":"The video captures a heated sideline moment"}

event: response.output_text.delta
data: {"type":"response.output_text.delta","sequence_number":5,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"delta":" during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid."}

event: response.output_text.done
data: {"type":"response.output_text.done","sequence_number":124,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"text":"The video captures a heated sideline moment during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid, visibly frustrated, and briefly bumps him before being restrained by a teammate [1]."}

event: response.content_part.done
data: {"type":"response.content_part.done","sequence_number":125,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"part":{"type":"output_text","text":"The video captures a heated sideline moment during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid, visibly frustrated, and briefly bumps him before being restrained by a teammate [1].","annotations":[{"type":"video_citation","start_index":211,"end_index":213,"item_id":"ksi_069e9870-3c4d-7abc-9012-3456789abcde","start_sec":0.0,"end_sec":9.0,"title":"Super Bowl LVIII sideline","thumbnail_url":"https://example.com/thumbnail.jpg","hls_url":"https://example.com/stream.m3u8"}]}}

event: response.completed
data: {"type":"response.completed","sequence_number":127,"response":{"id":"resp_019f4f2a-b69e-7812-b20f-6ea6d644ceff","type":"response","object":"response","status":"completed","incomplete_details":null,"output":[{"type":"message","id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","status":"completed","role":"assistant","phase":"final_answer","content":[{"type":"output_text","text":"The video captures a heated sideline moment during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid, visibly frustrated, and briefly bumps him before being restrained by a teammate [1].","annotations":[{"type":"video_citation","start_index":211,"end_index":213,"item_id":"ksi_069e9870-3c4d-7abc-9012-3456789abcde","start_sec":0.0,"end_sec":9.0,"title":"Super Bowl LVIII sideline","thumbnail_url":"https://example.com/thumbnail.jpg","hls_url":"https://example.com/stream.m3u8"}]}]}],"usage":{"input_tokens":12625,"output_tokens":289},"session_id":"sess_019f4f2a-b69b-7a01-9018-cc51681121ea","knowledge_store_id":"ks_019ebcf4-7e08-7201-b69c-69e0c1e6ae56","created_at":"2026-07-11T03:13:57Z"}}

data: [DONE]

````
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
const response = await client.responses.createStream({
    knowledgeStoreId: "ks_019ebcf4-7e08-7201-b69c-69e0c1e6ae56",
    input: [{
            type: "message",
            role: "user",
            content: "Give me the highlight."
        }]
});
for await (const item of response) {
    console.log(item);
}

````

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.ResponsesCreateStreamRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Responses.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.responses.<a href="/src/api/resources/responses/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.ResponseObject</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method uses [Jockey](/v1.3/agents/concepts/jockey) to reason over content in a knowledge store and create a response. It uses [Open Responses](https://www.openresponses.org/specification) conventions for input items and streaming events.

Before you use this method, you must create an asset, create a knowledge store, and add the asset to the knowledge store as an item.

**Multi-turn conversations**: Supported via a session identifier. The first request implicitly creates a session; subsequent requests pass the returned identifier to continue the conversation.

**Selections**: By default, Jockey reasons over every item in the knowledge store. To narrow the scope, set the optional `selections` parameter to specific items or item collections, then reference each one with a `{{sel:N}}` token in the `content` field of an `input` item (`N` is the zero-based position in the `selections` array). The narrowing is applied at the prompt level; the knowledge store does not block access to other items.

**Streaming**: Set the `stream` parameter to `true` to receive the response as [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) (SSE). The reply streams in as a sequence of typed events and ends with a `data: [DONE]` message.

<Accordion title="Example response">
```json
{
  "id": "resp_019f4f2a-b69e-7812-b20f-6ea6d644ceff",
  "type": "response",
  "object": "response",
  "status": "completed",
  "incomplete_details": null,
  "session_id": "sess_019f4f2a-b69b-7a01-9018-cc51681121ea",
  "knowledge_store_id": "ks_019ebcf4-7e08-7201-b69c-69e0c1e6ae56",
  "output": [
    {
      "type": "message",
      "id": "msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0",
      "status": "completed",
      "role": "assistant",
      "phase": "final_answer",
      "content": [
        {
          "type": "output_text",
          "text": "The video captures a heated sideline moment during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid, visibly frustrated, and briefly bumps him before being restrained by a teammate [1].",
          "annotations": [
            {
              "type": "video_citation",
              "start_index": 211,
              "end_index": 213,
              "item_id": "ksi_069e9870-3c4d-7abc-9012-3456789abcde",
              "start_sec": 0.0,
              "end_sec": 9.0,
              "title": "Super Bowl LVIII sideline",
              "thumbnail_url": "https://example.com/thumbnail.jpg",
              "hls_url": "https://example.com/stream.m3u8"
            }
          ]
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 12625,
    "output_tokens": 289
  },
  "created_at": "2026-07-11T03:13:57Z"
}
```
</Accordion>

<Accordion title="Example streamed response (SSE)">
```
event: response.created
data: {"type":"response.created","sequence_number":0,"response":{"id":"resp_019f4f2a-b69e-7812-b20f-6ea6d644ceff","type":"response","object":"response","status":"in_progress","incomplete_details":null,"output":[],"session_id":"sess_019f4f2a-b69b-7a01-9018-cc51681121ea","knowledge_store_id":"ks_019ebcf4-7e08-7201-b69c-69e0c1e6ae56","created_at":"2026-07-11T03:13:47Z"}}

event: response.output_item.added
data: {"type":"response.output_item.added","sequence_number":2,"output_index":0,"item":{"type":"message","id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","status":"in_progress","role":"assistant","phase":"final_answer","content":[{"type":"output_text","text":"","annotations":[]}]}}

event: response.content_part.added
data: {"type":"response.content_part.added","sequence_number":3,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"part":{"type":"output_text","text":"","annotations":[]}}

event: response.output_text.delta
data: {"type":"response.output_text.delta","sequence_number":4,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"delta":"The video captures a heated sideline moment"}

event: response.output_text.delta
data: {"type":"response.output_text.delta","sequence_number":5,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"delta":" during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid."}

event: response.output_text.done
data: {"type":"response.output_text.done","sequence_number":124,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"text":"The video captures a heated sideline moment during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid, visibly frustrated, and briefly bumps him before being restrained by a teammate [1]."}

event: response.content_part.done
data: {"type":"response.content_part.done","sequence_number":125,"item_id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","output_index":0,"content_index":0,"part":{"type":"output_text","text":"The video captures a heated sideline moment during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid, visibly frustrated, and briefly bumps him before being restrained by a teammate [1].","annotations":[{"type":"video_citation","start_index":211,"end_index":213,"item_id":"ksi_069e9870-3c4d-7abc-9012-3456789abcde","start_sec":0.0,"end_sec":9.0,"title":"Super Bowl LVIII sideline","thumbnail_url":"https://example.com/thumbnail.jpg","hls_url":"https://example.com/stream.m3u8"}]}}

event: response.completed
data: {"type":"response.completed","sequence_number":127,"response":{"id":"resp_019f4f2a-b69e-7812-b20f-6ea6d644ceff","type":"response","object":"response","status":"completed","incomplete_details":null,"output":[{"type":"message","id":"msg_sess_019f4f2a-b69b-7a01-9018-cc51681121ea_0","status":"completed","role":"assistant","phase":"final_answer","content":[{"type":"output_text","text":"The video captures a heated sideline moment during Super Bowl LVIII: after a fumble, Travis Kelce approaches head coach Andy Reid, visibly frustrated, and briefly bumps him before being restrained by a teammate [1].","annotations":[{"type":"video_citation","start_index":211,"end_index":213,"item_id":"ksi_069e9870-3c4d-7abc-9012-3456789abcde","start_sec":0.0,"end_sec":9.0,"title":"Super Bowl LVIII sideline","thumbnail_url":"https://example.com/thumbnail.jpg","hls_url":"https://example.com/stream.m3u8"}]}]}],"usage":{"input_tokens":12625,"output_tokens":289},"session_id":"sess_019f4f2a-b69b-7a01-9018-cc51681121ea","knowledge_store_id":"ks_019ebcf4-7e08-7201-b69c-69e0c1e6ae56","created_at":"2026-07-11T03:13:57Z"}}

data: [DONE]

````
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
await client.responses.create({
    knowledgeStoreId: "ks_019ebcf4-7e08-7201-b69c-69e0c1e6ae56",
    input: [{
            type: "message",
            role: "user",
            content: "Give me the highlight."
        }]
});

````

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `TwelvelabsApi.ResponsesCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Responses.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Data connectors

<details><summary><code>client.dataConnectors.<a href="/src/api/resources/dataConnectors/client/Client.ts">authorizeConnection</a>({ ...params }) -> TwelvelabsApi.AuthorizeConnectionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method starts the OAuth authorization flow for a data connector. The platform returns an authorization URL. Redirect the user to this URL so they can grant access to their account.

After the user grants or denies access, the platform redirects them to the redirect URI you provided, with the outcome appended to that URI as query parameters. Read these parameters from the redirect that your application receives:

- `connection_id`: The identifier of the new connection, returned on success. Store this value and pass it as the `connection_id` path parameter in later requests.
- `status`: The `ok` value, returned on success.
- `custom_id`: The label you supplied, returned on success when you provided one.
- `error`: An error code, returned instead of the other parameters when the user denies access or the flow fails.

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
await client.dataConnectors.authorizeConnection({
    provider: "google_drive",
    redirectUri: "https://app.example.com/oauth/done",
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

**request:** `TwelvelabsApi.AuthorizeConnectionRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataConnectors.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dataConnectors.<a href="/src/api/resources/dataConnectors/client/Client.ts">listConnections</a>({ ...params }) -> TwelvelabsApi.ListConnectionsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the connections in your account. The platform returns your connections sorted by creation date, with the newest at the top of the list.
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
await client.dataConnectors.listConnections({
    page: 1,
    pageLimit: 10,
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

**request:** `TwelvelabsApi.ListConnectionsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataConnectors.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dataConnectors.<a href="/src/api/resources/dataConnectors/client/Client.ts">retrieveConnection</a>(connectionId) -> TwelvelabsApi.Connection</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves details about the specified connection.
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
await client.dataConnectors.retrieveConnection("665f0a2c9b1e4d0012a3f7c9");
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

**connectionId:** `string` — The unique identifier of the connection to retrieve.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataConnectors.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dataConnectors.<a href="/src/api/resources/dataConnectors/client/Client.ts">deleteConnection</a>(connectionId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method disconnects the specified connection. The platform revokes access at the provider and deletes the stored tokens. Assets imported through this connection are retained.
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
await client.dataConnectors.deleteConnection("665f0a2c9b1e4d0012a3f7c9");
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

**connectionId:** `string` — The unique identifier of the connection to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataConnectors.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dataConnectors.<a href="/src/api/resources/dataConnectors/client/Client.ts">createConnectionPickerToken</a>(connectionId) -> TwelvelabsApi.CreateConnectionPickerTokenResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method generates a short-lived, read-only access token that you use with the provider's file picker, such as the Google Drive Picker. The platform never returns the refresh token of the connection.
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
await client.dataConnectors.createConnectionPickerToken("665f0a2c9b1e4d0012a3f7c9");
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

**connectionId:** `string` — The unique identifier of the connection.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataConnectors.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dataConnectors.<a href="/src/api/resources/dataConnectors/client/Client.ts">listRedirectUris</a>({ ...params }) -> TwelvelabsApi.ListRedirectUrisResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns your authorized redirect URIs, sorted by creation date with the newest at the top. Each one is a redirect URI the [Authorize a connection](/v1.3/api-reference/data-connectors/authorize-a-connection) method accepts.
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
await client.dataConnectors.listRedirectUris({
    page: 1,
    pageLimit: 10,
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

**request:** `TwelvelabsApi.ListRedirectUrisRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataConnectors.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dataConnectors.<a href="/src/api/resources/dataConnectors/client/Client.ts">createRedirectUri</a>({ ...params }) -> TwelvelabsApi.RedirectUri</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method registers a redirect URI so the [Authorize a connection](/v1.3/api-reference/data-connectors/authorize-a-connection) method accepts it.
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
await client.dataConnectors.createRedirectUri({
    redirectUri: "https://app.example.com/oauth/done",
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

**request:** `TwelvelabsApi.CreateRedirectUriRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataConnectors.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dataConnectors.<a href="/src/api/resources/dataConnectors/client/Client.ts">deleteRedirectUri</a>(redirectUriId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method removes a redirect URI from your authorized redirect URIs. After deletion, the [Authorize a connection](/v1.3/api-reference/data-connectors/authorize-a-connection) method no longer accepts it. This action cannot be undone.
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
await client.dataConnectors.deleteRedirectUri("665f0a2c9b1e4d0012a3f7c9");
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

**redirectUriId:** `string` — The unique identifier of the redirect URI to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataConnectors.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Imports

<details><summary><code>client.imports.<a href="/src/api/resources/imports/client/Client.ts">listImports</a>(connectionId, { ...params }) -> TwelvelabsApi.ListImportsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the imports for the specified connection. The platform returns the imports sorted by creation date, with the newest at the top of the list. Each import in the list is a summary and does not include the per-file details. To see them, use the [Retrieve an import](/v1.3/api-reference/data-connectors/imports/retrieve-an-import) endpoint.
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
await client.imports.listImports("665f0a2c9b1e4d0012a3f7c9", {
    page: 1,
    pageLimit: 10,
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

**connectionId:** `string` — The unique identifier of the connection to list imports for.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.ListImportsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Imports.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.imports.<a href="/src/api/resources/imports/client/Client.ts">importFiles</a>(connectionId, { ...params }) -> TwelvelabsApi.ImportResult</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method imports one or more files from the connected provider account into the platform as assets. Video files can be up to 10 GB, audio files up to 4 GB, and images up to 32 MB. For each newly imported file, the platform creates an asset in the `processing` status and fetches the file asynchronously. If you import a file that was already imported through this account, the platform returns the existing asset with its current status, without fetching the file again. If the earlier fetch had failed, the platform fetches the file again. The response contains one entry per requested file, in request order. Use the `action` field of each entry to identify which files were newly imported and which were already imported.
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
await client.imports.importFiles("665f0a2c9b1e4d0012a3f7c9", {
    items: [
        {
            sourceId: "1AbCDef_drive_file_id_x",
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

**connectionId:** `string` — The unique identifier of the connection to import through.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.ImportFilesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Imports.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.imports.<a href="/src/api/resources/imports/client/Client.ts">retrieveImport</a>(connectionId, importId) -> TwelvelabsApi.ImportDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves a single import. For each file, the response includes the `action` field, which indicates the outcome of the import operation, and the `status` field, which reflects the current status of the asset each time you retrieve the import.
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
await client.imports.retrieveImport("665f0a2c9b1e4d0012a3f7c9", "665f0afe9b1e4d0012a3f7d0");
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

**connectionId:** `string` — The unique identifier of the connection to retrieve the import from.

</dd>
</dl>

<dl>
<dd>

**importId:** `string` — The unique identifier of the import to retrieve.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Imports.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## AnalyzeAsync Tasks

<details><summary><code>client.analyzeAsync.tasks.<a href="/src/api/resources/analyzeAsync/resources/tasks/client/Client.ts">list</a>({ ...params }) -> TwelvelabsApi.TasksListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the analysis tasks in your account. The platform returns your analysis tasks sorted by creation date, with the newest at the top of the list.
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
await client.analyzeAsync.tasks.list({
    page: 1,
    pageLimit: 10,
    status: "queued",
    videoUrl: "https://example.com/video.mp4",
    assetId: "69abc123def456789012abcd",
    analysisMode: "general",
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

**request:** `TwelvelabsApi.analyzeAsync.TasksListRequest`

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

<details><summary><code>client.analyzeAsync.tasks.<a href="/src/api/resources/analyzeAsync/resources/tasks/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.CreateAnalyzeTaskResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method asynchronously analyzes your videos. It supports two analysis modes: general analysis (prompt-based text generation) and video segmentation with custom segment definitions.

<Accordion title="Input requirements">
- Minimum duration: 4 seconds
- Maximum duration: 2 hours
- Formats: [FFmpeg supported formats](https://ffmpeg.org/ffmpeg-formats.html)
- Resolution: 360x360 to 5184x2160 pixels
- Aspect ratio: Between 1:1 and 1:2.4, or between 2.4:1 and 1:1.
</Accordion>

**When to use this method**:

- Generate custom text from your video using a prompt (general analysis)
- Extract timestamped metadata with custom segment definitions from your video
- Analyze videos longer than 1 hour
- Process videos asynchronously without blocking your application

**Do not use this method for**:

- Videos for which you need immediate results or real-time streaming. Use the [`POST`](/v1.3/api-reference/analyze-videos/sync-analysis) method of the `/analyze` endpoint instead.

Analyzing videos asynchronously requires three steps:

1. Create an analysis task using this method. The platform returns a task identifier.
2. Poll the status of the task using the [`GET`](/v1.3/api-reference/analyze-videos/retrieve-analysis-task-status-results) method of the `/analyze/tasks/{task_id}` endpoint. Wait until the status is `ready`.
3. Retrieve the results from the response when the status is `ready` using the [`GET`](/v1.3/api-reference/analyze-videos/retrieve-analysis-task-status-results) method of the `/analyze/tasks/{task_id}` endpoint.

On the Free plan, you have a total of 600 minutes (10 hours) shared across indexing, analysis, and segmentation. For details, see the [Video hours and video count limits](/v1.3/docs/concepts/indexes#video-hours-and-video-count-limits) section.

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
await client.analyzeAsync.tasks.create({
    customId: "prod-segment-analysis-42",
    video: {
        type: "url",
        url: "https://example.com/video.mp4",
    },
    prompt: "Generate a detailed summary of this video in 3-4 sentences",
    temperature: 0.2,
    maxTokens: 1000,
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

**request:** `TwelvelabsApi.analyzeAsync.CreateAsyncAnalyzeRequest`

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

<details><summary><code>client.analyzeAsync.tasks.<a href="/src/api/resources/analyzeAsync/resources/tasks/client/Client.ts">retrieve</a>(taskId) -> TwelvelabsApi.AnalyzeTaskResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves the status and results of an analysis task.

**Task statuses**:

- `queued`: The task is waiting to be processed.
- `pending`: The task is queued and waiting to start.
- `processing`: The platform is analyzing the video.
- `ready`: Processing is complete. Results are available in the response.
- `failed`: The task failed. No results were generated.

Poll this method until `status` is `ready` or `failed`. When `status` is `ready`, use the results from the response.
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
await client.analyzeAsync.tasks.retrieve("64f8d2c7e4a1b37f8a9c5d12");
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

**taskId:** `string` — The unique identifier of the analysis task.

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

<details><summary><code>client.analyzeAsync.tasks.<a href="/src/api/resources/analyzeAsync/resources/tasks/client/Client.ts">delete</a>(taskId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method deletes an analysis task. You can only delete tasks that are not currently being processed.
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
await client.analyzeAsync.tasks.delete("64f8d2c7e4a1b37f8a9c5d12");
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

**taskId:** `string` — The unique identifier of the analyze task.

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

## AnalyzeAsync Batches

<details><summary><code>client.analyzeAsync.batches.<a href="/src/api/resources/analyzeAsync/resources/batches/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;TwelvelabsApi.AnalyzeBatchStatusResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this method to list all the batch objects in your account. The response sorts batches by creation date, with the newest batch first.
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
const response = await client.analyzeAsync.batches.list({
    page: 1,
    pageLimit: 10,
    status: ["processing", "canceling"],
    analysisMode: ["general", "time_based_metadata"],
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.analyzeAsync.batches.list({
    page: 1,
    pageLimit: 10,
    status: ["processing", "canceling"],
    analysisMode: ["general", "time_based_metadata"],
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

**request:** `TwelvelabsApi.analyzeAsync.BatchesListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Batches.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.analyzeAsync.batches.<a href="/src/api/resources/analyzeAsync/resources/batches/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.CreateAnalyzeBatchResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this method to submit many video analysis requests in a single call. Each request creates an analysis task. The response contains one batch identifier and one task identifier per request. Use the batch identifier to check progress and retrieve results.

**When to use this method**:

- Run the same analysis settings across many videos.
- Track a single batch instead of many individual analysis tasks.

**Do not use this method for**:

- Single videos that require immediate results. Use the [`POST`](/v1.3/api-reference/analyze-videos/sync-analysis) method of the `/analyze` endpoint instead.
- Background processing of a single video. Use the [`POST`](/v1.3/api-reference/analyze-videos/create-async-analysis-task) method of the `/analyze/tasks` endpoint instead.

**Retention and retry**:

- Batches expire 24 hours after creation. You can retrieve results for 30 days after creation.
- If processing does not finish for some items in time, resubmit them in a new batch.

**Limits**:

- Up to 1,000 requests per batch.
- Up to 2,000 total content hours per batch.
- Up to 5 active batches per account.

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
await client.analyzeAsync.batches.create({
    modelName: "pegasus1.5",
    analysisMode: "general",
    defaults: {
        prompt: {
            inputText: "Generate a 3-sentence executive summary of this video.",
        },
        temperature: 0.2,
        maxTokens: 4096,
    },
    requests: [
        {
            video: {
                type: "asset_id",
                assetId: "6298d673f1090f1100476d4c",
            },
            customId: "summary-001",
        },
        {
            video: {
                type: "asset_id",
                assetId: "6298d673f1090f1100476d4d",
            },
            customId: "summary-002",
        },
        {
            video: {
                type: "asset_id",
                assetId: "6298d673f1090f1100476d4e",
            },
            customId: "action-003",
            prompt: {
                inputText: "List all action items discussed.",
            },
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

**request:** `TwelvelabsApi.analyzeAsync.CreateAnalyzeBatchRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Batches.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.analyzeAsync.batches.<a href="/src/api/resources/analyzeAsync/resources/batches/client/Client.ts">retrieve</a>(batchId) -> TwelvelabsApi.AnalyzeBatchStatusResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this method to monitor a batch. The response includes the current batch status and counts for queued, processing, ready, failed, and canceled items.

Poll this method until the batch reaches the `completed`, `canceled`, or `expired` status. To retrieve the results, call the [`GET`](/v1.3/api-reference/analyze-videos/batch-analysis/retrieve-batch-results) method of the `/analyze/batches/{batch_id}/results` endpoint.

Do not treat the `completed` status as a success signal. It means processing has finished for every item, not that every analysis succeeded. To see how many items succeeded, failed, or were canceled, check the `ready_items`, `failed_items`, and `canceled_items` fields. A batch never has the `failed` status.
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
await client.analyzeAsync.batches.retrieve("68f4ddaf8aaa60d33df0e800");
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

**batchId:** `string` — The unique identifier of the batch.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Batches.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.analyzeAsync.batches.<a href="/src/api/resources/analyzeAsync/resources/batches/client/Client.ts">delete</a>(batchId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this method to delete a batch and all the tasks associated with it. You can only delete batches with status `completed`, `canceled`, or `expired`.

Deleting a batch does not affect billing. You are billed for every completed analysis regardless of whether you delete the batch afterward.

To stop a batch with the `pending` or `processing` status, use the [`POST`](/v1.3/api-reference/analyze-videos/batch-analysis/cancel-batch) method of the `/analyze/batches/{batch_id}/cancel` endpoint.

Batches are deleted 30 days after creation.
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
await client.analyzeAsync.batches.delete("68f4ddaf8aaa60d33df0e800");
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

**batchId:** `string` — The unique identifier of the batch.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Batches.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.analyzeAsync.batches.<a href="/src/api/resources/analyzeAsync/resources/batches/client/Client.ts">results</a>(batchId) -> core.Stream&lt;TwelvelabsApi.BatchResultItem&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this method to retrieve the results for each item in a batch. You can call it while the batch has the `pending` or `processing` status.

Each result entry has a status. For details on each status, see the [Item statuses](/v1.3/api-reference/analyze-videos/batch-analysis/the-batch-object#item-statuses) section on the **The batch object** page.

Each result entry includes a task identifier in the `task_id` field. Use this value with the [`GET`](/v1.3/api-reference/analyze-videos/retrieve-analysis-task-status-results) method of the `/analyze/tasks/{task_id}` endpoint if you need the full analysis task response.

You can retrieve results for 30 days after batch creation.
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
const response = await client.analyzeAsync.batches.results("68f4ddaf8aaa60d33df0e800");
for await (const item of response) {
    console.log(item);
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

**batchId:** `string` — The unique identifier of the batch.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Batches.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.analyzeAsync.batches.<a href="/src/api/resources/analyzeAsync/resources/batches/client/Client.ts">cancel</a>(batchId) -> TwelvelabsApi.AnalyzeBatchStatusResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this method to request cancellation for a batch with the `pending` or `processing` status.

When you invoke this method, the platform performs the following steps:

- Cancels the items in the `queued` status.
- Finishes the analysis for the items in the `processing` status.

The batch status changes to `canceling` immediately, and to `canceled` after every item reaches `ready`, `failed`, or `canceled`. You are not billed for canceled or failed items.
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
await client.analyzeAsync.batches.cancel("68f4ddaf8aaa60d33df0e800");
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

**batchId:** `string` — The unique identifier of the batch.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Batches.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Embed Tasks

<details><summary><code>client.embed.tasks.<a href="/src/api/resources/embed/resources/tasks/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;TwelvelabsApi.MediaEmbeddingTask&gt;</code></summary>
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
- Video embeddings are stored for seven days.
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

<Note title="Note">
This endpoint is rate-limited. For details, see the [Rate limits](/v1.3/docs/get-started/rate-limits) page.
</Note>

Upload options:

- **Local file**: Use the `video_file` parameter
- **Publicly accessible URL**: Use the `video_url` parameter.

Specify at least one option. If both are provided, `video_url` takes precedence.

Your video files must meet the [requirements](/v1.3/docs/concepts/models/marengo/marengo-3-0#video-file-requirements).
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
await client.embed.tasks.retrieve("663da73b31cdd0c1f638a8e6", {
    embeddingOption: ["visual"],
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

This method synchronously creates embeddings for multimodal content and returns the results immediately in the response.

Use this method to embed a query for retrieving matching content. With Marengo 3.5, audio and video can be up to 30 seconds. With Marengo 3.0, they can be up to 10 minutes. For longer content, use the [`POST`](/v1.3/api-reference/create-embeddings-v2/create-async-embedding-task) method of the `/embed-v2/tasks` endpoint instead.

The content this method accepts depends on the model. With Marengo 3.5, this method accepts only the `multi_input` input type; provide text, images, audio, or video as media sources. With Marengo 3.0, use the individual input types. For the formats, resolutions, file sizes, and duration limits each model accepts, see the input requirements for [Marengo 3.5](/v1.3/docs/concepts/models/marengo/marengo-3-5#input-requirements) or [Marengo 3.0](/v1.3/docs/concepts/models/marengo/marengo-3-0#input-requirements).

<Note title="Note">
This method is rate-limited. With Marengo 3.5, the platform counts input tokens for each type of content. A request can exceed a limit before you see an error. For details, see [Input token limits for embedding](/v1.3/docs/get-started/rate-limits#input-token-limits-for-embedding).
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
await client.embed.v2.create({
    inputType: "multi_input",
    modelName: "marengo3.5",
    multiInput: {
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

<details><summary><code>client.embed.v2.tasks.<a href="/src/api/resources/embed/resources/v2/resources/tasks/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;TwelvelabsApi.MediaEmbeddingTask&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the async embedding tasks in your account. The platform returns your async embedding tasks sorted by creation date, with the newest at the top of the list.

<Note title="Notes">
- Embeddings are stored for seven days.
- When you invoke this method without specifying the `started_at` and `ended_at` parameters, the platform returns all the async embedding tasks created within the last seven days.
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

This method creates embeddings for audio, video, images, and documents asynchronously.

Use this method to embed content at scale, such as long files or the media files you want to make searchable. For a query, or for results you need in the same request, use the [`POST`](/v1.3/api-reference/create-embeddings-v2/create-embeddings) method of the `/embed-v2` endpoint instead.

The content this method accepts depends on the model. Both models embed audio and video. Marengo 3.5 also embeds images and PDF files. For the formats, resolutions, file sizes, and duration limits each model accepts, see the input requirements for [Marengo 3.5](/v1.3/docs/concepts/models/marengo/marengo-3-5#input-requirements) or [Marengo 3.0](/v1.3/docs/concepts/models/marengo/marengo-3-0#input-requirements).

Creating embeddings asynchronously requires three steps:

1. Create a task using this method. The platform returns a task identifier.
2. Poll for the status of the task using the [`GET`](/v1.3/api-reference/create-embeddings-v2/retrieve-embeddings) method of the `/embed-v2/tasks/{task_id}` endpoint. Wait until the status is `ready`.
3. Retrieve the embeddings from the response when the status is `ready` using the [`GET`](/v1.3/api-reference/create-embeddings-v2/retrieve-embeddings) method of the `/embed-v2/tasks/{task_id}` endpoint.

<Note title="Notes">
- Creating a task validates only basic metadata and playability, not the full file. A file can pass this check but still fail later during embedding. When you retrieve the results, check the [`status`](/v1.3/api-reference/create-embeddings-v2/retrieve-embeddings#response.body.status) field. If it is `failed`, the [`error.message`](/v1.3/api-reference/create-embeddings-v2/retrieve-embeddings#response.body.error.message) field contains the reason.
- This method is rate-limited. With Marengo 3.5, the platform counts input tokens for each type of content. A task can exceed a limit before you see an error. For details, see [Input token limits for embedding](/v1.3/docs/get-started/rate-limits#input-token-limits-for-embedding).
- Embeddings are stored for seven days.
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
await client.embed.v2.tasks.create({
    inputType: "audio",
    modelName: "marengo3.5",
    audio: {
        mediaSource: {
            url: "https://user-bucket.com/audio/long-audio.wav",
        },
        startSec: 0,
        endSec: 3600,
        segmentation: {
            temporal: {
                strategy: "fixed",
                fixed: {
                    durationSec: 1,
                },
            },
        },
        embeddingOption: ["audio"],
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

Invoke this method repeatedly until the `status` field is `ready` or `failed`. When the status is `ready`, use the embeddings from the response. When the status is `failed`, the `error.message` field contains the reason.

<Note title="Note">
Embeddings are stored for seven days.
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

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">listByAsset</a>(assetId, { ...params }) -> core.Page&lt;TwelvelabsApi.Entity&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of entities whose [`asset_ids`](/v1.3/api-reference/entities/entity-collections/entities/retrieve#response.body.asset_ids) array contains the specified asset.
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
const response = await client.entityCollections.entities.listByAsset("6298d673f1090f1100476d4c", {
    page: 1,
    pageLimit: 10,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.entityCollections.entities.listByAsset("6298d673f1090f1100476d4c", {
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

**assetId:** `string` — The unique identifier of the asset.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.entityCollections.EntitiesListByAssetRequest`

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

<details><summary><code>client.entityCollections.entities.<a href="/src/api/resources/entityCollections/resources/entities/client/Client.ts">list</a>(entityCollectionId, { ...params }) -> core.Page&lt;TwelvelabsApi.Entity&gt;</code></summary>
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

<details><summary><code>client.indexes.indexedAssets.<a href="/src/api/resources/indexes/resources/indexedAssets/client/Client.ts">list</a>(indexId, { ...params }) -> core.Page&lt;TwelvelabsApi.IndexedAsset&gt;</code></summary>
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
    status: ["ready"],
    filename: "01.mp4",
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
    status: ["ready"],
    filename: "01.mp4",
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

<Note title="Adding videos to existing indexes">
You can no longer add videos to an index that has only Pegasus 1.2 enabled. When you add videos to an index that has both Marengo and Pegasus 1.2 enabled, the platform indexes them with Marengo only.
</Note>

Your asset must meet the requirements based on your workflow:

- **Search**: [Marengo requirements](/v1.3/docs/concepts/models/marengo/marengo-3-0#video-file-requirements)
- **Video analysis**: [Pegasus requirements](/v1.3/docs/concepts/models/pegasus#input-requirements).

If you want to both search and analyze your videos, the most restrictive requirements apply.

Indexes have limits on video hours and video count. For details, see the [Video hours and video count limits](/v1.3/docs/concepts/indexes#video-hours-and-video-count-limits) section.

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

Use this method to:

- Monitor the indexing progress:
    - Call this endpoint after creating an indexed asset
    - Check the `status` field until it shows `ready`
    - Once ready, your content is available for search and analysis

- Retrieve the asset metadata:
    - Retrieve system metadata (duration, resolution, filename)
    - Access user-defined metadata

- Retrieve the embeddings:
    - Include the `embeddingOption` parameter to retrieve video embeddings
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
    embeddingOption: ["visual"],
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

This method updates one or more fields of the metadata of an indexed asset. Also, can delete a field by setting it to `null`.
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

<details><summary><code>client.indexes.indexedAssets.<a href="/src/api/resources/indexes/resources/indexedAssets/client/Client.ts">listByAsset</a>(assetId, { ...params }) -> core.Page&lt;TwelvelabsApi.IndexedAssetSummary&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of indexed assets that reference the specified asset. Each entry includes the indexed asset ID and the index it belongs to.
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
const response = await client.indexes.indexedAssets.listByAsset("6298d673f1090f1100476d4c", {
    page: 1,
    pageLimit: 10,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.indexes.indexedAssets.listByAsset("6298d673f1090f1100476d4c", {
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

**assetId:** `string` — The unique identifier of the asset.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.indexes.IndexedAssetsListByAssetRequest`

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

<details><summary><code>client.indexes.videos.<a href="/src/api/resources/indexes/resources/videos/client/Client.ts">list</a>(indexId, { ...params }) -> core.Page&lt;TwelvelabsApi.VideoVector&gt;</code></summary>
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
    embeddingOption: ["visual"],
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

This method deletes all the information about the specified indexed video. This action cannot be undone.
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

This method updates one or more fields of the metadata of a video. Also, can delete a field by setting it to `null`.
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
