import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Schemahead, Schemaheaditems } from '../interfaces/schemahead';
import { Schemaitem } from '../interfaces/schema';
import { Relations } from '../interfaces/relations';
import { Api } from '../interfaces/api';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config = {
    version: 0.3,
    filePath: '',
    enableCors: false,
    dbconf:{ selecteddatabase:0,host:'',port:0,username:'',password:'',database:''},
    jwtsk:'',
    security: {},
    schemas: [],
  };
  /* schemas[id:number,name:string,description:string,schemastable[schemas],
  schemasrelations[],schemasapi[]] */
  constructor(private electron: ElectronService) { }
  setdatabase(set: any) {
    this.config.dbconf = set;
  }

  getdatabase(): any{
    if (this.config.dbconf===undefined) // for version conf compatibitili
    {
     this.config.dbconf={ selecteddatabase:0,host:'',port:0,username:'',password:'',database:''};
    }
    return this.config.dbconf;
  }

  setsecurity(set: any) {
    this.config.security = set;
  }

  getsecurity(): any{
    return this.config.security;
  }

  setfilepath(filePath: string) {
    this.config.filePath = filePath;
  }

  getfilepath():string  {
    return this.config.filePath;
  }

  enableCors(cors: boolean) {
    this.config.enableCors = cors;
  }

  // tslint:disable-next-line: variable-name
  getfieldschemaswithid(_id: number): any[] {
    // tslint:disable-next-line: prefer-const
    let fields = [];
    const columns = this.getschematable(_id);
    for (const iterator of columns) {
      fields.push({ id: iterator.id, name: iterator.name });
    }
    return fields;
  }

  getfieldid(table:number,namefield:string): number {
    const columns: Schemaitem[] = this.getschematable(table);
    for (let index = 0; index < columns.length; index++) {
      if (namefield===columns[index].name) return(columns[index].id);
    }
    return 0;
  }
  // tslint:disable-next-line: variable-name
  getfields(_id: number): string[] {
    // tslint:disable-next-line: prefer-const
    let fields = [];
    const columns = this.getschematable(_id);
    for (const iterator of columns) {
      fields.push(iterator.name);
    }
    return fields;
  }
  // tslint:disable-next-line: variable-name
  getrelations(_id: number): Relations[] {
    if ( this.config.schemas[_id].schemarelations !== undefined){
      return this.config.schemas[_id].schemarelations;
    } else {return []; }
  }

  getrelation(idschema: number, idrelation: number): Relations {
    return this.config.schemas[idschema].schemarelations[idrelation];
  }
  // tslint:disable-next-line: variable-name
  getrelationfilter(idschema: number, filter: string): Relations[] {
    const filtera = [...this.getrelations(idschema)];
    // tslint:disable-next-line: prefer-const
    let filterb = [];
    for (const iterator of filtera) {
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
  editrelation(_id: number, idr: number, relation: Relations) {
    this.config.schemas[_id - 1].schemarelations[idr - 1] = { ...relation };
  }

  getapi(schemaid: number, apiid: number): Api {
    const apis = this.getapis(schemaid);
    return apis[apiid - 1];
  }

  editapi(schemaid: number, apiid: number, reg: Api) {
    // tslint:disable-next-line: prefer-const
    let apis = this.getapis(schemaid);
    apis[apiid - 1] = reg;
  }
  getapis(id: number): Api[] {
    // tslint:disable-next-line: prefer-const
    return this.config.schemas[id - 1].schemasapi;
  }


  deleteapi(idschema: number, idapi: number) {
    const api = this.config.schemas[idschema - 1].schemasapi;
    api.splice(idapi - 1, 1);
    let i = 1;
    for (const iterator of api) {
      iterator.id = i;
      i++;
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

  getschemasname(): any[] {
    // tslint:disable-next-line: prefer-const
    let names = [];
    this.config.schemas.forEach(element => {
      names.push({ id: element.id, name: element.name });
    });
    return names;
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

  getschemaid(name:string): number {
    var array : Schemahead[];
    array = this.getschemawithtable();
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.name === name){
        return element.id;
      }
    };
    return(0);
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
