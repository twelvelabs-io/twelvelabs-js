import { APIClient } from './core';
import * as Resources from './resources';
import { BASE_URL, DEFAULT_API_VERSION } from './constants';

export interface ClientOptions {
  apiKey: string;
  version?: 'v1.1' | 'v1.2';
}

export class TwelveLabs extends APIClient {
  engine: Resources.Engine;
  index: Resources.Index;
  task: Resources.Task;
  search: Resources.Search;
  classify: Resources.Classify;
  generate: Resources.Generate;
  embed: Resources.Embed;

  baseUrl: string;
  apiKey: string;

  constructor({ apiKey, version = DEFAULT_API_VERSION }: ClientOptions) {
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

    this.engine = new Resources.Engine(this);
    this.index = new Resources.Index(this);
    this.task = new Resources.Task(this);
    this.search = new Resources.Search(this);
    this.classify = new Resources.Classify(this);
    this.generate = new Resources.Generate(this);
    this.embed = new Resources.Embed(this);
  }
}

export {
  Engine,
  Index,
  IndexListWithPagination,
  Video,
  VideoListWithPagination,
  Task,
  TaskListWithPagination,
  TransferImportResponse,
  TransferImportStatusResponse,
  TransferImportLog,
  TaskStatus,
  SearchResult,
  SearchData,
  GroupByVideoSearchData,
  GenerateGistResult,
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
  VideoFilterOptions,
  GenerateGistType,
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
