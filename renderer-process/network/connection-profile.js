'use strict';
const settings = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));
const logger = hfc.helper.getLogger('connection-profile');

const setCpBtn = document.getElementById('set-connection-profile');

const networkCp = document.getElementById('network-cp');
const orgname = document.getElementById('client-org');
const username = document.getElementById('client-user-name');
const clientCp = document.getElementById('client-cp');

networkCp.addEventListener('click', function(e) {
	ipc.send('open-file-dialog', 'network-cp');
});

clientCp.addEventListener('click', function(e) {
	ipc.send('open-file-dialog', 'client-cp');
});

ipc.on('selected-directory', function (event, path, element) {
  document.getElementById(element).value = path;
});

setCpBtn.addEventListener('click', async function(e) {
  if(!validParam(networkCp.value, clientCp.value, orgname.value, username.value)) {
    return;
  }
  settings.set('network-connection-profile-path', networkCp.value);
  settings.set('orgname', orgname.value);
  settings.set(orgname.value + '-connection-profile-path', clientCp.value);
  settings.set('username', username.value);

  // set up fabric-client config setting
  hfc.setUpConfigSetting();

  const client = await hfc.helper.getClientForOrg(orgname.value);
  const mspId = await client.getMspid();
  settings.set('mspId', mspId);
  console.log('====', mspId);

  const peers = await client.getPeersForOrg(mspId);

  settings.set('peers', peers);
  const peer = peers[0].getName();
  settings.set('peer', peer);

  logger.info('settings peers: ', peers);
  logger.info('settings peer:', peer);

  const channel = client.getChannel();
  settings.set('settings channelName', channel.getName());

  logger.info('settings orgname', settings.get('orgname'));
  logger.info('settings username', settings.get('username'));
  logger.info('settings client cp', settings.get(orgname.value + '-connection-profile-path'))
  logger.info('settings network cp', settings.get('network-connection-profile-path'));

});

currentConnectionProfile();

function currentConnectionProfile() {
  const ncp = settings.get('network-connection-profile-path');
  const org = settings.get('orgname');
  const ccp = settings.get(org + '-connection-profile-path');
  const un = settings.get('username');
  if (!ncp || !org || !un) {
    ipc.send('open-information-dialog', 'Fabric Network', 'Please config network connection profile');
    return;
  }
  networkCp.value = ncp;
  orgname.value = org;
  clientCp.value = ccp;
  username.value = un;
};


function validParam(networkCp, clientCp, orgname, username) {
  if (!networkCp) {
    ipc.send('open-error-dialog', 'Parameter Error', 'network connection profile should not be empty');
    return false;
  }

  if (!orgname) {
    ipc.send('open-error-dialog', 'Parameter Error', 'organization name should not be empty');
    return false;
  }

  if (!username) {
    ipc.send('open-error-dialog', 'Parameter Error', 'user name should not be empty');
    return false;
  }
  
  if (!clientCp) {
    ipc.send('open-error-dialog', 'Parameter Error', 'client connection profile should not be empty');
    return fale;
  }
  return true;
}