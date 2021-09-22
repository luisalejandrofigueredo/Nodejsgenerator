import { Injectable } from '@angular/core';
import { ConfigService } from "../service/config.service";
import { ElectronService } from 'ngx-electron';
@Injectable({
  providedIn: 'root'
})
export class ServiceGeneratorService {
  security: any;
  format: false;
  textGenerated: String = '';
  constructor(private config_service: ConfigService, private electron_service: ElectronService) { }
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
    this.generateService(item, index);
    this.textGenerated += `}\n`;
    this.textGenerated += `export default ${item.name}Service;\n`;
  }
  AddHeader(item: any, index) {
    this.textGenerated = '';
    if (item.mastersecurity) {
      this.textGenerated += `import bcrypt from 'bcrypt';\n`;
    }
    this.textGenerated += `import { getRepository } from 'typeorm;'\n`;
    this.textGenerated += `import  {${item.name}} from '../entity/${item.name}.entity';\n`;
    this.textGenerated += `import { HttpException } from '@exceptions/HttpException';\n`;
    this.textGenerated += `import { isEmpty } from '@utils/util';\n`;
  }
  generateService(item, _index) {
    item.schemasapi.forEach(element => { /**element is api */
      switch (element.type) {
        case 'get':
          this.generateOperationGet(item, element.operation, element.field)
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
          this.textGenerated += `async delete(_id: number) {\n`;
          this.textGenerated += `const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
          this.textGenerated += `\t const ${item.name.toLowerCase()}: ${item.name} = await ${item.name.toLowerCase()}Repository.findOne({where: [{ "id": _id }]});\n`;
          this.textGenerated += `\t return await ${item.name.toLowerCase()}Repository.delete(${item.name.toLowerCase()});\n`;
          this.textGenerated += `}\n\n`;
          break;
        case 'patch':
          this.textGenerated += `async patch${element.path}(_id: number,patchBody:any) {\n`;
          this.textGenerated += `\t const ${item.name.toLowerCase()}Repository = getRepository(this.${item.name.toLowerCase()});\n`
          this.textGenerated += `\t return await ${item.name.toLowerCase()}Repository.createQueryBuilder().update(${item.name}).set(patchBody).where("id = :id", { id:_id }).execute();\n`;
          this.textGenerated += '}\n\n';
          break;
      }
    });
  }
  generateOperationGet(item, operation, field) {
    console.log('operation:', operation);
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

    }
  }
}