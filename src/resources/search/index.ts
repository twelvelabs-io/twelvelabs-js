import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { convertKeysToSnakeCase, removeUndefinedValues } from '../../util';
import { SearchOptions } from './interfaces';

export class Search extends APIResource {
  async query(
    { options: searchOptions, ...restBody }: SearchOptions,
    options: RequestOptions = {},
  ): Promise<Models.SearchResult> {
    const _body = convertKeysToSnakeCase({
      ...restBody,
      searchOptions,
    });
    const res = await this._post<Models.SearchResultResponse>(
      'search',
      removeUndefinedValues(_body),
      options,
    );
    return new Models.SearchResult(this, res);
  }

  async byPageToken(pageToken: string, options: RequestOptions = {}): Promise<Models.SearchResult> {
    const res = await this._get<Models.SearchResultResponse>(`search/${pageToken}`, {}, options);
    return new Models.SearchResult(this, res);
  }
}
