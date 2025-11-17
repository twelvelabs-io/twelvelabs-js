import { Search } from "../../api/resources/search/client/Client";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";

export class SearchWrapper extends Search {
    constructor(options: Search.Options) {
        super(options);
    }

    /**
     * Use this endpoint to search for relevant matches in an index using text, media, or a combination of both as your query.
     *
     * **Text queries**:
     * - Use the `query_text` parameter to specify your query.
     *
     * **Media queries**:
     * - Set the `query_media_type` parameter to the corresponding media type (example: `image`).
     * - Specify either one of the following parameters:
     *   - `query_media_url`: Publicly accessible URL of your media file.
     *   - `query_media_file`: Local media file.
     *   If both `query_media_url` and `query_media_file` are specified in the same request, `query_media_url` takes precedence.
     *
     * **Composed text and media queries** (Marengo 3.0 only):
     * - Use the `query_text` parameter for your text query.
     * - Set `query_media_type` to `image`.
     * - Specify the image using either the `query_media_url` or the `query_media_file` parameter.
     *
     *   Example: Provide an image of a car and include  "red color"  in your query to find red instances of that car model.
     *
     * <Note title="Note">
     *   When using images in your search queries (either as media queries or in composed searches), ensure your image files meet the [format requirements](/v1.3/docs/concepts/models/marengo#image-file-requirements).
     * </Note>
     *
     * <Note title="Note">
     * This endpoint is rate-limited. For details, see the [Rate limits](/v1.3/docs/get-started/rate-limits) page.
     * </Note>
     *
     * @param {TwelvelabsApi.SearchCreateRequest} request
     * @param {Search.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link TwelvelabsApi.BadRequestError}
     * @throws {@link TwelvelabsApi.TooManyRequestsError}
     *
     * @example
     *     await client.search.create({
     *         indexId: "index_id",
     *         searchOptions: ["visual"]
     *     })
     */
    public async query(
        request: TwelvelabsApi.SearchCreateRequest,
        requestOptions?: Search.RequestOptions,
    ): Promise<core.Page<TwelvelabsApi.SearchItem>> {
        const response = await this.create(request, requestOptions);
        const retrieveRequest: TwelvelabsApi.SearchRetrieveRequest = {};
        if (request.includeUserMetadata) {
            retrieveRequest.includeUserMetadata = request.includeUserMetadata;
        }
        return new core.Pageable<TwelvelabsApi.SearchResults, TwelvelabsApi.SearchItem>({
            response,
            rawResponse: {} as any,
            hasNextPage: (response) => response?.pageInfo?.nextPageToken != null,
            getItems: (response) => response?.data ?? [],
            loadPage: (response) => {
                return this.retrieve(response!.pageInfo!.nextPageToken!, retrieveRequest, requestOptions);
            },
        });
    }
}

export declare namespace SearchWrapper {
    interface Options extends Search.Options {}
    interface RequestOptions extends Search.RequestOptions {}
}
