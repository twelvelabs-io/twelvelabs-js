/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../index";
import * as TwelvelabsApi from "../../../api/index";
import * as core from "../../../core";

export const AnalyzeRequest: core.serialization.Schema<serializers.AnalyzeRequest.Raw, TwelvelabsApi.AnalyzeRequest> =
    core.serialization.object({
        videoId: core.serialization.property("video_id", core.serialization.string()),
        prompt: core.serialization.string(),
        temperature: core.serialization.number().optional(),
    });

export declare namespace AnalyzeRequest {
    export interface Raw {
        video_id: string;
        prompt: string;
        temperature?: number | null;
    }
}
