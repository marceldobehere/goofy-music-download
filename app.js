import {fileExists, getAllFiles, makeStringFsSafe, mkDir, mvFile, readJSONFile, rmDir, rmFile} from './utils/fsStuff.js'
import fs from "fs";
import {Readable} from "stream";

const inputPath = "./input";
const outputPath = "./output";


async function main() {
    await mkDir(inputPath);
    // await rmDir(outputPath);
    await mkDir(outputPath);


    let albums = await getAllFiles(inputPath);
    for (let album of albums) {
        console.log(`> Checking album: ${album}`);
        const albumName = getAlbumName(album);
        const albumPath = `${outputPath}/${albumName}`;
        try {
            await downloadAlbum(`${inputPath}/${album}`, albumName, albumPath);
        } catch (err) {
            console.error(err);
        }
        console.log();
    }
}

function getAlbumName(album) {
    let albumName = album
        .replaceAll(".json", "")
        .replaceAll("FLAC", "")
        .replaceAll("OGG", "")
        .replaceAll("MP3", "")
        .trim();

    const index = albumName.indexOf(" - Download");
    if (index > -1)
        albumName = albumName.substring(0, index);

    return makeStringFsSafe(albumName);
}

async function getTitleFromUrl(url) {
    const text = decodeURI(url);
    const slashIndex = text.lastIndexOf("/");
    if (slashIndex === -1)
        return text;

    const text2 = text.substring(slashIndex + 1);
    const spaceIndex = text2.indexOf(" ");
    if (spaceIndex === -1)
        return text2;

    return text2;

    if (text2.split('-').length >= 1)
        return text2;

    return text2.substring(0, spaceIndex) + " -" + text2.substring(spaceIndex);
}

async function downloadAlbum(inputPath, albumName, resultPath) {
    await mkDir(resultPath);
    console.log(` > Downloading album: ${albumName}`);
    const urls = (await readJSONFile(inputPath))["links"];
    for (const url of urls) {
        const titleName = await getTitleFromUrl(url);
        console.log(`  > Downloading ${titleName}`);

        const filePath = `${resultPath}/${titleName}`;
        const filePathTemp = filePath + "_temp";

        if (await fileExists(filePathTemp))
            await rmFile(filePathTemp);

        if (await fileExists(filePath)) {
            console.log(`   > Already exists.`);
            continue;
        }

        try {
            await downloadTitle(url, filePathTemp);
        } catch (e) {
            console.error('Error downloading file:', e);
            await rmFile(filePathTemp);
        }
        await mvFile(filePathTemp, filePath);

        await sleep(300);
    }
}


async function downloadTitle(url, filePath) {
    console.log(`   > URL: ${url}`);
    console.log(`   > Path: ${filePath}`);

    const response = await fetch(url);

    if (!response.ok)
        throw new Error('Response is not ok!');

    const writeStream = fs.createWriteStream(filePath);
    const readable = Readable.fromWeb(response.body);
    readable.pipe(writeStream);
    await new Promise((resolve, reject) => {
        readable.on('end', resolve);
        readable.on('error', reject);
    });
}

export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

main().then();
