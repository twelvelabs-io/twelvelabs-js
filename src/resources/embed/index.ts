import FormData from 'form-data';
import { RequestOptions } from '../../core';
import * as Models from '../../models';
import { APIResource } from '../../resource';
import { TwelveLabs } from '../..';
import {
  CreateEmbedParams,
  CreateEmbeddingsTaskVideoParams,
  ListEmbeddingsTaskParams,
  RetrieveEmbeddingsTaskParams,
} from './interfaces';
import { attachFormFile, removeUndefinedValues, convertKeysToSnakeCase } from '../../util';

export class EmbedTask extends APIResource {
  async retrieve(
    id: string,
    params: RetrieveEmbeddingsTaskParams = {},
    options: RequestOptions = {},
  ): Promise<Models.EmbeddingsTask> {
    const { embeddingOption } = params;

    const path = `embed/tasks/${id}`;
    const queryParams = embeddingOption?.length ? { embedding_option: embeddingOption } : undefined;

    const res = await this._get<Models.EmbeddingsTaskResponse>(path, queryParams, options);
    return new Models.EmbeddingsTask(this, res);
  }

  async list(
    params: ListEmbeddingsTaskParams = {},
    options: RequestOptions = {},
  ): Promise<Models.EmbeddingsTask[]> {
    const _params = convertKeysToSnakeCase(params);
    const res = await this._get<{ data: Models.EmbeddingsTaskResponse[] }>(
      'embed/tasks',
      removeUndefinedValues(_params),
      options,
    );
    return res.data.map((v) => new Models.EmbeddingsTask(this, v));
  }

  async listPagination(
    params: ListEmbeddingsTaskParams = {},
    options: RequestOptions = {},
  ): Promise<Models.EmbeddingsTaskListWithPagination> {
    const _params = convertKeysToSnakeCase(params);
    const res = await this._get<{ data: Models.EmbeddingsTaskResponse[]; pageInfo: Models.PageInfo }>(
      'embed/tasks',
      removeUndefinedValues(_params),
      options,
    );
    return new Models.EmbeddingsTaskListWithPagination(this, params, res.data, res.pageInfo);
  }

  async create(
    modelName: 'Marengo-retrieval-2.7',
    { file, url, startOffsetSec, endOffsetSec, clipLength, scopes }: CreateEmbeddingsTaskVideoParams,
    options: RequestOptions = {},
  ): Promise<Models.EmbeddingsTask | undefined> {
    if (!file && !url) {
      throw new Error('Either video file or url must be provided');
    }

    const formData = new FormData();

    formData.append('model_name', modelName);
    if (url) formData.append('video_url', url);
    if (startOffsetSec) formData.append('video_start_offset_sec', startOffsetSec);
    if (endOffsetSec) formData.append('video_end_offset_sec', endOffsetSec);
    if (clipLength) formData.append('video_clip_length', clipLength);
    if (scopes) {
      scopes.forEach((scope) => formData.append('video_embedding_scope', scope));
    }

    try {
      if (file) attachFormFile(formData, 'video_file', file);
    } catch (err) {
      throw err;
    }

    const { id } = await this._post<{ id: string }>('embed/tasks', formData, options);
    const task = await this.retrieve(id);
    return task;
  }

  async createBulk(
    modelName: 'Marengo-retrieval-2.7',
    videos: CreateEmbeddingsTaskVideoParams[],
    options: RequestOptions = {},
  ): Promise<Models.EmbeddingsTask[]> {
    const tasks: Models.EmbeddingsTask[] = [];
    for (const videoParams of videos) {
      try {
        const task = await this.create(modelName, videoParams, options);
        tasks.push(task);
      } catch (e) {
        console.error(`Error creating task with video: ${e}`);
      }
    }
    return tasks;
  }

  async status(taskId: string, options: RequestOptions = {}): Promise<Models.EmbeddingsTaskStatus> {
    const res = await this._get<Models.EmbeddingsTaskStatusResponse>(
      `embed/tasks/${taskId}/status`,
      {},
      options,
    );
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
    {
      modelName,
      text,
      textTruncate,
      audioUrl,
      audioFile,
      audioStartOffsetSec,
      imageUrl,
      imageFile,
    }: CreateEmbedParams,
    options: RequestOptions = {},
  ): Promise<Models.CreateEmbeddingsResult> {
    if (!text && !audioUrl && !audioFile && !imageUrl && !imageFile) {
      throw new Error('At least one of text, audioUrl, audioFile, imageUrl, imageFile must be provided');
    }

    const formData = new FormData();

    formData.append('model_name', modelName);
    if (text) formData.append('text', text);
    if (textTruncate) formData.append('text_truncate', textTruncate);
    if (audioUrl) formData.append('audio_url', audioUrl);
    if (imageUrl) formData.append('image_url', imageUrl);
    if (audioFile) attachFormFile(formData, 'audio_file', audioFile);
    if (imageFile) attachFormFile(formData, 'image_file', imageFile);
    if (audioStartOffsetSec) formData.append('audio_start_offset_sec', audioStartOffsetSec);

    const res = await this._post<Models.CreateEmbeddingsResultResponse>('embed', formData, options);
    return new Models.CreateEmbeddingsResult(res);
  }
}
