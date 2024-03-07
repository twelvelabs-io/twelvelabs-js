import { PageOptions } from '../../interfaces';

export interface ListVideoParams extends PageOptions {
  id?: string;
  filename?: string;
  size?: number | Record<string, number>;
  width?: number | Record<string, number>;
  height?: number | Record<string, number>;
  duration?: number | Record<string, number>;
  fps?: number | Record<string, number>;
  metadata?: Record<string, any>;
  createdAt?: string | Record<string, string>;
  updatedAt?: string | Record<string, string>;
  indexedAt?: string | Record<string, string>;
}

export interface UpdateVideoParams {
  title?: string;
  metadata?: Record<string, any>;
}

export interface VideoFilterOptions {
  start?: number;
  end?: number;
}
