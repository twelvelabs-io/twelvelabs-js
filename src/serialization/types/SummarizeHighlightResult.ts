/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";
import { SummarizeHighlightResultHighlightsItem } from "./SummarizeHighlightResultHighlightsItem";
import { TokenUsage } from "./TokenUsage";

export const SummarizeHighlightResult: core.serialization.ObjectSchema<
    serializers.SummarizeHighlightResult.Raw,
    TwelvelabsApi.SummarizeHighlightResult
> = core.serialization.object({
    id: core.serialization.string().optional(),
    highlights: core.serialization.list(SummarizeHighlightResultHighlightsItem).optional(),
    usage: TokenUsage.optional(),
});

export declare namespace SummarizeHighlightResult {
    export interface Raw {
        id?: string | null;
        highlights?: SummarizeHighlightResultHighlightsItem.Raw[] | null;
        usage?: TokenUsage.Raw | null;
    }
}
