import { PageOptions } from '../../interfaces';

export interface ListTaskParams extends PageOptions {
  id?: string;
  indexId?: string;
  filename?: string;
  duration?: number;
  width?: number;
  height?: number;
  createdAt?: string | Record<string, string>;
  updatedAt?: string | Record<string, string>;
  estimatedTime?: number;
}

export interface CreateTaskParams {
  indexId: string;
  file?: Buffer | NodeJS.ReadableStream | string;
  url?: string;
  transcriptionFile?: Buffer | NodeJS.ReadableStream | string;
  transcriptionUrl?: string;
  language?: string;
  disableVideoStream?: boolean;
}
