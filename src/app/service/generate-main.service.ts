import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { element } from 'protractor';
import { Extension } from '../interfaces/extension';
import { Schemahead } from '../interfaces/schemahead';
import { ConfigService } from './config.service';
import { ExtensionService } from "../service/extension/extension.service";
import { ExtensionsService } from './extensions.service';
@Injectable({
  providedIn: 'root'
})
export class GenerateMainService {
  textGenerated = '';
  constructor(private config_service: ConfigService, private electron_service: ElectronService,private extensionService:ExtensionService) { }
  beginGenerate() {
    this.generateAppModule();
    this.generateServer();
    this.configDevelopment();
    this.configProduction();
    const schema: Schemahead[] = this.config_service.getschema();
    const extensions:Extension[]= this.config_service.config.extension;
    let security: boolean = false;
    schema.forEach(element => { if (element.security === true) { security = true } });
    this.textGenerated = '';
    this.textGenerated += `process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';\n`;
    this.textGenerated += `import 'dotenv/config';\n`;
    this.textGenerated += `import App from '@/app';\n`;
    this.textGenerated += `import IndexRoute from '@routes/index.route';\n`;
    schema.forEach(element => {
      this.textGenerated += `import ${element.name}Route from '@routes/${element.name}.route';\n`;
    });
    if (security) {
      this.textGenerated += `import loginRoute from '@routes/login.route';\n`;
    }
    this.textGenerated += `import validateEnv from '@utils/validateEnv';\n`;
    this.textGenerated += '';
    this.textGenerated += `validateEnv();\n`;
    this.textGenerated += 'const app = new App([';
    this.textGenerated += `new IndexRoute()`;
    schema.forEach((element, index) => {
      this.textGenerated += `, new ${element.name}Route()`;
    });
    extensions.forEach((extension,index)=>{
      this.textGenerated += `, new ${extension.name}Extension()`;
      this.extensionService.begin_generate(extension);
    });
    if (security) {
      this.textGenerated += `, new loginRoute()`;
    }
    this.textGenerated += ']);\n';
    this.textGenerated += `app.listen();`;
    if (this.electron_service.isElectronApp) {
      const args = {
        path: this.config_service.config.filePath,
        name: 'server',
        file: this.textGenerated,
        format: false,
      };
      const end = this.electron_service.ipcRenderer.sendSync('saveServe', args);
    }
  }

  generateServer() {
    let importHttps = '';
    const args={ path:this.config_service.config.filePath};
    let appFile=this.electron_service.ipcRenderer.sendSync('LoadAppModule', args);
    console.log('appFile:',appFile);
    if (this.config_service.config.enablehttps === true) {
      importHttps+=`import * as https from 'https';\n`;
      importHttps+=`import * as fs from 'fs';\n`
      appFile=this.findAndInsertAfter('/*end adding header*/',importHttps,appFile);
    }
    if (this.config_service.config.enablehttps === true) {
      const classVar=`public server:https.Server;\n`;
      appFile=this.findAndInsertAfter('/*end class var*/',classVar,appFile);
    }
    let server = '';
    if (this.config_service.config.enablehttps === true) {
      server += `console.log('Dir app',__dirname);\n`;
      server += 'const key = fs.readFileSync(`${__dirname}/key-rsa.pem`);\n';
      server += 'const cert = fs.readFileSync(`${__dirname}/cert.pem`);\n'
      server += 'this.server = https.createServer({ key:key, cert:cert }, this.app);\n';
      appFile=this.findAndInsertAfter('/*end security*/',server,appFile);
    }
    let listen = '';
    if (this.config_service.config.enablehttps === true) {
      listen += 'this.server.listen(this.port, () => {\n'
      listen += 'logger.info(`=================================`);\n';
      listen += 'logger.info(`======= ENV: ${this.env} =======`);\n'
      listen += 'logger.info(`🚀 App listening on the port ${this.port}`);\n'
      listen += 'logger.info(`=================================`);\n'
      listen += "console.log('Server https is listening on port ' + this.port);\n"
      listen += '})\n';
    } else {
      listen = 'this.app.listen(this.port, () => {\n';
      listen += 'logger.info(`=================================`);\n';
      listen += 'logger.info(`======= ENV: ${this.env} =======`);\n';
      listen += 'logger.info(`🚀 App listening on the port ${this.port}`);\n';
      listen += 'logger.info(`=================================`);\n';
      listen += '});\n';
    }
    appFile=this.findAndInsertAfter('/*end listen*/',listen,appFile);
    const argSave={ path:this.config_service.config.filePath,file:appFile};
    const end=this.electron_service.ipcRenderer.sendSync('SaveAppModule', argSave);
  }

 

  findAndInsertAfter(find: string, insert: string, text: string): string {
    const positionInsert = text.indexOf(find);
    return text.substr(0, positionInsert) + '\n' + insert + '\n' + text.substr(positionInsert);
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
      configDatabase.cors.origin=this.config_service.config.corsHost;
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
        driver: driver
      };
      console.log('selected database', driver);
      const end = this.electron_service.ipcRenderer.sendSync('createAppModule', args);
    }

  }
}
