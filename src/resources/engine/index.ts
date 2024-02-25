import { APIClient, RequestOptions } from '../../core';
import * as Models from '../../models';

export class Engine extends APIClient {
  async retrieve(id: string, options: RequestOptions = {}): Promise<Models.Engine> {
    const endpoint = `engines/${id}`;
    const res = await this._get<Models.EngineResponse>(endpoint, {}, options);
    return new Models.Engine(res);
  }

  async list(options: RequestOptions = {}): Promise<Models.Engine[]> {
    const endpoint = 'engines';
    const res = await this._get<{ data: Models.EngineResponse[] }>(endpoint, {}, options);
    return res.data.map((v) => new Models.Engine(v));
  }
}
