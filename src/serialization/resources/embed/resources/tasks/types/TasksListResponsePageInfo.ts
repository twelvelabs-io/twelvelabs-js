/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../index";
import * as TwelvelabsApi from "../../../../../../api/index";
import * as core from "../../../../../../core";
import { LimitPerPageSimple } from "../../../../../types/LimitPerPageSimple";
import { Page } from "../../../../../types/Page";
import { TotalPage } from "../../../../../types/TotalPage";
import { TotalResults } from "../../../../../types/TotalResults";

export const TasksListResponsePageInfo: core.serialization.ObjectSchema<
    serializers.embed.TasksListResponsePageInfo.Raw,
    TwelvelabsApi.embed.TasksListResponsePageInfo
> = core.serialization.object({
    limitPerPage: core.serialization.property("limit_per_page", LimitPerPageSimple.optional()),
    page: Page.optional(),
    totalPage: core.serialization.property("total_page", TotalPage.optional()),
    totalResults: core.serialization.property("total_results", TotalResults.optional()),
});

export declare namespace TasksListResponsePageInfo {
    export interface Raw {
        limit_per_page?: LimitPerPageSimple.Raw | null;
        page?: Page.Raw | null;
        total_page?: TotalPage.Raw | null;
        total_results?: TotalResults.Raw | null;
    }
}
