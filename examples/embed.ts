import * as fs from "fs";
import path from "path";
import { TwelveLabs, TwelvelabsApi } from "twelvelabs-js";

(async () => {
    const client = new TwelveLabs({ apiKey: process.env.API_KEY });

    const modelName = "marengo3.0";

    const printEmbeddings = (embeddings: TwelvelabsApi.EmbeddingData[]) => {
        embeddings.forEach((embedding) => {
            console.log(
                `Embedding: [${embedding.embedding
                    .slice(0, 5)
                    .join(", ")}...] (total: ${embedding.embedding.length} values)`,
            );
            if (embedding.embeddingOption) {
                console.log(`Embedding option: ${embedding.embeddingOption}`);
            }
            if (embedding.embeddingScope) {
                console.log(`Embedding scope: ${embedding.embeddingScope}`);
            }
            if (embedding.startSec) {
                console.log(`Start sec: ${embedding.startSec}`);
            }
            if (embedding.endSec) {
                console.log(`End sec: ${embedding.endSec}`);
            }
        });
    };

    // List embed tasks
    const embedTasksPager = await client.embed.v2.tasks.list();
    for await (const task of embedTasksPager) {
        console.log(`Embed task: id=${task.id} status=${task.status} created_at=${task.createdAt}`);
    }

    // Sync embedding examples

    // Text embedding
    let res = await client.embed.v2.create({
        inputType: "text",
        modelName,
        text: {
            inputText: "man walking across the street",
        },
    });
    console.log("Created text embedding");
    if (res.data && res.data.length > 0) {
        printEmbeddings(res.data);
    }

    // Image embedding (using URL)
    res = await client.embed.v2.create({
        inputType: "image",
        modelName,
        image: {
            mediaSource: {
                url: "https://www.gstatic.com/webp/gallery/1.jpg",
            },
        },
    });
    console.log("Created image embedding");
    if (res.data && res.data.length > 0) {
        printEmbeddings(res.data);
    }

    // Image embedding (using base64)
    const imagePath = path.join(__dirname, "assets/search_sample.png");
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString("base64");
    res = await client.embed.v2.create({
        inputType: "image",
        modelName,
        image: {
            mediaSource: {
                base64String,
            },
        },
    });
    console.log("Created image embedding");
    if (res.data && res.data.length > 0) {
        printEmbeddings(res.data);
    }

    // Audio embedding (sync, short audio using base64)
    const audioPath = path.join(__dirname, "assets/audio_sample.mp3");
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBase64String = audioBuffer.toString("base64");
    res = await client.embed.v2.create({
        inputType: "audio",
        modelName,
        audio: {
            mediaSource: {
                base64String: audioBase64String,
            },
        },
    });
    console.log("Created audio embedding");
    if (res.data && res.data.length > 0) {
        printEmbeddings(res.data);
    }

    // Video embedding (sync, short video using base64)
    const videoPath = path.join(__dirname, "assets/example.mp4");
    const videoBuffer = fs.readFileSync(videoPath);
    const videoBase64String = videoBuffer.toString("base64");
    res = await client.embed.v2.create({
        inputType: "video",
        modelName,
        video: {
            mediaSource: {
                base64String: videoBase64String,
            },
        },
    });
    console.log("Created video embedding");
    if (res.data && res.data.length > 0) {
        printEmbeddings(res.data);
    }

    // Async embedding examples

    const waitForDone = async (taskId: string): Promise<TwelvelabsApi.EmbeddingTaskResponse> => {
        let task = await client.embed.v2.tasks.retrieve(taskId);
        const doneStatuses = ["ready", "failed"];
        while (!doneStatuses.includes(task.status)) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            task = await client.embed.v2.tasks.retrieve(taskId);
            console.log(`Task status: ${task.status}`);
        }
        return task;
    };

    // Video embedding (async using URL)
    let createTask = await client.embed.v2.tasks.create({
        inputType: "video",
        modelName,
        video: {
            mediaSource: {
                url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            },
        },
    });
    console.log(`Created video embedding task: id=${createTask.id}`);
    let task = await waitForDone(createTask.id);
    console.log(`Video embedding done: ${task.status}`);
    if (task.data && task.data.length > 0) {
        printEmbeddings(task.data);
    }

    // Audio embedding (async using URL)
    createTask = await client.embed.v2.tasks.create({
        inputType: "audio",
        modelName,
        audio: {
            mediaSource: {
                url: "https://github.com/twelvelabs-io/twelvelabs-python/raw/refs/heads/main/examples/assets/audio_sample.mp3",
            },
        },
    });
    console.log(`Created audio embedding task: id=${createTask.id}`);
    task = await waitForDone(createTask.id);
    console.log(`Audio embedding done: ${task.status}`);
    if (task.data && task.data.length > 0) {
        printEmbeddings(task.data);
    }
})();
