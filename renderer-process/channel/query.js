'use strict';
const s = require('electron-settings');
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

const channelInfo = document.getElementById('channel-info');
const chainInfo = document.getElementById('channel-chaininfo');

const refreshChannelInfo = document.getElementById('refresh-channel-info');
const refreshChainInfo = document.getElementById('refresh-channel-chaininfo');

const channelBlock = document.getElementById('channel-block');
const channelTransaction = document.getElementById('channel-transaction');

const getBlockBtn = document.getElementById('get-channel-block');
const getTransactionBtn = document.getElementById('get-channel-transaction');

async function queryChaininfo() {
	try {
		let ret = await hfc.query.getChainInfo(s.get('peer'), s.get('channelName'), s.get('username'), s.get('orgname'));
		chainInfo.innerHTML = JSON.stringify(ret);
	} catch(e) {
		ipc.send('open-error-dialog', 'Query ChainInfo Failed', e.message);
	}
};

async function queryChannels() {
	try {
		let ret = await hfc.query.getChannels(s.get('peer'), s.get('username'), s.get('orgname'));
		channelInfo.innerHTML = JSON.stringify(ret);
	} catch(e) {
		ipc.send('open-error-dialog', 'Channel Chaincode Failed', e.message);
	}
};

refreshChainInfo.addEventListener('click', function(e) {
	queryChaininfo();
});

refreshChannelInfo.addEventListener('click', function(e) {
	queryChannels();
});

getBlockBtn.addEventListener('click', async function(e) {
	const peer = document.getElementById('query-block-peer').value;
	const blockId = document.getElementById('query-block-id').value;
	const hash = document.getElementById('query-block-hash').value;
	try {
		let ret = null;
		if (blockId) {
			ret = await hfc.query.getBlockByNumber(peer, s.get('channelName'), blockId, s.get('username'), s.get('orgname'));
		}
		if (hash) {
			ret = await hfc.query.getBlockByHash(peer, s.get('channelName'), hash, s.get('username'), s.get('orgname'));
		}
		channelBlock.innerHTML = JSON.stringify(ret);
	} catch(e) {
		ipc.send('open-error-dialog', 'Query Channel Block Failed', e.message);
	}
});

getTransactionBtn.addEventListener('click', async function(e) {
	const peer = document.getElementById('query-transaction-peer').value;
	const trxnId = document.getElementById('query-transaction-id').value;
	try {
		let ret = await hfc.query.getTransactionByID(peer, s.get('channelName'), trxnId, s.get('username'), s.get('orgname'));
		channelTransaction.innerHTML = JSON.stringify(ret);
	} catch(e) {
		ipc.send('open-error-dialog', 'Query Channel Transaction Failed', e.message);
	}
});