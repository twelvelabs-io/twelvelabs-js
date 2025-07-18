import { Videos } from "../../api/resources/indexes/resources/videos/client/Client";
import * as TwelvelabsApi from "../../api/index";
import * as core from "../../core";
import * as environments from "../../environments";
import urlJoin from "url-join";
import * as serializers from "../../serialization/index";
import * as errors from "../../errors/index";
import { SDK_VERSION } from "../../version";

/**
 * Wrapper for the IndexesVideos client that adds additional functionality.
 */
export class IndexesVideosWrapper extends Videos {
    constructor(options: Videos.Options) {
        super(options);
    }

    /**
     * This method returns a list of the videos in the specified index. By default, the API returns your videos sorted by creation date, with the newest at the top of the list.
     *
     * @param {string} indexId - The unique identifier of the index for which the API will retrieve the videos.
     * @param {TwelvelabsApi.indexes.VideosListRequest} request
     * @param {Videos.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link TwelvelabsApi.BadRequestError}
     *
     * @example
     *     await client.indexes.videos.list("6298d673f1090f1100476d4c", {
     *         page: 1,
     *         pageLimit: 10,
     *         sortBy: "created_at",
     *         sortOption: "desc",
     *         filename: "01.mp4",
     *         createdAt: "2024-08-16T16:53:59Z",
     *         updatedAt: "2024-08-16T16:53:59Z"
     *     })
     */
    public async list(
        indexId: string,
        request: TwelvelabsApi.indexes.VideosListRequest = {},
        requestOptions?: Videos.RequestOptions,
    ): Promise<core.Page<TwelvelabsApi.VideoVector>> {
        const list = core.HttpResponsePromise.interceptFunction(
            async (
                request: TwelvelabsApi.indexes.VideosListRequest,
            ): Promise<core.WithRawResponse<TwelvelabsApi.indexes.VideosListResponse>> => {
                const {
                    page,
                    pageLimit,
                    sortBy,
                    sortOption,
                    filename,
                    duration,
                    fps,
                    width,
                    height,
                    size,
                    createdAt,
                    updatedAt,
                    userMetadata,
                } = request;
                const _queryParams: Record<string, string | string[] | object | object[] | null> = {};
                if (page != null) {
                    _queryParams["page"] = page.toString();
                }
                if (pageLimit != null) {
                    _queryParams["page_limit"] = pageLimit.toString();
                }
                if (sortBy != null) {
                    _queryParams["sort_by"] = sortBy;
                }
                if (sortOption != null) {
                    _queryParams["sort_option"] = sortOption;
                }
                if (filename != null) {
                    _queryParams["filename"] = filename;
                }
                if (duration != null) {
                    _queryParams["duration"] = duration.toString();
                }
                if (fps != null) {
                    _queryParams["fps"] = fps.toString();
                }
                if (width != null) {
                    _queryParams["width"] = width.toString();
                }
                if (height != null) {
                    _queryParams["height"] = height.toString();
                }
                if (size != null) {
                    _queryParams["size"] = size.toString();
                }
                if (createdAt != null) {
                    _queryParams["created_at"] = createdAt;
                }
                if (updatedAt != null) {
                    _queryParams["updated_at"] = updatedAt;
                }
                // Flatten userMetadata instead of using toJson
                if (userMetadata != null && typeof userMetadata === "object") {
                    for (const [key, value] of Object.entries(userMetadata)) {
                        if (value != null) {
                            _queryParams[key] = typeof value === "string" ? value : String(value);
                        }
                    }
                }
                const _response = await core.fetcher({
                    url: urlJoin(
                        (await core.Supplier.get(this._options.baseUrl)) ??
                            (await core.Supplier.get(this._options.environment)) ??
                            environments.TwelvelabsApiEnvironment.Default,
                        `indexes/${encodeURIComponent(indexId)}/videos`,
                    ),
                    method: "GET",
                    headers: {
                        "X-Fern-Language": "JavaScript",
                        "X-Fern-SDK-Name": "twelvelabs-js",
                        "X-Fern-SDK-Version": SDK_VERSION,
                        "User-Agent": "twelvelabs-js/" + SDK_VERSION,
                        "X-Fern-Runtime": core.RUNTIME.type,
                        "X-Fern-Runtime-Version": core.RUNTIME.version,
                        ...(await this._getCustomAuthorizationHeaders()),
                        ...requestOptions?.headers,
                    },
                    contentType: "application/json",
                    queryParameters: _queryParams,
                    requestType: "json",
                    timeoutMs:
                        requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
                    maxRetries: requestOptions?.maxRetries,
                    abortSignal: requestOptions?.abortSignal,
                });
                if (_response.ok) {
                    return {
                        data: serializers.indexes.VideosListResponse.parseOrThrow(_response.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }),
                        rawResponse: _response.rawResponse,
                    };
                }
                if (_response.error.reason === "status-code") {
                    switch (_response.error.statusCode) {
                        case 400:
                            throw new TwelvelabsApi.BadRequestError(_response.error.body, _response.rawResponse);
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
                        throw new errors.TwelvelabsApiTimeoutError(
                            "Timeout exceeded when calling GET /indexes/{index-id}/videos.",
                        );
                    case "unknown":
                        throw new errors.TwelvelabsApiError({
                            message: _response.error.errorMessage,
                            rawResponse: _response.rawResponse,
                        });
                }
            },
        );
        let _offset = request?.page != null ? request?.page : 1;
        const dataWithRawResponse = await list(request).withRawResponse();
        return new core.Pageable<TwelvelabsApi.indexes.VideosListResponse, TwelvelabsApi.VideoVector>({
            response: dataWithRawResponse.data,
            rawResponse: dataWithRawResponse.rawResponse,
            hasNextPage: (response) => (response?.data ?? []).length > 0,
            getItems: (response) => response?.data ?? [],
            loadPage: (_response) => {
                _offset += 1;
                return list(core.setObjectProperty(request, "page", _offset));
            },
        });
    }
}

export declare namespace IndexesVideosWrapper {
    interface Options extends Videos.Options {}
    interface RequestOptions extends Videos.RequestOptions {}
}
