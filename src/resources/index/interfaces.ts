export interface ListIndexParams {
  id?: string;
  name?: string;
  engineOptions?: string[];
  engineFamily?: 'marengo' | 'pegasus';
  page?: number;
  pageLimit?: number;
  sortBy?: 'created_at' | 'updated_at';
  sortOption?: 'asc' | 'desc';
}

export interface CreateIndexParams {
  name: string;
  engines: { name: string; options: string[] }[];
  addons?: string[];
}
