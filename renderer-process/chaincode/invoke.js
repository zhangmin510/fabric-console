'use strict';
const s = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));
const logger = hfc.helper.getLogger('chaincode-management');

const invokeBtn = document.getElementById('chaincode-invoke-button')
const invokeResult = document.getElementById('chaincode-invoke-result')

invokeBtn.addEventListener('click', async function (event) {
	//TODO: 校验字段合法性
	const peers = document.getElementById('invoke-peers').value.split(',');
	const chaincodeName = document.getElementById('invoke-chaincodeName').value;
	const fcn = document.getElementById('invoke-fcn').value;
	let args = document.getElementById('invoke-args').value;

	if (!peers || !chaincodeName || !fcn || !args) {
		ipc.send('open-error-dialog', 'Parameter Error', 'params should not be empty');
		return;
	}

	args = JSON.parse(args);

	try {
		let ret = await hfc.invoke.invokeChaincode(peers, s.get('channelName'), chaincodeName, fcn, args, s.get('username'), s.get('orgname'));
		logger.info('invoke chaincode response:', ret);
		invokeResult.innerHTML = ret;
		ipc.send('open-information-dialog', 'Invoke Chaincode', ret);
	} catch(e) {
		logger.error('invoke chaincode failed with error ', e);
		ipc.send('open-error-dialog', 'Invoke Chaincode Failed', e.message);
	}
});