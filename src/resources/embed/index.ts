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
    return new Models.EmbeddingsTask(res);
  }

  async create(
    engineName: string,
    { file, url, startOffsetSec, endOffsetSec, clipLength, scopes }: CreateEmbeddingsTaskVideoParams,
    options: RequestOptions = {},
  ): Promise<string> {
    if (!file && !url) {
      throw new Error('Either video file or url must be provided');
    }

    const formData = new FormData();

    formData.append('engine_name', engineName);
    if (url) formData.append('video_url', url);
    if (startOffsetSec) formData.append('video_start_offset_sec', url);
    if (endOffsetSec) formData.append('video_end_offset_sec', url);
    if (clipLength) formData.append('video_clip_length', url);
    if (scopes) formData.append('video_embedding_scope', url);

    if (typeof file === 'string') {
      const filePath = path.resolve(file);
      const fileStream = createReadStream(filePath);
      const fileName = path.basename(filePath);
      formData.append('video_file', fileStream, fileName);
    } else if (file) {
      formData.append('video_file', file);
    }

    const res = await this._post<{ id: string }>('embed/tasks', formData, options);
    return res.id;
  }

  async createBulk(
    engineName: string,
    videos: CreateEmbeddingsTaskVideoParams[],
    options: RequestOptions = {},
  ): Promise<string[]> {
    const taskIds: string[] = [];
    for (const videoParams of videos) {
      try {
        const taskId = await this.create(engineName, videoParams, options);
        taskIds.push(taskId);
      } catch (e) {
        console.error(`Error creating task with video: ${e}`);
      }
    }
    return taskIds;
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
