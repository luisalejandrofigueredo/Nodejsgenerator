import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GenerateLoginService {

  constructor(private configService:ConfigService,private electronService:ElectronService) { }
  beginGenerate(){
    const appPath=this.configService.config.filePath;
    const templateLoginController = this.electronService.ipcRenderer.sendSync('loadTemplate', `${appPath}/templates/login-controller.ts`);
    const fileController=this.replaceTemplate(templateLoginController);
    const saved =  this.electronService.ipcRenderer.sendSync('saveTemplate',{ path:`${appPath}`, fileName:`src/controllers/login.controller.ts`,file:fileController,format:false});
    const templateLoginService=this.electronService.ipcRenderer.sendSync('loadTemplate', `${appPath}/templates/login-service.ts`);
    const fileService=this.replaceTemplate(templateLoginService);
    const savedService= this.electronService.ipcRenderer.sendSync('saveTemplate',{ path:`${appPath}`, fileName:`src/services/login.ts`,file:fileService,format:false});
  }

  replaceTemplate(template: string): string {
    const sec = this.configService.getsecurity();
    template = template.replace(/\/\*tableLower\*\//g, `${sec.table.toLowerCase()}`);
    template = template.replace(/\/\*table\*\//g, `${sec.table}`);
    template = template.replace(/\/\*roles\*\//g, `${sec.roles}`);
    template = template.replace(/\/\*login\*\//g, `${sec.login}`);
    template = template.replace(/\/\*bearer\*\//g, `${sec.bearertoken}`);
    template = template.replace(/\/\*count\*\//g, `${sec.count}`);
    template = template.replace(/\/\*password\*\//g, `${sec.password}`);
    return (template);
  }
}
