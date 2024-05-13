export interface ClassifyOptions {
  options: ('visual' | 'conversation' | 'text_in_video')[];
  classes: {
    name: string;
    prompts: string[];
    options?: ('visual' | 'conversation' | 'text_in_video')[];
    conversationOption?: 'semantic' | 'exact_match';
  }[];
  conversationOption?: 'semantic' | 'exact_match';
  pageLimit?: number;
  includeClips?: boolean;
  threshold?: Record<string, any>;
  showDetailedScore?: boolean;
}

export interface ClassifyVideosOptions extends ClassifyOptions {
  videoIds: string[];
}

export interface ClassifyIndexOptions extends ClassifyOptions {
  indexId: string;
}
