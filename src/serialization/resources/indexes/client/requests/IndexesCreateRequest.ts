/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as TwelvelabsApi from "../../../../../api/index";
import * as core from "../../../../../core";
import { IndexesCreateRequestModelsItem } from "../../types/IndexesCreateRequestModelsItem";

export const IndexesCreateRequest: core.serialization.Schema<
    serializers.IndexesCreateRequest.Raw,
    TwelvelabsApi.IndexesCreateRequest
> = core.serialization.object({
    indexName: core.serialization.property("index_name", core.serialization.string()),
    models: core.serialization.list(IndexesCreateRequestModelsItem),
    addons: core.serialization.list(core.serialization.string()).optional(),
});

export declare namespace IndexesCreateRequest {
    export interface Raw {
        index_name: string;
        models: IndexesCreateRequestModelsItem.Raw[];
        addons?: string[] | null;
    }
}
