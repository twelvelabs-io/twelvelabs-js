import { PageOptions } from '../../interfaces';

export interface RetrieveVideoParams {
  embed?: boolean;
}

export interface ListVideoParams extends PageOptions {
  filename?: string;
  size?: number | Record<string, number>;
  width?: number | Record<string, number>;
  height?: number | Record<string, number>;
  duration?: number | Record<string, number>;
  fps?: number | Record<string, number>;
  userMetadata?: Record<string, any>;
  createdAt?: string | Record<string, string>;
  updatedAt?: string | Record<string, string>;
  indexedAt?: string | Record<string, string>;
}

export interface UpdateVideoParams {
  userMetadata?: Record<string, any>;
}
