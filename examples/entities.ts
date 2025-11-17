import { TwelveLabs } from "twelvelabs-js";

const sampleImageUrls = [
    "https://www.gstatic.com/webp/gallery/1.jpg",
    "https://www.gstatic.com/webp/gallery/2.jpg",
    "https://www.gstatic.com/webp/gallery/3.jpg",
];

(async () => {
    const client = new TwelveLabs({ apiKey: process.env.API_KEY });

    // Create assets
    const assetIds: string[] = [];
    for (let i = 0; i < sampleImageUrls.length; i++) {
        const url = sampleImageUrls[i];
        const asset = await client.assets.create({
            method: "url",
            url: url,
        });
        assetIds.push(asset.id!);
        console.log(`Created asset ${i + 1}/${sampleImageUrls.length}: id=${asset.id}`);
    }

    console.log(`Asset IDs: ${assetIds}`);

    // Create entity collection
    const entityCollection = await client.entityCollections.create({
        name: "Sample Entity Collection",
    });
    console.log(`Created entity collection: id=${entityCollection.id}`);

    // Create entity
    const entity = await client.entityCollections.entities.create(entityCollection.id!, {
        name: "Sample Entity",
        assetIds: assetIds,
    });
    console.log(`Created entity: id=${entity.id}`);

    // Perform Entity Search
    const indexId = "<YOUR_INDEX_ID>";

    const searchPager = await client.search.query({
        indexId: indexId,
        searchOptions: ["visual", "audio"],
        // to perform entity search, the entity id should be wrapped with <@ and >
        queryText: `<@${entity.id}> is walking`,
    });

    for await (const clip of searchPager) {
        console.log(`  videoId=${clip.videoId} start=${clip.start} end=${clip.end} rank=${clip.rank}`);
    }
})();
