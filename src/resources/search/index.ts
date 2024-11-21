import FormData from 'form-data';
import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { attachFormFile } from '../../util';
import { SearchOptions } from './interfaces';

export class Search extends APIResource {
  async query(
    {
      indexId,
      queryText,
      queryMediaType,
      queryMediaFile,
      queryMediaUrl,
      options: searchOptions,
      groupBy,
      threshold,
      operator,
      filter,
      pageLimit,
      sortOption,
      adjustConfidenceLevel,
    }: SearchOptions,
    options: RequestOptions = {},
  ): Promise<Models.SearchResult> {
    if (!queryText && !queryMediaFile && !queryMediaUrl) {
      throw new Error('Either `queryText`, `queryMediaFile`, or `queryMediaUrl` must be provided');
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
