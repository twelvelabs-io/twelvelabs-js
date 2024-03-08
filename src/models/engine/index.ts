export interface EngineResponse {
  id: string;
  author: string;
  allowedEngineOptions: string[];
  ready: boolean;
  finetune: boolean;
}

export class Engine {
  id: string;
  author: string;
  allowedEngineOptions: string[];
  ready: boolean;
  finetune: boolean;

  constructor(res: EngineResponse) {
    this.id = res.id;
    this.author = res.author;
    this.allowedEngineOptions = res.allowedEngineOptions;
    this.ready = res.ready;
    this.finetune = res.finetune;
  }
}
