const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('open-error-dialog', function (event, title, msg) {
  dialog.showErrorBox(title, msg);
});

ipc.on('open-information-dialog', function (event, title, msg) {
    const options = {
      type: 'info',
      title: title,
      message: msg,
      buttons: ['OK']
    };
    dialog.showMessageBox(options, function (index) {
      event.sender.send('information-dialog-selection', index)
    });
  });