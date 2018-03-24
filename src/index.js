// src/electron.js

const {app, BrowserWindow,ipcMain,Menu} = require('electron')

// Needs to be loaded here so the renderer process can load it via the
// remote.require() API.
// See: https://github.com/nathanbuchar/electron-settings/wiki/FAQs
const settings = require('electron-settings');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win



function createWindow () {

  // Create the browser window.
  win = new BrowserWindow({width: 1024, height: 768})

  //clear sesssion on startup 

      // and load the index.html of the app.
      win.loadURL(`file://${__dirname}/index.html`)

      // Open the DevTools.
      //

      // Emitted when the window is closed.
      win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
      })

      ipcMain.on('logout-called', (event, arg) => {
          win.webContents.session.clearCache(function(){
            win.webContents.session.clearStorageData(function(){
              console.log('logout succeeded');
              win.loadURL(`file://${__dirname}/index.html`)
            });
          });
      })
}


function toggleSearch(){
        win.webContents.send('toggle-search', 'true');
}

function createMenu(){

    // Create the Application's main menu
    var template = [{
        label: "SAR-Client",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { label: "Debugger", accelerator: "Shift+CmdOrCtrl+I", click: function(){ win.webContents.openDevTools() }},
            { label: "Stick to top", accelerator: "Shift+CmdOrCtrl+T", click: function(){ win.setAlwaysOnTop(!win.isAlwaysOnTop())}},
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Find", accelerator: "CmdOrCtrl+F", click: function() { toggleSearch() }},
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

}

function init(){
  createWindow();
  createMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init)



// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
