'use strict';
const settings = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

const queryBtn = document.getElementById('chaincode-query-button')
const queryResult = document.getElementById('chaincode-query-result')

const username = settings.get('username');
const orgname = settings.get('orgname');
const channelName = settings.get('channelName');

queryBtn.addEventListener('click', async function (event) {
	//TODO: 校验字段合法性
	const peer = document.getElementById('query-peer').value;
	const chaincodeName = document.getElementById('query-chaincodeName').value;
	const fcn = document.getElementById('query-fcn').value;
	let args = document.getElementById('query-args').value;
	args = JSON.parse(args);

	try {
		let ret = await hfc.query.queryChaincode(peer, channelName, chaincodeName, args, fcn, username, orgname);
		console.log(ret);
		queryResult.innerHTML = ret;
		ipc.send('open-information-dialog', 'Query Chaincode', ret);
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Query Chaincode Failed', e.message);
	}
});