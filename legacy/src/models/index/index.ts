import { RequestOptions } from '../../core';
import * as Resources from '../../resources';
import { PageInfo } from '../interfaces';
import { SearchResult } from '../search';
import { Task } from '../task';
import { Video } from '../video';

export interface IndexResponse {
  id: string;
  indexName: string;
  models: IndexModelResponse[];
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
  models: IndexModel[];
  videoCount: number;
  totalDuration: number;
  createdAt: string;
  updatedAt?: string;

  constructor(resource: Resources.Index, data: IndexResponse) {
    this._resource = resource;
    this.id = data.id;
    this.name = data.indexName;
    this.models = data.models.map((v) => new IndexModel(v));
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

interface IndexModelResponse {
  id: string;
  modelName: string;
  modelOptions: ('visual' | 'audio' | 'conversation' | 'text_in_video' | 'logo')[];
  addons?: string[];
  finetuned?: boolean;
}

class IndexModel {
  id: string;
  name: string;
  // conversation, text_in_video, and logo are to keep backward compatibility with the old models
  options: ('visual' | 'audio' | 'conversation' | 'text_in_video' | 'logo')[];
  addons?: string[];
  finetuned?: boolean;
  constructor(res: IndexModelResponse) {
    this.id = res.id;
    this.name = res.modelName;
    this.options = res.modelOptions;
    this.addons = res.addons;
    this.finetuned = res.finetuned;
  }
}
