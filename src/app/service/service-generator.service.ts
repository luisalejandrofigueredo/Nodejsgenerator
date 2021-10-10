import { Injectable } from '@angular/core';
import { ConfigService } from "../service/config.service";
import { ElectronService } from 'ngx-electron';
import { Api } from '../interfaces/api';
import { RelationsService } from './relations.service';
import { Manytoone } from '../interfaces/manytoone';
@Injectable({
  providedIn: 'root'
})
export class ServiceGeneratorService {
  security: any;
  format: false;
  textGenerated: String = '';
  constructor(private relationsService:RelationsService,private config_service: ConfigService, private electron_service: ElectronService) { }
  begin_generate() {
    this.security = this.config_service.config.security;
    this.config_service.config.schemas.forEach((item, index) => {
      this.AddHeader(item, index);
      this.createBody(item, index);
      if (this.electron_service.isElectronApp) {
        const args = {
          path: this.config_service.config.filePath,
          name: item.name,
          file: this.textGenerated,
          format: this.format
        };
        const end = this.electron_service.ipcRenderer.sendSync('saveservice', args);
      }
    });
  }
  createBody(item, index) {
    this.textGenerated += `class ${item.name}Service {\n`;
    this.textGenerated += `public ${item.name.toLowerCase()} = ${item.name}\n`;
    this.bodyRelations(index,item);
    this.generateService(item, index);
    this.textGenerated += `}\n`;
    this.textGenerated += `export default ${item.name}Service;\n`;
  }

  bodyRelations(index,item) {
    const id=this.config_service.getschemawithname(item.name);
    const oneToMany=this.relationsService.getrelationsonetomany(id);
    oneToMany.forEach(OneToMany=>{
      this.textGenerated += `public ${OneToMany.table.toLowerCase()}=${OneToMany.table}\n`;
    });
    const manyToOne=this.relationsService.getrelationmanytoone(id);
    manyToOne.forEach(ManyToOne=>{
      this.textGenerated += `public ${ManyToOne.table.toLowerCase()}=${ManyToOne.table};\n`;
    });
    const manyToMany=this.relationsService.getrelationsmanytomany(id);
    manyToMany.forEach(ManyToMany=>{
      this.textGenerated += `public ${ManyToMany.table.toLowerCase()}=${ManyToMany.table}\n`;
    });
    const oneToOne=this.relationsService.getrelationsonetone(id);
    oneToOne.forEach(OneToOne=>{
      this.textGenerated += `public  ${OneToOne.table.toLowerCase()}=${OneToOne.table}\n`;
    });
  }

  AddHeader(item: any, index) {
    this.textGenerated = '';
    if (item.mastersecurity) {
      this.textGenerated += `import bcrypt from 'bcrypt';\n`;
    }
    this.textGenerated += `import { getRepository } from 'typeorm';\n`;
    this.textGenerated += `import { NextFunction, Request, Response } from 'express';\n`
    this.textGenerated += `import  {${item.name}} from '../entity/${item.name}.entity';\n`;
    this.relationsHeader(item.name);
    this.textGenerated += `import { HttpException } from '@exceptions/HttpException';\n`;
    this.textGenerated += `import { isEmpty } from '@utils/util';\n`;
  }

  relationsHeader(table:string){
    const id=this.config_service.getschemawithname(table);
    const oneToMany=this.relationsService.getrelationsonetomany(id);
    oneToMany.forEach(OneToMany=>{
      this.textGenerated += `import  {${OneToMany.table}} from '../entity/${OneToMany.table}.entity';\n`;
    });
    const manyToOne=this.relationsService.getrelationmanytoone(id);
    manyToOne.forEach(ManyToOne=>{
      this.textGenerated += `import  {${ManyToOne.table}} from '../entity/${ManyToOne.table}.entity';\n`;
    });
    const manyToMany=this.relationsService.getrelationsmanytomany(id);
    manyToMany.forEach(ManyToMany=>{
      this.textGenerated += `import  {${ManyToMany.table}} from '../entity/${ManyToMany.table}.entity';\n`;
    });
    const oneToOne=this.relationsService.getrelationsonetone(id);
    oneToOne.forEach(OneToOne=>{
      this.textGenerated += `import  {${OneToOne.table}} from '../entity/${OneToOne.table}.entity';\n`;
    });
  }

  generateService(item, _index) {
    item.schemasapi.forEach((element: Api) => {
      switch (element.type) {
        case 'get':
          this.generateOperationGet(item, element.operation, element.field, element)
          break;
        case 'put':
          this.textGenerated += `async update(${item.name.toLowerCase()}: ${item.name}): Promise<${item.name}> {\n`;
          this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
          this.textGenerated += `\t return await ${item.name.toLowerCase()}Repository.save(${item.name.toLowerCase()});\n`;
          this.textGenerated += `}\n\n`;
          break;
        case 'post':
          this.textGenerated += `async create(${item.name.toLowerCase()}: ${item.name} ): Promise<${item.name}> {\n`;
          this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
          if (item.mastersecurity === true) {
            this.textGenerated += `${item.name.toLowerCase()}.${this.security.password}=bcrypt.hashSync(${item.name.toLowerCase()}.${this.security.password},5);\n`;
          }
          this.textGenerated += `\t return await ${item.name.toLowerCase()}Repository.save(${item.name.toLowerCase()});\n`;
          this.textGenerated += `}\n\n`;
          break;
        case 'delete':
          this.textGenerated += `async delete(_id: number) : Promise<${item.name}> {\n`;
          this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
          this.textGenerated += `\t const ${item.name.toLowerCase()}: ${item.name} = await ${item.name.toLowerCase()}Repository.findOne({where: [{ "id": _id }]});\n`;
          this.textGenerated += `\t if (!${item.name.toLowerCase()}) throw new HttpException(409, "You're not ${item.name}");\n`;
          this.textGenerated += `\t await ${item.name.toLowerCase()}Repository.delete({id:_id});\n`;
          this.textGenerated += `\t return ${item.name.toLowerCase()}`;
          this.textGenerated += `}\n\n`;
          break;
        case 'patch':
          this.textGenerated += `async patch${element.path}(_id: number,patchBody:any): Promise<${item.name}> {\n`;
          this.textGenerated += `\t const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
          this.textGenerated += `\t await ${item.name.toLowerCase()}Repository.createQueryBuilder().update(${item.name}).set(patchBody).where("id = :id", { id:_id }).execute();\n`;
          this.textGenerated += `return await ${item.name.toLowerCase()}Repository.findOne({ where: { id: _id } });  `;
          this.textGenerated += '}\n\n';
          break;
        case 'postonetomany': 
        const table = item.name;
        const tableLower = item.name.toLowerCase();
        const relationsOneToMany = this.relationsService.getrelationsonetomany(item.id);
        const relationOneToMany= relationsOneToMany.find(oneToMany => oneToMany.relationname === element.field);
        const invRelations: Manytoone[] = this.relationsService.getrelationmanytoone(this.config_service.getschemawithname(relationOneToMany.table));
        const manytoone = invRelations.find(manyToOne => manyToOne.table === table);
        this.textGenerated+=`async postonetomany${element.path}(_id: number,relation:${relationOneToMany.table}): Promise<${table}> {\n`;
        this.textGenerated += `\t const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `\t const ${relationOneToMany.table.toLowerCase()}Repository = getRepository(this.${relationOneToMany.table.toLowerCase()});\n`
        this.textGenerated += `\t let ${item.name.toLowerCase()}: ${item.name} = await ${item.name.toLowerCase()}Repository.findOne({where: { "id": _id }});\n`;
        this.textGenerated += `\t if (!${item.name.toLowerCase()}) throw new HttpException(409, "Not find in post one to many ${item.name}");\n`;
        this.textGenerated += `\t let relationRegister= await  ${relationOneToMany.table.toLowerCase()}Repository.save(relation);\n`;
        this.textGenerated += `\t if (!relationRegister) throw new HttpException(409, "Not post in post one to many ${relationOneToMany.table}");\n`;
        this.textGenerated += `\t ${item.name.toLowerCase()}.${relationOneToMany.relationname}.push(relationRegister);\n`;
        this.textGenerated += `\t return await ${item.name.toLowerCase()}Repository.save(${item.name.toLowerCase()});\n`;
        this.textGenerated += '}\n\n';
        break;
      }
    });
  }
  generateOperationGet(item, operation: string, field: string, api: Api) {

    switch (operation) {
      case 'getall': {
        this.textGenerated += `public async findAll${item.name}(): Promise<any[]> {\n`
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `const ${item.name.toLowerCase()}:any[] = await ${item.name.toLowerCase()}Repository.find();\n`;
        this.textGenerated += `return ${item.name.toLowerCase()};\n`;
        this.textGenerated += `}\n`;
        break;
      }
      case 'getone': {
        this.textGenerated += `public async find${item.name}ById(Id: number): Promise<any> {\n`;
        this.textGenerated += `if (isEmpty(Id)) throw new HttpException(400, "You're not ${item.name}Id");\n`
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`;
        this.textGenerated += `const find${item.name}: any = await ${item.name.toLowerCase()}Repository.findOne({ where: { id: Id } });\n`;
        this.textGenerated += `if (!find${item.name}) throw new HttpException(409, "You're not ${item.name}");\n`;
        this.textGenerated += `return find${item.name};\n`;
        this.textGenerated += '}\n'
        break;
      }
      case 'findandcount': {
        this.textGenerated += `public async findAndCount(): Promise<any[]> {\n`
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `const ${item.name.toLowerCase()}:any[] = await ${item.name.toLowerCase()}Repository.findAndCount();\n`;
        this.textGenerated += `return ${item.name.toLowerCase()};\n`;
        this.textGenerated += `}\n`;
        break;
      }
      case 'skiplimit': {
        this.textGenerated += `async skipLimit(skip: number, limit: number, order: string): Promise<${item.name}[]> {\n`;
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `if (order === 'ASC') {\n`;
        this.textGenerated += `\treturn await ${item.name.toLowerCase()}Repository.createQueryBuilder("${item.name}").orderBy('id', 'ASC').offset(skip).limit(limit).getMany();\n`;
        this.textGenerated += `} else {\n`;
        this.textGenerated += `\treturn await ${item.name.toLowerCase()}Repository.createQueryBuilder("${item.name}").orderBy('id', 'DESC').offset(skip).limit(limit).getMany();\n`;
        this.textGenerated += `}\n`;
        this.textGenerated += `}\n`;
        break;
      }
      case 'skiplimitbyfield': {
        this.textGenerated += `async SkipLimit${field}(skip: number, limit: number, order: string): Promise<${item.name}[]> {\n`;
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `if (order === 'ASC') {\n`;
        this.textGenerated += `\treturn await ${item.name.toLowerCase()}Repository.createQueryBuilder("${item.name}").orderBy('${field}', 'ASC').offset(skip).limit(limit).getMany();\n`;
        this.textGenerated += `} else {\n`;
        this.textGenerated += `\treturn await ${item.name.toLowerCase()}Repository.createQueryBuilder("${item.name}").orderBy('${field}', 'DESC').offset(skip).limit(limit).getMany();\n`;
        this.textGenerated += `}\n}\n`;
        break;
      }
      case 'skiplimitfilter': {
        this.textGenerated += `async skipLimitFilter${field}(skip: number, limit: number, order: string, ${field}:string): Promise<${item.name}[]> {\n`;
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `if (order === "ASC") {\n`;
        this.textGenerated += `\treturn await ${item.name.toLowerCase()}Repository.createQueryBuilder("${item.name}").orderBy('${field}', 'ASC').offset(skip).limit(limit).where("${item.name}.${field} like :${field}",{ ${field}: ${field}+'%'}).getMany();\n`;
        this.textGenerated += `} else {\n`;
        this.textGenerated += `\treturn await ${item.name.toLowerCase()}Repository.createQueryBuilder("${item.name}").orderBy('${field}', 'DESC').offset(skip).limit(limit).where("${item.name}.${field} like :${field}",{ ${field}: ${field}+'%'}).getMany();\n`;
        this.textGenerated += `}\n}\n`;
        break;
      }
      case 'findwithoptions': {
        this.textGenerated += `async getfindwithoptions${item.name}(options:string): Promise<any[]> {\n`;
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `\treturn await ${item.name.toLowerCase()}Repository.find(JSON.parse(decodeURI(options)));\n`;
        this.textGenerated += `}\n`;
        break;
      }
      case 'findandcountwithoptions': {
        this.textGenerated += `async getfindandcountwithoptions${item.name}(options:string): Promise<any[]> {\n`;
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `\treturn await ${item.name.toLowerCase()}Repository.findAndCount(JSON.parse(decodeURI(options)));\n`;
        this.textGenerated += `}\n`;
        break;
      }
      case 'count': {
        this.textGenerated += `public async count${item.name}(): Promise<number> {\n`
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `const ${item.name.toLowerCase()}:number = await ${item.name.toLowerCase()}Repository.count();\n`;
        this.textGenerated += `return ${item.name.toLowerCase()};\n`;
        this.textGenerated += `}\n`;
        break;
      }
      case 'findgenerated': {
        this.textGenerated += `public async findGenerated${item.name}${api.path}(req: Request): Promise<any> {\n`
        api.parameters.forEach((parameter)=>{
          switch (parameter.type) {
            case 'string':
              this.textGenerated +=`const ${parameter.name}:string=req.params.${parameter.name};\n`;  
              break;
              case 'number':
              this.textGenerated +=`const ${parameter.name}:number=Number(req.params.${parameter.name});\n`;  
              break;
            default:
              break;
          }
        })
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `const ${item.name.toLowerCase()}:any = await ${item.name.toLowerCase()}Repository.find(${api.options});\n`;
        this.textGenerated += `return ${item.name.toLowerCase()};\n`;
        this.textGenerated += `}\n`;
        break;
      }
       case 'findandcountgenerated': {
        this.textGenerated += `public async findAndCountGenerated${item.name}${api.path}(req: Request): Promise<any> {\n`
        api.parameters.forEach((parameter)=>{
          switch (parameter.type) {
            case 'string':
              this.textGenerated +=`const ${parameter.name}:string=req.params.${parameter.name};\n`;  
              break;
              case 'number':
              this.textGenerated +=`const ${parameter.name}:number=Number(req.params.${parameter.name});\n`;  
              break;
            default:
              break;
          }
        })
        this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
        this.textGenerated += `const ${item.name.toLowerCase()}:any = await ${item.name.toLowerCase()}Repository.findAndCount(${api.options});\n`;
        this.textGenerated += `return ${item.name.toLowerCase()};\n`;
        this.textGenerated += `}\n`;
        break;
      }
    }
  }
}