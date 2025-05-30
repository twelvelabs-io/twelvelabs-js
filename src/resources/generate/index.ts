import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, removeUndefinedValues, trackStream } from '../../util';
import { GenerateGistType, GenerateSummarizeType, GenerateTextStreamParams } from './interfaces';

export class Generate extends APIResource {
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

  async analyze(
    videoId: string,
    prompt: string,
    temperature?: number,
    options: RequestOptions = {},
  ): Promise<Models.GenerateOpenEndedTextResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      prompt,
      temperature,
      stream: false,
    });
    const res = await this._post<Models.GenerateOpenEndedTextResult>(
      'analyze',
      removeUndefinedValues(_body),
      options,
    );
    return res;
  }

  async analyzeStream(
    { videoId, prompt, temperature }: GenerateTextStreamParams,
    options: RequestOptions = {},
  ): Promise<Models.GenerateTextStreamResult> {
    const _body = convertKeysToSnakeCase({
      videoId,
      prompt,
      temperature,
      stream: true,
    });
    const res = await this._post<AsyncIterable<Uint8Array>>('analyze', removeUndefinedValues(_body), options);
    return new Models.GenerateTextStreamResult(trackStream(res));
  }

  /**
   * @deprecated This method is deprecated and will not be supported after 2025-07-31. Use `analyze` instead.
   */
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
      stream: false,
    });
    const res = await this._post<Models.GenerateOpenEndedTextResult>(
      'generate',
      removeUndefinedValues(_body),
      options,
    );
    return res;
  }

  /**
   * @deprecated This method is deprecated and will not be supported after 2025-07-31. Use `analyzeStream` instead.
   */
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
