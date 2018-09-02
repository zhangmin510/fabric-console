'use strict';

const path = require('path');

const APP_HOME = path.join(__dirname, '../../');

const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

const queryResult = document.getElementById('query-reply')
const queryBtn = document.getElementById('query')

queryBtn.addEventListener('click', async function (event) {
	console.log(event);
	const peer = 'peer0.org1.example.com';
	const username = 'Jim';
	const orgname = 'Org1';
	let message = await hfc.query.getChannels(peer, username, orgname);
	console.log(message);
	queryResult.innerHTML = message.channels;
});