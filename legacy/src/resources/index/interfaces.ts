import { PageOptions } from '../../interfaces';

export interface ListIndexParams extends PageOptions {
  id?: string;
  name?: string;
  modelOptions?: ('visual' | 'audio')[];
  modelFamily?: 'marengo' | 'pegasus';
  createdAt?: string | Record<string, string>;
  updatedAt?: string | Record<string, string>;
}

export interface CreateIndexParams {
  name: string;
  models: { name: 'marengo2.7' | 'pegasus1.2'; options: ('visual' | 'audio')[] }[];
  addons?: string[];
}
