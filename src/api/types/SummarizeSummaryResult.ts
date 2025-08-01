/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as TwelvelabsApi from "../index";

/**
 * An object that represents the response from a summarize summary operation.
 */
export interface SummarizeSummaryResult {
    /** Unique identifier of the response. */
    id?: string;
    /** A brief report of the main points of the video. */
    summary?: string;
    usage?: TwelvelabsApi.TokenUsage;
}
