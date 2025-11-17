import { TwelvelabsApiClient } from "../Client";
import { SearchWrapper } from "./resources/SearchWrapper";
import { TasksWrapper } from "./resources/TasksWrapper";
import { EmbedWrapper } from "./resources/EmbedWrapper";
import { IndexesWrapper } from "./resources/IndexesWrapper";
import { MultipartUploadWrapper } from "./resources/MultipartUploadWrapper";
import { TwelvelabsApiEnvironment } from "..";
import * as core from "../core";

export class TwelveLabs {
    private client: TwelvelabsApiClient;
    private _options: TwelvelabsApiClient.Options;
    public readonly tasks: TasksWrapper;
    public readonly indexes: IndexesWrapper;
    public readonly search: SearchWrapper;
    public readonly embed: EmbedWrapper;
    public readonly assets: TwelvelabsApiClient["assets"];
    public readonly entityCollections: TwelvelabsApiClient["entityCollections"];
    public readonly multipartUpload: MultipartUploadWrapper;
    public readonly summarize: TwelvelabsApiClient["summarize"];
    public readonly gist: TwelvelabsApiClient["gist"];
    public readonly analyze: TwelvelabsApiClient["analyze"];
    public readonly analyzeStream: TwelvelabsApiClient["analyzeStream"];

    constructor({ apiKey = process.env.TWELVE_LABS_API_KEY }: { apiKey?: string }) {
        if (!apiKey) {
            throw new Error(
                "Provide `apiKey` to initialize a client or set the TWELVE_LABS_API_KEY environment variable. You can see the API Key in the Dashboard page: https://dashboard.playground.io",
            );
        }

        const clientOptions: TwelvelabsApiClient.Options = {
            apiKey: apiKey,
            environment: process.env.TWELVELABS_BASE_URL || TwelvelabsApiEnvironment.Default,
        };
        this._options = clientOptions;
        this.client = new TwelvelabsApiClient(clientOptions);

        this.summarize = this.client.summarize.bind(this.client);
        this.gist = this.client.gist.bind(this.client);
        this.analyze = this.client.analyze.bind(this.client);
        this.analyzeStream = this.client.analyzeStream.bind(this.client);
        this.assets = this.client.assets;
        this.entityCollections = this.client.entityCollections;

        // Use custom wrappers instead of default clients
        this.tasks = new TasksWrapper(clientOptions);
        this.indexes = new IndexesWrapper(clientOptions);
        this.search = new SearchWrapper(clientOptions);
        this.embed = new EmbedWrapper(clientOptions);
        this.multipartUpload = new MultipartUploadWrapper(clientOptions);
    }

    protected async _getCustomAuthorizationHeaders() {
        const apiKeyValue = (await core.Supplier.get(this._options.apiKey)) ?? process?.env["TWELVE_LABS_API_KEY"];
        return { "x-api-key": apiKeyValue };
    }
}
