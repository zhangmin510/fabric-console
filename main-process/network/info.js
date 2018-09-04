'use strict';
const settings = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

async function getInfo() {
    if (settings.has('orgname')) {

        hfc.setUpConfigSetting();

        const client = await hfc.helper.getClientForOrg(settings.get('orgname'));
        const mspId = await client.getMspid();
        settings.set('mspId', mspId);

        const peers = await client.getPeersForOrg(mspId);

        settings.set('peers', peers);
        settings.set('peer', peers[0].getName());

        const channel = client.getChannel();
        settings.set('channelName', channel.getName());

        let caClient = client.getCertificateAuthority();
		let admins = caClient.getRegistrar();
        settings.set('username', admins[0].enrollId);
    }
    console.log('settings file location:', settings.file());
    console.log('settings current:', settings.getAll());
}

getInfo();
