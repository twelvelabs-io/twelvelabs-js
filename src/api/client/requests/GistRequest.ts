/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as TwelvelabsApi from "../../index";

/**
 * @example
 *     {
 *         videoId: "6298d673f1090f1100476d4c",
 *         types: ["title", "topic"]
 *     }
 */
export interface GistRequest {
    /** The unique identifier of the video that you want to generate a gist for. */
    videoId: string;
    /**
     * Specifies the type of gist. Use one of the following values:
     *   - `title`: A title succinctly captures a video's main theme, such as "From Consumerism to Minimalism: A Journey Toward Sustainable Living," guiding viewers to its content and themes.
     *   - `topic`: A topic is the central theme of a video, such as "Shopping Vlog Lifestyle", summarizing its content for efficient categorization and reference.
     *   - `hashtag`: A hashtag, like "#BlackFriday", represents key themes in a video, enhancing its discoverability and categorization on social media platforms.
     */
    types: TwelvelabsApi.GistRequestTypesItem[];
}
