# Goofy Music Downloader
Downloads Music Albums from provided sources

Basically you can put in JSON files into the input folder, which contain URLs and then the program will download them.

Example of an input file:
```json
{
  "url": "<URL FOR ALBUM SOURCE>",
  "links": [
    "https://<URL-1>.mp3",
    "https://<URL-2>.mp3",
    ...
  ]
}
```

Will create a folder for each file and download the files into it

## How to use
* Clone Repo
* `npm install`
* `npm run start`
* Will create the `ìnput` and `output` folders
* Get JSON files from stuff to download
* Add the JSON files to the input folder
* `npm run start`
* Wait until it is complete
* Profit
