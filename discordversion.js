const fetch = require('node-fetch');

const releaseChannel = ['https://discordapp.com/', 'https://ptb.discordapp.com/', 'https://canary.discordapp.com/']; 
const releaseChannelName = ['Stable: ', 'Beta: ', 'Canary: ']

const getIndexOfFiles = async (channel) => {
    const result = await fetch(`${channel}app`)
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            return data.match(/assets\/[\w\d]+\.js/g).reverse();
        })
    return result;
}

const scrapeIndexFiles = async (channel, fileIndex) => {
    const result = await fetch(`${channel}${fileIndex}`)
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            return data.match(/Build Number: [\w.]+, Version Hash: [\w.]+/g);
        })
    return result;
}

const getIndividualReleaseBuild = async (release) => {
    const indexOfFiles = await getIndexOfFiles(releaseChannel[release]);
    for (const file in indexOfFiles) {
        const scrapeIndex = await scrapeIndexFiles(releaseChannel[release], indexOfFiles[file]);
        if (scrapeIndex) return scrapeIndex;
    }
}

const getAllReleaseBuilds = async () => {
    let discordReleases = [];
    for (i = 0; i < releaseChannel.length; i++) {
        const result = await getIndividualReleaseBuild(i);
        discordReleases.push(releaseChannelName[i] + result);
    }
    return discordReleases;
}

(async () => {
    console.log(await getAllReleaseBuilds())
})()


