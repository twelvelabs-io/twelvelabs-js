import { Embed } from "../../api/resources/embed/client/Client";
import { EmbedTasksWrapper } from "./EmbedTasksWrapper";
import { EmbedV2Wrapper } from "./EmbedV2Wrapper";

/**
 * Wrapper for the Embed client that replaces the tasks property with EmbedTasksWrapper.
 */
export class EmbedWrapper extends Embed {
    private _customTasks: EmbedTasksWrapper | undefined;
    private _customV2: EmbedV2Wrapper | undefined;

    constructor(options: Embed.Options) {
        super(options);
    }

    /**
     * Override the original tasks getter to return our custom EmbedTasksWrapper
     */
    public get tasks(): EmbedTasksWrapper {
        return (this._customTasks ??= new EmbedTasksWrapper(this._options));
    }

    /** Override the generated v2 client to protect non-idempotent batch creation from retries. */
    public override get v2(): EmbedV2Wrapper {
        return (this._customV2 ??= new EmbedV2Wrapper(this._options));
    }
}

export declare namespace EmbedWrapper {
    interface Options extends Embed.Options {}
    interface RequestOptions extends Embed.RequestOptions {}
}
