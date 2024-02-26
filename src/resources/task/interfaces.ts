import { PageOptions } from '../../interfaces';

export interface ListTaskParams extends PageOptions {
  id?: string;
  indexId?: string;
  filename?: string;
  duration?: number;
  width?: number;
  height?: number;
  createdAt?: string;
  updatedAt?: string;
  estimatedTime?: number;
}

export interface CreateTaskParams {
  indexId: string;
}
