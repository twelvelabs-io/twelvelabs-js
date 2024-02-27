import * as Resources from '../../resources';

export interface SearchResultResponse {
  searchPool: SearchPool;
  data: SearchData[];
  pageInfo: SearchPageInfo;
}

export class SearchResult {
  private readonly _resource: Resources.Search;
  pool: SearchPool;
  data: SearchData[];
  pageInfo: SearchPageInfo;
  constructor(resource: Resources.Search, data: SearchResultResponse) {
    this._resource = resource;
    this.pool = data.searchPool;
    this.data = data.data;
    this.pageInfo = data.pageInfo;
  }

  async next(): Promise<SearchData[] | null> {
    const { nextPageToken } = this.pageInfo;
    if (!nextPageToken) {
      return null;
    }
    const res = await this._resource.byPageToken(nextPageToken);
    this.pageInfo = res.pageInfo;
    return res.data;
  }
}

interface SearchData {
  score: number;
  start: number;
  end: number;
  videoId: string;
  metadata?: Record<string, any>;
  confidence: string;
  thumbnailUrl?: string;
  moduleConfidence?: Record<string, any>;
}

interface SearchPool {
  totalCount: number;
  totalDuration: number;
  indexId: string;
}

interface SearchPageInfo {
  limitPerPage: number;
  totalResults: number;
  pageExpiredAt: string;
  nextPageToken?: string;
  prevPageToken?: string;
}
