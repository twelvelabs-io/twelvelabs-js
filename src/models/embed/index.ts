export interface Embedding {
  float: number[];
}

export interface CreateEmbeddingsResultResponse {
  engineName: string;
  textEmbedding: Embedding;
}

export class CreateEmbeddingsResult {
  engineName: string;
  textEmbedding: Embedding;

  constructor(data: CreateEmbeddingsResultResponse) {
    this.engineName = data.engineName;
    this.textEmbedding = data.textEmbedding;
  }
}

export interface EmbeddingsTaskStatusResponse {
  id: string;
  engineName: string;
  status: string;
}

export class EmbeddingsTaskStatus {
  id: string;
  engineName: string;
  status: string;

  constructor(data: EmbeddingsTaskStatusResponse) {
    this.id = data.id;
    this.engineName = data.engineName;
    this.status = data.status;
  }
}

export interface VideoEmbedding {
  startOffsetSec: number;
  endOffsetSec: number;
  embeddingScope: string;
  embedding: Embedding;
}

export interface EmbeddingsTaskResponse {
  id: string;
  engineName: string;
  status: string;
  videoEmbeddings?: VideoEmbedding[];
}

export class EmbeddingsTask {
  id: string;
  engineName: string;
  status: string;
  videoEmbeddings?: VideoEmbedding[];

  constructor(data: EmbeddingsTaskResponse) {
    this.id = data.id;
    this.engineName = data.engineName;
    this.status = data.status;
    this.videoEmbeddings = data.videoEmbeddings;
  }
}
