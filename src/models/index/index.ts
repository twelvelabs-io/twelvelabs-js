import { RequestOptions } from '../../core';
import * as Resources from '../../resources';

export interface IndexResponse {
  id: string;
  indexName: string;
  engines: IndexEngineResponse[];
  videoCount: number;
  totalDuration: number;
  createdAt: string;
  updatedAt?: string;
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
}

interface IndexEngineResponse {
  id: string;
  engineName: string;
  engineOptions: string[];
  addons?: string[];
}

class IndexEngine {
  id: string;
  name: string;
  options: string[];
  addons?: string[];
  constructor(res: IndexEngineResponse) {
    this.id = res.id;
    this.name = res.engineName;
    this.options = res.engineOptions;
    this.addons = res.addons;
  }
}
