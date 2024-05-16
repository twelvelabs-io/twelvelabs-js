export interface PageInfo {
  limitPerPage: number;
  page: number;
  totalPage: number;
  totalResults: number;
}

export interface TokenPageInfo {
  limitPerPage: number;
  totalResults: number;
  pageExpiredAt: string;
  nextPageToken?: string;
  prevPageToken?: string;
}
