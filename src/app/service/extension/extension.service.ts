import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from '../config.service';
import { GenerateRoutesService } from '../generate-routes.service';

@Injectable({
  providedIn: 'root'
})
export class ExtensionService {
  lineGenerating:string;
  constructor(private electronService: ElectronService, private configService: ConfigService) { }
  begin_generate() {
    this.configService.config.extension.forEach((extension) => {
      const file = this.configService.config.filePath + '/routes/' + extension.name + '.route.ts'
      const exist = this.electronService.ipcRenderer.sendSync('ifFile', { path: file });
      if (exist !== 'found') {
       this.GenerateRoutesService();
      }
    });
  }

  GenerateRoutesService(){
    this.lineGenerating='';
    

  }
}
