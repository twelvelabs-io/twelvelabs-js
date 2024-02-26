import { PageOptions } from '../../interfaces';

export interface ListIndexParams extends PageOptions {
  id?: string;
  name?: string;
  engineOptions?: string[];
  engineFamily?: 'marengo' | 'pegasus';
}

export interface CreateIndexParams {
  name: string;
  engines: { name: string; options: string[] }[];
  addons?: string[];
}
