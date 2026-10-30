import { V2 } from "../../api/resources/embed/resources/v2/client/Client";
import { EmbedV2BatchesWrapper } from "./EmbedV2BatchesWrapper";

/** Wrapper for Embed v2 resources with safer batch-create retry behavior. */
export class EmbedV2Wrapper extends V2 {
    private _customBatches: EmbedV2BatchesWrapper | undefined;

    constructor(options: V2.Options) {
        super(options);
    }

    public override get batches(): EmbedV2BatchesWrapper {
        return (this._customBatches ??= new EmbedV2BatchesWrapper(this._options));
    }
}
