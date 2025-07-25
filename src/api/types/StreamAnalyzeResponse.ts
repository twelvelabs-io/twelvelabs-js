/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as TwelvelabsApi from "../index";

/**
 * When the value of the `stream` parameter is set to `true`, the platform provides a streaming response in the NDJSON format.
 *
 * The stream contains three types of events:
 * 1. Stream start
 * 2. Text generation
 * 3. Stream end
 *
 * To integrate the response into your application, follow the guidelines below:
 * - Parse each line of the response as a separate JSON object.
 * - Check the `event_type` field to determine how to handle the event.
 * - For `text_generation` events, process the `text` field as it arrives. Depending on your application's requirements, this may involve displaying the text incrementally, storing it for later use, or performing any tasks.
 * - Use the `stream_start` and `stream_end` events to manage the lifecycle of your streaming session.
 */
export type StreamAnalyzeResponse =
    | TwelvelabsApi.StreamStartResponse
    | TwelvelabsApi.StreamTextResponse
    | TwelvelabsApi.StreamEndResponse;
