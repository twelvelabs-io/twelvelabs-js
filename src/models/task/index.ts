import { RequestOptions } from '../../core';
import * as Resources from '../../resources';

export interface TaskResponse {
  id: string;
  indexId: string;
  videoId?: string[];
  estimatedTime?: string;
  status: string;
  metadata: Record<string, any>;
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
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
