import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Schemahead, Schemaheaditems } from '../interfaces/schemahead';
import { Schemaitem } from '../interfaces/schema';
import { Schemaapi } from '../interfaces/schemaapi';
import { Typeoperation } from '../interfaces/typeoperation';
import { Relations } from '../interfaces/relations';
import { Api } from '../interfaces/api';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config = {
    version: 0.1,
    filePath: '',
    enableCors: false,
    schemas: [],
    api: []
  };
  /* schemas[id:number,name:string,description:string,schemastable[schemas]] */
  /* api schema operations:[operations] */
  constructor(private electron: ElectronService) { }
  setfilepath(filePath: string) {
    this.config.filePath = filePath;
  }

  enableCors(cors: boolean) {
    this.config.enableCors = cors;
  }

  // tslint:disable-next-line: variable-name
  getrelations(_id: number): Relations[] {
    return this.config.schemas[_id].schemarelations;
  }

  getrelation(idschema: number, idrelation: number): Relations {
    return this.config.schemas[idschema].schemarelations[idrelation];
  }
  // tslint:disable-next-line: variable-name
  getrelationfilter(_id: number, filter: string): Relations[] {
    const filtera = [...this.getrelations(_id)];
    // tslint:disable-next-line: prefer-const
    let filterb = [];
    for (const iterator  of filtera ) {
      if (iterator.type === filter) {
         filterb.push(iterator);
      }
    }
    return filterb;
  }
  // tslint:disable-next-line: variable-name
  addapi(_id: number, api: Api) {
    this.config.schemas[_id - 1].schemasapi.push(api);
   }
  // tslint:disable-next-line: variable-name
  addrelation(_id: number, relation: Relations) {
    this.config.schemas[_id - 1].schemarelations.push(relation);
   }
   // tslint:disable-next-line: variable-name
   editrelation(_id: number, idr: number, relation: Relations){
    this.config.schemas[_id - 1].schemarelations[idr - 1] = {...relation};
   }
  getapis(id: number): Api[] {
    // tslint:disable-next-line: prefer-const
    return this.config.schemas[id - 1].schemasapi;
  }

  // tslint:disable-next-line: variable-name
  deleteoperation(schemaname: string, _id: number) {
    let find = false;
    let pos = 0;
    for (let index = 0; index < this.config.api.length; index++) {
      if (this.config.api[index].name === schemaname) {
        find = true;
        pos = index;
        break;
      }
    }
    if (find === true) {
      this.config.api[pos].operations.splice(_id, 1);
    }
  }

  save() {
    this.electron.ipcRenderer.send('saveconfig', JSON.stringify(this.config, null, '\t'));
  }

  load() {
    this.config = this.electron.ipcRenderer.sendSync('loadconfig', 'config.json');
  }

  getschema(): Schemahead[] {
    return this.config.schemas as Schemahead[];
  }

  getschemawithtable(): Schemaheaditems[] {
    return this.config.schemas;
  }

  getschematable(id: number): Schemaitem[] {
    return this.config.schemas[id - 1].schemastable;
  }

  getschemaname(id: number): string {
    return this.config.schemas[id - 1].name;
  }

  addschema(SchemaHead: Schemahead) {
    this.config.schemas.push({
      id: SchemaHead.id,
      name: SchemaHead.name,
      description: SchemaHead.description,
      imports: SchemaHead.imports,
      fields: SchemaHead.fields,
      schemastable: [], schemarelations: [], schemasapi: []
    });
  }
  // delete schema
  renumanddelete(id: number) {
    this.config.schemas.splice(id - 1, 1);
    for (let index = 0; index < this.config.schemas.length; index++) {
      this.config.schemas[index].id = index + 1;
    }
  }

  editschema(SchemaHead: Schemahead, index: number) {
    const Schemastable = [...this.config.schemas[index].schemastable];
    this.config.schemas[index] = { ...SchemaHead, schemastable: Schemastable };
  }

  addschemaitem(id: number, schemaitem: Schemaitem) {
    this.config.schemas[id - 1].schemastable.push(schemaitem);
  }

  editschemaitem(id: number, iditem: number, schemaitem: Schemaitem) {
    this.config.schemas[id - 1].schemastable[iditem] = { ...schemaitem };
  }

  deleteschmeaitem(id: number, iditem: number) {
    this.config.schemas[id - 1].schemastable.splice(iditem - 1, 1);
    for (let index = 0; index < this.config.schemas[id - 1].schemastable.length; index++) {
      this.config.schemas[id - 1].schemastable[index].id = index + 1;
    }
  }

  existschema(nameschema: string): boolean {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.config.schemas.length; index++) {
      if (this.config.schemas[index].name === nameschema) {
        return true;
      }
    }
    return false;
  }
}
