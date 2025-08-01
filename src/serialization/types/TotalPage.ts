/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";

export const TotalPage: core.serialization.Schema<serializers.TotalPage.Raw, TwelvelabsApi.TotalPage> =
    core.serialization.number();

export declare namespace TotalPage {
    export type Raw = number;
}
