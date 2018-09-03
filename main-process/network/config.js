const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipc = electron.ipcMain
const app = electron.app

//TODO: 设置当前用户，组织信息
const menu = new Menu()
menu.append(new MenuItem({ 
    label: 'Settings',
    click: function (item, focusedWindow) {
        if (focusedWindow) {
          const options = {
            type: 'info',
            title: 'Application Menu Demo',
            buttons: ['Ok'],
            message: 'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.'
          }
          electron.dialog.showMessageBox(focusedWindow, options, function () {})
        }
      }
}));
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'Fabric Console', type: 'checkbox', checked: true }))

app.on('browser-window-created', function (event, win) {
  win.webContents.on('context-menu', function (e, params) {
    menu.popup(win, params.x, params.y)
  })
})

ipc.on('show-context-menu', function (event) {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})