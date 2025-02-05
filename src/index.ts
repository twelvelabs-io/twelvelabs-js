import { APIClient } from './core';
import * as Resources from './resources';
import { BASE_URL, LATEST_API_VERSION } from './constants';

export interface ClientOptions {
  apiKey: string;
  version?: 'v1.1' | 'v1.2' | 'v1.3';
}

export class TwelveLabs extends APIClient {
  index: Resources.Index;
  task: Resources.Task;
  search: Resources.Search;
  generate: Resources.Generate;
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
    this.generate = new Resources.Generate(this);
    this.embed = new Resources.Embed(this);
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
  GenerateOpenEndedTextResult,
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
