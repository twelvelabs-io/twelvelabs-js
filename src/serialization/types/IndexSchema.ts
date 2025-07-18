/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";
import { IndexModelsItem } from "./IndexModelsItem";

export const IndexSchema: core.serialization.ObjectSchema<serializers.IndexSchema.Raw, TwelvelabsApi.IndexSchema> =
    core.serialization.object({
        id: core.serialization.property("_id", core.serialization.string().optional()),
        createdAt: core.serialization.property("created_at", core.serialization.string().optional()),
        updatedAt: core.serialization.property("updated_at", core.serialization.string().optional()),
        expiresAt: core.serialization.property("expires_at", core.serialization.string().optional()),
        indexName: core.serialization.property("index_name", core.serialization.string().optional()),
        totalDuration: core.serialization.property("total_duration", core.serialization.number().optional()),
        videoCount: core.serialization.property("video_count", core.serialization.number().optional()),
        models: core.serialization.list(IndexModelsItem).optional(),
        addons: core.serialization.list(core.serialization.string()).optional(),
    });

export declare namespace IndexSchema {
    export interface Raw {
        _id?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
        expires_at?: string | null;
        index_name?: string | null;
        total_duration?: number | null;
        video_count?: number | null;
        models?: IndexModelsItem.Raw[] | null;
        addons?: string[] | null;
    }
}
