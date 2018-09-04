'use strict';
const s = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));
const logger = hfc.helper.getLogger('chaincode-management');

const queryBtn = document.getElementById('chaincode-query-button')
const queryResult = document.getElementById('chaincode-query-result')

queryBtn.addEventListener('click', async function (event) {
	//TODO: 校验字段合法性
	const peer = document.getElementById('query-peer').value;
	const chaincodeName = document.getElementById('query-chaincodeName').value;
	const fcn = document.getElementById('query-fcn').value;
	let args = document.getElementById('query-args').value;

	if (!peers || !chaincodeName || !fcn || !args) {
		ipc.send('open-error-dialog', 'Parameter Error', 'params should not be empty');
		return;
	}

	args = JSON.parse(args);

	try {
		let ret = await hfc.query.queryChaincode(peer, s.get('channelName'), chaincodeName, args, fcn, s.get('username'), s.get('orgname'));
		logger.info('query chaincode response:', ret);
		queryResult.innerHTML = ret;
		ipc.send('open-information-dialog', 'Query Chaincode', ret);
	} catch(e) {
		logger.error('query chaincode failed with error ', e);
		ipc.send('open-error-dialog', 'Query Chaincode Failed', e.message);
	}
});