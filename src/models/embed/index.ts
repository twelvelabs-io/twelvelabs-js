import { RequestOptions } from '../../core';
import * as Resources from '../../resources';

export interface Embedding {
  float: number[];
}

export interface CreateEmbeddingsResultResponse {
  engineName: string;
  textEmbedding: Embedding;
}

export class CreateEmbeddingsResult {
  engineName: string;
  textEmbedding: Embedding;

  constructor(data: CreateEmbeddingsResultResponse) {
    this.engineName = data.engineName;
    this.textEmbedding = data.textEmbedding;
  }
}

export interface EmbeddingsTaskStatusResponse {
  id: string;
  engineName: string;
  status: string;
}

export class EmbeddingsTaskStatus {
  id: string;
  engineName: string;
  status: string;

  constructor(data: EmbeddingsTaskStatusResponse) {
    this.id = data.id;
    this.engineName = data.engineName;
    this.status = data.status;
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
}

export class EmbeddingsTask {
  private readonly _resource: Resources.EmbedTask;
  id: string;
  engineName: string;
  status: string;
  videoEmbeddings?: VideoEmbedding[];

  constructor(resource: Resources.EmbedTask, data: EmbeddingsTaskResponse) {
    this._resource = resource;
    this.id = data.id;
    this.engineName = data.engineName;
    this.status = data.status;
    this.videoEmbeddings = data.videoEmbeddings;
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
