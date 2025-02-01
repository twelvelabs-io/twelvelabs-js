export type GenerateSummarizeType = 'summary' | 'chapter' | 'highlight';

export type GenerateGistType = 'topic' | 'hashtag' | 'title';

export interface GenerateTextStreamParams {
  videoId: string;
  prompt: string;
  temperature?: number;
}
