'use strict';
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

//TODO: 当前用户设置，可以通过context 菜单
const peer = 'peer0.org1.example.com';
const username = 'Jim';
const orgname = 'Org1';
const channelName = 'mychannel';

async function queryChaininfo() {
	try {
		let ret = await hfc.query.getChainInfo(peer, channelName, username, orgname);
		console.log(ret);
		chainInfo.innerHTML = JSON.stringify(ret);
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Query ChainInfo Failed', e.message);
	}
};

async function queryChannels() {
	try {
		let ret = await hfc.query.getChannels(peer, username, orgname);
		console.log(ret);
		channelInfo.innerHTML = JSON.stringify(ret);
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Channel Chaincode Failed', e.message);
	}
};

queryChaininfo();
queryChannels();

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
			ret = await hfc.query.getBlockByNumber(peer, channelName, blockId, username, orgname);
		}
		if (hash) {
			ret = await hfc.query.getBlockByHash(peer, channelName, hash, username, orgname);
		}
		console.log(ret);
		channelBlock.innerHTML = JSON.stringify(ret);
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Query Channel Block Failed', e.message);
	}
});

getTransactionBtn.addEventListener('click', async function(e) {
	const peer = document.getElementById('query-transaction-peer').value;
	const trxnId = document.getElementById('query-transaction-id').value;
	try {
		let ret = await hfc.query.getTransactionByID(peer, channelName, trxnId, username, orgname);
		console.log(ret);
		channelTransaction.innerHTML = JSON.stringify(ret);
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Query Channel Transaction Failed', e.message);
	}
});