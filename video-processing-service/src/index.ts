import express from 'express';
import asyncHandler from 'express-async-handler';
import { setupDirectories, downloadRawVideo, uploadProcessedVideo, convertVideo, deleteRawVideo, deleteProcessedVideo } from './storage';

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", asyncHandler(async (req, res) => {
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('Invalid message payload received');
        }
    } catch (error) {
        console.error(error);
        res.status(400).send('Bad Request: missing filename.');
    }

    const inputFileName = data.name
    const outputFileName = `processed-${inputFileName}`;

    // Download raw video from Cloud Storage
    await downloadRawVideo(inputFileName)
    
    // convert video to 360p

    try {
        await convertVideo(inputFileName, outputFileName);
    } catch (err) {
        Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        res.status(500).send(`Internal Server Error: video processing failed.`);
    }
    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    res.status(200).send(`Processing finished successfully.`);
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});