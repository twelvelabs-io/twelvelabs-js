/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";
import { ScoreSearchTerms } from "./ScoreSearchTerms";
import { StartTime } from "./StartTime";
import { EndTime } from "./EndTime";
import { Confidence } from "./Confidence";
import { ThumbnailUrl } from "./ThumbnailUrl";
import { UserMetadata } from "./UserMetadata";
import { SearchItemClipsItem } from "./SearchItemClipsItem";

export const SearchItem: core.serialization.ObjectSchema<serializers.SearchItem.Raw, TwelvelabsApi.SearchItem> =
    core.serialization.object({
        score: ScoreSearchTerms.optional(),
        start: StartTime.optional(),
        end: EndTime.optional(),
        videoId: core.serialization.property("video_id", core.serialization.string().optional()),
        confidence: Confidence.optional(),
        thumbnailUrl: core.serialization.property("thumbnail_url", ThumbnailUrl.optional()),
        transcription: core.serialization.string().optional(),
        id: core.serialization.string().optional(),
        userMetadata: core.serialization.property("user_metadata", UserMetadata.optional()),
        clips: core.serialization.list(SearchItemClipsItem).optional(),
    });

export declare namespace SearchItem {
    export interface Raw {
        score?: ScoreSearchTerms.Raw | null;
        start?: StartTime.Raw | null;
        end?: EndTime.Raw | null;
        video_id?: string | null;
        confidence?: Confidence.Raw | null;
        thumbnail_url?: ThumbnailUrl.Raw | null;
        transcription?: string | null;
        id?: string | null;
        user_metadata?: UserMetadata.Raw | null;
        clips?: SearchItemClipsItem.Raw[] | null;
    }
}
