export interface SearchOptions {
  indexId: string;
  queryText?: string;
  queryMediaType?: 'image';
  queryMediaFile?: Buffer | NodeJS.ReadableStream | string;
  queryMediaUrl?: string;
  options?: ('visual' | 'audio')[];
  groupBy?: 'video' | 'clip';
  threshold?: 'high' | 'medium' | 'low';
  operator?: 'or' | 'and';
  filter?: Record<string, any>;
  pageLimit?: number;
  sortOption?: 'score' | 'clip_count';
  adjustConfidenceLevel?: number;
}
