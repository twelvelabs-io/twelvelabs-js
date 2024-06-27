import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, removeUndefinedValues, trackStream } from '../../util';
import { GenerateGistType, GenerateSummarizeType, GenerateTextStreamParams } from './interfaces';

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
    temperature?: number,
    options: RequestOptions = {},
  ): Promise<Models.GenerateSummarizeResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      type,
      prompt,
      temperature,
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
    temperature?: number,
    options: RequestOptions = {},
  ): Promise<Models.GenerateOpenEndedTextResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      prompt,
      temperature,
    });
    const res = await this._post<Models.GenerateOpenEndedTextResult>(
      'generate',
      removeUndefinedValues(_body),
      options,
    );
    return res;
  }

  async textStream(
    { videoId, prompt, temperature }: GenerateTextStreamParams,
    options: RequestOptions = {},
  ): Promise<Models.GenerateTextStreamResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      prompt,
      temperature,
      stream: true,
    });
    const res = await this._post<AsyncIterable<Uint8Array>>(
      'generate',
      removeUndefinedValues(_body),
      options,
    );
    return new Models.GenerateTextStreamResult(trackStream(res));
  }
}
