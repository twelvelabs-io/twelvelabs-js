import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, removeUndefinedValues } from '../../util';
import { GenerateGistType, GenerateSummarizeType } from './interfaces';

export class Generate extends APIResource {
  async gist(
    videoId: string,
    types: GenerateGistType[],
    options: RequestOptions = {},
  ): Promise<Models.GenerateGistResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      types,
    });
    const res = await this._post<Models.GenerateGistResult>('gist', _body, options);
    return res;
  }

  async summarize(
    videoId: string,
    type: GenerateSummarizeType,
    prompt?: string,
    options: RequestOptions = {},
  ): Promise<Models.GenerateSummarizeResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      type,
      prompt,
    });
    const res = await this._post<Models.GenerateSummarizeResult>(
      'summarize',
      removeUndefinedValues(_body),
      options,
    );
    return res;
  }

  async text(
    videoId: string,
    prompt: string,
    options: RequestOptions = {},
  ): Promise<Models.GenerateOpenEndedTextResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      prompt,
    });
    const res = await this._post<Models.GenerateOpenEndedTextResult>('generate', _body, options);
    return res;
  }
}
