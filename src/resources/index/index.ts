import { APIClient, RequestOptions } from '../../core';
import * as Models from '../../models';

export class Index extends APIClient {
  async retrieve(id: string, options: RequestOptions = {}): Promise<Models.Index> {
    const endpoint = `indexes/${id}`;
    const res = await this._get<Models.IndexResponse>(endpoint, {}, options);
    return new Models.Index(this, res);
  }

  async list(
    options: RequestOptions & {
      id?: string;
      name?: string;
      engineOptions?: string[];
      engineFamily?: 'marengo' | 'pegasus';
      page?: number;
      pageLimit?: number;
      sortBy?: string;
      sortOption?: string;
    } = {},
  ): Promise<Models.Index[]> {
    const params = { ...options, engine_options: options.engineOptions, engine_family: options.engineFamily };
    const res = await this._get<{ data: Models.IndexResponse[] }>('indexes', params, options);
    return res.data.map((v) => new Models.Index(this, v));
  }

  async create(
    options: RequestOptions & {
      name: string;
      engines: { name: string; options: string[] }[];
      addons?: string[];
    },
  ): Promise<Models.Index> {
    const res = await this._post<{ id: string }>('indexes', { json: options }, options);
    return await this.retrieve(res.id);
  }

  async update(id: string, name: string, options: RequestOptions = {}): Promise<void> {
    await this._put<void>(`indexes/${id}`, { json: { indexName: name }, ...options });
  }

  async delete(id: string, options: RequestOptions = {}): Promise<void> {
    await this._delete<void>(`indexes/${id}`, options);
  }
}
