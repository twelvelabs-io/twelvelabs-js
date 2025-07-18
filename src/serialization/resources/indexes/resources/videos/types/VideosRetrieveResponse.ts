/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../index";
import * as TwelvelabsApi from "../../../../../../api/index";
import * as core from "../../../../../../core";
import { VideosRetrieveResponseSystemMetadata } from "./VideosRetrieveResponseSystemMetadata";
import { HlsObject } from "../../../../../types/HlsObject";
import { VideosRetrieveResponseEmbedding } from "./VideosRetrieveResponseEmbedding";
import { TranscriptionData } from "../../../../../types/TranscriptionData";
import { TranscriptionDataItem } from "../../../../../types/TranscriptionDataItem";

export const VideosRetrieveResponse: core.serialization.ObjectSchema<
    serializers.indexes.VideosRetrieveResponse.Raw,
    TwelvelabsApi.indexes.VideosRetrieveResponse
> = core.serialization.object({
    id: core.serialization.property("_id", core.serialization.string().optional()),
    createdAt: core.serialization.property("created_at", core.serialization.string().optional()),
    updatedAt: core.serialization.property("updated_at", core.serialization.string().optional()),
    indexedAt: core.serialization.property("indexed_at", core.serialization.string().optional()),
    systemMetadata: core.serialization.property("system_metadata", VideosRetrieveResponseSystemMetadata.optional()),
    userMetadata: core.serialization.property(
        "user_metadata",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    ),
    hls: HlsObject.optional(),
    embedding: VideosRetrieveResponseEmbedding.optional(),
    transcription: TranscriptionData.optional(),
});

export declare namespace VideosRetrieveResponse {
    export interface Raw {
        _id?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
        indexed_at?: string | null;
        system_metadata?: VideosRetrieveResponseSystemMetadata.Raw | null;
        user_metadata?: Record<string, unknown> | null;
        hls?: HlsObject.Raw | null;
        embedding?: VideosRetrieveResponseEmbedding.Raw | null;
        transcription?: TranscriptionData.Raw | null;
    }
}
