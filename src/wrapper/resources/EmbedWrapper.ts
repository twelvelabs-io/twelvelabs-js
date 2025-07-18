import { Embed } from "../../api/resources/embed/client/Client";
import { EmbedTasksWrapper } from "./EmbedTasksWrapper";

/**
 * Wrapper for the Embed client that replaces the tasks property with EmbedTasksWrapper.
 */
export class EmbedWrapper extends Embed {
    private _customTasks: EmbedTasksWrapper | undefined;

    constructor(options: Embed.Options) {
        super(options);
    }

    /**
     * Override the original tasks getter to return our custom EmbedTasksWrapper
     */
    public get tasks(): EmbedTasksWrapper {
        return (this._customTasks ??= new EmbedTasksWrapper(this._options));
    }
}

export declare namespace EmbedWrapper {
    interface Options extends Embed.Options {}
    interface RequestOptions extends Embed.RequestOptions {}
} 