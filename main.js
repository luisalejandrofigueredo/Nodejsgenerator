const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  screen,
  shell
} = require('electron');
const prettier = require("prettier");
const {
  spawn,
  spawnSync
} = require('child_process');
const url = require("url");
const path = require("path");
var fs = require('fs');
const {
  electron
} = require("process");
var arraysubmenu = [];
var recent = [];
var template = [{
    label: 'Menu',
    submenu: [{
        label: 'New',
        click() {
          newfile();
        }
      },
      {
        label: 'Load',
        click() {
          load();
        }
      },
      {
        id: 'save',
        enabled: false,
        label: 'Save',
        click() {
          save();
        }
      },
      {
        label: 'Save as',
        click() {
          saveas();
        }
      },
      {
        id: 'recent',
        submenu: arraysubmenu,
        label: 'Open recent',
        click() {}
      },
      {
        label: 'Exit',
        click() {
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
          openDevTools()
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
    case 'testapi':
      mainWindow.webContents.send("navigate", 'testapi');
      break;
    default:
      break;
  }
}
ipcMain.on('disableMenus', (event, _arg) => {
  mainWindow.setMenuBarVisibility(false);
});

ipcMain.on('enableMenus', (event, _arg) => {
  mainWindow.setMenuBarVisibility(true);
})

function processinstall(state) {
  switch (state) {
    case 'installnestjs':
      mainWindow.webContents.send("state", 'installnestjs');
      break;
    case 'createproject':
      mainWindow.webContents.send("state", 'createproject');
      break;
    case 'loadsampleproject':
      mainWindow.webContents.send("state", 'loadsampleproject');
      break;
    case 'load':
      mainWindow.webContents.send("state", 'load');
      break;
    case 'exit':
      mainWindow.webContents.send("state", 'exit');
      break;
    default:
      break;
  }
}

function copy_files() {
  mainWindow.webContents.send("copy_files");
}
ipcMain.on('getpath', (event, _arg) => {
  event.returnValue = path.join(__dirname, `/dist/generador/assets`);
})

ipcMain.on('loadsampledata', (_event, arg) => {
  if (arg.loadsampleproject === true) {
    let dest;
    let filedest;
    if (process.platform === "win32") {
      console.log('copy in windows...');
      dest = '\\sample'
      filedest = '\\sample.json';
    } else {
      console.log('copy in unix...');
      dest = '/sample';
      filedest = '/sample.json';
    }
    if (!fs.existsSync(arg.paths.home + dest)) {
      fs.mkdirSync(arg.paths.home + dest);
    }
    fs.readFile(path.join(__dirname, `/dist/generador/assets/sample/sample.json`), 'utf-8', function (err, data) {
      if (err) throw err;
      writeFileSync(arg.paths.home + dest + filedest, data);
      processinstall('load');
    });
  } else {
    processinstall('exit');
  }
});


ipcMain.on('installnestjs', (_event, arg) => {
  processinstall('installnestjs');
  let dest;
  let filedest;
  console.log('process:', process.platform);
  if (process.platform === "win32") {
    console.log('copy in windows...');
    dest = '\\batchs'
    filedest = '\\installnestjs.bat';
  } else {
    console.log('copy in unix...');
    dest = '/batchs';
    filedest = '/installnestjs.sh';
  }
  if (!fs.existsSync(arg.home + dest)) {
    fs.mkdirSync(arg.home + dest);
  }
  fs.readFile(path.join(__dirname, `/dist/generador/assets/batchs/installnestjs.bat`), {
    encoding: 'utf-8'
  }, function (err, data) {
    if (err) throw err;
    try {
      writeFileSync(arg.home + dest + filedest, data)
      const res = spawn(arg.home + dest + filedest);
      res.stdout.on('data', (data) => {
        mainWindow.webContents.send("addtext", data.toString());
      });
      res.on('exit', (code, sig) => {
        processinstall('createproject');
      });
      res.on('error', (error) => {
        console.log('error:', error)
      });
    } catch (error) {
      mainWindow.webContents.send("error", {
        message: 'Error runing batch file ',
        error: error
      });
    }
  });
});

ipcMain.on('copy_files', (event, arg) => {
  let dest;
  let filedest;
  if (process.platform === "win32") {
    console.log('copy in windows...');
    dest = '\\'
    filedest = 'package.json';
  } else {
    console.log('copy in unix...');
    dest = '/';
    filedest = 'package.json';
  }
  if (!fs.existsSync(arg.path)) {
    fs.mkdirSync(arg.path);
  }
  fs.readFile(path.join(__dirname, `/dist/generador/assets/files/package/package.json`), 'utf-8', function (err, data) {
    if (err) throw err;
    console.log('write copy file:', arg.path + dest + filedest);
    writeFileSync(arg.path + dest + filedest, data);
    event.returnValue = data;
  });
});

ipcMain.on('write_package', (event, arg) => {
  console.log('arg', arg);
  let dest;
  let filedest;
  if (process.platform === "win32") {
    console.log('copy in windows...');
    dest = '\\'
    filedest = 'package.json';
  } else {
    console.log('copy in unix...');
    dest = '/';
    filedest = 'package.json';
  }
  if (!fs.existsSync(arg.path)) {
    fs.mkdirSync(arg.path);
  }
  try {
    writeFileSync(arg.path + dest + filedest, arg.data);
  } catch (error) {
    throw error
  }
  event.returnValue = arg.data;
});

ipcMain.on('createproject', (_event, arg) => {
  let dest;
  let filedest;
  if (process.platform === "win32") {
    console.log('copy in windows...');
    dest = '\\batchs'
    filedest = '\\createproject.bat';
  } else {
    console.log('copy in unix...');
    dest = '/batchs';
    filedest = '/createproject.sh';
  }
  if (!fs.existsSync(arg.paths.home + dest)) {
    fs.mkdirSync(arg.paths.home + dest);
  }
  fs.readFile(path.join(__dirname, `/dist/generador/assets/batchs/createproject.bat`), 'utf-8', function (err, data) {
    if (err) throw err;
    console.log('write create projects:', arg.paths.home + dest + filedest);
    console.log('package:', arg.package);
    writeFileSync(arg.paths.home + dest + filedest, data);
    const createproject = spawn(`${arg.paths.home + dest + filedest}`, [`${arg.paths.home}`, `${arg.projectname}`, `${arg.package}`], {});
    createproject.stdout.on('data', (data) => {
      mainWindow.webContents.send("addtext", data.toString());
    });
    createproject.on('exit', (code, sig) => {
      processinstall('loadsampleproject');
    })
    createproject.on('error', (error) => {
      console.log('error:', error)
    })
  });
});

ipcMain.on('userpath', (event) => {
  const homePath = app.getPath('home');
  const programPath = app.getPath('userData');
  event.returnValue = {
    home: homePath,
    programPath: programPath
  };
});

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
  template = [{
      label: 'Menu',
      submenu: [{
          label: 'New',
          click() {
            newfile();
          }
        },
        {
          label: 'Load',
          click() {
            load();
          }
        },
        {
          id: 'save',
          enabled: saveenable,
          label: 'Save',
          click() {
            save();
          }
        },
        {
          label: 'Save as',
          click() {
            saveas();
          }
        },
        {
          id: 'recent',
          submenu: arraysubmenu,
          label: 'Open recent',
          click() {}
        },
        {
          label: 'Exit',
          click() {
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
            openDevTools()
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
  ]
}

function openDevTools() {
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
    autoHideMenuBar: false,
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

ipcMain.on('setrecent', (_event, recentpar) => {
  recent.splice(0, recent.length);
  arraysubmenu = [];
  recentpar.forEach(element => {
    arraysubmenu.push({
      id: element.name,
      label: element.name + ' ' + element.path,
      click() {
        recentclick(element.name, element.path);
      }
    });
    recent.push({
      name: element.name,
      path: element.path
    });
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
  let textprettier = prettier.format(arg.file, {
    semi: true,
    singleQuote: true,
    parser: "typescript"
  });
  writeFile(filepath, textprettier);
  event.returnValue = filepath;
});

ipcMain.on('loadTemplate', (event, arg) => {
  try {
    const data = fs.readFileSync(arg, {
      encoding: 'utf-8'
    });
    event.returnValue = data;
  } catch (error) {
    mainWindow.webContents.send("error", {
      message: 'error loading template',
      error: error
    });
  }
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
  return event.returnValue = "file as ready";
});

ipcMain.on('installPackages', (event, arg) => {
  console.log('arg', arg);
  try {
    process.chdir(arg.path);
  } catch (err) {
    console.log('operative system error');
  }
  try {
    if (process.platform === "win32") {
      const commandCd = spawnSync('cmd.exe', ["/c", 'cd'], {
        stdio: 'inherit',
        shell: true
      });
      const command = spawn('cmd.exe', ["/c", 'npm', 'install']);
      command.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      command.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      command.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
        mainWindow.webContents.send("endProcess");
      });
    } else {
      const command = spawn('npm', ['install']);
    }
  } catch (err) {
    console.log('system error while create project');
  }
});
ipcMain.on('createProject', (event, arg) => {
  console.log('arg', arg);
  try {
    process.chdir(arg.path);
  } catch (err) {
    console.log('operative system error');
  }
  try {
    if (process.platform === "win32") {
      const commandCd = spawnSync('cmd.exe', ["/c", 'cd'], {
        stdio: 'inherit',
        shell: true
      });
      const command = spawnSync('cmd.exe', ["/c", 'npm', 'init', '-f', '-y']);
    } else {
      const command = spawn('npm', ['init', '-f', '-y']);
    }
  } catch (err) {
    console.log('system error while create project');
  }
  event.returnValue = 'project created';
});

ipcMain.on('openvisualcode', (event, arg) => {
  console.log('arg', arg);
  try {
    process.chdir(arg.path);
  } catch (err) {
    console.log('operative system error');
  }
  try {
    if (process.platform === "win32") {
      const visu = spawn('cmd.exe', ['/c', 'code', '.']);
    } else {
      const visu = spawn('code', ['.']);
    }
  } catch (err) {
    console.log('operative error open visual');
  }
  try {
    process.chdir(__dirname);
  } catch (err) {
    console.log('operative system error');
  }
  event.returnValue = 'visual ready';
});

ipcMain.on('saveDevelopment', (event, arg) => {
  writeFile(arg.path + '/src/configs/development.json', arg.file);
  event.returnValue = 'wrote';
});

ipcMain.on('saveProduction', (event, arg) => {
  writeFile(arg.path + '/src/configs/production.json', arg.file);
  event.returnValue = 'wrote';
});

ipcMain.on('loadProduction', (event, arg) => {
  fs.readFile(arg.path + '/src/configs/production.json', function (err, data) {
    if (err) throw err;
    const json = JSON.parse(data);
    event.returnValue = json;
  });
});
ipcMain.on('loadDevelopment', (event, arg) => {
  fs.readFile(arg.path + '/src/configs/development.json', function (err, data) {
    if (err) throw err;
    const json = JSON.parse(data);
    event.returnValue = json;
  });
});

ipcMain.on('createDirectory', (event, arg) => {
  fs.existsSync(arg.directory) || fs.mkdirSync(arg.directory);
  event.returnValue = 'ready'
});

ipcMain.on('loadAppModule', (event, arg) => {
  const file = arg.path + '/src/app.ts'
  fs.readFile(file, function (err, data) {
    if (err) throw err;
    event.returnValue = data.toString();
  });
});

ipcMain.on('saveAppModule', (event, arg) => {
  const filepath = arg.path + '/src/app.ts'
  writeFile(filepath, arg.file);
  event.returnValue = 'ready';
});

ipcMain.on('createAppModule', (event, arg) => {
  console.log('writing files os:', process.platform);
  if (process.platform === "win32") {
    console.log('writing in windows app.ts...');
  } else {
    console.log('writing in unix app.ts...');
  }
  if (!fs.existsSync(path.join(arg.path, '/src/configs'))) {
    fs.mkdirSync(path.join(arg.path, '/src/configs'))
  }
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/app/app.ts`), arg.path + '/src/app.ts')
  fs.readFile(arg.path + '/src/app.ts', function (err, data) {
    if (err) throw err;
    const dataString = data.toString().replace(/3000/g, arg.port);
    writeFile(arg.path + '/src/app.ts', dataString);
  });
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/configs/development.json`), arg.path + '/src/configs/development.json');
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/configs/production.json`), arg.path + '/src/configs/production.json');
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/configs/test.json`), arg.path + '/src/configs/test.json');
  /** configs */
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/ts/tsconfig.json`), arg.path + '/tsconfig.json');
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/root/.env`), arg.path + '/.env');
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/root/nodemon.json`), arg.path + '/nodemon.json');
  /**install middleware */
  if (!fs.existsSync(path.join(arg.path, '/src/middlewares'))) {
    fs.mkdirSync(path.join(arg.path, '/src/middlewares'))
  }
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/middleware/validation.middleware.ts`), arg.path + '/src/middlewares/validation.middleware.ts');
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/middleware/error.middleware.ts`), arg.path + '/src/middlewares/error.middleware.ts')
  /**end middleware */
  /** index*/
  if (!fs.existsSync(path.join(arg.path, '/src/routes'))) {
    fs.mkdirSync(path.join(arg.path, '/src/routes'))
  }
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/routes/index.route.ts`), arg.path + '/src/routes/index.route.ts')
  if (!fs.existsSync(path.join(arg.path, '/src/controllers'))) {
    fs.mkdirSync(path.join(arg.path, '/src/controllers'))
  }
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/controller/index.controller.ts`), arg.path + '/src/controllers/index.controller.ts')
  /** end index */
  /** utils*/
  if (!fs.existsSync(path.join(arg.path, '/src/utils'))) {
    fs.mkdirSync(path.join(arg.path, '/src/utils'))
  }
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/utils/logger.ts`), arg.path + '/src/utils/logger.ts');
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/utils/util.ts`), arg.path + '/src/utils/util.ts');
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/utils/validateEnv.ts`), arg.path + '/src/utils/validateEnv.ts');
  /* end utils*/
  /** exceptions */
  if (!fs.existsSync(path.join(arg.path, '/src/exceptions'))) {
    fs.mkdirSync(path.join(arg.path, '/src/exceptions'))
  }
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/exceptions/HttpException.ts`), arg.path + '/src/exceptions/HttpException.ts');
  /** end exceptions */
  /** interfaces  */
  if (!fs.existsSync(path.join(arg.path, '/src/interfaces'))) {
    fs.mkdirSync(path.join(arg.path, '/src/interfaces'))
  }
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/interfaces/db.interface.ts`), arg.path + '/src/interfaces/db.interface.ts');
  /** end interfaces */
  if (!fs.existsSync(path.join(arg.path, '/src/databases'))) {
    fs.mkdirSync(path.join(arg.path, '/src/databases'))
  }
  fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/databases/index.ts`), arg.path + '/src/databases/index.ts')
  fs.readFile(arg.path + '/src/databases/index.ts', function (err, data) {
    if (err) throw err;
    let dataString = data.toString().replace(/mysql/g, arg.driver);
    dataString = dataString.replace(/3306/g, arg.portDatabase);
    writeFile(arg.path + '/src/databases/index.ts', dataString);
  });
  if (!fs.existsSync(path.join(arg.path, '/src/templates'))) {
    fs.mkdirSync(path.join(arg.path, '/src/templates'))
  }
  if (!fs.existsSync(path.join(arg.path, '/src/templates/login-controller.ts'))) {
    fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/templates/login-controller.ts`), arg.path + '/src/templates/login-controller.ts');
  }
  if (!fs.existsSync(path.join(arg.path, '/src/templates/login-service.ts'))) {
    fs.copyFileSync(path.join(__dirname, `/dist/generador/assets/files/template/login-service.ts`), arg.path + '/src/templates/login-service.ts');
  }
  event.returnValue = 'Wrote';
});



ipcMain.on('saveservice', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  let dirsrc = ''
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\services\\' + arg.name + '.service.ts';
    dirsrc = arg.path + '\\src';
    dir = arg.path + '\\src\\services'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/services/' + arg.name + '.service.ts';
    dirsrc = arg.path + '/src';
    dir = arg.path + '/src/services'
  }
  if (!fs.existsSync(dirsrc)) {
    fs.mkdirSync(dirsrc)
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  writeFile(filepath, arg.file);
  event.returnValue = filepath;
});
ipcMain.on('saveServe', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  let dirsrc = ''
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\' + arg.name + '.ts';
    dirsrc = arg.path + '\\src';
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/' + arg.name + '.ts';
    dirsrc = arg.path + '/src';
  }
  if (!fs.existsSync(dirsrc)) {
    fs.mkdirSync(dirsrc)
  }
  writeFile(filepath, arg.file);
  event.returnValue = filepath;
});

ipcMain.on('saveMiddlewares', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  let dirsrc = ''
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\middlewares\\' + arg.name + '.middleware.ts';
    dirsrc = arg.path + '\\src';
    dir = arg.path + '\\src\\middlewares'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/middlewares/' + arg.name + '.middlewares.ts';
    dirsrc = arg.path + '/src';
    dir = arg.path + '/src/middlewares'
  }
  if (!fs.existsSync(dirsrc)) {
    fs.mkdirSync(dirsrc)
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  writeFile(filepath, arg.file);
  event.returnValue = filepath;
});

ipcMain.on('saveRoutes', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  let dirsrc = ''
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\routes\\' + arg.name + '.route.ts';
    dirsrc = arg.path + '\\src';
    dir = arg.path + '\\src\\routes'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/routes/' + arg.name + '.route.ts';
    dirsrc = arg.path + '/src';
    dir = arg.path + '/src/routes'
  }
  if (!fs.existsSync(dirsrc)) {
    fs.mkdirSync(dirsrc)
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  writeFile(filepath, arg.file);
  event.returnValue = filepath;
});
ipcMain.on('saveInterfaces', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  let dirsrc = ''
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\interfaces\\' + arg.name + '.interface.ts';
    dirsrc = arg.path + '\\src';
    dir = arg.path + '\\src\\interfaces'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/interfaces/' + arg.name + '.interface.ts';
    dirsrc = arg.path + '/src';
    dir = arg.path + '/src/interfaces'
  }
  if (!fs.existsSync(dirsrc)) {
    fs.mkdirSync(dirsrc)
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  writeFile(filepath, arg.file);
  event.returnValue = filepath;
});

ipcMain.on('saveentity', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  let dirsrc = ''
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\entity\\' + arg.name + '.entity.ts';
    dirsrc = arg.path + '\\src';
    dir = arg.path + '\\src\\entity'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/entity/' + arg.name + '.entity.ts';
    dirsrc = arg.path + '/src';
    dir = arg.path + '/src/entity'
  }
  if (!fs.existsSync(dirsrc)) {
    fs.mkdirSync(dirsrc)
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  writeFile(filepath, arg.file);
  event.returnValue = filepath;
});

ipcMain.on('saveTemplate', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    filepath = arg.path + '\\' + arg.fileName;
    console.log('writing in windows...', arg.fileName);
  } else {
    filepath = arg.path + '/' + arg.fileName;;
    console.log('writing in unix...', arg.fileName);
  }
  if (arg.format) {
    const textPrettier = prettier.format(arg.file, {
      semi: true,
      singleQuote: true,
      parser: "typescript"
    });
    writeFile(filepath, textPrettier);
  } else {
    writeFile(filepath, arg.file);
  }
  event.returnValue = filepath;
});

ipcMain.on('saveController', (event, arg) => {
  console.log('writing files os:', process.platform);
  let dir = '';
  let filepath = '';
  if (process.platform === "win32") {
    console.log('writing in windows...');
    filepath = arg.path + '\\src\\controllers\\' + arg.name + '.controller.ts';
    dir = arg.path + '\\src\\controllers'
  } else {
    console.log('writing in unix...');
    filepath = arg.path + '/src/controllers/' + arg.name + '.controller.ts';
    dir = arg.path + '/src/controllers'
  }
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir)
    } catch (e) {
      console.log('error:', e);
    }
  }
  if (arg.format) {
    let textprettier = prettier.format(arg.file, {
      semi: true,
      singleQuote: true,
      parser: "typescript"
    });
    writeFile(filepath, textprettier);
  } else {
    writeFile(filepath, arg.file);
  }
  event.returnValue = filepath;
});

function writeFileSync(filepath, file) {
  try {
    fs.writeFileSync(filepath, file), console.log('Writed:', filepath);
  } catch {
    alert('Failed to save the file !');
  }
}

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

function getAppDataPath() {
  switch (process.platform) {
    case "darwin": {
      return path.join(process.env.HOME, "Library", "Application Support", "myApp");
    }
    case "win32": {
      return path.join(process.env.APPDATA, "myApp");
    }
    case "linux": {
      return path.join(process.env.HOME, ".myApp");
    }
    default: {
      console.log("Unsupported platform!");
      process.exit(1);
    }
  }
}
