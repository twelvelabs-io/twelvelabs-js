/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as TwelvelabsApi from "../../../../../index";

export interface TasksListResponse {
    /** An array that contains up to `page_limit` video embedding tasks. */
    data?: TwelvelabsApi.VideoEmbeddingTask[];
    /** An object that provides information about pagination. */
    pageInfo?: TwelvelabsApi.embed.TasksListResponsePageInfo;
}
