import fetch, { RequestInit, Response } from 'node-fetch';
import { API_KEY_HEADER } from './constants';
import * as Errors from './error';
import { convertKeysToCamelCase } from './util';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type RequestOptions = RequestInit & { json?: any; params?: Record<string, any> };

interface APIClientOptions {
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

  private async request(
    method: HttpMethod,
    endpoint: string,
    { params, json, ...options }: RequestOptions = {},
  ): Promise<any> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.keys(params).forEach((key) => url.searchParams.append(key, params![key]));
    }

    const headers = {
      'Content-Type': 'application/json',
      [API_KEY_HEADER]: this.apiKey,
      ...options.headers,
    };

    const config: RequestInit = {
      method,
      headers,
      body: json ? JSON.stringify(json) : undefined,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('Content-Type');
      let body = null;

      if (contentType && contentType.includes('application/json')) {
        const rawBody = await response.json();
        body = convertKeysToCamelCase(rawBody);
      } else {
        body = await response.text();
      }

      handleResponse(response, body);

      return body;
    } catch (error) {
      if (error instanceof fetch.FetchError) {
        if (error.code === 'ENOTFOUND') {
          throw new Errors.APIConnectionError('API Connection Error', error);
        } else if (error.type === 'request-timeout') {
          throw new Errors.APITimeoutError('API Timeout Error', error);
        }
      }
      if (error instanceof Error) {
        throw new Errors.APIError(error.message);
      } else {
        throw new Errors.APIError('An unknown error occurred');
      }
    }
  }

  async _get<T>(endpoint: string, params?: Record<string, any>, options: RequestOptions = {}) {
    return (await this.request('GET', endpoint, { ...options, params })) as T;
  }

  async _post<T>(endpoint: string, data?: any, options: RequestOptions = {}) {
    return (await this.request('POST', endpoint, { ...options, json: data })) as T;
  }

  async _patch<T>(endpoint: string, data?: any, options: RequestOptions = {}) {
    return (await this.request('PATCH', endpoint, { ...options, json: data })) as T;
  }

  async _put<T>(endpoint: string, data?: any, options: RequestOptions = {}) {
    return (await this.request('PUT', endpoint, { ...options, json: data })) as T;
  }

  async _delete<T>(endpoint: string, options: RequestOptions = {}) {
    return (await this.request('DELETE', endpoint, options)) as T;
  }
}

export function handleResponse(response: Response, body: any): void {
  if (!response.ok) {
    const message = body && body.message ? body.message : response.statusText;
    const headers = response.headers as unknown as Headers;
    if (response.status >= 400 && response.status < 500) {
      switch (response.status) {
        case 400:
          throw new Errors.BadRequestError(message, response.status, body, headers);
        case 401:
          throw new Errors.UnauthorizedError(message, response.status, body, headers);
        case 403:
          throw new Errors.ForbiddenError(message, response.status, body, headers);
        case 404:
          throw new Errors.NotFoundError(message, response.status, body, headers);
        case 405:
          throw new Errors.MethodNotAllowedError(message, response.status, body, headers);
        case 409:
          throw new Errors.ConflictError(message, response.status, body, headers);
        case 429:
          throw new Errors.TooManyRequestsError(message, response.status, body, headers);
        default:
          throw new Errors.APIError(message, response.status, body, headers);
      }
    } else if (response.status >= 500) {
      throw new Errors.InternalServerError(message, response.status, body, headers);
    }
    throw new Errors.APIError(message, response.status, body, headers);
  }
}
