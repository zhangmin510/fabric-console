'use strict';
const s = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));
const logger = hfc.helper.getLogger('chaincode-management');

const refreshInstalledChaincodesBtn = document.getElementById('refresh-installed-chaincode')
const refreshInstantiatedChaincodesBtn = document.getElementById('refresh-instantiated-chaincode')
const instantiateChaincodeBtn = document.getElementById('instantiate-chaincode')
const installBtn = document.getElementById('chaincode-install-button')
//const chooseChaincodePath = document.getElementById('chaincodePath')
const installedChaincodes = document.getElementById('installed-chaincodes')
const instantiatedChaincodes = document.getElementById('instantiated-chaincods')

//chooseChaincodePath.addEventListener('click', function(e) {
//	ipc.send('open-file-dialog', 'chaincodePath');
//});

ipc.on('information-dialog-selection', function (event, index) {
	let message = 'You selected '
	if (index === 0) message += 'OK'
	console.log(message);
});

async function refreshInstalledChaincodes() {
	let ccs = await hfc.query.getInstalledChaincodes(s.get('peer'), null, 'installed', s.get('username'), s.get('orgname'));
	logger.info('installed chaincode: ', ccs);
	composeTable(installedChaincodes, ccs, true);
}
async function refreshInstantiatedChaincodes() {
	let ccs = await hfc.query.getInstalledChaincodes(s.get('peer'), s.get('channelName'), 'instantiated', s.get('username'), s.get('orgname'));
	logger.info('instantiated chaincode: ', ccs);
	composeTable(instantiatedChaincodes, ccs, false);
}

refreshInstalledChaincodesBtn.addEventListener('click', function(event) {
	refreshInstalledChaincodes();
});

refreshInstantiatedChaincodesBtn.addEventListener('click', function(event) {
	refreshInstantiatedChaincodes();
});

installBtn.addEventListener('click', async function (event) {
	//TODO: 校验字段合法性
	const peers = document.getElementById('peers').value.split(',');
	const chaincodeName = document.getElementById('chaincodeName').value;
	const chaincodePath = document.getElementById('chaincodePath').value;
	const chaincodeType = document.getElementById('chaincodeType').value;
	const chaincodeVersion = document.getElementById('chaincodeVersion').value;

	if (!peers || !chaincodeName || !chaincodeType || !chaincodeVersion) {
		ipc.send('open-error-dialog', 'Parameter Error', 'params should not be empty');
		return;
	}

	try {
		let ret = await hfc.install.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, s.get('username'), s.get('orgname'))
		logger.info('install chaincode response:', ret);
		ipc.send('open-information-dialog', 'Install Chaincode', ret.message);
		refreshInstalledChaincodes();
	} catch(e) {
		logger.error('install chaincode failed with error ', e);
		ipc.send('open-error-dialog', 'Install Chaincode Failed', e.message);
	}
});

instantiateChaincodeBtn.addEventListener('click', async function (event) {
	//TODO: 校验字段合法性
	const peers = document.getElementById('instantiate-peers').value.split(',');
	const chaincodeName = document.getElementById('instantiate-chaincodeName').value;
	const chaincodeType = document.getElementById('instantiate-chaincodeType').value;
	const chaincodeVersion = document.getElementById('instantiate-chaincodeVersion').value;
	const fcn = document.getElementById('instantiate-fcn').value;
	let args = document.getElementById('instantiate-args').value;

	if (!peers || !chaincodeName || !chaincodeType || !chaincodeVersion) {
		ipc.send('open-error-dialog', 'Parameter Error', 'params should not be empty');
		return;
	}
	
	args = JSON.parse(args);

	try {
		let ret = await hfc.instantiate.instantiateChaincode(peers, s.get('channelName'), chaincodeName, chaincodeVersion, chaincodeType, fcn, args, s.get('username'), s.get('orgname'));
		logger.info('instantiate chaincode response: ', ret);
		ipc.send('open-information-dialog', 'Instantiate Chaincode', ret.message);
		refreshInstalledChaincodes();
		refreshInstantiatedChaincodes();
	} catch(e) {
		logger.error('instantiate chaincode failed with error ', e);
		ipc.send('open-error-dialog', 'Instantiate Chaincode Failed', e.message);
	}
});

function composeTable(table, ccs, instantiated) {
	// 先清空table
	const length = table.rows.length;
	if (length > 1) {
		for(let i = 1; i < length; i++) {
			table.deleteRow(1);
		}
	}
	let tr = null;
	let td = null;
	let txt = null;
	let count = 0;
	for(const cc of ccs) {
		let elems = cc.split(',');
		tr = document.createElement('tr');
		tr.id = 'cc' + count++;
		for (const ele of elems) {
			td = document.createElement('td');
			txt = document.createTextNode(ele.split(':')[1]);
			td.appendChild(txt);
			tr.appendChild(td);
		}
		if (instantiated) {
			tr.addEventListener('dblclick', function(event) {
				const childNodes = event.target.parentNode.childNodes;
				console.log(childNodes[0].innerText);
				console.log(childNodes[1].innerText);
				console.log(childNodes[2].innerText);
			});
		}
		table.appendChild(tr);
	}
}