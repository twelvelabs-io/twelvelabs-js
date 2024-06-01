export interface CreateEmbedParams {
  engineName: string;
  text: string;
  textTruncate?: 'none' | 'start' | 'end';
}

export interface CreateEmbeddingsTaskVideoParams {
  file?: Buffer | NodeJS.ReadableStream | string;
  url?: string;
  startOffsetSec?: number;
  endOffsetSec?: number;
  clipLength?: number;
  scopes?: Array<'clip' | 'video'>;
}
