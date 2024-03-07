import path from 'path';
import FormData from 'form-data';
import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { convertKeysToSnakeCase, handleComparisonParams, removeUndefinedValues } from '../../util';
import { CreateTaskParams, ListTaskParams } from './interfaces';
import { createReadStream } from 'fs';
import { APIResource } from '../../resource';

export class Task extends APIResource {
  async retrieve(id: string, options: RequestOptions = {}): Promise<Models.Task> {
    const res = await this._get<Models.TaskResponse>(`tasks/${id}`, {}, options);
    return new Models.Task(this, res);
  }

  async list(
    { id, createdAt, updatedAt, ...restParams }: ListTaskParams = {},
    options: RequestOptions = {},
  ): Promise<Models.Task[]> {
    const _params = convertKeysToSnakeCase({
      ...restParams,
      _id: id,
    });
    handleComparisonParams(_params, 'createdAt', createdAt);
    handleComparisonParams(_params, 'updatedAt', updatedAt);
    const res = await this._get<{ data: Models.TaskResponse[] }>(
      'tasks',
      removeUndefinedValues(_params),
      options,
    );
    return res.data.map((v) => new Models.Task(this, v));
  }

  async listPagination(
    { id, createdAt, updatedAt, ...restParams }: ListTaskParams = {},
    options: RequestOptions = {},
  ): Promise<Models.TaskListWithPagination> {
    const originParams = { id, ...restParams };
    const _params = convertKeysToSnakeCase({
      ...restParams,
      _id: id,
    });
    handleComparisonParams(_params, 'updatedAt', updatedAt);
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

    const formData = new FormData();

    formData.append('index_id', body.indexId);
    if (body.url) formData.append('video_url', body.url);
    if (body.transcriptionUrl) formData.append('transcription_url', body.transcriptionUrl);
    if (body.language) formData.append('language', body.language);

    if (typeof body.file === 'string') {
      const filePath = path.resolve(body.file);
      const fileStream = createReadStream(filePath);
      const fileName = path.basename(filePath);
      formData.append('video_file', fileStream, fileName);
    } else if (body.file) {
      formData.append('video_file', body.file);
    }

    if (typeof body.transcriptionFile === 'string') {
      const filePath = path.resolve(body.transcriptionFile);
      const fileStream = createReadStream(filePath);
      const fileName = path.basename(filePath);
      formData.append('transcription_file', fileStream, fileName);
      formData.append('provide_transcription', true);
    } else if (body.transcriptionFile) {
      formData.append('transcription_file', body.transcriptionFile);
      formData.append('provide_transcription', true);
    }

    const res = await this._post<{ id: string }>('tasks', formData, options);

    return await this.retrieve(res.id);
  }

  async createBulk(
    indexId: string,
    {
      files,
      urls,
      language,
    }: {
      files?: (string | Buffer | null)[];
      urls?: string[];
      language?: string;
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
          const task = await this.create({ indexId, file, language }, options);
          tasks.push(task);
        } catch (e) {
          console.error(`Error processing file ${file}:`, e);
        }
      }
    }

    if (urls) {
      for (const url of urls) {
        try {
          const task = await this.create({ indexId, url, language }, options);
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

  async status(indexId: string, options: RequestOptions = {}): Promise<Models.TaskStatus> {
    const params = { index_id: indexId };
    const res = await this._get<Models.TaskStatus>(`tasks/status`, convertKeysToSnakeCase(params), options);
    return res;
  }

  async transfer(file: Buffer | NodeJS.ReadableStream, options: RequestOptions = {}): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await this._post<void>(`tasks/transfers`, formData, options);
  }

  async externalProvider(indexId: string, url: string, options: RequestOptions = {}): Promise<Models.Task> {
    const body = { index_id: indexId, url };
    const res = await this._post<{ id: string }>(
      `tasks/external-provider`,
      convertKeysToSnakeCase(body),
      options,
    );
    return await this.retrieve(res.id);
  }
}
