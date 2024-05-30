import FormData from 'form-data';
import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { TwelveLabs } from '../..';
import { CreateEmbedParams, CreateEmbeddingsTaskVideoParams } from './interfaces';
import path from 'path';
import { createReadStream } from 'fs';

export class EmbedTask extends APIResource {
  async retrieve(id: string, options: RequestOptions = {}): Promise<Models.EmbeddingsTask> {
    const res = await this._get<Models.EmbeddingsTask>(`embed/tasks/${id}`, {}, options);
    return new Models.EmbeddingsTask(this, res);
  }

  async create(
    engineName: string,
    { file, url, startOffsetSec, endOffsetSec, clipLength, scopes }: CreateEmbeddingsTaskVideoParams,
    options: RequestOptions = {},
  ): Promise<Models.EmbeddingsTask> {
    if (!file && !url) {
      throw new Error('Either video file or url must be provided');
    }

    const formData = new FormData();

    formData.append('engine_name', engineName);
    if (url) formData.append('video_url', url);
    if (startOffsetSec) formData.append('video_start_offset_sec', startOffsetSec);
    if (endOffsetSec) formData.append('video_end_offset_sec', endOffsetSec);
    if (clipLength) formData.append('video_clip_length', clipLength);
    if (scopes) formData.append('video_embedding_scope', scopes);

    if (typeof file === 'string') {
      const filePath = path.resolve(file);
      const fileStream = createReadStream(filePath);
      const fileName = path.basename(filePath);
      formData.append('video_file', fileStream, fileName);
    } else if (file) {
      formData.append('video_file', file);
    }

    const { id } = await this._post<{ id: string }>('embed/tasks', formData, options);
    const task = await this.retrieve(id);
    return task;
  }

  async createBulk(
    engineName: string,
    videos: CreateEmbeddingsTaskVideoParams[],
    options: RequestOptions = {},
  ): Promise<Models.EmbeddingsTask[]> {
    const tasks: Models.EmbeddingsTask[] = [];
    for (const videoParams of videos) {
      try {
        const task = await this.create(engineName, videoParams, options);
        tasks.push(task);
      } catch (e) {
        console.error(`Error creating task with video: ${e}`);
      }
    }
    return tasks;
  }

  async status(taskId: string, options: RequestOptions = {}): Promise<Models.EmbeddingsTaskStatus> {
    const res = await this._get<Models.EmbeddingsTaskStatus>(`embed/tasks/${taskId}/status`, {}, options);
    return new Models.EmbeddingsTaskStatus(res);
  }
}

export class Embed extends APIResource {
  task: EmbedTask;

  constructor(client: TwelveLabs) {
    super(client);
    this.task = new EmbedTask(client);
  }

  async create(
    { engineName, text, textTruncate }: CreateEmbedParams,
    options: RequestOptions = {},
  ): Promise<Models.CreateEmbeddingsResult> {
    const formData = new FormData();

    formData.append('engine_name', engineName);
    formData.append('text', text);
    formData.append('text_truncate', textTruncate);

    const res = await this._post<Models.CreateEmbeddingsResult>('embed', formData, options);
    return new Models.CreateEmbeddingsResult(res);
  }
}
