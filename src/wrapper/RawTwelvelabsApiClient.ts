import { TwelvelabsApiClient as GeneratedTwelvelabsApiClient } from "../Client";
import { Embed } from "../api/resources/embed/client/Client";
import { EmbedV2Wrapper } from "./resources/EmbedV2Wrapper";

class EmbedV2OnlyWrapper extends Embed {
    private _customV2: EmbedV2Wrapper | undefined;

    public override get v2(): EmbedV2Wrapper {
        return (this._customV2 ??= new EmbedV2Wrapper(this._options));
    }
}

/**
 * Public generated-client wrapper that applies the maintained Embed v2 batch-create retry policy
 * while preserving the generated legacy Embed tasks resource.
 */
export class TwelvelabsApiClient extends GeneratedTwelvelabsApiClient {
    private _customEmbed: EmbedV2OnlyWrapper | undefined;

    public override get embed(): EmbedV2OnlyWrapper {
        return (this._customEmbed ??= new EmbedV2OnlyWrapper(this._options));
    }
}

export declare namespace TwelvelabsApiClient {
    interface Options extends GeneratedTwelvelabsApiClient.Options {}
    interface RequestOptions extends GeneratedTwelvelabsApiClient.RequestOptions {}
}
