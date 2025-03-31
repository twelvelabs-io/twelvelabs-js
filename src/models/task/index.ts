import { RequestOptions } from '../../core';
import * as Resources from '../../resources';
import { PageInfo } from '../interfaces';

export interface TaskResponse {
  id: string;
  indexId: string;
  videoId?: string;
  status: string;
  systemMetadata: Record<string, any>;
  hls?: TaskHLS;
  createdAt: string;
  updatedAt?: string;
}

export class Task {
  private readonly _resource: Resources.Task;
  id: string;
  indexId: string;
  videoId?: string;
  status: string;
  systemMetadata: Record<string, any>;
  hls?: TaskHLS;
  createdAt: string;
  updatedAt?: string;

  constructor(resource: Resources.Task, data: TaskResponse) {
    this._resource = resource;
    this.id = data.id;
    this.indexId = data.indexId;
    this.videoId = data.videoId;
    this.status = data.status;
    this.systemMetadata = data.systemMetadata;
    this.hls = data.hls;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  async retrieve(options: RequestOptions = {}): Promise<Task> {
    return await this._resource.retrieve(this.id, options);
  }

  async delete(options: RequestOptions = {}): Promise<void> {
    await this._resource.delete(this.id, options);
  }

  async waitForDone(sleepInterval: number = 5000, callback?: (task: Task) => void): Promise<Task> {
    const isDone = () => this.status === 'ready' || this.status === 'failed';
    if (sleepInterval <= 0) {
      throw new Error('sleepInterval must be greater than 0');
    }

    while (!isDone()) {
      await this.sleep(sleepInterval);
      try {
        const task = await this.retrieve();
        this.status = task.status;
        this.systemMetadata = task.systemMetadata;
      } catch (err) {
        console.warn(`Retrieving task failed: ${err.message}, retrying..`);
        continue;
      }

      if (callback) {
        callback(this);
      }
    }

    return this;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export class TaskListWithPagination {
  private readonly _resource: Resources.Task;
  private readonly _originParams: Resources.ListTaskParams;
  data: Task[];
  pageInfo: PageInfo;

  constructor(
    resource: Resources.Task,
    originParams: Resources.ListTaskParams,
    data: TaskResponse[],
    pageInfo: PageInfo,
  ) {
    this._resource = resource;
    this._originParams = originParams;
    this.data = data.map((v) => new Task(resource, v));
    this.pageInfo = pageInfo;
  }

  async next(): Promise<Task[] | null> {
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

export interface TaskHLS {
  videoUrl?: string;
  thumbnailUrls?: string[];
  status?: string;
  updatedAt?: string;
}

export interface TransferImportVideo {
  videoId: string;
  filename: string;
}

export interface TransferImportFailedFile {
  filename: string;
  errorMessage: string;
}

export interface TransferImportResponse {
  videos: TransferImportVideo[];
  failedFiles?: TransferImportFailedFile[];
}

export interface TransferImportStatusVideoInfo {
  videoId: string;
  filename: string;
  createdAt?: string;
}

export interface TransferImportStatusFailedVideoInfo {
  filename: string;
  createdAt?: string;
  errorMessage: string;
}

export interface TransferImportStatusResponse {
  notImported: string[];
  ready: TransferImportStatusVideoInfo[];
  validating: TransferImportStatusVideoInfo[];
  pending: TransferImportStatusVideoInfo[];
  indexing: TransferImportStatusVideoInfo[];
  failed: TransferImportStatusFailedVideoInfo[];
  queued: TransferImportStatusVideoInfo[];
}

export interface TransferImportLogVideoStatus {
  ready: number;
  validating: number;
  pending: number;
  indexing: number;
  failed: number;
  queued: number;
}

export interface TransferImportLogFailedFile {
  filename: string;
  errorMessage: string;
}

export interface TransferImportLog {
  indexId: string;
  indexName: string;
  createdAt: string;
  endedAt?: string;
  videoStatus: TransferImportLogVideoStatus;
  failedFiles?: TransferImportLogFailedFile[];
}
