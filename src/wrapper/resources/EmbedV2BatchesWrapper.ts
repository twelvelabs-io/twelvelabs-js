import { Batches } from "../../api/resources/embed/resources/v2/resources/batches/client/Client";
import * as TwelvelabsApi from "../../api/index";

/**
 * Wrapper for Embed v2 batches. Batch creation is not replayed automatically because a 5xx
 * response can follow a committed create. Callers can opt in through maxRetries when safe.
 */
export class EmbedV2BatchesWrapper extends Batches {
    constructor(options: Batches.Options) {
        super(options);
    }

    public override create(
        request: TwelvelabsApi.embed.v2.CreateEmbeddingBatchRequest,
        requestOptions?: EmbedV2BatchesWrapper.RequestOptions,
    ): ReturnType<Batches["create"]> {
        return super.create(request, {
            ...requestOptions,
            maxRetries: requestOptions?.maxRetries ?? 0,
        });
    }
}

export declare namespace EmbedV2BatchesWrapper {
    interface RequestOptions extends Omit<Batches.RequestOptions, "maxRetries"> {
        /** The number of times to retry this create request. Defaults to 0. */
        maxRetries?: number;
    }
}
