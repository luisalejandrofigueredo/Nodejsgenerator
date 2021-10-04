import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class MenuserviceService {

  constructor(private electron:ElectronService) { }
  menuEnabled(){
    this.electron.ipcRenderer.send('enableMenus', null);
  }
  menuDisabled(){
    this.electron.ipcRenderer.send('disableMenus',null);
  }
}
