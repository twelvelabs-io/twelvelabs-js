import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, removeUndefinedValues } from '../../util';
import { ClassifyIndexOptions, ClassifyVideosOptions } from './interfaces';

export class Classify extends APIResource {
  async videos(
    { conversationOption = 'semantic', ...restBody }: ClassifyVideosOptions,
    options: RequestOptions = {},
  ): Promise<Models.ClassifyPageResult> {
    const _body = convertKeysToSnakeCase({
      ...restBody,
      conversationOption,
    });
    const res = await this._post<Models.ClassifyPageResultResponse>(
      'classify',
      removeUndefinedValues(_body),
      options,
    );
    return new Models.ClassifyPageResult(this, res);
  }

  async index(
    { conversationOption = 'semantic', ...restBody }: ClassifyIndexOptions,
    options: RequestOptions = {},
  ): Promise<Models.ClassifyPageResult> {
    const _body = convertKeysToSnakeCase({
      ...restBody,
      conversationOption,
    });
    const res = await this._post<Models.ClassifyPageResultResponse>(
      'classify/bulk',
      removeUndefinedValues(_body),
      options,
    );
    return new Models.ClassifyPageResult(this, res);
  }

  async byPageToken(pageToken: string, options: RequestOptions = {}): Promise<Models.ClassifyPageResult> {
    const res = await this._get<Models.ClassifyPageResultResponse>(`classify/${pageToken}`, {}, options);
    return new Models.ClassifyPageResult(this, res);
  }
}
