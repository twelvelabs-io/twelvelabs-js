import { PageOptions } from '../../interfaces';

export interface CreateEmbedParams {
  engineName: string;
  // text params
  text?: string;
  textTruncate?: 'none' | 'start' | 'end';
  // audio params
  audioUrl?: string;
  audioFile?: Buffer | NodeJS.ReadableStream | string;
  // image params
  imageUrl?: string;
  imageFile?: Buffer | NodeJS.ReadableStream | string;
}

export interface CreateEmbeddingsTaskVideoParams {
  file?: Buffer | NodeJS.ReadableStream | string;
  url?: string;
  startOffsetSec?: number;
  endOffsetSec?: number;
  clipLength?: number;
  scopes?: Array<'clip' | 'video'>;
}

export interface ListEmbeddingsTaskParams extends PageOptions {
  startedAt: string;
  endedAt: string;
  status?: string;
}
