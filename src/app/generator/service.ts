import { GeneratorComponent } from "./generator.component";

//generando servicio
  servicegenerator(index: number, schema: string) {
    const schemalower = schema.toLowerCase();
    this.filegenerating = '';
    this.filegenerating += `import { Injectable, Inject, UseGuards } from '@nestjs/common';\n`;
    this.filegenerating += `import { InjectRepository } from '@nestjs/typeorm';\n`;
    this.filegenerating += `import { Repository } from 'typeorm';\n`;
    this.filegenerating += `import * as bcrypt from 'bcrypt';\n`;
    this.filegenerating += `import { ${this.config.schemas[index].name} } from '../entitys/${this.config.schemas[index].name}.entity';\n`;
    this.filegenerating += `@Injectable()\n`;
    this.filegenerating += `export class ${schema}Service {\n`;
    this.filegenerating += `constructor(@InjectRepository(${schema}) private ${schema}Repository: Repository<${schema}>) { }\n`;
    // tslint:disable-next-line: prefer-for-of
    for (let ind = 0; ind < this.config.schemas[index].schemasapi.length; ind++) {
      const element = this.config.schemas[index].schemasapi[ind];
      switch (element.type) {
        case 'get':
          switch (element.operation) {
            case 'getall':
              this.addgenrartinline('\tadding service get getall');
              this.filegenerating += `async getall(): Promise<${schema}[]> {\n`;
              this.filegenerating += `\treturn await this.${schema}Repository.find();\n`;
              this.filegenerating += `}\n`;
              break;
              case 'getone':
              this.addgenrartinline('\tadding service get getone');
              this.filegenerating += `async getOne(_id: number): Promise<${schema}> {\n`;
              this.filegenerating += `\t return await this.${schema}Repository.findOne({`;
              this.filegenerating += `where: [{ "id": _id }]`;
              this.filegenerating += `});\n`;
              this.filegenerating += `}\n`;
              break;
              case 'skiplimit':
              this.addgenrartinline('\tadding service get skiplimit');
              this.filegenerating += `async skiplimit(skip: number, limit: number, order: string): Promise<${schema}[]> {\n`;
              this.filegenerating += `if (order === 'ASC') {\n`;
              this.filegenerating += `\treturn await this.${schema}Repository.createQueryBuilder("${schema}").orderBy('${this.keyfield}', 'ASC').offset(skip).limit(limit).getMany();\n`;
              this.filegenerating += `} else {\n`;
              this.filegenerating += `\treturn await this.${schema}Repository.createQueryBuilder("${schema}").orderBy('${this.keyfield}', 'DESC').offset(skip).limit(limit).getMany();\n`;
              this.filegenerating += `}\n}\n`;
              break;
              case 'skiplimitbyfield':
              this.addgenrartinline('\tadding service get skiplimit');
              // tslint:disable-next-line: max-line-length
              this.filegenerating += `async skiplimit${element.field}(skip: number, limit: number, order: string): Promise<${schema}[]> {\n`;
              this.filegenerating += `if (order === 'ASC') {\n`;
              this.filegenerating += `\treturn await this.${schema}Repository.createQueryBuilder("${schema}").orderBy('${element.field}', 'ASC').offset(skip).limit(limit).getMany();\n`;
              this.filegenerating += `} else {\n`;
              this.filegenerating += `\treturn await this.${schema}Repository.createQueryBuilder("${schema}").orderBy('${element.field}', 'DESC').offset(skip).limit(limit).getMany();\n`;
              this.filegenerating += `}\n}\n`;
              break;
              case 'skiplimitfilter':
              this.addgenrartinline('\tadding service get skiplimit filter');
              this.filegenerating += `async skiplimitfilter${element.field}(skip: number, limit: number, order: string, ${element.field}:string): Promise<${schema}[]> {\n`;
              this.filegenerating += `if (order === "ASC") {\n`;
              this.filegenerating +=  `\treturn await this.${schema}Repository.createQueryBuilder("${schema}").orderBy('${element.field}', 'ASC').offset(skip).limit(limit).where("${schema}.${element.field} like :${element.field}",{ ${element.field}: ${element.field}+'%'}).getMany();\n`;
              this.filegenerating += `} else {\n`;
              this.filegenerating +=  `\treturn await this.${schema}Repository.createQueryBuilder("${schema}").orderBy('${element.field}', 'DESC').offset(skip).limit(limit).where("${schema}.${element.field} like :${element.field}",{ ${element.field}: ${element.field}+'%'}).getMany();\n`;
              this.filegenerating += `}\n}\n`;
              break;
              case 'count':
              this.addgenrartinline('\tadding service get count');
              this.filegenerating += `async get${schema}Count(): Promise<number> {\n`;
              this.filegenerating += `\t return await this.${schema}Repository.count();\n`;
              this.filegenerating += '}\n';
              break;
            default:
              break;
          }
          break;
        case 'put':
          this.addgenrartinline('\tadding put service');
          this.filegenerating += `async update(${schemalower}: ${schema}): Promise<${schema}> {\n`;
          this.filegenerating += `\t return await this.${schema}Repository.save(${schemalower});\n`;
          this.filegenerating += `}\n`;
          break;
        case 'post':
          this.addgenrartinline('\tadding post service');
          this.filegenerating += `async create(${schemalower}: ${schema} ): Promise<${schema}> {\n`;
          this.filegenerating += `\t return await this.${schema}Repository.save(${schemalower});\n`;
          this.filegenerating += `}\n`;
          break;
          case 'delete':
            this.addgenrartinline('\tadding delete service');
            this.filegenerating += `async delete(_id: Number) {\n`;
            this.filegenerating += `\t let ${schemalower}: ${schema} = await this.${schema}Repository.findOne({where: [{ "id": _id }]});\n`;
            this.filegenerating += `\t return await this.${schema}Repository.delete(${schemalower});\n`;
            this.filegenerating += `}\n`;
            break;
        default:
          break;
      }
    }
    this.filegenerating += `}\n`;
    const args = { path: this.config.filePath, name: schema, file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('saveservice', args);
  }