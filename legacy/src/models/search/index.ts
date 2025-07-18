import * as Resources from '../../resources';
import { TokenPageInfo } from '../interfaces';

export interface SearchResultResponse {
  searchPool: SearchPool;
  data: SearchData[];
  pageInfo: TokenPageInfo;
}

export class SearchResult {
  private readonly _resource: Resources.Search;
  pool: SearchPool;
  data: SearchData[] | GroupByVideoSearchData[];
  pageInfo: TokenPageInfo;
  constructor(resource: Resources.Search, data: SearchResultResponse) {
    this._resource = resource;
    this.pool = data.searchPool;
    this.data = data.data;
    this.pageInfo = data.pageInfo;
  }

  async next(): Promise<SearchData[] | GroupByVideoSearchData[] | null> {
    const { nextPageToken } = this.pageInfo;
    if (!nextPageToken) {
      return null;
    }
    const res = await this._resource.byPageToken(nextPageToken);
    this.pageInfo = res.pageInfo;
    return res.data;
  }
}

export interface SearchData {
  score: number;
  start: number;
  end: number;
  videoId: string;
  confidence: string;
  thumbnailUrl?: string;
  moduleConfidence?: Record<string, any>;
}

export interface GroupByVideoSearchData {
  clips?: SearchData[];
  id: string;
}

interface SearchPool {
  totalCount: number;
  totalDuration: number;
  indexId: string;
}
