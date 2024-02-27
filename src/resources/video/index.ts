import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, removeUndefinedValues } from '../../util';
import { ListVideoParams, UpdateVideoParams, VideoFilterOptions } from './interfaces';

export class Video extends APIResource {
  async retrieve(indexId: string, id: string, options: RequestOptions = {}): Promise<Models.Video> {
    const res = await this._get<Models.VideoResponse>(
      `indexes/${indexId}/videos/${id}`,
      {},
      { ...options, skipCamelKeys: ['metadata'] },
    );
    return new Models.Video(this, indexId, res);
  }

  async list(indexId: string, { id, ...restParams }: ListVideoParams = {}, options: RequestOptions = {}) {
    const _params = convertKeysToSnakeCase({
      ...restParams,
      _id: id,
    });
    const res = await this._get<{ data: Models.VideoResponse[] }>(
      `indexes/${indexId}/videos`,
      removeUndefinedValues(_params),
      { ...options, skipCamelKeys: ['metadata'] },
    );
    return res.data.map((v) => new Models.Video(this, indexId, v));
  }

  async update(
    indexId: string,
    id: string,
    { title, metadata }: UpdateVideoParams,
    options: RequestOptions = {},
  ): Promise<void> {
    await this._put<void>(
      `indexes/${indexId}/videos/${id}`,
      removeUndefinedValues(convertKeysToSnakeCase({ videoTitle: title, metadata })),
      options,
    );
  }

  async delete(indexId: string, id: string, options: RequestOptions = {}): Promise<void> {
    await this._delete<void>(`indexes/${indexId}/videos/${id}`, options);
  }

  async transcription(
    indexId: string,
    id: string,
    filter: VideoFilterOptions = {},
    options: RequestOptions = {},
  ): Promise<Models.VideoValue[]> {
    const res = await this._get<{ data: Models.VideoValue[] }>(
      `indexes/${indexId}/videos/${id}/transcription`,
      removeUndefinedValues(filter),
      options,
    );
    return res.data || [];
  }

  async textInVideo(
    indexId: string,
    id: string,
    filter: VideoFilterOptions = {},
    options: RequestOptions = {},
  ): Promise<Models.VideoValue[]> {
    const res = await this._get<{ data: Models.VideoValue[] }>(
      `indexes/${indexId}/videos/${id}/text-in-video`,
      removeUndefinedValues(filter),
      options,
    );
    return res.data || [];
  }

  async logo(
    indexId: string,
    id: string,
    filter: VideoFilterOptions = {},
    options: RequestOptions = {},
  ): Promise<Models.VideoValue[]> {
    const res = await this._get<{ data: Models.VideoValue[] }>(
      `indexes/${indexId}/videos/${id}/logo`,
      removeUndefinedValues(filter),
      options,
    );
    return res.data || [];
  }

  async thumbnail(indexId: string, id: string, time?: number, options: RequestOptions = {}): Promise<string> {
    const res = await this._get<{ thumbnail: string }>(
      `indexes/${indexId}/videos/${id}/transcription`,
      removeUndefinedValues({ time }),
      options,
    );
    return res.thumbnail;
  }
}
