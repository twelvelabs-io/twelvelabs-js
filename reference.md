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
- This endpoint supports streaming responses. For details on integrating this feature into your application, refer to the [Open-ended analysis](/v1.3/docs/guides/analyze-videos/open-ended-analysis#streaming-responses) guide.
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

This method returns a list of the video indexing tasks in your account. The API returns your video indexing tasks sorted by creation date, with the newest at the top of the list.

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

This method creates a video indexing task that uploads and indexes a video.

Upload options:

- **Local file**: Use the `video_file` parameter.
- **Publicly accessible URL**: Use the `video_url` parameter.

<Accordion title="Video requirements">
  The videos you wish to upload must meet the following requirements:
  - **Video resolution**: Must be at least 360x360 and must not exceed 3840x2160.
  - **Aspect ratio**: Must be one of 1:1, 4:3, 4:5, 5:4, 16:9, 9:16, or 17:9.
  - **Video and audio formats**: Your video files must be encoded in the video and audio formats listed on the [FFmpeg Formats Documentation](https://ffmpeg.org/ffmpeg-formats.html) page. For videos in other formats, contact us at support@twelvelabs.io.
  - **Duration**: For Marengo, it must be between 4 seconds and 2 hours (7,200s). For Pegasus, it must be between 4 seconds and 60 minutes (3600s). In a future release, the maximum duration for Pegasus will be 2 hours (7,200 seconds).
  - **File size**: Must not exceed 2 GB.
    If you require different options, contact us at support@twelvelabs.io.

If both Marengo and Pegasus are enabled for your index, the most restrictive prerequisites will apply.
</Accordion>

<Note title="Notes">
- The platform supports video URLs that can play without additional user interaction or custom video players. Ensure your URL points to the raw video file, not a web page containing the video. Links to third-party hosting sites, cloud storage services, or videos requiring extra steps to play are not supported.
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

This method returns a list of the indexes in your account. The API returns indexes sorted by creation date, with the oldest indexes at the top of the list.

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
            modelName: "marengo2.7",
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

## Embed

<details><summary><code>client.embed.<a href="/src/api/resources/embed/client/Client.ts">create</a>({ ...params }) -> TwelvelabsApi.EmbeddingResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method creates embeddings for text, image, and audio content.

Before you create an embedding, ensure that your image or audio files meet the following prerequisites:

- [Image embeddings](/v1.3/docs/guides/create-embeddings/image#prerequisites)
- [Audio embeddings](/v1.3/docs/guides/create-embeddings/audio#prerequisites)

Parameters for embeddings:

- **Common parameters**:
    - `model_name`: The video understanding model you want to use. Example: "Marengo-retrieval-2.7".
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
- Audio embeddings combine generic sound and human speech in a single embedding. For videos with transcriptions, you can retrieve transcriptions and then [create text embeddings](/v1.3/api-reference/text-image-audio-embeddings/create-text-image-audio-embeddings) from these transcriptions.
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

Use this endpoint to search for relevant matches in an index using text or various media queries.

**Text queries**:

- Use the `query_text` parameter to specify your query.

**Media queries**:

- Set the `query_media_type` parameter to the corresponding media type (example: `image`).
- Specify either one of the following parameters:
    - `query_media_url`: Publicly accessible URL of your media file.
    - `query_media_file`: Local media file.
      If both `query_media_url` and `query_media_file` are specified in the same request, `query_media_url` takes precedence.
      <Accordion title="Image requirements">
      Your images must meet the following requirements:
    - **Format**: JPEG and PNG.
    - **Dimension**: Must be at least 64 x 64 pixels.
    - **Size**: Must not exceed 5MB.
      </Accordion>

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

<details><summary><code>client.embed.tasks.<a href="/src/api/resources/embed/resources/tasks/client/Client.ts">list</a>({ ...params }) -> core.Page<TwelvelabsApi.VideoEmbeddingTask></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

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

This method creates a new video embedding task that uploads a video to the platform and creates one or multiple video embeddings.

Upload options:

- **Local file**: Use the `video_file` parameter
- **Publicly accessible URL**: Use the `video_url` parameter.

Specify at least one option. If both are provided, `video_url` takes precedence.

<Accordion title="Video requirements">
  The videos you wish to upload must meet the following requirements:
  - **Video resolution**: Must be at least 360x360 and must not exceed 3840x2160.
  - **Aspect ratio**: Must be one of 1:1, 4:3, 4:5, 5:4, 16:9, 9:16, or 17:9.
  - **Video and audio formats**: Your video files must be encoded in the video and audio formats listed on the [FFmpeg Formats Documentation](https://ffmpeg.org/ffmpeg-formats.html) page. For videos in other formats, contact us at support@twelvelabs.io.
  - **Duration**: Must be between 4 seconds and 2 hours (7,200s).
  - **File size**: Must not exceed 2 GB.
    If you require different options, contact us at support@twelvelabs.io.
</Accordion>

<Note title="Notes">
- The Marengo video understanding model generates embeddings for all modalities in the same latent space. This shared space enables any-to-any searches across different types of content.
- Video embeddings are stored for seven days.
- The platform supports uploading video files that can play without additional user interaction or custom video players. Ensure your URL points to the raw video file, not a web page containing the video. Links to third-party hosting sites, cloud storage services, or videos requiring extra steps to play are not supported.
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

This method retrieves the status of a video embedding task. Check the task status of a video embedding task to determine when you can retrieve the embedding.

A task can have one of the following statuses:

- `processing`: The platform is creating the embeddings.
- `ready`: Processing is complete. Retrieve the embeddings by invoking the [`GET`](/v1.3/api-reference/video-embeddings/retrieve-video-embeddings) method of the `/embed/tasks/{task_id} endpoint`.
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

This method retrieves embeddings for a specific video embedding task. Ensure the task status is `ready` before invoking this method. Refer to the [Retrieve the status of a video embedding tasks](/v1.3/api-reference/video-embeddings/retrieve-video-embedding-task-status) page for instructions on checking the task status.

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

## Indexes Videos

<details><summary><code>client.indexes.videos.<a href="/src/api/resources/indexes/resources/videos/client/Client.ts">list</a>(indexId, { ...params }) -> core.Page<TwelvelabsApi.VideoVector></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method returns a list of the videos in the specified index. By default, the API returns your videos sorted by creation date, with the newest at the top of the list.

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

**indexId:** `string` — The unique identifier of the index for which the API will retrieve the videos.

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
await client.indexes.videos.retrieve("6298d673f1090f1100476d4c", "6298d673f1090f1100476d4c");
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

Use this method to update one or more fields of the metadata of a video. Also, you can delete a field by setting it to `null`.

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

<details><summary><code>client.tasks.transfers.<a href="/src/api/resources/tasks/resources/transfers/client/Client.ts">create</a>(integrationId, { ...params }) -> TwelvelabsApi.TransfersCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

An import represents the process of uploading and indexing all videos from the specified integration.

This method initiates an asynchronous import and returns two lists:

- Videos that will be imported.
- Videos that will not be imported, typically because they do not meet the prerequisites of all enabled video understanding models for your index. Note that the most restrictive prerequisites among the enabled models will apply.

The actual uploading and indexing of videos occur asynchronously after you invoke this method. To monitor the status of each upload after invoking this method, use the [Retrieve import status](/v1.3/api-reference/tasks/cloud-to-cloud-integrations/get-status) method.

<Accordion title="Video requirements">
  The videos you wish to upload must meet the following requirements:
  - **Video resolution**: Must be at least 360x360 and must not exceed 3840x2160.
  - **Aspect ratio**: Must be one of 1:1, 4:3, 4:5, 5:4, 16:9, 9:16, or 17:9.
  - **Video and audio formats**: Your video files must be encoded in the video and audio formats listed on the [FFmpeg Formats Documentation](https://ffmpeg.org/ffmpeg-formats.html) page. For videos in other formats, contact us at support@twelvelabs.io.
  - **Duration**: For Marengo, it must be between 4 seconds and 2 hours (7,200s). For Pegasus, it must be between 4 seconds and 60 minutes (3600s). In a future release, the maximum duration for Pegasus will be 2 hours (7,200 seconds).
  - **File size**: Must not exceed 2 GB.
    If you require different options, contact us at support@twelvelabs.io.

If both Marengo and Pegasus are enabled for your index, the most restrictive prerequisites will apply.
</Accordion>

<Note title="Notes">
- Before importing videos, you must set up an integration. For details, see the [Set up an integration](/v1.3/docs/advanced/cloud-to-cloud-integrations#set-up-an-integration) section.
- By default, the platform checks for duplicate files using hashes within the target index and will not upload the same video to the same index twice. However, the same video can exist in multiple indexes. To bypass duplicate checking entirely and import duplicate videos into the same index, set the value of the `incremental_import` parameter to `false`.
- Only one import job can run at a time. To start a new import, wait for the current job to complete. Use the [`GET`](/v1.3/api-reference/tasks/cloud-to-cloud-integrations/get-status) method of the `/tasks/transfers/import/{integration-id}/logs` endpoint to retrieve a list of your import jobs, including their creation time, completion time, and processing status for each video file.
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
await client.tasks.transfers.create("6298d673f1090f1100476d4c", {
    indexId: "6298d673f1090f1100476d4c",
    incrementalImport: true,
    retryFailed: false,
    userMetadata: {
        category: "recentlyAdded",
        batchNumber: 5,
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

**integrationId:** `string` — The unique identifier of the integration for which you want to import videos. You can retrieve it from the [Integrations](https://playground.twelvelabs.io/dashboard/integrations) page.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.tasks.TransfersCreateRequest`

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

<details><summary><code>client.tasks.transfers.<a href="/src/api/resources/tasks/resources/transfers/client/Client.ts">getStatus</a>(integrationId, { ...params }) -> TwelvelabsApi.TransfersGetStatusResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This method retrieves the current status for each video from a specified integration and index. It returns an object containing lists of videos grouped by status. See the [Task object](/v1.3/api-reference/tasks/the-task-object) page for details on each status.

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
await client.tasks.transfers.getStatus("6298d673f1090f1100476d4c", {
    indexId: "6298d673f1090f1100476d4c",
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

**integrationId:** `string` — The unique identifier of the integration for which you want to retrieve the status of your imported videos. You can retrieve it from the [Integrations](https://playground.twelvelabs.io/dashboard/integrations) page.

</dd>
</dl>

<dl>
<dd>

**request:** `TwelvelabsApi.tasks.TransfersGetStatusRequest`

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

<details><summary><code>client.tasks.transfers.<a href="/src/api/resources/tasks/resources/transfers/client/Client.ts">getLogs</a>(integrationId) -> TwelvelabsApi.TransfersGetLogsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint returns a chronological list of import operations for the specified integration. The list is sorted by creation date, with the oldest imports first. Each item in the list contains:

- The number of videos in each status
- Detailed error information for failed uploads, including filenames and error messages.

Use this endpoint to track import progress and troubleshoot potential issues across multiple operations.

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
await client.tasks.transfers.getLogs("6298d673f1090f1100476d4c");
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

**integrationId:** `string` — The unique identifier of the integration for which you want to retrieve the import logs. You can retrieve it from the [Integrations](https://playground.twelvelabs.io/dashboard/integrations) page.

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
