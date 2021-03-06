const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('open-file-dialog', function (event, element) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openirectory']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files, element)
  });
});