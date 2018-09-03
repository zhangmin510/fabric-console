'use strict';
const settings = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

//TODO: set up
const username = 'Jim';
const orgname = 'Org1';
const channelName = 'mychannel';

async function getInfo() {
    const client = await hfc.helper.getClientForOrg(orgname, username);

    const mspId = await client.getMspid();
    settings.set('mspId', mspId);

    const peers = await client.getPeersForOrg(mspId);

    settings.set('peers', peers);
    settings.set('peer', peers[0].getName());
    settings.set('username', username);
    settings.set('orgname', orgname);
    settings.set('channelName', channelName);


    for (let peer of peers) {
    console.log(peer.getName());
    console.log(peer.getUrl());
    }
}

getInfo();
