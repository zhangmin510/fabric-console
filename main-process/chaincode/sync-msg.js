const ipc = require('electron').ipcMain

ipc.on('chaincode-query-sync', function (event, arg) {
  event.returnValue = 'pong'
})
