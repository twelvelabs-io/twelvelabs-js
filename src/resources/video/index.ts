import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, handleComparisonParams, removeUndefinedValues } from '../../util';
import { ListVideoParams, RetrieveVideoParams, UpdateVideoParams } from './interfaces';

export class Video extends APIResource {
  async retrieve(
    indexId: string,
    id: string,
    { embed }: RetrieveVideoParams = {},
    options: RequestOptions = {},
  ): Promise<Models.Video> {
    const _params = convertKeysToSnakeCase({ embed });
    const res = await this._get<Models.VideoResponse>(
      `indexes/${indexId}/videos/${id}`,
      removeUndefinedValues(_params),
      { ...options, skipCamelKeys: ['metadata'] },
    );
    return new Models.Video(this, indexId, res);
  }

  async list(
    indexId: string,
    {
      size,
      width,
      height,
      duration,
      fps,
      createdAt,
      updatedAt,
      indexedAt,
      ...restParams
    }: ListVideoParams = {},
    options: RequestOptions = {},
  ): Promise<Models.Video[]> {
    const _params = convertKeysToSnakeCase(restParams);
    handleComparisonParams(_params, 'size', size);
    handleComparisonParams(_params, 'width', width);
    handleComparisonParams(_params, 'height', height);
    handleComparisonParams(_params, 'duration', duration);
    handleComparisonParams(_params, 'fps', fps);
    handleComparisonParams(_params, 'createdAt', createdAt);
    handleComparisonParams(_params, 'updatedAt', updatedAt);
    handleComparisonParams(_params, 'indexedAt', indexedAt);
    const res = await this._get<{ data: Models.VideoResponse[] }>(
      `indexes/${indexId}/videos`,
      removeUndefinedValues(_params),
      { ...options, skipCamelKeys: ['user_metadata'] },
    );
    return res.data.map((v) => new Models.Video(this, indexId, v));
  }

  async listPagination(
    indexId: string,
    {
      size,
      width,
      height,
      duration,
      fps,
      createdAt,
      updatedAt,
      indexedAt,
      ...restParams
    }: ListVideoParams = {},
    options: RequestOptions = {},
  ): Promise<Models.VideoListWithPagination> {
    const originParams = {
      size,
      width,
      height,
      duration,
      fps,
      createdAt,
      updatedAt,
      indexedAt,
      ...restParams,
    };
    const _params = convertKeysToSnakeCase(restParams);
    handleComparisonParams(_params, 'size', size);
    handleComparisonParams(_params, 'width', width);
    handleComparisonParams(_params, 'height', height);
    handleComparisonParams(_params, 'duration', duration);
    handleComparisonParams(_params, 'fps', fps);
    handleComparisonParams(_params, 'createdAt', createdAt);
    handleComparisonParams(_params, 'updatedAt', updatedAt);
    handleComparisonParams(_params, 'indexedAt', indexedAt);
    const res = await this._get<{ data: Models.VideoResponse[]; pageInfo: Models.PageInfo }>(
      `indexes/${indexId}/videos`,
      removeUndefinedValues(_params),
      { ...options, skipCamelKeys: ['user_metadata'] },
    );
    return new Models.VideoListWithPagination(this, originParams, indexId, res.data, res.pageInfo);
  }

  async update(
    indexId: string,
    id: string,
    { userMetadata }: UpdateVideoParams,
    options: RequestOptions = {},
  ): Promise<void> {
    await this._put<void>(
      `indexes/${indexId}/videos/${id}`,
      removeUndefinedValues(convertKeysToSnakeCase({ userMetadata })),
      options,
    );
  }

  async delete(indexId: string, id: string, options: RequestOptions = {}): Promise<void> {
    await this._delete<void>(`indexes/${indexId}/videos/${id}`, options);
  }
}
