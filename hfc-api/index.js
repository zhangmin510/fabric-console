var util = require('util');
var path = require('path');
var hfc = require('fabric-client');

var file = 'network-config%s.yaml';

var env = process.env.TARGET_NETWORK;
if (env)
	file = util.format(file, '-' + env);
else
	file = util.format(file, '');
// indicate to the application where the setup file is located so it able
// to have the hfc load it to initalize the fabric client instance
hfc.setConfigSetting('network-connection-profile-path',path.join(__dirname, '../artifacts' ,file));
hfc.setConfigSetting('Org1-connection-profile-path',path.join(__dirname, '../artifacts', 'org1.yaml'));
hfc.setConfigSetting('Org2-connection-profile-path',path.join(__dirname, '../artifacts', 'org2.yaml'));
// some other settings the application might need to know
hfc.addConfigFile(path.join(__dirname, './config.json'));

let hfcApi = module.exports;

hfcApi.helper = require('./helper.js');
hfcApi.createChannel = require('./create-channel.js');
hfcApi.join = require('./join-channel.js');
hfcApi.install = require('./install-chaincode.js');
hfcApi.instantiate = require('./instantiate-chaincode.js');
hfcApi.invoke = require('./invoke-transaction.js');
hfcApi.query = require('./query.js');
hfcApi.client = hfc;