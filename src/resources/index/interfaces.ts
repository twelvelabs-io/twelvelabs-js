import { PageOptions } from '../../interfaces';

export interface ListIndexParams extends PageOptions {
  id?: string;
  name?: string;
  engineOptions?: string[];
  engineFamily?: 'marengo' | 'pegasus';
  createdAt?: string | Record<string, string>;
  updatedAt?: string | Record<string, string>;
}

export interface CreateIndexParams {
  name: string;
  engines: { name: string; options: string[] }[];
  addons?: string[];
}
