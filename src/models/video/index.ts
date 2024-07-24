import { RequestOptions } from '../../core';
import * as Resources from '../../resources';
import { GenerateGistResult, GenerateOpenEndedTextResult } from '../generate';
import { PageInfo } from '../interfaces';

export interface VideoResponse {
  id: string;
  metadata: VideoMetadata;
  hls?: VideoHLS;
  source?: VideoSource;
  indexedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export class Video {
  private readonly _resource: Resources.Video;
  private readonly _indexId: string;
  id: string;
  metadata: VideoMetadata & Record<string, any>;
  hls?: VideoHLS;
  source?: VideoSource;
  indexedAt?: string;
  createdAt: string;
  updatedAt?: string;

  constructor(resource: Resources.Video, indexId: string, data: VideoResponse) {
    this._resource = resource;
    this._indexId = indexId;
    this.id = data.id;
    this.metadata = data.metadata;
    this.hls = data.hls;
    this.source = data.source;
    this.indexedAt = data.indexedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Video related methods

  async update(params: Resources.UpdateVideoParams, options: RequestOptions = {}): Promise<void> {
    return await this._resource.update(this._indexId, this.id, params, options);
  }

  async delete(options: RequestOptions = {}): Promise<void> {
    return await this._resource.delete(this._indexId, this.id, options);
  }

  async transcription(
    filter?: Resources.VideoFilterOptions,
    options: RequestOptions = {},
  ): Promise<VideoValue[]> {
    return await this._resource.transcription(this._indexId, this.id, filter, options);
  }

  async textInVideo(
    filter: Resources.VideoFilterOptions = {},
    options: RequestOptions = {},
  ): Promise<VideoValue[]> {
    return await this._resource.textInVideo(this._indexId, this.id, filter, options);
  }

  async logo(filter: Resources.VideoFilterOptions = {}, options: RequestOptions = {}): Promise<VideoValue[]> {
    return await this._resource.logo(this._indexId, this.id, filter, options);
  }

  async thumbnail(time?: number, options: RequestOptions = {}): Promise<string> {
    return await this._resource.thumbnail(this._indexId, this.id, time, options);
  }

  // Generate related methods

  async generateGist(
    types: Resources.GenerateGistType[],
    options: RequestOptions = {},
  ): Promise<GenerateGistResult> {
    return await this._resource._client.generate.gist(this.id, types, options);
  }

  async generateSummarize(
    type: Resources.GenerateSummarizeType,
    prompt?: string,
    temperature?: number,
    options: RequestOptions = {},
  ): Promise<GenerateGistResult> {
    return await this._resource._client.generate.summarize(this.id, type, prompt, temperature, options);
  }

  async generateText(
    prompt: string,
    temperature?: number,
    options: RequestOptions = {},
  ): Promise<GenerateOpenEndedTextResult> {
    return await this._resource._client.generate.text(this.id, prompt, temperature, options);
  }
}

export class VideoListWithPagination {
  private readonly _resource: Resources.Video;
  private readonly _originParams: Resources.ListVideoParams;
  private readonly _indexId: string;
  data: Video[];
  pageInfo: PageInfo;

  constructor(
    resource: Resources.Video,
    originParams: Resources.ListVideoParams,
    indexId: string,
    data: VideoResponse[],
    pageInfo: PageInfo,
  ) {
    this._resource = resource;
    this._originParams = originParams;
    this._indexId = indexId;
    this.data = data.map((v) => new Video(resource, indexId, v));
    this.pageInfo = pageInfo;
  }

  async next(): Promise<Video[] | null> {
    if (this.pageInfo.page >= this.pageInfo.totalPage) {
      return null;
    }
    const params = { ...this._originParams };
    params.page = this.pageInfo.page + 1;
    const res = await this._resource.listPagination(this._indexId, params);
    this.pageInfo = res.pageInfo;
    return res.data;
  }
}

interface VideoMetadata {
  filename: string;
  duration: number;
  fps: number;
  width: number;
  height: number;
  size: number;
}

export interface VideoHLS {
  videoUrl?: string;
  thumbnailUrls?: string[];
  status?: string;
  updatedAt: string;
}

export interface VideoValue {
  start: number;
  end: number;
  value: string;
}

export interface VideoSource {
  type: string;
  name: string;
  url?: string;
}
