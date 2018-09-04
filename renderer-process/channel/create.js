'use strict';
const s = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));
const logger = hfc.helper.getLogger('channel-management');

const createChannelReply = document.getElementById('create-channel-reply');
const joinChannelReply = document.getElementById('join-channel-reply');

const createChannelBtn = document.getElementById('create-channel');
const joinChannelBtn = document.getElementById('join-channel');
const chooseChannelConfigPath = document.getElementById('create-channel-path');


chooseChannelConfigPath.addEventListener('click', function(e) {
	ipc.send('open-file-dialog', 'create-channel-path');
});

createChannelBtn.addEventListener('click', async function(e) {
	const channelName = document.getElementById('create-channel-name').value;
	const channelConfigPath = document.getElementById('create-channel-path').value;
	try {
        let ret = await hfc.createChannel.createChannel(channelName, channelConfigPath, s.get('channelName'), s.get('orgname'));
		createChannelReply.innerHTML = JSON.stringify(ret);
	} catch(e) {
		ipc.send('open-error-dialog', 'Create Channel Failed', e.message);
	}
});

joinChannelBtn.addEventListener('click', async function(e) {
	const channelName = document.getElementById('join-channel-name').value;
	const peers = document.getElementById('join-channel-peers').value.split(',');
	try {
        let ret =  await hfc.join.joinChannel(channelName, peers, s.get('username'), s.get('orgname'));
		logger.info('join channel response:', ret);
		joinChannelReply.innerHTML = JSON.stringify(ret);
	} catch(e) {
		logger.error('join channel failed with error ', e);
		ipc.send('open-error-dialog', 'Join Channel Failed', e.message);
	}
});