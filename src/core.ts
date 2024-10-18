import fetch from 'cross-fetch';
import FormData from 'form-data';
import { API_KEY_HEADER } from './constants';
import * as Errors from './error';
import { convertKeysToCamelCase } from './util';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type RequestOptions = RequestInit & { params?: Record<string, any>; skipCamelKeys?: string[] };

export interface APIClientOptions {
  baseUrl: string;
  apiKey: string;
}

export class APIClient {
  baseUrl: string;
  apiKey: string;

  constructor({ baseUrl, apiKey }: APIClientOptions) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async _request(
    method: HttpMethod,
    endpoint: string,
    { params, body, skipCamelKeys, ...options }: RequestOptions = {},
  ): Promise<any> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.keys(params).forEach((key) => url.searchParams.append(key, params![key]));
    }

    let headers = {
      [API_KEY_HEADER]: this.apiKey,
      ['content-type']: 'application/json',
      ...options.headers,
    };
    if (body instanceof FormData) {
      headers = {
        ...headers,
        ...body.getHeaders(),
      };
    }

    const config: RequestInit = {
      ...options,
      method,
      headers,
      body:
        body ?
          body instanceof FormData ?
            body
          : JSON.stringify(body)
        : undefined,
    };

    const isStreamRequest = (params && params.stream === true) || (body && (body as any).stream === true);

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('Content-Type');
      let body = null;

      if (isStreamRequest) {
        body = response.body;
      } else if (contentType && contentType.includes('application/json')) {
        const rawBody = await response.json();
        body = convertKeysToCamelCase(rawBody, skipCamelKeys);
      } else {
        body = await response.text();
      }

      handleResponse(response, body, config);

      return body;
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        throw new Errors.APIConnectionError('API Connection Error', error);
      }
      if (error.type === 'request-timeout') {
        throw new Errors.APITimeoutError('API Timeout Error', error);
      }
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Errors.APIError('An unknown error occurred');
      }
    }
  }

  async _get<T>(endpoint: string, params?: Record<string, any>, options: RequestOptions = {}) {
    return (await this._request('GET', endpoint, { ...options, params })) as T;
  }

  async _post<T>(endpoint: string, data?: any, options: RequestOptions = {}) {
    return (await this._request('POST', endpoint, { ...options, body: data })) as T;
  }

  async _patch<T>(endpoint: string, data?: any, options: RequestOptions = {}) {
    return (await this._request('PATCH', endpoint, { ...options, body: data })) as T;
  }

  async _put<T>(endpoint: string, data?: any, options: RequestOptions = {}) {
    return (await this._request('PUT', endpoint, { ...options, body: data })) as T;
  }

  async _delete<T>(endpoint: string, options: RequestOptions = {}) {
    return (await this._request('DELETE', endpoint, options)) as T;
  }
}

export function handleResponse(response: Response, body: any, request?: RequestInit): void {
  if (!response.ok) {
    const message = body && body.message ? body.message : response.statusText;
    const headers = response.headers as unknown as Headers;
    if (response.status >= 400 && response.status < 500) {
      switch (response.status) {
        case 400:
          throw new Errors.BadRequestError(message, response.status, body, headers, request);
        case 401:
          throw new Errors.UnauthorizedError(message, response.status, body, headers, request);
        case 403:
          throw new Errors.ForbiddenError(message, response.status, body, headers, request);
        case 404:
          throw new Errors.NotFoundError(message, response.status, body, headers, request);
        case 405:
          throw new Errors.MethodNotAllowedError(message, response.status, body, headers, request);
        case 409:
          throw new Errors.ConflictError(message, response.status, body, headers, request);
        case 429:
          throw new Errors.TooManyRequestsError(message, response.status, body, headers, request);
        default:
          throw new Errors.APIError(message, response.status, body, headers, request);
      }
    } else if (response.status >= 500) {
      throw new Errors.InternalServerError(message, response.status, body, headers, request);
    }
    throw new Errors.APIError(message, response.status, body, headers, request);
  }
}
