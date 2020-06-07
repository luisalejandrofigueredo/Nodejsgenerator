const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron')
const { spawn } = require('child_process');
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

ipcMain.on('loadconfig', (event, arg) => {
  fs.readFile(arg, function (err, data) {
    if (err) throw err;
    const json = JSON.parse(data);
    event.returnValue = json;
  });
});

ipcMain.on('openvisualcode', (event, arg) => {
  console.log('arg', arg);
  try {
    process.chdir(arg.path);
  }
  catch(err){console.log('operative system error');}
  try {
    if (process.platform==="win32") {
        const visu=spawn('cmd.exe',['/c','code','.']);
    } else {
        const visu=spawn('code',['.']);
    }
  }
  catch(err){console.log('operative error open visual');}
  try {
      process.chdir(__dirname);
  }
  catch(err){console.log('operative system error');}
  event.returnValue = 'visual ready';
});

ipcMain.on('saveentity', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\entitys\\' + arg.name + '.entity.ts';
    dir = arg.path + '\\src\\entitys'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/entitys/' + arg.name + '.entity.ts';
    dir = arg.path + '/src/entitys'
  }
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  writeFile(filepath, arg.file);
  event.returnValue = 'file saved';
});

ipcMain.on('saveservice', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\service\\' + arg.name + '.service.ts';
    dir = arg.path + '\\src\\service';
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/service/' + arg.name + '.service.ts';
    dir = arg.path + '/src/service';
  }
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  writeFile(filepath, arg.file);
  event.returnValue = 'file saved';
});

ipcMain.on('savecontroler', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\controler\\' + arg.name + '.controler.ts';
    dir = arg.path + '\\src\\controler'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/controler/' + arg.name + '.controler.ts';
    dir = arg.path + '/src/controler'
  }
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  writeFile(filepath, arg.file);
  event.returnValue = 'file controler saved';
});

function writeFile(filepath, file) {
  fs.writeFileSync(filepath, file);
  console.log('writed', filepath);
}

ipcMain.on('saveconfig', (event, arg) => {
  fs.writeFile('config.json', arg, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
})

app.allowRendererProcessReuse = true;
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})