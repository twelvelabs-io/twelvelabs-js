# TwelveLabs JavaScript SDK

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2Ffern-demo%2Ftwelve-labs-js)
[![NPM version](https://img.shields.io/npm/v/twelvelabs-js.svg)](https://npmjs.org/package/twelvelabs-js)
![NPM Downloads](https://img.shields.io/npm/dy/twelvelabs-js)

> **NOTE**: This version includes breaking changes compared to the 0.4.x version. To use it in your application, you must update your code and thoroughly test the changes to ensure everything functions as expected before deploying it to production environments. If you want to use the legacy version, please refer to the [0.4 folder](./0.4).

This SDK provides a convenient way to interact with the Twelve Labs Video Understanding Platform from an application written in JavaScript or TypeScript language. The SDK equips you with a set of intuitive methods that streamline the process of interacting with the platform, minimizing the need for boilerplate code.

# Prerequisites

Ensure that the following prerequisites are met before using the SDK:

- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh) must be installed on your machine.
- You have an API key. If you don't have an account, please [sign up](https://playground.twelvelabs.io/) for a free account. Then, to retrieve your API key, go to the [API Key](https://playground.twelvelabs.io/dashboard/api-key) page, and select the **Copy** icon to the right of the key to copy it to your clipboard.

# Install the SDK

Install the pre-release version of the `twelvelabs-js` package:

```sh
yarn add twelvelabs-js # or npm install twelvelabs-js
```

# Initialize the SDK

1. Import the "twelvelabs-js" package into your application:

```js
import { TwelveLabs } from "twelvelabs-js";
```

1. Instantiate the SDK client with your API key:

```js
const client = new TwelveLabs({ apiKey: "<YOUR_API_KEY>" });
```

# Use the SDK

To get started with the SDK, follow these basic steps:

1. Create an index.
2. Upload videos.
3. Perform downstream tasks, such as searching or analyzing videos to generate text based on their content.

## Create an index

To create an index, use the example code below, replacing "<YOUR_INDEX_NAME>" with the desired name for your index:

```js
let index = await client.indexes.create({
    indexName: "<YOUR_INDEX_NAME>",
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
});

console.log(`Created index: id=${index.id} name=${index.name}`);
```

Note the following about this example:

- The platform provides two distinct models, each serving unique purposes in multimodal video understanding.
  - **Marengo**: An embedding model that analyzes multiple modalities in video content, including visuals, audio, and text, to provide a holistic understanding similar to human comprehension. Key use cases include searching using image or natural-language queries and creating embeddings for various downstream applications. The current version is Marengo 3.0.
  - **Pegasus**: A generative model that analyzes multiple modalities to generate contextually relevant text based on the content of your videos. Key use cases include content summarization and timestamp identification. The current version is Pegasus 1.2.
    This example enables both Marengo and Pegasus.
- The `models.options` fields specify the modalities each video understanding model will process.
- The models and the model options specified when you create an index apply to all the videos you upload to that index and cannot be changed.

Note that the platform returns, among other information, a field named `id`, representing the unique identifier of your new index.

For a description of each field in the request and response, see the [Create an index](https://docs.twelvelabs.io/v1.3/sdk-reference/node-js/manage-indexes#create-an-index) section.

## Upload videos

Before you upload a video to the platform, ensure that it meets the following requirements:

- **Video resolution**: The shorter side (width or height) must be at least 360 pixels and must not exceed 2160 pixels.
- **Aspect ratio**: Must be one of the following (including both landscape and portrait variants): 1:1, 4:3, 4:5, 5:4, 16:9, 9:16, or 17:9.
- **Video and audio formats**: The video files you wish to upload must be encoded in the video and audio formats listed on the [FFmpeg Formats Documentation](https://ffmpeg.org/ffmpeg-formats.html) page. For videos in other formats, contact us at [support@twelvelabs.io](mailto:support@twelvelabs.io).
- **Duration**: For Marengo, it must be between 4 seconds and 4 hours (14,400s). For Pegasus, it must be between 4 seconds and 1 hour (3,600s).
- **File size**: For Marengo, up to 4 GB is supported. For Pegasus, up to 2 GB is supported.

To upload videos, use the example code below, replacing the following:

- **`<YOUR_VIDEO_PATH>`**: with a string representing the path to the directory containing the video files you wish to upload.
- **`<YOUR_INDEX_ID>`**: with a string representing the unique identifier of the index to which you want to upload your video.

```js
import { promises as fsPromises } from "fs";
import * as path from "path";
import * as fs from "fs";

const files = await fsPromises.readdir("<YOUR_VIDEO_PATH>");
for (const file of files) {
    const filePath = path.join("<YOUR_VIDEO_PATH>", file);
    console.log(`Uploading ${filePath}`);
    const task = await client.tasks.create({
        indexId: "<YOUR_INDEX_ID>",
        videoFile: fs.createReadStream(filePath),
    });
    console.log(`Created task: id=${task.id}`);
    const completedTask = await client.tasks.waitForDone(task.id, {
        callback: (task) => {
            console.log(`  Status=${task.status}`);
        },
    });
    if (completedTask.status !== "ready") {
        throw new Error(`Indexing failed with status ${completedTask.status}`);
    }
    console.log(`Uploaded ${filePath}. The unique identifier of your video is ${completedTask.videoId}`);
}
```

For a description of each field in the request and response, see the [Create a video indexing task](https://docs.twelvelabs.io/v1.3/sdk-reference/node-js/upload-videos#create-a-video-indexing-task) section.

## Perform downstream tasks

The sections below show how you can perform the most common downstream tasks. See [our documentation](https://docs.twelvelabs.io/docs) for a complete list of all the features the Twelve Labs Understanding Platform provides.

### Search

To search for relevant video content, you can use either text or images as queries:

- **Text queries**: Use natural language to find video segments matching specific keywords or phrases.
- **Image queries**: Use images to find video segments that are semantically similar to the provided images.

**Search using text queries**

To perform search requests using text queries, use the example code below, replacing the following:

- **`<YOUR_INDEX_ID>`**: with a string representing the unique identifier of your index.
- **`<YOUR_QUERY>`**: with a string representing your search query. Note that the API supports full natural language-based search. The following examples are valid queries: "birds flying near a castle," "sun shining on water," and "an officer holding a child's hand."
- **`[<YOUR_SEARCH_OPTIONS>]`**: with an array of strings that specifies the sources of information the platform uses when performing a search. For example, to search based on visual and audio cues, use `["visual", "audio"]`. Note that the search options you specify must be a subset of the model options used when you created the index. For more details, see the [Search options](https://docs.twelvelabs.io/v1.3/docs/concepts/modalities#search-options) section.

```js
let searchResults = await client.search.query({
    indexId: "<YOUR_INDEX_ID>",
    queryText: "<YOUR_QUERY>",
    searchOptions: ["<YOUR_SEARCH_OPTIONS>"],
});

for await (const clip of searchResults) {
    console.log(
        `video_id=${clip.videoId} score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`,
    );
}
```

Note that the response contains, among other information, the following fields:

- `videoId`: The unique identifier of the video that matched your search terms.
- `score`: A quantitative value determined by the AI model representing the level of confidence that the results match your search terms.
- `start`: The start time of the matching video clip, expressed in seconds.
- `end`: The end time of the matching video clip, expressed in seconds.
- `confidence`: A qualitative indicator based on the value of the score field. This field can take one of the following values:
    - `high`
    - `medium`
    - `low`

  **Note:** The `confidence` field is deprecated for indexes created with the Marengo 3.0 model.
- `rank`: Indicates the rank of the matched clip based on search relevance. 

For a description of each field in the request and response, see the [Make a search request](https://docs.twelvelabs.io/v1.3/sdk-reference/node-js/search#make-a-search-request) page.

**Search using image queries**

You can provide images as local files or publicly accessible URLs. Use the `queryMediaFile` parameter for local image files and the `queryMediaUrl` parameter for publicly accessible URLs.

To perform a search request using image queries, use the example code below, replacing the following:

- **`<YOUR_INDEX_ID>`**: with a string representing the unique identifier of your index.
- **`<YOUR_FILE_PATH>`**: with a string representing the path of the image file you wish to provide.
- **`[<YOUR_SEARCH_OPTIONS>]`**: with an array of strings that specifies the sources of information the platform uses when performing a search. For example, to search based on visual cues, use `["visual"]`. Note that the search options you specify must be a subset of the model options used when you created the index. For more details, see the [Search options](https://docs.twelvelabs.io/v1.3/docs/concepts/modalities#search-options) section.

```js
let searchResults = await client.search.query({
    indexId: "<YOUR_INDEX_ID>",
    queryMediaType: "image",
    queryMediaFile: "<YOUR_FILE_PATH>", # Use queryMediaUrl instead to provide a file from a publicly accessible URL.
    searchOptions: ["visual"],
});
```

The response is similar to that received when using text queries.

### Analyze videos

The Twelve Labs Video Understanding Platform offers three distinct endpoints tailored to meet various requirements. Each endpoint has been designed with specific levels of flexibility and customization to accommodate different needs.

Note the following about using these endpoints:

- The Pegasus video understanding model must be enabled for the index to which your video has been uploaded.
- Your prompts must be instructive or descriptive, and you can also phrase them as questions.
- The maximum length of a prompt is 2000 tokens.

#### Titles, topics, and hashtags

To analyze videos and generate titles, topics, and hashtags use the example code below, replacing the following:

- **`<YOUR_VIDEO_ID>`**: with a string representing the unique identifier of your video.

```js
const gist = await client.gist(task.videoId, ["title", "topic", "hashtag"]);
console.log(`Title: ${gist.title}\nTopics=${gist.topics}\nHashtags=${gist.hashtags}`);
```

#### Summaries, chapters, and highlights

To generate summaries, chapters, and highlights, use the example code below, replacing the following:

- **`<YOUR_VIDEO_ID>`**: with a string representing the unique identifier of your video.
- **`<TYPE>`**: with a string representing the type of text the platform should generate. This parameter can take one of the following values: "summary", "chapter", or "highlight".
- _(Optional)_ **`<YOUR_PROMPT>`**: with a string that provides context for the summarization task, such as the target audience, style, tone of voice, and purpose. Example: "Generate a summary in no more than 5 bullet points."

```js
const summaryResponse = await client.summarize({
    videoId: "<YOUR_VIDEO_ID>",
    type: "<TYPE>",
    prompt: "<YOUR_PROMPT>", // Optional
});

if (summaryResponse.summarizeType === "summary") {
    console.log(`Summary: ${summaryResponse.summary}`);
} else if (summaryResponse.summarizeType === "chapter") {
    for (const chapter of summaryResponse.chapters) {
        console.log(`Chapter: ${chapter.chapterNumber} - ${chapter.chapterTitle}`);
    }
} else if (summaryResponse.summarizeType === "highlight") {
    for (const highlight of summaryResponse.highlights) {
        console.log(`Highlight: ${highlight.highlight}`);
    }
}
```

For a description of each field in the request and response, see the [Summaries, chapters, or highlights](https://docs.twelvelabs.io/v1.3/sdk-reference/node-js/analyze-videos#summaries-chapters-and-highlights) page.

#### Open-ended analysis

To perform open-ended analysis and generate tailored text outputs based on your prompts, use the example code below, replacing the following:

- **`<YOUR_VIDEO_ID>`**: with a string representing the unique identifier of your video.
- **`<YOUR_PROMPT>`**: with a string that guides the model on the desired format or content. The maximum length of the prompt is 2000 tokens. Example: "I want to generate a description for my video with the following format: Title of the video, followed by a summary in 2-3 sentences, highlighting the main topic, key events, and concluding remarks."

```js
const analysis = await client.analyze({
    videoId: "<YOUR_VIDEO_ID>",
    prompt: "<YOUR_PROMPT>",
});
console.log(`Open-ended analysis: ${analysis.data}`);
```

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
try {
    let index = await client.indexes.create({
        indexName: "<YOUR_INDEX_NAME>",
        models: [
            {
                modelName: "marengo3.0",
                modelOptions: ["visual", "audio"],
            },
        ],
    });
    console.log(`Created index: id=${index.id} name=${index.indexName} models=${JSON.stringify(index.models)}`);
} catch (e) {
    console.log(e);
}
```

## Contributing

This repository contains code that has been automatically generated from an OpenAPI specification. We are unable to merge direct code contributions to the SDK because the code generation tool overwrites manual changes with each new release.

To contribute, follow these steps:

1. Open an issue to discuss your proposed changes with our team.
2. If you would like to submit a proof of concept, create a pull request. We will review your pull request, but we cannot merge it.
3. We will transfer any approved changes to the repository where the code generation tool operates.

We welcome contributions to the README file. You can submit pull requests directly.
