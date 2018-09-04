'use strict';
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');
const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));
const s = require('electron-settings');

const getUserBtn = document.getElementById('refresh-list');
const userList = document.getElementById('user-list');
const createUserBtn = document.getElementById('create-user');
const revokeUserBtn = document.getElementById('revoke-user');


async function genTable() {
    let all = await hfc.users.getUsers(s.get('orgname'));
    let tab="<table border='1' bordercolor='blue' width='200' height='10'>";
    tab += "<tr><td>ID</td><td>Affiliation</td></tr>";
    for(let i in all.result.identities) {
      
      let u = all.result.identities[i];
      tab+="<tr>";
      tab+="<td>" + u.id + "</td>";
      tab+="<td>" + u.affiliation + "</td>";
      tab+="</tr>";
      console.log(u.id);
    }
    tab+="</table>"
    userList.innerHTML=tab;
    console.log(JSON.stringify(all));
}

getUserBtn.addEventListener('click', async function (event) {
    genTable();
});

createUserBtn.addEventListener('click', async function (event) {
    let user_id = document.getElementById('userid').value;
    let user_aff = document.getElementById('useraff').value;
    let reply = document.getElementById('create-user-reply');
    let res = await hfc.users.registerUser(user_id, user_aff,s.get('orgname'));
    if(res) {
        genTable();
        reply.innerText = 'Register Success';
    } else {
        reply.innerText = 'Register Failed';
    }

});

revokeUserBtn.addEventListener('click', async function (event) {
    let user_id = document.getElementById('revoke-user-id').value;
    let reply = document.getElementById('revoke-user-reply');
    console.log(user_id);
    let res = await hfc.users.revokeUser(user_id,s.get('orgname'));
    if(res) {
        reply.innerText = 'Revoke Success';
    } else {
        reply.innerText = 'Revoke Failed';
    }
});