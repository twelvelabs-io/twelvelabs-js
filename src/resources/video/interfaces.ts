import { PageOptions } from '../../interfaces';

export interface ListVideoParams extends PageOptions {
  id?: string;
  filename?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  fps?: number;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  indexedAt?: string;
}

export interface UpdateVideoParams {
  title?: string;
  metadata?: Record<string, any>;
}

export interface VideoFilterOptions {
  start?: number;
  end?: number;
}
