import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Schemahead } from '../interfaces/schemahead';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GenerateMainService {
  textGenerated = '';
  constructor(private config_service: ConfigService, private electron_service: ElectronService,) { }

  beginGenerate() {
    this.generateAppModule();
    this.configDevelopment();
    this.configProduction();
    const schema: Schemahead[] = this.config_service.getschema();
    this.textGenerated = '';
    this.textGenerated += `process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';\n`;
    this.textGenerated += `import 'dotenv/config';\n`;
    this.textGenerated += `import App from '@/app';\n`;
    this.textGenerated +=`import IndexRoute from '@routes/index.route';\n`;
    schema.forEach(element => {
      this.textGenerated += `import ${element.name}Route from '@routes/${element.name}.route';\n`;
    });
    this.textGenerated += `import validateEnv from '@utils/validateEnv';\n`;
    this.textGenerated += '';
    this.textGenerated += `validateEnv();\n`;
    this.textGenerated += 'const app = new App([';
    this.textGenerated += `new IndexRoute()`;
    schema.forEach((element, index) => {
        this.textGenerated += `, new ${element.name}Route()`;
    });
    this.textGenerated += ']);';
    this.textGenerated += `app.listen();`;
    if (this.electron_service.isElectronApp) {
      const args = {
        path: this.config_service.config.filePath,
        name: 'server',
        file: this.textGenerated,
        format: false
      };
      const end = this.electron_service.ipcRenderer.sendSync('saveServe', args);
    }
  }

  configDevelopment() {
    if (this.electron_service.isElectronApp) {
      const args = {
        path: this.config_service.config.filePath,
      };
      let configDatabase = this.electron_service.ipcRenderer.sendSync('loadDevelopment', args);
      configDatabase.dbConfig.database = this.config_service.config.dbconf.database;
      configDatabase.dbConfig.host = this.config_service.config.dbconf.host;
      configDatabase.dbConfig.user = this.config_service.config.dbconf.username;
      configDatabase.dbConfig.password = this.config_service.config.dbconf.password;
      configDatabase.secretKey = this.config_service.config.jwtsk;
      const argSave = {
        path: this.config_service.config.filePath,
        file: JSON.stringify(configDatabase, null, 4)
      };
      const wrote = this.electron_service.ipcRenderer.sendSync('saveDevelopment', argSave);
    }
  }

  configProduction() {
    if (this.electron_service.isElectronApp) {
      const args = {
        path: this.config_service.config.filePath,
      };
      let configDatabase = this.electron_service.ipcRenderer.sendSync('loadProduction', args);
      configDatabase.dbConfig.database = this.config_service.config.dbconfProduction.database;
      configDatabase.dbConfig.host = this.config_service.config.dbconfProduction.host;
      configDatabase.dbConfig.user = this.config_service.config.dbconfProduction.username;
      configDatabase.dbConfig.password = this.config_service.config.dbconfProduction.password;
      configDatabase.secretKey = this.config_service.config.jwtskProduction;
      const argSave = {
        path: this.config_service.config.filePath,
        file: JSON.stringify(configDatabase, null, 4)
      };
      const wrote = this.electron_service.ipcRenderer.sendSync('saveProduction', argSave);
    }

  }

  generateAppModule() {
    let driver = '';
    if (this.electron_service.isElectronApp) {
      switch (this.config_service.config.dbconf.selecteddatabase) {
        case 0:
          driver = 'mysql';
          break;
        case 1:
          driver = 'postgres';
          break;
        case 2:
          driver = 'sqlite3';
          break;
        case 3:
          driver = 'mssql';
          break;
        case 4:
          driver = 'sql.js';
          break;
        case 5:
          driver = 'oracledb';
          break;
        default:
          break;
      }
      const args = {
        path: this.config_service.config.filePath,
        format: false,
        port: this.config_service.config.port,
        portDatabase: this.config_service.config.dbconf.port,
        driver:driver
      };
      console.log('selected database', driver);
      const end = this.electron_service.ipcRenderer.sendSync('createAppModule', args);
    }

  }
}
