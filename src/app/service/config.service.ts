import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import {Schemahead, Schemaheaditems} from '../interfaces/schemahead';
import { Schemaitem } from '../interfaces/schema';
import {Schemaapi} from '../interfaces/schemaapi';
import {Typeoperation} from '../interfaces/typeoperation';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config = { filePath: '',
            enableCors: false,
            schemas: [],
            api: []};
/* schemas[id:number,name:string,description:string,schemastable[schemas]] */
/* api schema operations:[operations] */
  constructor(private electron: ElectronService) { }
  setfilepath(filePath: string){
    this.config.filePath = filePath;
  }

  enableCors(cors: boolean){
    this.config.enableCors = cors;
  }

  getapis(schemaname: string) {
    let apis = [];
    let find = false;
    let pos =  0;
    for (let index = 0; index < this.config.api.length; index++) {
      if (this.config.api[index].name === schemaname){
        find = true;
        pos = index;
        break;
      }
    }
    if (find === true) {
    for (let index = 0; index < this.config.api[pos].operations.length; index++) {
      apis.push({id: index + 1, type: this.config.api[pos].operations[index].type});
    }
    return apis;
    }
    else {
       return [];
      }
}

  deleteoperation(schemaname: string, _id: number) {
    let find = false;
    let pos =  0;
    for (let index = 0; index < this.config.api.length; index++) {
      if (this.config.api[index].name === schemaname){
        find = true;
        pos = index;
        break;
      }
    }
    if (find === true){
      this.config.api[pos].operations.splice( _id , 1);
    }
  }

 addoperation(schemaapi: Schemaapi, data: Typeoperation) {
   let find = false;
   let pos = 0;
   // tslint:disable-next-line: prefer-for-of
   for (let index = 0; index < this.config.api.length; index++) {
     if (this.config.api[index].name === schemaapi.name){
       find = true;
       pos = index;
     }
   }
   if (find === false) {
    this.config.api.push({ id: schemaapi.id , name: schemaapi.name , operations: [data]});
   } else {
     this.config.api[pos].operations.push(data);
   }
 }

  save(){
    this.electron.ipcRenderer.send('saveconfig', JSON.stringify(this.config, null, '\t'));
  }


  getschema(): Schemahead[]{
    return this.config.schemas as Schemahead[];
  }

  getschemawithtable(): Schemaheaditems[] {
    return this.config.schemas;
  }

  getschematable(id: number): Schemaitem[]{
    return this.config.schemas[id - 1].schemastable;
  }
  getschemaname(id: number): string {
    return this.config.schemas[id - 1].name;
  }

  addschema(SchemaHead: Schemahead) {
    this.config.schemas.push({id: SchemaHead.id, name: SchemaHead.name, description: SchemaHead.description, schemastable: []});
  }
  // delete schema
  renumanddelete(id: number){
    this.config.schemas.splice(id - 1, 1);
    for (let index = 0; index < this.config.schemas.length; index++) {
      this.config.schemas[index].id = index + 1 ;
    }
  }

  editschema(SchemaHead: Schemahead, index: number ){
    // tslint:disable-next-line: prefer-for-of
      const Schemastable = [ ...this.config.schemas[index].schemastable];
      this.config.schemas[index] = { ...SchemaHead, schemastable: Schemastable };
  }

  addschemaitem(id: number, schemaitem: Schemaitem){
       this.config.schemas[id - 1].schemastable.push(schemaitem);
  }

  deleteschmeaitem(id: number, iditem: number){
    this.config.schemas[id - 1 ].schemastable.splice(iditem - 1, 1);
    for (let index = 0; index < this.config.schemas[id - 1].schemastable.length; index++) {
      this.config.schemas[id - 1].schemastable[index].id = index + 1;
    }
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
