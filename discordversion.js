const fetch = require('node-fetch');
const fs = require('fs');
const storedHashPath = './discordhash.json';
const settingsPath = './settings.json';
const releaseChannel = ['https://discordapp.com/', 'https://ptb.discordapp.com/', 'https://canary.discordapp.com/']; 
const releaseChannelName = ['Stable', 'Beta', 'Canary']


const getIndexOfFiles = async (channel, index) => {
    const storedDiscordHash = JSON.parse(fs.readFileSync(storedHashPath));
    const retrieveData = await fetch(`${channel}app`)
        .then((response) => {
            return response.text();
        })

    const getBuildId = retrieveData.match(/"buildId":"([\w\d]+)"/).reverse();
    const foundBuildId = getBuildId[0];

    if (storedDiscordHash[releaseChannelName[index]] !== foundBuildId) {
        storedDiscordHash[releaseChannelName[index]] = foundBuildId;
        fs.writeFileSync(storedHashPath, JSON.stringify(storedDiscordHash, null, 4));
    } else {
        return false;
    }

    return retrieveData.match(/assets\/[\w\d]+\.js/g).reverse();
}

const searchIndexOfFiles = async (channel, fileIndex) => {
    const result = await fetch(`${channel}${fileIndex}`)
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            let searchMatch = data.match(/Build Number: ([\w.]+), Version Hash: ([\w.]+)/);
            if (searchMatch ===  null) return;
            let matchResult = []
            matchResult.push(searchMatch[1], searchMatch[2])
            return matchResult;
        })
    return result;
}

const getIndividualReleaseBuild = async (release) => {
    const indexOfFiles = await getIndexOfFiles(releaseChannel[release], release);
    if (indexOfFiles === false) return false;
    for (const file in indexOfFiles) {
        const indexSearchResults = await searchIndexOfFiles(releaseChannel[release], indexOfFiles[file]);
        if (indexSearchResults) return indexSearchResults;
    }
}

const getAllReleaseBuilds = async () => {
    let discordReleases = [];
    for (let i = 0; i < releaseChannel.length; i++) {
        const result = await getIndividualReleaseBuild(i);
        discordReleases.push(result);
    }
    return discordReleases;
}

const sendDiscordUpdate = async () => {
    let getSetting = JSON.parse(fs.readFileSync(settingsPath));
    while (getSetting.botSettings.discordUpdates === true) {
        let discordUpdateData =  await getAllReleaseBuilds();
        for (let i = 0; i < discordUpdateData.length; i++) {
            if (discordUpdateData[i]) {
                console.log(discordUpdateData[i])
                let buildNumber = discordUpdateData[i][0]
                let versionHash = discordUpdateData[i][1]
                console.log(buildNumber, versionHash)
            }
        }
        getSetting = JSON.parse(fs.readFileSync(settingsPath));
        await delay(15000);
    }
    return;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
    console.log(await sendDiscordUpdate())
})()


