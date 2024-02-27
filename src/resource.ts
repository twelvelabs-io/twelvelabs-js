import { TwelveLabs } from '.';
import { APIClient, RequestOptions } from './core';

export class APIResource extends APIClient {
  readonly _client: TwelveLabs;
  readonly _get: <T>(endpoint: string, params?: Record<string, any>, options?: RequestOptions) => Promise<T>;
  readonly _post: <T>(endpoint: string, data?: any, options?: RequestOptions) => Promise<T>;
  readonly _patch: <T>(endpoint: string, data?: any, options?: RequestOptions) => Promise<T>;
  readonly _put: <T>(endpoint: string, data?: any, options?: RequestOptions) => Promise<T>;
  readonly _delete: <T>(endpoint: string, options?: RequestOptions) => Promise<T>;

  constructor(client: TwelveLabs) {
    super(client);
    this._client = client;
    this._get = client._get;
    this._post = client._post;
    this._patch = client._patch;
    this._put = client._put;
    this._delete = client._delete;
  }
}
