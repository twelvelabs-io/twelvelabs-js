/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";
import { TokenUsage } from "./TokenUsage";

export const StreamEndResponseMetadata: core.serialization.ObjectSchema<
    serializers.StreamEndResponseMetadata.Raw,
    TwelvelabsApi.StreamEndResponseMetadata
> = core.serialization.object({
    generationId: core.serialization.property("generation_id", core.serialization.string().optional()),
    usage: TokenUsage.optional(),
});

export declare namespace StreamEndResponseMetadata {
    export interface Raw {
        generation_id?: string | null;
        usage?: TokenUsage.Raw | null;
    }
}
