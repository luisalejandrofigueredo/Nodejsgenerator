'use strict';
const { app, BrowserWindow, ipcMain, Menu, screen, shell } = require('electron');
const { spawn } = require('child_process');
const url = require("url");
const path = require("path");
var fs = require('fs');
const prettier = require("prettier");
/*require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});*/

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
    },
    icon: path.join(__dirname, `/dist/generador/assets/logo.svg`)
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
ipcMain.on('helpoptions', (event, arg) => {
  shell.openExternal('https://typeorm.io/#/find-options');
});

ipcMain.on('savemain', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\' + arg.name;
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/' + arg.name;
  }
  let textprettier = prettier.format(arg.file, { semi: true, singleQuote: true, parser: "typescript" });
  writeFile(filepath, textprettier);
  event.returnValue = filepath;
});

ipcMain.on('loadtemplate', (event, arg) => {
  fs.readFile(arg, 'utf-8', function (err, data) {
    if (err) throw err;
    event.returnValue = data;
  });
});

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
  catch (err) { console.log('operative system error'); }
  try {
    if (process.platform === "win32") {
      const visu = spawn('cmd.exe', ['/c', 'code', '.']);
    } else {
      const visu = spawn('code', ['.']);
    }
  }
  catch (err) { console.log('operative error open visual'); }
  try {
    process.chdir(__dirname);
  }
  catch (err) { console.log('operative system error'); }
  event.returnValue = 'visual ready';
});

ipcMain.on('saveappmodule', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\' + arg.name + '.module.ts';
    dir = arg.path + '\\src\\'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/' + arg.name + '.module.ts';
    dir = arg.path + '/src/'
  }
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  writeFile(filepath, arg.file);
  event.returnValue = filepath;
});

ipcMain.on('saveutilmuter', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\controller\\' + arg.name + '.utils.ts';
    dir = arg.path + '\\src\\controller'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/controller/' + arg.name + '.utils.ts';
    dir = arg.path + '/src/controller'
  }
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  let textprettier = prettier.format(arg.file, { semi: true, singleQuote: true, parser: "typescript" });
  writeFile(filepath, textprettier);
  event.returnValue = filepath;
});

ipcMain.on('savemodule', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\module\\' + arg.name + '.module.ts';
    dir = arg.path + '\\src\\module'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/module/' + arg.name + '.module.ts';
    dir = arg.path + '/src/module'
  }
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  let textprettier = prettier.format(arg.file, { semi: true, singleQuote: true, parser: "typescript" });
  writeFile(filepath, textprettier);
  event.returnValue = filepath;
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
  event.returnValue = filepath;
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
  if (arg.format) {
    let textprettier = prettier.format(arg.file, { semi: true, singleQuote: true, parser: "typescript" });
    writeFile(filepath, textprettier);
  } else {
    writeFile(filepath, arg.file)
  }
  event.returnValue = filepath;
});

ipcMain.on('saveormconfig', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\' + arg.name;
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/' + arg.name;
  }
  writeFile(filepath, arg.file);
  event.returnValue = filepath;
});

ipcMain.on('savecanactivate', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\roles\\' + arg.name + '.guard.ts';
    dir = arg.path + '\\src\\roles'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/roles/' + arg.name + '.guard.ts';
    dir = arg.path + '/src/roles'
  }
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  let textprettier = prettier.format(arg.file, { semi: true, singleQuote: true, parser: "typescript" });
  writeFile(filepath, textprettier);
  event.returnValue = filepath;
});

ipcMain.on('saveController', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\controller\\' + arg.name + '.controller.ts';
    dir = arg.path + '\\src\\controller'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/controller/' + arg.name + '.controller.ts';
    dir = arg.path + '/src/controller'
  }
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  let textprettier = prettier.format(arg.file, { semi: true, singleQuote: true, parser: "typescript" });
  writeFile(filepath, textprettier);
  event.returnValue = filepath;
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