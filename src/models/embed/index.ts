import { RequestOptions } from '../../core';
import * as Resources from '../../resources';
import { PageInfo } from '../interfaces';

export interface EmbeddingMediaMetadata {
  inputUrl?: string;
  inputFilename?: string;
}

export interface Embedding {
  float?: number[];
  isSuccess: boolean;
  errorMessage?: string;
  metadata?: EmbeddingMediaMetadata;
}

export interface SegmentEmbedding {
  float?: number[];
  startOffsetSec: number;
  endOffsetSec?: number;
  embeddingScope?: string;
}

export interface AudioEmbedding {
  segments?: SegmentEmbedding[];
  isSuccess: boolean;
  errorMessage?: string;
  metadata?: EmbeddingMediaMetadata;
}

export interface CreateEmbeddingsResultResponse {
  engineName: string;
  textEmbedding?: Embedding;
  imageEmbedding?: Embedding;
  videoEmbedding?: Embedding;
  audioEmbedding?: AudioEmbedding;
}

export class CreateEmbeddingsResult {
  engineName: string;
  textEmbedding?: Embedding;
  imageEmbedding?: Embedding;
  videoEmbedding?: Embedding;
  audioEmbedding?: AudioEmbedding;

  constructor(data: CreateEmbeddingsResultResponse) {
    this.engineName = data.engineName;
    this.textEmbedding = data.textEmbedding;
    this.imageEmbedding = data.imageEmbedding;
    this.videoEmbedding = data.videoEmbedding;
    this.audioEmbedding = data.audioEmbedding;
  }
}

export interface EmbeddingMetadata {
  url?: string;
  filename?: string;
  videoClipLength?: number;
  videoEmbeddingScope?: string[];
  duration?: number;
}

export interface EmbeddingsTaskStatusResponse {
  id: string;
  engineName: string;
  status: string;
  metadata?: EmbeddingMetadata;
}

export class EmbeddingsTaskStatus {
  id: string;
  engineName: string;
  status: string;
  metadata?: EmbeddingMetadata;

  constructor(data: EmbeddingsTaskStatusResponse) {
    this.id = data.id;
    this.engineName = data.engineName;
    this.status = data.status;
    this.metadata = data.metadata;
  }
}

export interface VideoEmbedding {
  startOffsetSec: number;
  endOffsetSec: number;
  embeddingScope: string;
  embedding: Embedding;
}

export interface EmbeddingsTaskResponse {
  id: string;
  engineName: string;
  status: string;
  videoEmbeddings?: VideoEmbedding[];
  createdAt?: string;
  metadata?: EmbeddingMetadata;
}

export class EmbeddingsTask {
  private readonly _resource: Resources.EmbedTask;
  id: string;
  engineName: string;
  status: string;
  videoEmbeddings?: VideoEmbedding[];

  createdAt?: string;
  metadata?: EmbeddingMetadata;

  constructor(resource: Resources.EmbedTask, data: EmbeddingsTaskResponse) {
    this._resource = resource;
    this.id = data.id;
    this.engineName = data.engineName;
    this.status = data.status;
    this.videoEmbeddings = data.videoEmbeddings;
    this.createdAt = data.createdAt;
    this.metadata = data.metadata;
  }

  async retrieve(options: RequestOptions = {}): Promise<EmbeddingsTask> {
    return await this._resource.retrieve(this.id, options);
  }

  async getStatus(options: RequestOptions = {}): Promise<string> {
    const { status } = await this._resource.status(this.id, options);
    return status;
  }

  async waitForDone(
    sleepInterval: number = 5000,
    callback?: (task: EmbeddingsTask) => void,
  ): Promise<string> {
    const isDone = () => this.status === 'ready' || this.status === 'failed';
    if (sleepInterval <= 0) {
      throw new Error('sleepInterval must be greater than 0');
    }

    while (!isDone()) {
      await this.sleep(sleepInterval);
      try {
        this.status = await this.getStatus();
      } catch (err) {
        console.warn(`Retrieving status failed: ${err.message}, retrying..`);
        continue;
      }

      if (callback) {
        callback(this);
      }
    }

    return this.status;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export class EmbeddingsTaskListWithPagination {
  private readonly _resource: Resources.EmbedTask;
  private readonly _originParams: Resources.ListEmbeddingsTaskParams;
  data: EmbeddingsTask[];
  pageInfo: PageInfo;

  constructor(
    resource: Resources.EmbedTask,
    originParams: Resources.ListEmbeddingsTaskParams,
    data: EmbeddingsTaskResponse[],
    pageInfo: PageInfo,
  ) {
    this._resource = resource;
    this._originParams = originParams;
    this.data = data.map((v) => new EmbeddingsTask(resource, v));
    this.pageInfo = pageInfo;
  }

  async next(): Promise<EmbeddingsTask[] | null> {
    if (this.pageInfo.page >= this.pageInfo.totalPage) {
      return null;
    }
    const params = { ...this._originParams };
    params.page = this.pageInfo.page + 1;
    const res = await this._resource.listPagination(params);
    this.pageInfo = res.pageInfo;
    return res.data;
  }
}
