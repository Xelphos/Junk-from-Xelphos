import fetch from 'node-fetch';

function GetCanaryScripts() {
    return fetch('https://canary.discordapp.com/app')
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            return data.match(/assets\/[\w\d]+\.js/g);
        })
}


function scrapeJsFiles(files) {
    return fetch(`https://canary.discord.com/${files}`)
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            let result = data.match(/Build Number: [\w.]+, Version Hash: [\w\d]+.*?(?=\")/);
            return result;
        })
}


let jsFiles = await GetCanaryScripts();



const getDiscordBuild = async () => {
    let counter = 0
    let files = jsFiles.length;
    let scrape;

    while (counter <= files) {        
        if (scrape === undefined || scrape === null) {
            scrape = await scrapeJsFiles(jsFiles[counter]);
            counter++
        } else {
            counter = 9999; // It's over 9000!!!
            let match = scrape[0];
            return match;
        }
    }   
}

console.log(await getDiscordBuild())


