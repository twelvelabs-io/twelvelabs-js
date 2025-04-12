import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, handleComparisonParams, removeUndefinedValues } from '../../util';
import { ListVideoParams, RetrieveVideoParams, UpdateVideoParams } from './interfaces';

export class Video extends APIResource {
  async retrieve(
    indexId: string,
    id: string,
    { embeddingOption }: RetrieveVideoParams = {},
    options: RequestOptions = {},
  ): Promise<Models.Video> {
    let queryString = '';

    if (embeddingOption && embeddingOption.length > 0) {
      embeddingOption.forEach(option => {
        queryString += `embedding_option=${encodeURIComponent(option)}&`;
      });
      // Remove trailing &
      queryString = queryString.slice(0, -1);
    }

    const res = await this._get<Models.VideoResponse>(
      `indexes/${indexId}/videos/${id}${queryString ? '?' + queryString : ''}`,
      {}, // Empty params since we're adding them directly to the URL
      { ...options, skipCamelKeys: ['user_metadata'] },
    );
    return new Models.Video(this, indexId, res);
  }

  async list(
    indexId: string,
    { size, width, height, duration, fps, createdAt, updatedAt, ...restParams }: ListVideoParams = {},
    options: RequestOptions = {},
  ): Promise<Models.Video[]> {
    const _params = convertKeysToSnakeCase(restParams);
    handleComparisonParams(_params, 'size', size);
    handleComparisonParams(_params, 'width', width);
    handleComparisonParams(_params, 'height', height);
    handleComparisonParams(_params, 'duration', duration);
    handleComparisonParams(_params, 'fps', fps);
    handleComparisonParams(_params, 'created_at', createdAt);
    handleComparisonParams(_params, 'updated_at', updatedAt);
    const res = await this._get<{ data: Models.VideoResponse[] }>(
      `indexes/${indexId}/videos`,
      removeUndefinedValues(_params),
      { ...options, skipCamelKeys: ['user_metadata'] },
    );
    return res.data.map((v) => new Models.Video(this, indexId, v));
  }

  async listPagination(
    indexId: string,
    { size, width, height, duration, fps, createdAt, updatedAt, ...restParams }: ListVideoParams = {},
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
      ...restParams,
    };
    const _params = convertKeysToSnakeCase(restParams);
    handleComparisonParams(_params, 'size', size);
    handleComparisonParams(_params, 'width', width);
    handleComparisonParams(_params, 'height', height);
    handleComparisonParams(_params, 'duration', duration);
    handleComparisonParams(_params, 'fps', fps);
    handleComparisonParams(_params, 'created_at', createdAt);
    handleComparisonParams(_params, 'updated_at', updatedAt);
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
      removeUndefinedValues({ user_metadata: userMetadata }),
      options,
    );
  }

  async delete(indexId: string, id: string, options: RequestOptions = {}): Promise<void> {
    await this._delete<void>(`indexes/${indexId}/videos/${id}`, options);
  }
}
