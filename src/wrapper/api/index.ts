/**
 * Stable public API namespace over Fern-generated exports.
 *
 * Keep aliases for status constants that were renamed by the generated open
 * enum representation. The generated types continue to accept future response
 * values while these constants preserve existing imports.
 */
import * as GeneratedApi from "../../api";

export * from "../../api";
export * as embed from "./embed";

export type EmbeddingTaskResponseStatus = GeneratedApi.EmbeddingTaskResponseStatus;
export const EmbeddingTaskResponseStatus = GeneratedApi.EmbeddingTaskResponseStatusZero;
export type EmbeddingBatchStatus = GeneratedApi.EmbeddingBatchStatus;
export const EmbeddingBatchStatus = GeneratedApi.EmbeddingBatchStatusZero;
export type EmbeddingBatchItemStatus = GeneratedApi.EmbeddingBatchItemStatus;
export const EmbeddingBatchItemStatus = GeneratedApi.EmbeddingBatchItemStatusZero;
