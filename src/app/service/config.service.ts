import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import {Schemahead, Schemaheadvector} from '../interfaces/schemahead';
import { Schemaitem } from '../interfaces/schema';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config = { filePath: '',
            schemas: []};
/* schemas[id:number,name:string,description:string,schemastable[schemas]] */
  constructor(private electron: ElectronService) { }
  setfilepath(filePath: string){
    this.config.filePath = filePath;
  }
  save(){
    this.electron.ipcRenderer.send('saveconfig', JSON.stringify(this.config,null,'\t'));
  }


  getschema(): Schemahead[]{
    return this.config.schemas as Schemahead[];
  }

  getschemawithtable(): Schemaheadvector[] {
    return this.config.schemas;
  }

  getschematable(id: number): Schemaitem[]{
    return this.config.schemas[id - 1].schemastable;
  }
  getschemaname(id: number): string {
    return this.config.schemas[id - 1].name;
  }
  addschema(schemadata: Schemahead) {
    this.config.schemas.push({id: schemadata.id, name: schemadata.name, description: schemadata.description, schemastable: []});
  }

  editschema(edit: Schemahead, index: number ){
    // tslint:disable-next-line: prefer-for-of
      const _schemastable = [ ...this.config.schemas[index].schemastable];
      this.config.schemas[index] = { ...edit, schemastable: _schemastable };
  }


  addschemaitem(id: number, schemastable: Schemaitem){
       this.config.schemas[id - 1].schemastable.push(schemastable);
  }

  existschema(nameschema: string): boolean {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.config.schemas.length; index++) {
      if (this.config.schemas[index].name === nameschema){
        return true;
      }
    }
    return false;
  }

}
