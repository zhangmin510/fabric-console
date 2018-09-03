'use strict';
const settings = require('electron-settings')
const ipc = require('electron').ipcRenderer
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));


const refreshInstalledChaincodesBtn = document.getElementById('refresh-installed-chaincode')
const refreshInstantiatedChaincodesBtn = document.getElementById('refresh-instantiated-chaincode')
const installinstantiateChaincodeBtn = document.getElementById('instantiate-chaincode')
const installBtn = document.getElementById('chaincode-install-button')

const installedChaincodes = document.getElementById('installed-chaincodes')
const instantiatedChaincodes = document.getElementById('instantiated-chaincods')

ipc.on('information-dialog-selection', function (event, index) {
	let message = 'You selected '
	if (index === 0) message += 'OK'
	console.log(message);
});

const peer = settings.get('peer');
const username = settings.get('username');
const orgname = settings.get('orgname');
const channelName = settings.get('channelName');

async function refreshInstalledChaincodes() {
	let ccs = await hfc.query.getInstalledChaincodes(peer, null, 'installed', username, orgname)
	console.log(ccs);
	composeTable(installedChaincodes, ccs, true);
}
async function refreshInstantiatedChaincodes() {
	let ccs = await hfc.query.getInstalledChaincodes(peer, channelName, 'instantiated', username, orgname);
	console.log(ccs);
	composeTable(instantiatedChaincodes, ccs, false);
}

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

refreshInstalledChaincodes();
refreshInstantiatedChaincodes();

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

	try {
		let ret = await hfc.install.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, username, orgname)
		console.log(ret);
		ipc.send('open-information-dialog', 'Install Chaincode', ret.message);
		refreshInstalledChaincodes();
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Install Chaincode Failed', e.message);
	}
});

installinstantiateChaincodeBtn.addEventListener('click', async function (event) {
	//TODO: 校验字段合法性
	const peers = document.getElementById('instantiate-peers').value.split(',');
	const chaincodeName = document.getElementById('instantiate-chaincodeName').value;
	const chaincodeType = document.getElementById('instantiate-chaincodeType').value;
	const chaincodeVersion = document.getElementById('instantiate-chaincodeVersion').value;
	const fcn = document.getElementById('instantiate-fcn').value;
	const args = document.getElementById('instantiate-args').value;

	try {
		let ret = await hfc.instantiate.instantiateChaincode(peers, channelName, chaincodeName, chaincodeVersion, chaincodeType, fcn, args, username, orgname);
		console.log(ret);
		ipc.send('open-information-dialog', 'Instantiate Chaincode', ret.message);
		refreshInstalledChaincodes();
		refreshInstantiatedChaincodes();
	} catch(e) {
		console.log(e);
		ipc.send('open-error-dialog', 'Instantiate Chaincode Failed', e.message);
	}
});