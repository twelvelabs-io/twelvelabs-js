/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";

export const VideoVectorSystemMetadata: core.serialization.ObjectSchema<
    serializers.VideoVectorSystemMetadata.Raw,
    TwelvelabsApi.VideoVectorSystemMetadata
> = core.serialization.object({
    filename: core.serialization.string().optional(),
    duration: core.serialization.number().optional(),
    fps: core.serialization.number().optional(),
    width: core.serialization.number().optional(),
    height: core.serialization.number().optional(),
    size: core.serialization.number().optional(),
});

export declare namespace VideoVectorSystemMetadata {
    export interface Raw {
        filename?: string | null;
        duration?: number | null;
        fps?: number | null;
        width?: number | null;
        height?: number | null;
        size?: number | null;
    }
}
