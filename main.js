const { app, BrowserWindow, ipcMain, Menu,screen } = require('electron')
const url = require("url");
const path = require("path");
var fs = require('fs');

let mainWindow
var menu = Menu.buildFromTemplate([
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Exit', click() {
          app.quit()
        }
      }
    ]
  }
])

function createWindow() {
  Menu.setApplicationMenu(menu);
  const display = screen.getPrimaryDisplay();
  const maxiSize = display.workAreaSize;
  mainWindow = new BrowserWindow({
    width: maxiSize.width,
    height: maxiSize.height,
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

ipcMain.on('loadconfig',(event, arg) => {
   fs.readFile(arg, function (err,data) {
    if (err) throw err;
    const json =  JSON.parse(data);
    event.returnValue= json;
  });
})

ipcMain.on('saveentity', (event, arg) => {
  const file = arg.path+'\\'+ arg.name+'.ts';
  fs.writeFile(file, arg.file, function (err) {
    if (err) throw err;
    console.log('Saved entity!',file);
    event.returnValue= 'file saved';
  });
})

ipcMain.on('saveconfig', (event, arg) => {
  fs.writeFile('config.json', arg, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
})

app.allowRendererProcessReuse=true;
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})