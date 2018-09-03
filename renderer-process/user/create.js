'use strict';
const path = require('path');
const APP_HOME = path.join(__dirname, '../../');
const hfc = require(path.join(APP_HOME, 'hfc-api/index.js'));

const getUserBtn = document.getElementById('refresh-list');
const userList = document.getElementById('user-list');
const createUserBtn = document.getElementById('create-user');
const revokeUserBtn = document.getElementById('revoke-user');


const orgName = 'Org1';

async function genTable() {
    let all = await hfc.users.getUsers(orgName);
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

genTable();

getUserBtn.addEventListener('click', async function (event) {
    genTable();
});

createUserBtn.addEventListener('click', async function (event) {
    let user_id = document.getElementById('userid').value;
    let user_aff = document.getElementById('useraff').value;
    let reply = document.getElementById('create-user-reply');
    let res = await hfc.users.registerUser(user_id, user_aff,orgName);
    if(res) {
        genTable();
        reply.innerText = '注册成功！';
    } else {
        reply.innerText = '注册失败！';
    }

});

revokeUserBtn.addEventListener('click', async function (event) {
    let user_id = document.getElementById('revoke-user-id').value;
    let reply = document.getElementById('revoke-user-reply');
    console.log(user_id);
    let res = await hfc.users.revokeUser(user_id,orgName);
    if(res) {
        reply.innerText = '吊销成功！';
    } else {
        reply.innerText = '吊销失败！';
    }
});