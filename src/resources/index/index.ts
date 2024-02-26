import { APIClient, RequestOptions } from '../../core';
import * as Models from '../../models';
import { convertKeysToSnakeCase, removeUndefinedValues } from '../../util';
import { CreateIndexParams, ListIndexParams } from './interfaces';

export class Index extends APIClient {
  async retrieve(id: string, options: RequestOptions = {}): Promise<Models.Index> {
    const res = await this._get<Models.IndexResponse>(`indexes/${id}`, {}, options);
    return new Models.Index(this, res);
  }

  async list(
    { name, ...restParams }: ListIndexParams = {},
    options: RequestOptions = {},
  ): Promise<Models.Index[]> {
    const _params = convertKeysToSnakeCase({
      ...restParams,
      indexName: name,
    });
    const res = await this._get<{ data: Models.IndexResponse[] }>(
      'indexes',
      removeUndefinedValues(_params),
      options,
    );
    return res.data.map((v) => new Models.Index(this, v));
  }

  async create(
    { name, engines, addons }: CreateIndexParams,
    options: RequestOptions = {},
  ): Promise<Models.Index> {
    const _body = {
      indexName: name,
      engines: engines.map(({ name, options }) => ({ engineName: name, engineOptions: options })),
      addons,
    };
    const res = await this._post<{ id: string }>(
      'indexes',
      removeUndefinedValues(convertKeysToSnakeCase(_body)),
      options,
    );
    return await this.retrieve(res.id);
  }

  async update(id: string, name: string, options: RequestOptions = {}): Promise<void> {
    await this._put<void>(
      `indexes/${id}`,
      convertKeysToSnakeCase({
        indexName: name,
      }),
      options,
    );
  }

  async delete(id: string, options: RequestOptions = {}): Promise<void> {
    await this._delete<void>(`indexes/${id}`, options);
  }
}
