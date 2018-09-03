'use strict';
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

const createChannelReply = document.getElementById('create-channel-reply');
const joinChannelReply = document.getElementById('join-channe-reply');

const createChannelBtn = document.getElementById('create-channel');
const joinChannelBtn = document.getElementById('join-channel');

//TODO: 当前用户设置，可以通过context 菜单
const peer = 'peer0.org1.example.com';
const username = 'Jim';
const orgname = 'Org1';
const channelName = 'mychannel';

createChannelBtn.addEventListener('click', async function(e) {
	const channelName = document.getElementById('create-channel-name').value;
	const channelConfigPath = document.getElementById('create-channel-path').value;
	try {
        let ret = await hfc.createChannel.createChannel(channelName, channelConfigPath, username, orgname);
		createChannelReply.innerHTML = JSON.stringify(ret);
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Create Channel Failed', e.message);
	}
});

joinChannelBtn.addEventListener('click', async function(e) {
	const channelName = document.getElementById('join-channel-name').value;
	const peers = document.getElementById('join-channel-peers').value.split(',');
	try {
        let ret =  await hfc.join.joinChannel(channelName, peers, username, orgname);
		console.log(ret);
		joinChannelReply.innerHTML = JSON.stringify(ret);
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Join Channel Failed', e.message);
	}
});