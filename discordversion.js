import fetch from 'node-fetch';

const getIndexOfFiles = async () => {
    return fetch('https://canary.discordapp.com/app')
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            return data.match(/assets\/[\w\d]+\.js/g).reverse();
        })
}

const scrapeIndexFiles = async (files) => {
    return fetch(`https://canary.discord.com/${files}`)
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            const results = data.match(/Build Number: [\w.]+, Version Hash: [\w.]+/g);
            return results;
        })
}

const getDiscordBuild = async () => {
    const indexOfFiles = await getIndexOfFiles();    
    for (const file in indexOfFiles) {        
        const scrapeIndex = await scrapeIndexFiles(indexOfFiles[file]);
        if (scrapeIndex) return scrapeIndex;
    }   
}

console.log(await getDiscordBuild())


