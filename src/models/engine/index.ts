export interface EngineResponse {
  id: string;
  author: string;
  allowedIndexOptions: string[];
  ready: boolean;
  finetune: boolean;
}

export class Engine {
  id: string;
  author: string;
  allowedIndexOptions: string[];
  ready: boolean;
  finetune: boolean;

  constructor(res: EngineResponse) {
    this.id = res.id;
    this.author = res.author;
    this.allowedIndexOptions = res.allowedIndexOptions;
    this.ready = res.ready;
    this.finetune = res.finetune;
  }
}
