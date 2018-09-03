'use strict';
const settings = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

const getCpBtn = document.getElementById('get-connection-profile');
const connctionProfile = document.getElementById('connection-profile');

const username = settings.get('username');
const orgname = settings.get('orgname');


getCpBtn.addEventListener('click', async function(e) {
  const client = await hfc.helper.getClientForOrg(orgname, username);

  const mspId = await client.getMspid();
  console.log('mpsId: ', mspId);
  const peers = await client.getPeersForOrg(mspId);
  for (let peer of peers) {
    console.log(peer.getName());
    console.log(peer.getUrl());
  }
});

// Tell main process to show the menu when demo button is clicked
const contextMenuBtn = document.getElementById('context-menu')
contextMenuBtn.addEventListener('click', function () {
  ipc.send('show-context-menu')
})