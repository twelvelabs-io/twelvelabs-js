import FormData from 'form-data';
import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { attachFormFile, convertKeysToSnakeCase, removeUndefinedValues } from '../../util';
import { SearchOptions } from './interfaces';

export class Search extends APIResource {
  async query(
    {
      indexId,
      query,
      queryText,
      queryMediaType,
      queryMediaFile,
      queryMediaUrl,
      options: searchOptions,
      groupBy,
      threshold,
      operator,
      conversationOption,
      filter,
      pageLimit,
      sortOption,
      adjustConfidenceLevel,
    }: SearchOptions,
    options: RequestOptions = {},
  ): Promise<Models.SearchResult> {
    if (!queryText && !queryMediaFile && !queryMediaUrl) {
      if (query) {
        // deprecated; call /search endpoint
        console.warn(
          'Warning: `query` is deprecated. Use `queryText`, `queryMediaFile` or `queryMediaUrl` instead.',
        );
        const _body = convertKeysToSnakeCase({
          indexId,
          query,
          queryText,
          queryMediaType,
          queryMediaFile,
          queryMediaUrl,
          searchOptions,
          groupBy,
          threshold,
          operator,
          conversationOption,
          filter,
          pageLimit,
          sortOption,
          adjustConfidenceLevel,
        });
        const res = await this._post<Models.SearchResultResponse>(
          'search',
          removeUndefinedValues(_body),
          options,
        );
        return new Models.SearchResult(this, res);
      } else {
        throw new Error('Either `queryText`, `queryMediaFile`, or `queryMediaUrl` must be provided');
      }
    }

    if ((queryMediaFile || queryMediaUrl) && !queryMediaType) {
      throw new Error(
        '`queryMediaType` must be provided when `queryMediaFile` or `queryMediaUrl` is provided.',
      );
    }

    const formData = new FormData();
    formData.append('index_id', indexId);
    if (queryText) formData.append('query_text', queryText);
    if (queryMediaType) formData.append('query_media_type', queryMediaType);
    if (queryMediaUrl) formData.append('query_media_url', queryMediaUrl);
    if (searchOptions) {
      searchOptions.forEach((option) => formData.append('search_options', option));
    }
    if (groupBy) formData.append('group_by', groupBy);
    if (threshold) formData.append('threshold', threshold);
    if (operator) formData.append('operator', operator);
    if (conversationOption) formData.append('conversation_option', conversationOption);
    if (filter) formData.append('filter', JSON.stringify(filter));
    if (pageLimit) formData.append('page_limit', pageLimit);
    if (sortOption) formData.append('sort_option', sortOption);
    if (adjustConfidenceLevel) formData.append('adjust_confidence_level', adjustConfidenceLevel);

    try {
      if (queryMediaFile) attachFormFile(formData, 'query_media_file', queryMediaFile);
    } catch (err) {
      throw err;
    }

    const res = await this._post<Models.SearchResultResponse>('search-v2', formData, options);
    return new Models.SearchResult(this, res);
  }

  async byPageToken(pageToken: string, options: RequestOptions = {}): Promise<Models.SearchResult> {
    const res = await this._get<Models.SearchResultResponse>(`search/${pageToken}`, {}, options);
    return new Models.SearchResult(this, res);
  }
}
