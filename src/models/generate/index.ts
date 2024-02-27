export interface GenerateOpenEndedTextResult {
  id: string;
  data: string;
}

export interface GenerateSummarizeChapterResult {
  chapterNumber: number;
  start: number;
  end: number;
  chapterTitle: string;
  chapterSummary: string;
}

export interface GenerateSummarizeHighlightResult {
  start: number;
  end: number;
  highlight: string;
}

export interface GenerateSummarizeResult {
  id: string;
  summary?: string;
  chapters?: GenerateSummarizeChapterResult[];
  highlights?: GenerateSummarizeHighlightResult[];
}

export interface GenerateGistResult {
  id: string;
  title?: string;
  topics?: string[];
  hashtags?: string[];
}
