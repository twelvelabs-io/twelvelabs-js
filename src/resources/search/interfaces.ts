export interface SearchOptions {
  indexId: string;
  query?: string | Record<string, any>;
  queryText?: string;
  queryMediaType?: 'image';
  queryMediaFile?: Buffer | NodeJS.ReadableStream | string;
  queryMediaUrl?: string;
  options?: ('visual' | 'conversation' | 'text_in_video' | 'logo')[];
  groupBy?: 'video' | 'clip';
  threshold?: 'high' | 'medium' | 'low';
  operator?: 'or' | 'and';
  conversationOption?: 'semantic' | 'exact_match';
  filter?: Record<string, any>;
  pageLimit?: number;
  sortOption?: 'score' | 'clip_count';
  adjustConfidenceLevel?: number;
}
