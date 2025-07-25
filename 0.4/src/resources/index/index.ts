import { TwelveLabs } from '../..';
import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, handleComparisonParams, removeUndefinedValues } from '../../util';
import { Video as VideoResource } from '../video';
import { CreateIndexParams, ListIndexParams } from './interfaces';

export class Index extends APIResource {
  video: VideoResource;

  constructor(client: TwelveLabs) {
    super(client);
    this.video = new VideoResource(client);
  }

  async retrieve(id: string, options: RequestOptions = {}): Promise<Models.Index> {
    const res = await this._get<Models.IndexResponse>(`indexes/${id}`, {}, options);
    return new Models.Index(this, res);
  }

  async list(
    { id, name, createdAt, updatedAt, ...restParams }: ListIndexParams = {},
    options: RequestOptions = {},
  ): Promise<Models.Index[]> {
    const _params = convertKeysToSnakeCase({
      ...restParams,
      _id: id,
      indexName: name,
    });
    handleComparisonParams(_params, 'created_at', createdAt);
    handleComparisonParams(_params, 'updated_at', updatedAt);
    const res = await this._get<{ data: Models.IndexResponse[] }>(
      'indexes',
      removeUndefinedValues(_params),
      options,
    );
    return res.data.map((v) => new Models.Index(this, v));
  }

  async listPagination(
    { id, name, createdAt, updatedAt, ...restParams }: ListIndexParams = {},
    options: RequestOptions = {},
  ): Promise<Models.IndexListWithPagination> {
    const originParams = { id, name, createdAt, updatedAt, ...restParams };
    const _params = convertKeysToSnakeCase({
      ...restParams,
      _id: id,
      indexName: name,
    });
    handleComparisonParams(_params, 'created_at', createdAt);
    handleComparisonParams(_params, 'updated_at', updatedAt);
    const res = await this._get<{ data: Models.IndexResponse[]; pageInfo: Models.PageInfo }>(
      'indexes',
      removeUndefinedValues(_params),
      options,
    );
    return new Models.IndexListWithPagination(this, originParams, res.data, res.pageInfo);
  }

  async create(
    { name, models, addons }: CreateIndexParams,
    options: RequestOptions = {},
  ): Promise<Models.Index> {
    const _body = {
      indexName: name,
      models: models.map(({ name, options }) => ({ modelName: name, modelOptions: options })),
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
