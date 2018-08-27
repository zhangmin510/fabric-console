const ipc = require('electron').ipcMain

ipc.on('chaincode-query-async', function (event, arg) {
  event.sender.send('asynchronous-reply', 'pong')
})
