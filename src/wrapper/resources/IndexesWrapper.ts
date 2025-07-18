import { Indexes } from "../../api/resources/indexes/client/Client";
import { IndexesVideosWrapper } from "./IndexesVideosWrapper";

/**
 * Wrapper for the Indexes client that replaces the videos property with IndexesVideosWrapper.
 */
export class IndexesWrapper extends Indexes {
    private _customVideos: IndexesVideosWrapper | undefined;

    constructor(options: Indexes.Options) {
        super(options);
    }

    /**
     * Override the original videos getter to return our custom IndexesVideosWrapper
     */
    public get videos(): IndexesVideosWrapper {
        return (this._customVideos ??= new IndexesVideosWrapper(this._options));
    }
}

export declare namespace IndexesWrapper {
    interface Options extends Indexes.Options {}
    interface RequestOptions extends Indexes.RequestOptions {}
}
