/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";

export const NotFoundErrorBody: core.serialization.ObjectSchema<
    serializers.NotFoundErrorBody.Raw,
    TwelvelabsApi.NotFoundErrorBody
> = core.serialization.object({
    code: core.serialization.string().optional(),
    message: core.serialization.string().optional(),
});

export declare namespace NotFoundErrorBody {
    export interface Raw {
        code?: string | null;
        message?: string | null;
    }
}
