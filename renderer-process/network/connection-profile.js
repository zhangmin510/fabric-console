'use strict';
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

const getCpBtn = document.getElementById('get-connection-profile');
const connctionProfile = document.getElementById('connection-profile');

//TODO: set up
const username = 'Jim';
const orgname = 'Org1';

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
