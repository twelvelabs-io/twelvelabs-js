import { PageOptions } from '../../interfaces';

export interface ListTaskParams extends PageOptions {
  indexId?: string;
  filename?: string;
  duration?: number;
  width?: number;
  height?: number;
  createdAt?: string | Record<string, string>;
  updatedAt?: string | Record<string, string>;
}

export interface CreateTaskParams {
  indexId: string;
  file?: Buffer | NodeJS.ReadableStream | string;
  url?: string;
  enableVideoStream?: boolean;
}

export interface TransferImportParams {
  integrationId: string;
  indexId: string;
  userMetadata?: Record<string, any>;
  incrementalImport?: boolean;
  retryFailed?: boolean;
}
