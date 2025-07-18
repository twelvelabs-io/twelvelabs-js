import { RequestOptions } from '../../core';
import * as Models from '../../models';
import {
  attachFormFile,
  convertKeysToSnakeCase,
  FormDataImpl,
  handleComparisonParams,
  removeUndefinedValues,
} from '../../util';
import { CreateTaskParams, ListTaskParams, TransferImportParams } from './interfaces';
import { APIResource } from '../../resource';
import { TwelveLabs } from '../..';

export class TaskTransfer extends APIResource {
  async importVideos(
    { integrationId, ...restParams }: TransferImportParams,
    options: RequestOptions = {},
  ): Promise<Models.TransferImportResponse> {
    const _params = convertKeysToSnakeCase(restParams);
    const res = await this._post<Models.TransferImportResponse>(
      `tasks/transfers/import/${integrationId}`,
      removeUndefinedValues(_params),
      options,
    );
    return res;
  }

  async importStatus(
    integrationId: string,
    indexId: string,
    options: RequestOptions = {},
  ): Promise<Models.TransferImportStatusResponse> {
    const _params = convertKeysToSnakeCase({ indexId });
    const res = await this._get<Models.TransferImportStatusResponse>(
      `tasks/transfers/import/${integrationId}/status`,
      removeUndefinedValues(_params),
      options,
    );
    return res;
  }

  async importLogs(integrationId: string, options: RequestOptions = {}): Promise<Models.TransferImportLog[]> {
    const res = await this._get<{ data: Models.TransferImportLog[] }>(
      `tasks/transfers/import/${integrationId}/logs`,
      {},
      options,
    );
    return res.data || [];
  }
}

export class Task extends APIResource {
  transfers: TaskTransfer;

  constructor(client: TwelveLabs) {
    super(client);
    this.transfers = new TaskTransfer(client);
  }

  async retrieve(id: string, options: RequestOptions = {}): Promise<Models.Task> {
    const res = await this._get<Models.TaskResponse>(`tasks/${id}`, {}, options);
    return new Models.Task(this, res);
  }

  async list(
    { createdAt, updatedAt, ...restParams }: ListTaskParams = {},
    options: RequestOptions = {},
  ): Promise<Models.Task[]> {
    const _params = convertKeysToSnakeCase(restParams);
    handleComparisonParams(_params, 'created_at', createdAt);
    handleComparisonParams(_params, 'updated_at', updatedAt);
    const res = await this._get<{ data: Models.TaskResponse[] }>(
      'tasks',
      removeUndefinedValues(_params),
      options,
    );
    return res.data.map((v) => new Models.Task(this, v));
  }

  async listPagination(
    { createdAt, updatedAt, ...restParams }: ListTaskParams = {},
    options: RequestOptions = {},
  ): Promise<Models.TaskListWithPagination> {
    const originParams = { createdAt, updatedAt, ...restParams };
    const _params = convertKeysToSnakeCase(restParams);
    handleComparisonParams(_params, 'created_at', createdAt);
    handleComparisonParams(_params, 'updated_at', updatedAt);
    const res = await this._get<{ data: Models.TaskResponse[]; pageInfo: Models.PageInfo }>(
      'tasks',
      removeUndefinedValues(_params),
      options,
    );
    return new Models.TaskListWithPagination(this, originParams, res.data, res.pageInfo);
  }

  async create(body: CreateTaskParams, options: RequestOptions = {}): Promise<Models.Task> {
    if (!body.file && !body.url) {
      throw new Error('Either file or url must be provided');
    }

    const formData = new FormDataImpl();

    formData.append('index_id', body.indexId);
    if (body.url) formData.append('video_url', body.url);
    if (body.enableVideoStream) formData.append('enable_video_stream', String(body.enableVideoStream));

    try {
      if (body.file) attachFormFile(formData, 'video_file', body.file);
    } catch (err) {
      throw err;
    }

    const res = await this._post<{ id: string }>('tasks', formData, options);

    return await this.retrieve(res.id);
  }

  async createBulk(
    indexId: string,
    {
      files,
      urls,
      enableVideoStream,
    }: {
      files?: (string | Buffer | null)[];
      urls?: string[];
      enableVideoStream?: boolean;
    },
    options: RequestOptions = {},
  ): Promise<Models.Task[]> {
    if (!files && !urls) {
      throw new Error('Either files or urls must be provided');
    }

    const tasks: Models.Task[] = [];

    if (files) {
      for (const file of files) {
        try {
          const task = await this.create({ indexId, file, enableVideoStream }, options);
          tasks.push(task);
        } catch (e) {
          console.error(`Error processing file ${file}:`, e);
        }
      }
    }

    if (urls) {
      for (const url of urls) {
        try {
          const task = await this.create({ indexId, url, enableVideoStream }, options);
          tasks.push(task);
        } catch (e) {
          console.error(`Error processing url ${url}:`, e);
        }
      }
    }

    return tasks;
  }

  async delete(id: string, options: RequestOptions = {}): Promise<void> {
    await this._delete<void>(`tasks/${id}`, options);
  }
}
