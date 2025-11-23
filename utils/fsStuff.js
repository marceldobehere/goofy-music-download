import filenamify from "filenamify";
import fs from "fs";

function goofyShortenStr(str, maxSize, endNeeded) {
    if (str.length <= maxSize)
        return str;

    const lastPart = str.substring(str.length - endNeeded);
    const firstPart = str.substring(0, maxSize - endNeeded - 3);
    // console.log(str, str.length);
    // console.log(firstPart, firstPart.length);
    // console.log(lastPart, lastPart.length);
    const res = firstPart + "___" + lastPart;
    // console.log(res, res.length);
    return res;
}

export function makeStringFsSafe(str) {
    const short = goofyShortenStr(str, 125, 45);
    const res = filenamify(short, {maxLength: 130});
    // console.log(` > Making "${str}" Short -> "${short}" Safe -> "${res}"`);
    return res;
}

function JSONCopy(data) {
    return JSON.parse(JSON.stringify(data));
}

export async function readJSONFile(filename, defaultData) {
    try {
        let res = await fs.promises.readFile(filename, "utf-8");
        try {
            return JSON.parse(res);
        } catch (e) {
            console.error("Failed to parse JSON from file: ", e, res);
            return JSONCopy(defaultData);
        }
    } catch (e) {
        //console.error("Failed to read file: ", e);
        await writeJSONFile(filename, defaultData);
        return JSONCopy(defaultData);
    }
}

export async function writeJSONFile(filename, data) {
    await fs.promises.writeFile(filename, JSON.stringify(data, null, 2), "utf8");
}

export async function readAllLines(filename) {
    try {
        return (await fs.promises.readFile(filename, "utf-8")).split(/\r?\n/);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function rmDir(path) {
    fs.rmSync(path, { recursive: true, force: true });
}

export async function mkDir(path) {
        let showDir = path; // `${showPath}/${makeStringFsSafe(showName)}`;
        if (!fs.existsSync(path))
            fs.mkdirSync(path, { recursive: true });
}

export async function getAllFiles(folderPath) {
    return fs.readdirSync(folderPath);
}

export async function fileExists(filename) {
    return fs.existsSync(filename);
}

export async function rmFile(filename) {
    try {
        fs.unlinkSync(filename);
    } catch (err) {
        console.error('Error deleting file:', err);
    }
}

export async function mvFile(oldPath, newPath) {
    return fs.renameSync(oldPath, newPath);
}