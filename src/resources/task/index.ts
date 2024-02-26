import { APIClient, RequestOptions } from '../../core';
import * as Models from '../../models';
import { convertKeysToSnakeCase, removeUndefinedValues } from '../../util';

export class Task extends APIClient {
  async retrieve(id: string, options: RequestOptions = {}): Promise<Models.Task> {
    const res = await this._get<Models.TaskResponse>(`tasks/${id}`, {}, options);
    return new Models.Task(this, res);
  }
}
