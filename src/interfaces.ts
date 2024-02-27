export interface PageOptions {
  page?: number;
  pageLimit?: number;
  sortBy?: 'created_at' | 'updated_at';
  sortOption?: 'asc' | 'desc';
}
