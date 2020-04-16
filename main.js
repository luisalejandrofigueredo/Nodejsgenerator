const {app, BrowserWindow,ipcMain} = require('electron')
const url = require("url");
const path = require("path");
var fs = require('fs');

let mainWindow

function createWindow () {
  console.log('comienzo');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/generador/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipcMain.on('genschema', (event, arg) => {
  fs.writeFile('schema.ts', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
})

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})