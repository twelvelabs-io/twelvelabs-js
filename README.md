# TwelveLabs JavaScript SDK

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2Ffern-demo%2Ftwelve-labs-js)
[![NPM version](https://img.shields.io/npm/v/twelvelabs-js.svg)](https://npmjs.org/package/twelvelabs-js)
![NPM Downloads](https://img.shields.io/npm/dy/twelvelabs-js)

The TwelveLabs JavaScript SDK provides a set of intuitive classes and methods that streamline platform interaction, minimizing the need for boilerplate code.

> **Note**: The examples in this guide show only the required parameters. For the complete guides, see the [Search](https://docs.twelvelabs.io/docs/guides/search) and [Analyze videos](https://docs.twelvelabs.io/docs/guides/analyze-videos) pages.

# Prerequisites

Ensure that the following prerequisites are met before using the SDK:

- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh) must be installed on your machine.
- To use the platform, you need an API key:
  1. If you don't have an account, [sign up](https://playground.twelvelabs.io/) for a free account.
  2. Go to the [API Keys](https://playground.twelvelabs.io/dashboard/api-keys) page.
  3. If you need to create a new key, select the **Create API Key** button. Enter a name and set the expiration period. The default is 12 months.
  4. Select the **Copy** icon next to your key to copy it to your clipboard.
- Your video files must meet the following requirements:
    - **For this guide**: Files up to 4 GB.
    - **Model capabilities**: See the complete requirements for [Marengo](https://docs.twelvelabs.io/v1.3/docs/concepts/models/marengo#video-file-requirements) and [Pegasus](https://docs.twelvelabs.io/v1.3/docs/concepts/models/pegasus#video-file-requirements) for resolution, aspect ratio, and supported formats.

    For upload size limits and processing modes, see the [Upload and processing methods](https://docs.twelvelabs.io/v1.3/docs/concepts/upload-methods) page.

# Install the SDK

Install the latest version of the `twelvelabs-js` package:

```sh
npm install twelvelabs-js
# or yarn add twelvelabs-js
```

# Initialize the SDK

1. Import the SDK into your application:

   ```js
   import { TwelveLabs } from "twelvelabs-js";
   ```

2. Instantiate the SDK client with your API key:

   ```js
   const client = new TwelveLabs({ apiKey: "<YOUR_API_KEY>" });
   ```

# Use the SDK

To get started with the SDK, follow these basic steps:

1. Create an index.
2. Upload videos.
3. Perform downstream tasks, such as searching or analyzing videos to generate text based on their content.

## Create an index

Indexes store and organize your video data, allowing you to group related videos. When you create an index, configure which video understanding models process your videos and what modalities those models analyze.

To create an index, call the `client.indexes.create` method with the following parameters:

- **`indexName`**: The name of the index.
- **`models`**: An array of models to enable. Each entry has two fields:
  - **`modelName`**: The model to enable. Use `"marengo3.0"` for search or `"pegasus1.2"` for text generation.
  - **`modelOptions`**: The modalities to analyze.

```js
const index = await client.indexes.create({
  indexName: "<YOUR_INDEX_NAME>",
  models: [
    { modelName: "marengo3.0", modelOptions: ["visual", "audio"] },
    { modelName: "pegasus1.2", modelOptions: ["visual", "audio"] }
  ]
});
if (!index.id) {
  throw new Error("Failed to create an index.");
}
console.log(`Created index: id=${index.id}`);
```

The `client.indexes.create` method returns an object that includes, among other information, a field named `id` representing the unique identifier of your new index.

See the [Indexes](https://docs.twelvelabs.io/docs/concepts/indexes) page for more details.

## Upload videos

To upload a video, call the `client.assets.create` method with the following parameters:

- **`method`**: Upload method. Use `"url"` for publicly accessible URLs or `"direct"` for local files.
- **`url`** or **`file`**: The video URL or a readable stream. Use direct links to raw media files. Hosting platform links and cloud storage sharing links are not supported.

```js
// Uncomment the next line if uploading a local file
// import * as fs from "fs";

const asset = await client.assets.create({
  method: "url",
  url: "<YOUR_VIDEO_URL>"
  // Or use method: "direct" and file: fs.createReadStream("<PATH_TO_VIDEO_FILE>") to upload a local file.
});
console.log(`Created asset: id=${asset.id}`);
```

The `client.assets.create` method returns an object that includes, among other information, a field named `id` representing the unique identifier of your asset. Use this identifier in subsequent steps.

## Check the status of the asset

You only need this step for files larger than 200 MB. The platform processes files up to 200 MB synchronously and sets the asset status to ready. For larger files, check the asset status until it is ready.

To check the status of the asset, call the `client.assets.retrieve` method with the unique identifier of your asset as a paremeter:

```js
console.log("Waiting for asset to be ready...");
let readyAsset = await client.assets.retrieve(asset.id);
while (readyAsset.status !== "ready" && readyAsset.status !== "failed") {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  readyAsset = await client.assets.retrieve(asset.id);
}
if (readyAsset.status === "failed") {
  throw new Error(`Asset processing failed: id=${asset.id}`);
}
console.log("Asset is ready");
```

## Index your video

To index your video, call the `client.indexes.indexedAssets.create` method with the following parameters:

- **`indexId`**: The unique identifier of your index.
- **`assetId`**: The unique identifier of the asset to index.

```js
let indexedAsset = await client.indexes.indexedAssets.create(index.id, {
  assetId: asset.id
});
console.log(`Created indexed asset: id=${indexedAsset.id}`);
```

The `client.indexes.indexedAssets.create` method returns an object that includes, among other information, a field named `id` representing the unique identifier of your indexed asset.

## Monitor the indexing process

The platform indexes videos asynchronously. To monitor the indexing process, call the `client.indexes.indexedAssets.retrieve` method with the following parameters:

- **`indexId`**: The unique identifier of your index.
- **`indexedAssetId`**: The unique identifier of your indexed asset.

```js
console.log("Waiting for indexing to complete.");
while (true) {
  indexedAsset = await client.indexes.indexedAssets.retrieve(
    index.id,
    indexedAsset.id
  );
  console.log(`  Status=${indexedAsset.status}`);
  if (indexedAsset.status === "ready") {
    console.log("Indexing complete!");
    break;
  } else if (indexedAsset.status === "failed") {
    throw new Error("Indexing failed");
  }
  await new Promise(resolve => setTimeout(resolve, 5000));
}
```

The `client.indexes.indexedAssets.retrieve` method returns an object that includes, among other information, a field named `status` representing the status of the indexing process. Poll this method until `status` is `"ready"` before performing downstream tasks.

## Perform downstream tasks

The sections below show the most common downstream tasks. See [our documentation](https://docs.twelvelabs.io/docs) for the complete list of features the platform provides.

### Search

Use natural language, images, or both to find matching video segments. Search operates within a single index.

**Text queries**

To search using a text query, call the `client.search.query` method with the following parameters:

- **`queryText`**: Natural language query. The maximum length of a query is 500 tokens.
- **`searchOptions`**: Modalities to search. Valid values: `"visual"`, `"audio"`, `"transcription"` (spoken words). See the [Search options](https://docs.twelvelabs.io/docs/concepts/modalities#search-options) page for details.

```js
const searchResults = await client.search.query({
  indexId: index.id,
  queryText: "<YOUR_QUERY>",
  searchOptions: ["visual", "audio"]
});
let resultIndex = 0;
for await (const clip of searchResults) {
  resultIndex++;
  console.log(`Result ${resultIndex}: videoId=${clip.videoId} rank=${clip.rank} start=${clip.start}s end=${clip.end}s`);
}
```

The `client.search.query` method returns an async iterable where each item contains, among other information, the following fields:

- `videoId`: The unique identifier of the matching video.
- `rank`: The relevance ranking (1 = most relevant).
- `start`, `end`: The start and end time of the matching clip, expressed in seconds.

**Image queries**

To search using an image query, call the `client.search.query` method with the following parameters:

- **`queryMediaType`**: Must be `"image"`.
- **`queryMediaFile`**, **`queryMediaUrl`**, **`queryMediaFiles`**, or **`queryMediaUrls`**: The image or images to use as a query (up to 10 total). Provide at least one of the following:
  - _(Optional)_ **`queryMediaFile`**: A readable stream. Use `fs.createReadStream("<PATH>")` to open a local file.
  - _(Optional)_ **`queryMediaUrl`**: The publicly accessible URL of your image file.
  - _(Optional)_ **`queryMediaFiles`**: A list of readable streams.
  - _(Optional)_ **`queryMediaUrls`**: A list of publicly accessible URLs.

```js
// import * as fs from "fs";

const searchResults = await client.search.query({
  indexId: index.id,
  queryMediaType: "image",
  queryMediaUrl: "<YOUR_IMAGE_URL>",
  // Or use queryMediaFile: fs.createReadStream("<PATH_TO_IMAGE_FILE>") for a local file.
  // Or use queryMediaUrls: ["<URL_1>", "<URL_2>"] for multiple URLs.
  // Or use queryMediaFiles: [fs.createReadStream("<FILE_1>"), fs.createReadStream("<FILE_2>")] for multiple local files.
  searchOptions: ["visual"]
});
let resultIndex = 0;
for await (const clip of searchResults) {
  resultIndex++;
  console.log(`Result ${resultIndex}: videoId=${clip.videoId} rank=${clip.rank} start=${clip.start}s end=${clip.end}s`);
}
```

The response is similar to that received when using text queries.

**Composed queries**

Combine up to 10 images with text to narrow results. For example, provide an image of a car and add "red color" to find only red instances of that vehicle.

To perform a composed query, call the `client.search.query` method with the following parameters:

- **`queryMediaFile`**, **`queryMediaUrl`**, **`queryMediaFiles`**, or **`queryMediaUrls`**: The image or images to use as a query (up to 10 total). Provide at least one of the following:
  - _(Optional)_ **`queryMediaFile`**: A readable stream. Use `fs.createReadStream("<PATH>")` to open a local file.
  - _(Optional)_ **`queryMediaUrl`**: The publicly accessible URL of your image file.
  - _(Optional)_ **`queryMediaFiles`**: A list of readable streams.
  - _(Optional)_ **`queryMediaUrls`**: A list of publicly accessible URLs.
- **`queryText`**: Text that refines the image query.

```js
// import * as fs from "fs";

const searchResults = await client.search.query({
  indexId: index.id,
  queryMediaType: "image",
  queryMediaUrl: "<YOUR_IMAGE_URL>",
  // Or use queryMediaFile: fs.createReadStream("<PATH_TO_IMAGE_FILE>") for a local file.
  // Or use queryMediaUrls: ["<URL_1>", "<URL_2>"] for multiple URLs.
  // Or use queryMediaFiles: [fs.createReadStream("<FILE_1>"), fs.createReadStream("<FILE_2>")] for multiple local files.
  queryText: "<YOUR_QUERY>",
  searchOptions: ["visual"]
});
let resultIndex = 0;
for await (const clip of searchResults) {
  resultIndex++;
  console.log(`Result ${resultIndex}: videoId=${clip.videoId} rank=${clip.rank} start=${clip.start}s end=${clip.end}s`);
}
```

The response is similar to that received when using text queries.

### Analyze videos

The platform uses a multimodal approach to analyze video content, processing visuals, sounds, spoken words, and on-screen text. Use a custom prompt to generate summaries, extract insights, answer questions, or produce structured output.

Note the following about using these methods:

- The Pegasus model must be enabled for the index.
- Your prompts can be instructive or descriptive, or you can phrase them as questions.
- The maximum length of a prompt is 2,000 tokens.

**Streaming responses**

Streaming delivers text fragments in real-time. Use it for live transcription or when you need immediate output.

To analyze a video with streaming responses, call the `client.analyzeStream` method with the following parameters:

- **`videoId`**: The unique identifier of the indexed asset.
- **`prompt`**: Guides text generation, and it can be instructive, descriptive, or a question. The maximum length is 2,000 tokens.

```js
const textStream = await client.analyzeStream({
  videoId: indexedAsset.id,
  prompt: "<YOUR_PROMPT>"
});
for await (const text of textStream) {
  if ("text" in text) {
    console.log(text.text);
  }
}
```

The `client.analyzeStream` method returns an async iterable of objects. Filter for items that contain the `text` field to get the generated text fragments.

**Non-streaming responses**

Non-streaming returns the complete text in a single response. Use it for reports or summaries where you need the full result at once. Call the `client.analyze` method with the same parameters as `client.analyzeStream`.

```js
const result = await client.analyze({
  videoId: indexedAsset.id,
  prompt: "<YOUR_PROMPT>"
});
console.log(result.data);
```

The `client.analyze` method returns an object where the `data` field contains the complete generated text string (up to 4,096 tokens).

For the complete guide, see the [Analyze videos](https://docs.twelvelabs.io/docs/guides/analyze-videos) page.

## Error Handling

The SDK includes a set of exceptions that are mapped to specific HTTP status codes, as shown in the table below:

| Exception                | HTTP Status Code |
| ------------------------ | ---------------- |
| BadRequestError          | 400              |
| AuthenticationError      | 401              |
| PermissionDeniedError    | 403              |
| NotFoundError            | 404              |
| ConflictError            | 409              |
| UnprocessableEntityError | 422              |
| RateLimitError           | 429              |
| InternalServerError      | 5xx              |

The following example shows how you can handle specific HTTP errors in your application:

```js
import { TwelveLabs, TwelvelabsApi } from "twelvelabs-js";

const client = new TwelveLabs({ apiKey: process.env.TWELVELABS_API_KEY });
try {
  const indexes = await client.indexes.list();
  console.log(indexes);
} catch (e) {
  if (e instanceof TwelvelabsApi.BadRequestError) {
    console.log("Bad request.");
  } else if (e instanceof TwelvelabsApi.NotFoundError) {
    console.log("Not found.");
  } else {
    console.log(`An error occurred: ${e}`);
  }
}
```

## Contributing

This repository contains code that has been automatically generated from an OpenAPI specification. We are unable to merge direct code contributions to the SDK because the code generation tool overwrites manual changes with each new release.

To contribute, follow these steps:

1. Open an issue to discuss your proposed changes with our team.
2. If you would like to submit a proof of concept, create a pull request. We will review your pull request, but we cannot merge it.
3. We will transfer any approved changes to the repository where the code generation tool operates.

We welcome contributions to the README file. You can submit pull requests directly.
