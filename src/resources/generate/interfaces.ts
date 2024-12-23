export type GenerateSummarizeType = 'summary' | 'chapter' | 'highlight';

export interface GenerateTextStreamParams {
  videoId: string;
  prompt: string;
  temperature?: number;
}
