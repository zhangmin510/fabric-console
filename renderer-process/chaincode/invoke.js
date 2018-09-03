'use strict';
const settings = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

const invokeBtn = document.getElementById('chaincode-invoke-button')
const invokeResult = document.getElementById('chaincode-invoke-result')

const username = settings.get('username');
const orgname = settings.get('orgname');
const channelName = settings.get('channelName');

invokeBtn.addEventListener('click', async function (event) {
	//TODO: 校验字段合法性
	const peers = document.getElementById('invoke-peers').value.split(',');
	const chaincodeName = document.getElementById('invoke-chaincodeName').value;
	const fcn = document.getElementById('invoke-fcn').value;
	let args = document.getElementById('invoke-args').value;
	args = JSON.parse(args);

	try {
		let ret = await hfc.invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		console.log(ret);
		invokeResult.innerHTML = ret;
		ipc.send('open-information-dialog', 'Invoke Chaincode', ret);
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Invoke Chaincode Failed', e.message);
	}
});