import { ComponentFactoryResolver, Injectable } from '@angular/core';
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
    const schema: Schemahead[] = this.config_service.getschema();
    this.textGenerated='';
    this.textGenerated += `process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';\n`;
    this.textGenerated += `import 'dotenv/config';\n`;
    this.textGenerated += `import App from '../app';\n`;
    schema.forEach(element => {
      this.textGenerated += `import ${element.name}Route from '../src/routes/${element.name}.route';\n`;
    });
    this.textGenerated += `import validateEnv from '@utils/validateEnv;\n`;
    this.textGenerated += '';
    this.textGenerated += `validateEnv();\n`;
    this.textGenerated += 'const app = new App([';
    schema.forEach((element, index) => {
      if (index === 0) {
        this.textGenerated+=`new ${element.name}Route()`;
      } else {
        this.textGenerated+=`, new ${element.name}Route()`;
      }
    });
    this.textGenerated+=']);';
    this.textGenerated += `app.listen();`;
    if (this.electron_service.isElectronApp) {
      const args = {
        path: this.config_service.config.filePath,
        name: 'serve',
        file: this.textGenerated,
        format: false
      };
      const end = this.electron_service.ipcRenderer.sendSync('saveServe', args);
    }
  }

  configDevelopment(){
    if (this.electron_service.isElectronApp) {
      const args = {
        path: this.config_service.config.filePath,
      };
      let configDatabase = this.electron_service.ipcRenderer.sendSync('loadDevelopment', args);
      configDatabase.dbConfig.database=this.config_service.config.dbconf.database;
      configDatabase.dbConfig.host=this.config_service.config.dbconf.host;
      configDatabase.dbConfig.user=this.config_service.config.dbconf.username;
      configDatabase.dbConfig.password=this.config_service.config.dbconf.password;
      const argSave = {
        path: this.config_service.config.filePath,
        file:JSON.stringify(configDatabase,null,4)
      };
      const wrote=this.electron_service.ipcRenderer.sendSync('saveDevelopment', argSave);
      console.log('configDevelopment',configDatabase);
    }
  }

  generateAppModule(){
    if (this.electron_service.isElectronApp) {
      const args = {
        path: this.config_service.config.filePath,
        format: false
      };
      const end = this.electron_service.ipcRenderer.sendSync('createAppModule', args);
    }

  }
}
