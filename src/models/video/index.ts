import * as Resources from '../../resources';

export interface VideoResponse {
  id: string;
  metadata: VideoMetadata;
  createdAt: string;
  updatedAt?: string;
}

export class Video {
  private readonly _resource: Resources.Video;
  private readonly _indexId: string;
  id: string;
  metadata: VideoMetadata & Record<string, any>;
  createdAt: string;
  updatedAt?: string;

  constructor(resource: Resources.Video, indexId: string, data: VideoResponse) {
    this._resource = resource;
    this._indexId = indexId;
    this.id = data.id;
    this.metadata = data.metadata;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
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

export interface VideoValue {
  start: number;
  end: number;
  value: string;
}
