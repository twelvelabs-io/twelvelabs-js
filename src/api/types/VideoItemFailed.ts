/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * An object that contains information about a video file that failed to import.
 */
export interface VideoItemFailed {
    /** The name of the video file. */
    filename: string;
    /** The date and time, in the RFC 3339 format ("YYYY-MM-DDTHH:mm:ssZ"), when the video was added to the import process. */
    createdAt: Date;
    /** The error message explaining why the video failed to import. */
    errorMessage: string;
}
