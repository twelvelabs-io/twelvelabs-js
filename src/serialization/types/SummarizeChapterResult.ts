/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";
import { SummarizeChapterResultChaptersItem } from "./SummarizeChapterResultChaptersItem";
import { TokenUsage } from "./TokenUsage";

export const SummarizeChapterResult: core.serialization.ObjectSchema<
    serializers.SummarizeChapterResult.Raw,
    TwelvelabsApi.SummarizeChapterResult
> = core.serialization.object({
    id: core.serialization.string().optional(),
    chapters: core.serialization.list(SummarizeChapterResultChaptersItem).optional(),
    usage: TokenUsage.optional(),
});

export declare namespace SummarizeChapterResult {
    export interface Raw {
        id?: string | null;
        chapters?: SummarizeChapterResultChaptersItem.Raw[] | null;
        usage?: TokenUsage.Raw | null;
    }
}
