import fetch from 'node-fetch';

function getCanaryScripts() {
    return fetch('https://canary.discordapp.com/app')
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            return data.match(/assets\/[\w\d]+\.js/g).reverse();
        })
}


function scrapeJsFiles(files) {
    return fetch(`https://canary.discord.com/${files}`)
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            let results = data.match(/Build Number: [\w.]+, Version Hash: [\w.]+/g);
            return results;
        })
}

let indexOfFiles = await getCanaryScripts();

const getDiscordBuild = async () => {
    let counter = 0
    let files = indexOfFiles.length;
    let scrape;

    while (counter <= files) {        
        if (scrape === undefined || scrape === null) {
            scrape = await scrapeJsFiles(indexOfFiles[counter]);
            counter++
        } else {
            counter = 9999; // It's over 9000!!!
            return scrape;
        }
    }   
}

console.log(await getDiscordBuild())


