import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
@Injectable({
  providedIn: 'root'
})
export class StringauxService {

  constructor(private electronservice: ElectronService) { }

  addtexttofile(file: string, stringtoadd: string, stringtofind: string): string {
    const pos = file.lastIndexOf(stringtofind);
    if (this.electronservice.isWindows === true){
      return file.substr(0, pos) + stringtoadd + '\r\n' + file.substr(pos, file.length);
    } else {
      return file.substr(0, pos) + stringtoadd + '\n' + file.substr(pos, file.length);
    }
  }
}
