import { RequestOptions } from '../../core';
import * as Resources from '../../resources';
import { PageInfo } from '../interfaces';
import { SearchResult } from '../search';
import { Task, TaskStatus } from '../task';
import { Video } from '../video';

export interface IndexResponse {
  id: string;
  indexName: string;
  engines: IndexEngineResponse[];
  videoCount: number;
  totalDuration: number;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
}

export class Index {
  private readonly _resource: Resources.Index;

  id: string;
  name: string;
  engines: IndexEngine[];
  videoCount: number;
  totalDuration: number;
  createdAt: string;
  updatedAt?: string;

  constructor(resource: Resources.Index, data: IndexResponse) {
    this._resource = resource;
    this.id = data.id;
    this.name = data.indexName;
    this.engines = data.engines.map((v) => new IndexEngine(v));
    this.videoCount = data.videoCount;
    this.totalDuration = data.totalDuration;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Index related methods

  async retrieve(options: RequestOptions = {}): Promise<Index> {
    return await this._resource.retrieve(this.id, options);
  }

  async update(name: string, options: RequestOptions = {}): Promise<void> {
    return await this._resource.update(this.id, name, options);
  }

  async delete(options: RequestOptions = {}): Promise<void> {
    return await this._resource.delete(this.id, options);
  }

  // Task related methods

  async createTask(
    body: Omit<Resources.CreateTaskParams, 'indexId'>,
    options: RequestOptions = {},
  ): Promise<Task> {
    return await this._resource._client.task.create({ ...body, indexId: this.id }, options);
  }

  async taskStatus(options: RequestOptions = {}): Promise<TaskStatus> {
    return await this._resource._client.task.status(this.id, options);
  }

  async taskExternalProvider(url: string, options: RequestOptions = {}): Promise<Task> {
    return await this._resource._client.task.externalProvider(this.id, url, options);
  }

  // Video related methods

  async listVideos(params: Resources.ListVideoParams = {}, options: RequestOptions = {}): Promise<Video[]> {
    return await this._resource.video.list(this.id, params, options);
  }

  // Search related methods

  async query(
    body: Omit<Resources.SearchOptions, 'indexId'>,
    options: RequestOptions = {},
  ): Promise<SearchResult> {
    return await this._resource._client.search.query({ ...body, indexId: this.id }, options);
  }
}

export class IndexListWithPagination {
  private readonly _resource: Resources.Index;
  private readonly _originParams: Resources.ListIndexParams;
  data: Index[];
  pageInfo: PageInfo;

  constructor(
    resource: Resources.Index,
    originParams: Resources.ListIndexParams,
    data: IndexResponse[],
    pageInfo: PageInfo,
  ) {
    this._resource = resource;
    this._originParams = originParams;
    this.data = data.map((v) => new Index(resource, v));
    this.pageInfo = pageInfo;
  }

  async next(): Promise<Index[] | null> {
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

interface IndexEngineResponse {
  id: string;
  engineName: string;
  engineOptions: string[];
  addons?: string[];
  finetuned?: boolean;
}

class IndexEngine {
  id: string;
  name: string;
  options: string[];
  addons?: string[];
  finetuned?: boolean;
  constructor(res: IndexEngineResponse) {
    this.id = res.id;
    this.name = res.engineName;
    this.options = res.engineOptions;
    this.addons = res.addons;
    this.finetuned = res.finetuned;
  }
}
