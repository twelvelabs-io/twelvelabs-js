/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as TwelvelabsApi from "../../../../api/index";
import * as core from "../../../../core";

export const SearchCreateRequestSortOption: core.serialization.Schema<
    serializers.SearchCreateRequestSortOption.Raw,
    TwelvelabsApi.SearchCreateRequestSortOption
> = core.serialization.enum_(["score", "clip_count"]);

export declare namespace SearchCreateRequestSortOption {
    export type Raw = "score" | "clip_count";
}
