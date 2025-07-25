import { APIClient } from './core';
import * as Resources from './resources';
import { BASE_URL, LATEST_API_VERSION } from './constants';
import { RequestOptions } from './core';
import * as Models from './models';
import { convertKeysToSnakeCase, removeUndefinedValues, trackStream } from './util';

export interface ClientOptions {
  apiKey: string;
  version?: 'v1.1' | 'v1.2' | 'v1.3';
}

export class TwelveLabs extends APIClient {
  index: Resources.Index;
  task: Resources.Task;
  search: Resources.Search;
  private _generate: Resources.Generate;
  embed: Resources.Embed;

  baseUrl: string;
  apiKey: string;

  constructor({ apiKey, version = LATEST_API_VERSION }: ClientOptions) {
    if (version !== LATEST_API_VERSION) {
      throw new Error(
        `[Warning] You manually set the API version to ${version}, but this SDK version is not fully compatible with current API version, please use version 0.3.x or earlier`,
      );
    }
    if (!apiKey) {
      throw new Error(
        'Provide `apiKey` to initialize a client. You can see the API Key in the Dashboard page: https://dashboard.playground.io',
      );
    }

    const customBaseUrl = process.env.TWELVELABS_BASE_URL;
    const baseUrl = `${customBaseUrl || BASE_URL}/${version}/`;

    super({ baseUrl, apiKey });

    this.baseUrl = baseUrl;
    this.apiKey = apiKey;

    this.index = new Resources.Index(this);
    this.task = new Resources.Task(this);
    this.search = new Resources.Search(this);
    this._generate = new Resources.Generate(this);
    this.embed = new Resources.Embed(this);
  }

  /**
   * @deprecated The `generate` property is deprecated. Use the flattened methods directly on the client: `client.summarize()`, `client.gist()`, `client.analyze()`, `client.analyzeStream()` instead.
   */
  get generate(): Resources.Generate {
    console.warn(
      '[Deprecation Warning] The `generate` property is deprecated. Use the flattened methods directly on the client: `client.summarize()`, `client.gist()`, `client.analyze()`, `client.analyzeStream()` instead.',
    );
    return this._generate;
  }

  async summarize(
    videoId: string,
    type: Resources.GenerateSummarizeType,
    prompt?: string,
    temperature?: number,
    options: RequestOptions = {},
  ): Promise<Models.GenerateSummarizeResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      type,
      prompt,
      temperature,
    });
    const res = await this._post<Models.GenerateSummarizeResult>(
      'summarize',
      removeUndefinedValues(_body),
      options,
    );
    return res;
  }

  async gist(
    videoId: string,
    types: Resources.GenerateGistType[],
    options: RequestOptions = {},
  ): Promise<Models.GenerateGistResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      types,
    });
    const res = await this._post<Models.GenerateGistResult>('gist', _body, options);
    return res;
  }

  async analyze(
    videoId: string,
    prompt: string,
    temperature?: number,
    options: RequestOptions = {},
  ): Promise<Models.GenerateOpenEndedTextResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      prompt,
      temperature,
      stream: false,
    });
    const res = await this._post<Models.GenerateOpenEndedTextResult>(
      'analyze',
      removeUndefinedValues(_body),
      options,
    );
    return res;
  }

  async analyzeStream(
    { videoId, prompt, temperature }: Resources.GenerateTextStreamParams,
    options: RequestOptions = {},
  ): Promise<Models.GenerateTextStreamResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      prompt,
      temperature,
      stream: true,
    });
    const res = await this._post<AsyncIterable<Uint8Array>>('analyze', removeUndefinedValues(_body), options);
    return new Models.GenerateTextStreamResult(trackStream(res));
  }
}

export {
  Index,
  IndexListWithPagination,
  Video,
  VideoListWithPagination,
  Task,
  TaskListWithPagination,
  TransferImportResponse,
  TransferImportStatusResponse,
  TransferImportLog,
  SearchResult,
  SearchData,
  GroupByVideoSearchData,
  GenerateSummarizeResult,
  GenerateGistResult,
  GenerateOpenEndedTextResult,
  GenerateTextStreamResult,
  EmbeddingsTask,
  EmbeddingsTaskListWithPagination,
  EmbeddingsTaskStatus,
  CreateEmbeddingsResult,
  Embedding,
  SegmentEmbedding,
  PageInfo,
} from './models';

export {
  CreateIndexParams,
  CreateTaskParams,
  ListIndexParams,
  ListTaskParams,
  RetrieveVideoParams,
  ListVideoParams,
  SearchOptions,
  UpdateVideoParams,
  GenerateSummarizeType,
  GenerateGistType,
  GenerateTextStreamParams,
  CreateEmbedParams,
  CreateEmbeddingsTaskVideoParams,
  ListEmbeddingsTaskParams,
} from './resources';

export {
  TwelveLabsError,
  APIConnectionError,
  APITimeoutError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  MethodNotAllowedError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
  InternalServerError,
} from './error';
