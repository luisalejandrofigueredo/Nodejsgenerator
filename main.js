const prettier = require("prettier");
const { app, BrowserWindow, ipcMain, Menu, screen, shell } = require('electron');
const { spawn } = require('child_process');
const { ElementRef } = require("@angular/core");
const url = require("url");
const path = require("path");
var fs = require('fs');
var saveenabled = false;
var arraysubmenu = [];
var recent = [];
var template = [
  {
    label: 'Menu',
    submenu: [
      {
        label: 'New', click() {
          newfile();
        }
      },
      {
        label: 'Load', click() {
          load();
        }
      },
      {
        id: 'save',
        enabled: false,
        label: 'Save', click() {
          save();
        }
      },
      {
        label: 'Save as', click() {
          saveas();
        }
      },
      {
        id: 'recent',
        submenu: arraysubmenu,
        label: 'Open recent', click() {
        }
      },
      {
        label: 'Exit', click() {
          app.quit()
        }
      }
    ]
  }, {
    label: 'Windows',
    submenu: [{
      label: 'Config',
      click() {
        navigate('config')
      }
    },
    {
      label: 'Browse schematics',
      click() {
        navigate('browseschematics')
      }
    },
    {
      label: 'Generator',
      click() {
        navigate('generator')
      }
    }, {
      label: 'Config security',
      click() {
        navigate('gensecurity')
      }
    },
    {
      label: 'Test Api',
      click() {
        navigate('testapi')
      }
    }
    ]
  }, {
    label: 'Execute',
    submenu: [{
      label: 'clear recent',
      click() {
        clearrecent()
      }
    },
    {
      label: 'Open dev tools',
      click() {
        opendevtools()
      }
    }
    ]
  },
  {
    label: 'Help',
    submenu: [{
      label: 'About',
      click() {
        about()
      }
    },
    {
      label: 'Tutorial',
      click() {
        tutorial()
      }
    }
    ]
  }
];
var mainWindow;
var menu = Menu.buildFromTemplate(template);
/*require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});*/

function navigate(moveto) {
  switch (moveto) {
    case 'config':
      mainWindow.webContents.send("navigate", 'config');
      break;
    case 'browseschematics':
      mainWindow.webContents.send("navigate", 'browseschematics');
      break;
    case 'generator':
      mainWindow.webContents.send("navigate", 'generator');
      break;
    case 'gensecurity':
      mainWindow.webContents.send("navigate", 'gensecurity');
      break;
    case 'testapi':
      mainWindow.webContents.send("navigate", 'testapi');
      break;
    default:
      break;
  }
}
function about() {
  mainWindow.webContents.send("about");
}
function tutorial() {
  mainWindow.webContents.send("tutorial");
}
function newfile() {
  mainWindow.webContents.send("new");
  let itemmenu = menu.getMenuItemById('save');
  itemmenu.enabled = true;
}
function settemplate() {
  const itemmenu = menu.getMenuItemById('save');
  const saveenable = itemmenu.enabled;
  template = [
    {
      label: 'Menu',
      submenu: [
        {
          label: 'New', click() {
            newfile();
          }
        },
        {
          label: 'Load', click() {
            load();
          }
        },
        {
          id: 'save',
          enabled: saveenable,
          label: 'Save', click() {
            save();
          }
        },
        {
          label: 'Save as', click() {
            saveas();
          }
        },
        {
          id: 'recent',
          submenu: arraysubmenu,
          label: 'Open recent', click() {
          }
        },
        {
          label: 'Exit', click() {
            app.quit()
          }
        }
      ]
    }, {
      label: 'Windows',
      submenu: [{
        label: 'Config',
        click() {
          navigate('config')
        }
      },
      {
        label: 'Browse schematics',
        click() {
          navigate('browseschematics')
        }
      },
      {
        label: 'Generator',
        click() {
          navigate('generator')
        }
      },
      {
        label: 'Config security',
        click() {
          navigate('gensecurity')
        }
      },
      {
        label: 'Test Api',
        click() {
          navigate('testapi')
        }
      }
      ]
    }, {
      label: 'Execute',
      submenu: [{
        label: 'Clear recent',
        click() {
          clearrecent()
        }
      },
      {
        label: 'Open dev tools',
        click() {
          opendevtools()
        }
      }
      ]
    },
    {
      label: 'Help',
      submenu: [{
        label: 'About',
        click() {
          about()
        }
      },
      {
        label: 'Tutorial',
        click() {
          tutorial()
        }
      }]
    }
  ]
}
function opendevtools() {
  mainWindow.webContents.openDevTools();
}
function clearrecent() {
  mainWindow.webContents.send("clearrecent");
  recent = [];
  arraysubmenu = [];
  settemplate();
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function save() {
  mainWindow.webContents.send("save");
}
function load() {
  mainWindow.webContents.send("load file");
  saveenabled = true;
}

function saveas() {
  mainWindow.webContents.send("saveas");
  saveenabled = true;
}

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
    icon: path.join(__dirname, `/dist/generador/assets/icons/win/icon.ico`)
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/generador/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function recentclick(nameclick, pathclick) {
  let recentfind = recent.find((item) => item.name === nameclick && item.path === pathclick);
  loadrecent(recentfind.path);
}

function loadrecent(recentfnd) {
  mainWindow.webContents.send("loadrecent", recentfnd);
};

ipcMain.on('setrecent', (event, recentpar) => {
  recent.splice(0, recent.length);
  arraysubmenu = [];
  recentpar.forEach(element => {
    arraysubmenu.push(
      {
        id: element.name,
        label: element.name + ' ' + element.path,
        click() {
          recentclick(element.name, element.path);
        }
      });
    recent.push({ name: element.name, path: element.path });
  });
  settemplate();
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

ipcMain.on('setdisable', () => {
  let itemmenu = menu.getMenuItemById('save');
  itemmenu.enabled = true;
})

ipcMain.on('setdisablefalse', () => {
  let itemmenu = menu.getMenuItemById('save');
  itemmenu.enabled = false;
})
ipcMain.on('helpoptions', () => {
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

ipcMain.on('save', (event, arg) => {
  writeFile(arg.path, arg.file);
  return event.returnValue = "save file ready";
});

ipcMain.on('load', (event, arg) => {
  fs.readFile(arg, function (err, data) {
    if (err) throw err;
    const json = JSON.parse(data);
    saveenabled = true;
    event.returnValue = json;
  });
});

ipcMain.on('saveas', (event, arg) => {
  writeFile(arg.path, arg.file);
  return event.returnValue = "fileas ready";
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
  fs.writeFile(filepath, file, function (err) {
    if (err) throw err;
    console.log(`Writed:${filepath}`);
  });
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

