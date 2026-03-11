import * as fs from "fs";
import { Search } from "../../api/resources/search/client/Client";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";
import * as environments from "../../environments";
import * as errors from "../../errors/index";
import * as serializers from "../../serialization/index";

type FileType = File | fs.ReadStream | Blob;

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
     * **Multiple images** (Marengo 3.0 only):
     * - Use `query_media_urls` (array of URLs) or `query_media_files` (array of local files) to pass up to 10 images.
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
     * @param {SearchWrapper.QueryRequest} request
     * @param {Search.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link TwelvelabsApi.BadRequestError}
     * @throws {@link TwelvelabsApi.TooManyRequestsError}
     *
     * @example
     *     await client.search.query({
     *         indexId: "index_id",
     *         searchOptions: ["visual"]
     *     })
     */
    public async query(
        request: SearchWrapper.QueryRequest,
        requestOptions?: Search.RequestOptions,
    ): Promise<core.Page<TwelvelabsApi.SearchItem>> {
        const { queryMediaFile, queryMediaFiles, queryMediaUrls, ...baseRequest } = request;

        const hasPlural =
            queryMediaFiles != null || queryMediaUrls != null || Array.isArray(queryMediaFile);

        let response: TwelvelabsApi.SearchResults;
        if (hasPlural) {
            response = await this._queryWithFiles(request, requestOptions);
        } else {
            const singleRequest: TwelvelabsApi.SearchCreateRequest = {
                ...baseRequest,
                ...(queryMediaFile != null ? { queryMediaFile: queryMediaFile as FileType } : {}),
            };
            response = await this.create(singleRequest, requestOptions);
        }

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

    private async _queryWithFiles(
        request: SearchWrapper.QueryRequest,
        requestOptions?: Search.RequestOptions,
    ): Promise<TwelvelabsApi.SearchResults> {
        const { queryMediaFile, queryMediaFiles, queryMediaUrls, ...rest } = request;

        const _request = await core.newFormData();

        if (rest.queryMediaType != null) {
            _request.append(
                "query_media_type",
                serializers.SearchCreateRequestQueryMediaType.jsonOrThrow(rest.queryMediaType, {
                    unrecognizedObjectKeys: "strip",
                }),
            );
        }

        // URL fields — plural takes precedence
        if (queryMediaUrls != null) {
            for (const url of queryMediaUrls) {
                _request.append("query_media_url", url);
            }
        } else if (rest.queryMediaUrl != null) {
            _request.append("query_media_url", rest.queryMediaUrl);
        }

        // File fields — plural takes precedence
        const filesToAppend: FileType[] =
            queryMediaFiles != null
                ? queryMediaFiles
                : Array.isArray(queryMediaFile)
                  ? queryMediaFile
                  : queryMediaFile != null
                    ? [queryMediaFile]
                    : [];

        for (const f of filesToAppend) {
            await _request.appendFile("query_media_file", f);
        }

        if (rest.queryText != null) {
            _request.append("query_text", rest.queryText);
        }

        _request.append("index_id", rest.indexId);

        for (const _item of rest.searchOptions) {
            _request.append(
                "search_options",
                serializers.SearchCreateRequestSearchOptionsItem.jsonOrThrow(_item, {
                    unrecognizedObjectKeys: "strip",
                }),
            );
        }

        if (rest.transcriptionOptions != null) {
            for (const _item of rest.transcriptionOptions) {
                _request.append(
                    "transcription_options",
                    serializers.SearchCreateRequestTranscriptionOptionsItem.jsonOrThrow(_item, {
                        unrecognizedObjectKeys: "strip",
                    }),
                );
            }
        }

        if (rest.adjustConfidenceLevel != null) {
            _request.append("adjust_confidence_level", rest.adjustConfidenceLevel.toString());
        }

        if (rest.groupBy != null) {
            _request.append(
                "group_by",
                serializers.SearchCreateRequestGroupBy.jsonOrThrow(rest.groupBy, {
                    unrecognizedObjectKeys: "strip",
                }),
            );
        }

        if (rest.threshold != null) {
            _request.append(
                "threshold",
                serializers.ThresholdSearch.jsonOrThrow(rest.threshold, { unrecognizedObjectKeys: "strip" }),
            );
        }

        if (rest.sortOption != null) {
            _request.append(
                "sort_option",
                serializers.SearchCreateRequestSortOption.jsonOrThrow(rest.sortOption, {
                    unrecognizedObjectKeys: "strip",
                }),
            );
        }

        if (rest.operator != null) {
            _request.append(
                "operator",
                serializers.SearchCreateRequestOperator.jsonOrThrow(rest.operator, {
                    unrecognizedObjectKeys: "strip",
                }),
            );
        }

        if (rest.pageLimit != null) {
            _request.append("page_limit", rest.pageLimit.toString());
        }

        if (rest.filter != null) {
            _request.append("filter", rest.filter);
        }

        if (rest.includeUserMetadata != null) {
            _request.append("include_user_metadata", rest.includeUserMetadata.toString());
        }

        const _maybeEncodedRequest = await _request.getRequest();
        const _baseUrl =
            (await core.Supplier.get(this._options.baseUrl)) ??
            (await core.Supplier.get(this._options.environment)) ??
            environments.TwelvelabsApiEnvironment.Default;

        const _response = await core.fetcher({
            url: `${_baseUrl.replace(/\/$/, "")}/search`,
            method: "POST",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "twelvelabs-js",
                "X-Fern-SDK-Version": "1.2.1",
                "User-Agent": "twelvelabs-js/1.2.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
                ..._maybeEncodedRequest.headers,
                ...requestOptions?.headers,
            },
            requestType: "file",
            duplex: _maybeEncodedRequest.duplex,
            body: _maybeEncodedRequest.body,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });

        if (_response.ok) {
            return serializers.SearchResults.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
                breadcrumbsPrefix: ["response"],
            });
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 400:
                    throw new TwelvelabsApi.BadRequestError(_response.error.body, _response.rawResponse);
                case 429:
                    throw new TwelvelabsApi.TooManyRequestsError(_response.error.body, _response.rawResponse);
                default:
                    throw new errors.TwelvelabsApiError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                        rawResponse: _response.rawResponse,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.TwelvelabsApiError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                    rawResponse: _response.rawResponse,
                });
            case "timeout":
                throw new errors.TwelvelabsApiTimeoutError("Timeout exceeded when calling POST /search.");
            case "unknown":
                throw new errors.TwelvelabsApiError({
                    message: _response.error.errorMessage,
                    rawResponse: _response.rawResponse,
                });
        }
    }
}

export declare namespace SearchWrapper {
    interface Options extends Search.Options {}
    interface RequestOptions extends Search.RequestOptions {}
    interface QueryRequest extends Omit<TwelvelabsApi.SearchCreateRequest, "queryMediaFile"> {
        /** A single file or an array of up to 10 files to use as query images (Marengo 3.0). */
        queryMediaFile?: FileType | FileType[];
        /** Array of up to 10 publicly accessible image URLs to use as query images (Marengo 3.0). */
        queryMediaUrls?: string[];
        /** Array of up to 10 local image files to use as query images (Marengo 3.0). */
        queryMediaFiles?: FileType[];
    }
}
