import * as Resources from '../../resources';
import { TokenPageInfo } from '../interfaces';

export interface ClassifyResultResponse {
  data: ClassifyVideoData[];
}

export class ClassifyResult {
  data: ClassifyVideoData[];
  constructor(data: ClassifyResultResponse) {
    this.data = data.data;
  }
}

export interface ClassifyPageResultResponse {
  data: ClassifyVideoData[];
  pageInfo: TokenPageInfo;
}

export class ClassifyPageResult {
  private readonly _resource: Resources.Classify;
  data: ClassifyVideoData[];
  pageInfo: TokenPageInfo;

  constructor(resource: Resources.Classify, data: ClassifyPageResultResponse) {
    this._resource = resource;
    this.data = data.data;
    this.pageInfo = data.pageInfo;
  }

  async next(): Promise<ClassifyVideoData[] | null> {
    const { nextPageToken } = this.pageInfo;
    if (!nextPageToken) {
      return null;
    }
    const res = await this._resource.byPageToken(nextPageToken);
    this.pageInfo = res.pageInfo;
    return res.data;
  }
}

export interface ClassifyDetailedScore {
  maxScore: number;
  avgScore: number;
  normalizedScore: number;
}

export interface ClassifyClip {
  start: number;
  end: number;
  score: number;
  option: string;
  prompt: string;
  thumbnail_url?: string;
  detailed_scores?: ClassifyDetailedScore;
}

export interface ClassifyClass {
  name: string;
  score: number;
  durationRatio: number;
  clips?: ClassifyClip[];
}

export interface ClassifyVideoData {
  videoId: string;
  classes: ClassifyClass[];
}
