import { RequestOptions } from '../../core';
import * as Resources from '../../resources';

export interface TaskResponse {
  id: string;
  indexId: string;
  videoId?: string[];
  estimatedTime?: string;
  status: string;
  metadata: Record<string, any>;
  process?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export class Task {
  private readonly _resource: Resources.Task;
  id: string;
  indexId: string;
  videoId?: string[];
  estimatedTime?: string;
  status: string;
  metadata: Record<string, any>;
  process?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;

  constructor(resource: Resources.Task, data: TaskResponse) {
    this._resource = resource;
    this.id = data.id;
    this.indexId = data.indexId;
    this.videoId = data.videoId;
    this.estimatedTime = data.estimatedTime;
    this.status = data.status;
    this.metadata = data.metadata;
    this.process = data.process;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  async retrieve(options: RequestOptions = {}): Promise<Task> {
    return await this._resource.retrieve(this.id, options);
  }

  async delete(options: RequestOptions = {}): Promise<void> {
    await this._resource.delete(this.id);
  }

  async waitForDone(sleepInterval: number = 5000, callback?: (task: Task) => void): Promise<Task> {
    if (sleepInterval <= 0) {
      throw new Error('sleepInterval must be greater than 0');
    }

    let done = this.status === 'ready' || this.status === 'failed';

    while (!done) {
      await this.sleep(sleepInterval);
      const task = await this.retrieve();

      this.estimatedTime = task.estimatedTime;
      this.status = task.status;
      this.metadata = task.metadata;
      this.process = task.process;

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

export interface TaskStatus {
  indexId: string;
  ready: number;
  validating: number;
  pending: number;
  failed: number;
  totalResult: number;
}
