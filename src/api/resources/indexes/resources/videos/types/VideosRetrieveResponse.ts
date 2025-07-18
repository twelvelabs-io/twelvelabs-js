/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as TwelvelabsApi from "../../../../../index";

export interface VideosRetrieveResponse {
    /** The unique identifier of the video. */
    id?: string;
    /** A string indicating the date and time, in the RFC 3339 format ("YYYY-MM-DDTHH:mm:ssZ"), that the video indexing task was created. */
    createdAt?: string;
    /** A string indicating the date and time, in the RFC 3339 format ("YYYY-MM-DDTHH:mm:ssZ"), that the corresponding video indexing task was last updated. The platform updates this field every time the corresponding video indexing task transitions to a different state. */
    updatedAt?: string;
    /** A string indicating the date and time, in the RFC 3339 format ("YYYY-MM-DDTHH:mm:ssZ"), that the video indexing task has been completed. */
    indexedAt?: string;
    /** System-generated metadata about the video. */
    systemMetadata?: TwelvelabsApi.indexes.VideosRetrieveResponseSystemMetadata;
    /** User-generated metadata about the video. */
    userMetadata?: Record<string, unknown>;
    hls?: TwelvelabsApi.HlsObject;
    /** Contains the embedding and the associated information. The platform returns this field when the `embedding_option` parameter is specified in the request. */
    embedding?: TwelvelabsApi.indexes.VideosRetrieveResponseEmbedding;
    transcription?: TwelvelabsApi.TranscriptionData;
}
