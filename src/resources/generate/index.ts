import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, removeUndefinedValues, trackStream } from '../../util';
import { GenerateGistType, GenerateSummarizeType, GenerateTextStreamParams } from './interfaces';

export class Generate extends APIResource {
  /**
   * @deprecated client.generate.summarize() is deprecated. Use client.summarize() instead.
   */
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

  /**
   * @deprecated client.generate.gist() is deprecated. Use client.gist() instead.
   */
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

  /**
   * @deprecated client.generate.text() is deprecated. Use client.analyze() instead.
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
   * @deprecated client.generate.textStream() is deprecated. Use client.analyzeStream() instead.
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
