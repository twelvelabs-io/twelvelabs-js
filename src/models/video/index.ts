import { RequestOptions } from '../../core';
import * as Resources from '../../resources';
import { CreateEmbeddingsResult, CreateEmbeddingsResultResponse } from '../embed';
import { GenerateOpenEndedTextResult, GenerateSummarizeResult, GenerateGistResult } from '../generate';
import { PageInfo } from '../interfaces';

export interface VideoResponse {
  id: string;
  systemMetadata: VideoMetadata;
  userMetadata?: Record<string, any>;
  hls?: VideoHLS;
  source?: VideoSource;
  createdAt: string;
  updatedAt?: string;
  embedding?: CreateEmbeddingsResultResponse;
}

export class Video {
  private readonly _resource: Resources.Video;
  private readonly _indexId: string;
  id: string;
  systemMetadata: VideoMetadata & Record<string, any>;
  userMetadata?: Record<string, any>;
  hls?: VideoHLS;
  source?: VideoSource;
  createdAt: string;
  updatedAt?: string;
  embedding?: CreateEmbeddingsResult;

  constructor(resource: Resources.Video, indexId: string, data: VideoResponse) {
    this._resource = resource;
    this._indexId = indexId;
    this.id = data.id;
    this.systemMetadata = data.systemMetadata;
    this.userMetadata = data.userMetadata;
    this.hls = data.hls;
    this.source = data.source;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    if (data.embedding) {
      this.embedding = new CreateEmbeddingsResult(data.embedding);
    }
  }

  // Video related methods

  async update(params: Resources.UpdateVideoParams, options: RequestOptions = {}): Promise<void> {
    return await this._resource.update(this._indexId, this.id, params, options);
  }

  async delete(options: RequestOptions = {}): Promise<void> {
    return await this._resource.delete(this._indexId, this.id, options);
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
  ): Promise<GenerateSummarizeResult> {
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
  name?: string;
  url?: string;
}
