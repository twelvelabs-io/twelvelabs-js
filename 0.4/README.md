# TwelveLabs JavaScript Legacy SDK

[![NPM version](https://img.shields.io/npm/v/twelvelabs-js.svg)](https://npmjs.org/package/twelvelabs-js)

> **NOTE**: This is the legacy version (0.4.x) of the SDK. Version 1.0.0 introduces an SDK that is automatically generated based on our API specification and includes breaking changes, and TwelveLabs will no longer maintain versions up to 0.4.x.

This SDK provides a convenient way to interact with the Twelve Labs Video Understanding Platform from an application written in JavaScript or TypeScript language. The SDK equips you with a set of intuitive methods that streamline the process of interacting with the platform, minimizing the need for boilerplate code.

# Prerequisites

Ensure that the following prerequisites are met before using the SDK:

- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh) must be installed on your machine.
- You have an API key. If you don't have an account, please [sign up](https://playground.twelvelabs.io/) for a free account. Then, to retrieve your API key, go to the [API Key](https://playground.twelvelabs.io/dashboard/api-key) page, and select the **Copy** icon to the right of the key to copy it to your clipboard.

# Install the SDK

Install the `twelvelabs-js` package:

```sh
yarn add twelvelabs-js@0.4.12 # or npm i twelvelabs-js@0.4.12
```

The current SDK version is compatible with API version 1.3.

# Initialize the SDK

1. Import the required packages into your application:

```js
import { TwelveLabs, SearchData, Task } from 'twelvelabs-js';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
```

2. Instantiate the SDK client with your API key. This example code assumes that your API key is stored in an environment variable named `TL_API_KEY`:

```js
const client = new TwelveLabs({ apiKey: '<YOUR_API_KEY>' });
```

# Use the SDK

To get started with the SDK, follow these basic steps:

1. Create an index.
2. Upload videos.
3. Perform downstream tasks, such as searching or generating text from video.

## Create an index

To create an index, use the example code below, replacing '<YOUR_INDEX_NAME>' with the desired name for your index:

```js
let index = await client.index.create({
  name: '<YOUR_INDEX_NAME>',
  models: [
    {
      name: 'marengo2.7',
      options: ['visual', 'audio'],
    },
    {
      name: 'pegasus1.2',
      options: ['visual', 'audio'],
    },
  ],
});

console.log(`Created index: id=${index.id} name=${index.name} models=${JSON.stringify(index.models)}`);
```

Note the following about this example:

- The platform provides two distinct model types - embedding and generative, each serving unique purposes in multimodal video understanding.
  - **Embedding models (Marengo)**: These models are proficient at performing tasks such as search and classification, enabling enhanced video understanding.
  - **Generative models (Pegasus)**: These models generate text based on your videos.
    For your index, both Marengo and Pegasus are enabled.
- The `models.options` fields specify the types of information each video understanding model will process. For details, see the [model options](https://docs.twelvelabs.io/v1.3/docs/model-options) page.
- The models and the model options specified when you create an index apply to all the videos you upload to that index and cannot be changed. For details, see the [model options](https://docs.twelvelabs.io/v1.3/docs/model-options) page.

The output should look similar to the following:

```
Created index: id=65e71802bb29f13bdd6f38d8 name=2024-03-05T13:02:57.938Z models=[{"name":"pegasus1.2","options":["visual","audio"]},{"name":"marengo2.7","options":["visual","audio"]}]
```

Note that the API returns, among other information, a field named `id`, representing the unique identifier of your new index.

For a description of each field in the request and response, see the [Create an index](https://docs.twelvelabs.io/v1.3/reference/create-index) page.

## Upload videos

Before you upload a video to the platform, ensure that it meets the following requirements:

- **Video resolution**: Must be at least 480x360 or 360x480, and not exceed 4K (3840x2160).
- **Video and audio formats**: The video files you wish to upload must be encoded in the video and audio formats listed on the [FFmpeg Formats Documentation](https://ffmpeg.org/ffmpeg-formats.html) page. For videos in other formats, contact us at [support@twelvelabs.io](mailto:support@twelvelabs.io).
- **Duration**: For Marengo, it must be between 4 seconds and 2 hours (7,200s). For Pegasus, it must be between 4 seconds and 1 hour (3,600s).
- **File size**: Must not exceed 2 GB. If you require different options, send us an email at support@twelvelabs.io.
- **Audio track**: If the `audio` [model option](https://docs.twelvelabs.io/v1.3/docs/model-options) is selected, the video you're uploading must contain an audio track.

To upload videos, use the example code below, replacing the following:

- **`<YOUR_VIDEO_PATH>`**: with a string representing the path to the directory containing the video files you wish to upload.
- **`<YOUR_INDEX_ID>`**: with a string representing the unique identifier of the index to which you want to upload your video.

```js
const files = await fsPromises.readdir('YOUR_VIDEO_PATH');
for (const file of files) {
  const filePath = path.join(__dirname, file);
  console.log(`Uploading ${filePath}`);
  const task = await client.task.create({
    indexId: '<YOUR_INDEX_ID>'
    file: filePath,
  });
  console.log(`Created task: id=${task.id}`);
  await task.waitForDone(50, (task: Task) => {
    console.log(`  Status=${task.status}`);
  });
  if (task.status !== 'ready') {
    throw new Error(`Indexing failed with status ${task.status}`);
  }
  console.log(`Uploaded ${videoPath}. The unique identifer of your video is ${task.videoId}`);
}
```

Note that once a video has been successfully uploaded and indexed, the response will contain a field named `videoId`, representing the unique identifier of your video.

For a description of each field in the request and response, see the [Create a video indexing task](https://docs.twelvelabs.io/reference/create-video-indexing-task) page.

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
- **`[<YOUR_SEARCH_OPTIONS>]`**: with an array of strings that specifies the sources of information the platform uses when performing a search. For example, to search based on visual and audio cues, use `["visual", "audio"]`. Note that the search options you specify must be a subset of the model options used when you created the index. For more details, see the [Search options](https://docs.twelvelabs.io/docs/search-options) page.

```js
let searchResults = await client.search.query({
  indexId: '<YOUR_INDEX_ID>'
  queryText: '<YOUR_QUERY>',
  options: ['<YOUR_SEARCH_OPTIONS>'],
});
printPage(searchResults.data);
while (true) {
  const page = await searchResults.next();
  if (page === null) break;
  else printPage(page);
}

// Utility function to print a specific page
function printPage(searchData) {
  (searchData as SearchData[]).forEach((clip) => {
    console.log(
      `video_id= ${clip.videoId} score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`,
    );
  });
}
```

The results are returned one page at a time, with a default limit of 10 results on each page. The `next` method returns the next page of results. When you've reached the end of the dataset, the response is `null`.

```
 video_id=65ca2bce48db9fa780cb3fa4 score=84.9 start=104.9375 end=111.90625 confidence=high
 video_id=65ca2bce48db9fa780cb3fa4 score=84.82 start=160.46875 end=172.75 confidence=high
 video_id=65ca2bce48db9fa780cb3fa4 score=84.77 start=55.375 end=72.46875 confidence=high
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

For a description of each field in the request and response, see the [Make a search request](https://docs.twelvelabs.io/v1.3/reference/make-search-request) page.

**Search using image queries**

You can provide images as local files or publicly accessible URLs. Use the `queryMediaFile` parameter for local image files and the `queryMediaUrl` parameter for publicly accessible URLs.

To perform a search request using image queries, use the example code below, replacing the following:

- **`<YOUR_INDEX_ID>`**: with a string representing the unique identifier of your index.
- **`<YOUR_FILE_PATH>`**: with a string representing the path of the image file you wish to provide.
- **`[<YOUR_SEARCH_OPTIONS>]`**: with an array of strings that specifies the sources of information the platform uses when performing a search. For example, to search based on visual cues, use `["visual"]`. Note that the search options you specify must be a subset of the model options used when you created the index. For more details, see the [Search options](https://docs.twelvelabs.io/docs/search-options) page.

```js
let searchResults = await client.search.query({
  indexId: '<YOUR_INDEX_ID>',
  queryMediaType: 'image',
  queryMediaFile: '<YOUR_FILE_PATH>', // Use queryMediaUrl instead to provide a file from a publicly accessible URL.
  options: ['visual'],
});
```

The response is similar to that received when using text queries.

### Analyze videos

>**NOTE**: The Generate API has been renamed to the Analyze API to more accurately reflect its purpose of analyzing videos to generate text. This update includes changes to specific SDK methods, outlined below. You can continue using the Generate API until July 30, 2025. After this date, the Generate API will be deprecated, and you must transition to the Analyze API.
>
>The `generate` prefix has been removed from method names, and the following methods have been renamed as follows:
>
>- `generate.gist` is now `gist`
>- `generate.summarize` is now `summarize`
>- `generate.text` is now `analyze`
>- `generate.textStream` is now `analyzeStream`
>
>To maintain compatibility, update your applications to use the new names before July 30, 2025.


The Twelve Labs Video Understanding Platform offers three distinct endpoints tailored to meet various requirements. Each endpoint has been designed with specific levels of flexibility and customization to accommodate different needs.

Note the following about using these endpoints:

- The Pegasus video understanding model must be enabled for the index to which your video has been uploaded.
- Your prompts must be instructive or descriptive, and you can also phrase them as questions.
- The maximum length of a prompt is 2,000 tokens.

#### Titles, topics, and hashtags

To analyze videos and generate titles, topics, and hashtags use the example code below, replacing the following:

- **`<YOUR_VIDEO_ID>`**: with a string representing the unique identifier of your video.

```js
const res = await client.gist("<YOUR_VIDEO_ID>", ["title", "topic","hashtag"]);
console.log(`Title: ${res.title}\nTopics=${res.topics}\nHashtags=${res.hashtags}`);
```

#### Summaries, chapters, and highlights

To analyze videos and generate summaries, chapters, and highlights, use the example code below, replacing the following:

- **`<YOUR_VIDEO_ID>`**: with a string representing the unique identifier of your video.
- **`<TYPE>`**: with a string representing the type of text the platform should generate. This parameter can take one of the following values: "summary", "chapter", or "highlight".
- _(Optional)_ **`<YOUR_PROMPT>`**: with a string that provides context for the summarization task, such as the target audience, style, tone of voice, and purpose. Example: "Generate a summary in no more than 5 bullet points."

```js
const summary = await client.summarize('<YOUR_VIDEO_ID>', '<TYPE>');
console.log(`Summary: ${summary.summary}`);
```

For a description of each field in the request and response, see the [Summaries, chapters, or highlights](https://docs.twelvelabs.io/v1.3/api-reference/analyze-videos/summarize) page.

#### Open-ended analysis

To perform open-ended analysis and generate tailored text outputs based on your prompts, use the example code below, replacing the following:

- **`<YOUR_VIDEO_ID>`**: with a string representing the unique identifier of your video.
- **`<YOUR_PROMPT>`**: with a string that guides the model on the desired format or content. The maximum length of the prompt is 2,000 tokens. Example: "I want to generate a description for my video with the following format: Title of the video, followed by a summary in 2-3 sentences, highlighting the main topic, key events, and concluding remarks."

```js
const analysis = await client.analyze('<YOUR_VIDEO_ID>', '<YOUR_PROMPT>');
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
  let index = await client.index.create({
    name: '<YOUR_INDEX_NAME>',
    models: [
      {
        name: 'marengo2.7',
        options: ['visual', 'audio'],
      },
    ],
  });
  console.log(`Created index: id=${index.id} name=${index.name} models=${JSON.stringify(index.models)}`);
} catch (e) {
  console.log(e);
}
```

# License

We use the Developer Certificate of Origin (DCO) in lieu of a Contributor License Agreement for all contributions to Twelve Labs' open-source projects. We request that contributors agree to the terms of the DCO and indicate that agreement by signing all commits made to Twelve Labs' projects by adding a line with your name and email address to every Git commit message contributed, as shown in the example below:

```
Signed-off-by: Jane Doe <jane.doe@example.com>
```

You can sign your commit automatically with Git by using `git commit -s` if you have your `user.name` and `user.email` set as part of your Git configuration.
We ask that you use your real name (please, no anonymous contributions or pseudonyms). By signing your commitment, you are certifying that you have the right have the right to submit it under the open-source license used by that particular project. You must use your real name (no pseudonyms or anonymous contributions are allowed.)
We use the Probot DCO GitHub app to check for DCO signoffs of every commit.
If you forget to sign your commits, the DCO bot will remind you and give you detailed instructions for how to amend your commits to add a signature.
