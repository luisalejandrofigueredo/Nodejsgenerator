import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Schemaitem } from '../interfaces/schema';
import { Relations } from '../interfaces/relations';


@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit, AfterContentInit, OnChanges {
  generatingline = 'Ready for begin\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
  progressbar = false;
  keyfield = '';
  @ViewChild('textgenerating', { static: true }) container: ElementRef;
  constructor(private ngzone: NgZone, private electronservice: ElectronService) { }
  config: any;
  filePath: string;
  filegenerating = '';
  fileapigenerating = '';
  reltables: string[] = [];
  editorOptions = { theme: 'vs-dark', language: 'typescript', uri: 'file://' + this.filePath  };
  ormj = { PrimaryGeneratedColumn: false, OneToMany: false, ManyToOne: false };
  ngOnInit(): void {
  }
  ngAfterContentInit(): void {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }
  addingPath() {
    this.addgenrartinline('reading file path ...');
    this.filePath = this.config.filePath;
    // const end = this.electronservice.ipcRenderer.sendSync('dir', { path: this.config.filePath});
    this.generateschemas();
    this.addgenrartinline('End generate');
  }
  generateschemas() {
    this.addgenrartinline('begin generating schemas ...');
    const schemas = this.config.schemas;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < schemas.length; index++) {
      const element = schemas[index].name;
      this.generatingline += 'schema:' + element + '\n';
      this.ormj = { PrimaryGeneratedColumn: false, OneToMany: false, ManyToOne: false };
      this.reltables = [];
      this.entitygenerator(index);
      this.apigenerator(index, schemas[index].name);
    }
    this.addgenrartinline('end generating schemas ...');
  }

  apigenerator(index: number, schema: string) {
    const schemalower = schema.toLowerCase();
    this.addgenrartinline('Begin generate Api... ');
    this.addgenrartinline('Begin generate controller... ');
    this.filegenerating = 'import { Controller, Inject,Post, Body, Get, Put, Delete,Param,UseGuards,Headers, SetMetadata,Query} from "@nestjs/common";\n';
    this.filegenerating += `import { ${this.config.schemas[index].name} } from '../entitys/${this.config.schemas[index].name}.entity';\n`;
    // tslint:disable-next-line: max-line-length
    this.filegenerating += `import { ${this.config.schemas[index].name}Service } from '../service/${this.config.schemas[index].name}.service';\n`;
    this.filegenerating += `@Controller('${this.config.schemas[index].name}')\n`;
    this.filegenerating += `export class ${this.config.schemas[index].name}class {\n`;
    this.filegenerating += `constructor(private service: ${this.config.schemas[index].name}Service){}\n`;
    // tslint:disable-next-line: prefer-for-of
    for (let ind = 0; ind < this.config.schemas[index].schemasapi.length; ind++) {
      const element = this.config.schemas[index].schemasapi[ind];
      switch (element.type) {
        case 'get':
          switch (element.operation) {
            case 'getall':
              this.addgenrartinline('\tadding verb get getall');
              this.filegenerating += '@Get()\n';
              this.filegenerating += 'get()\n';
              this.filegenerating += `{ \n\t return this.service.getall();\n}\n`;
              break;
            case 'getone':
              this.addgenrartinline('\tadding verb get getone');
              this.filegenerating += `@Get('${element.path}/:id')\n`;
              this.filegenerating += `getone(@Param() params) {\n`;
              this.filegenerating += `\t return this.service.getOne(+params.id);\n }\n`;
              break;
            case 'skiplimit':
              this.addgenrartinline('\tadding verb get skiplimit');
              this.filegenerating += `@Get('skiplimit/:skip/:limit/:order')\n`;
              this.filegenerating += `getskiplimitorder (@Param('skip') skip:number,@Param('limit') limit:number,@Param('order') order:string)`;
              this.filegenerating += '{\n';
              this.filegenerating += '\t return this.service.skiplimit(skip,limit,order);\n';
              this.filegenerating += '}\n';
              break;
            default:
              break;
          }
          break;
        case 'put':
          this.addgenrartinline('\tadding put');
          this.filegenerating += `@Put()\n`;
          this.filegenerating += `update(@Body() ${schemalower}: ${schema}) {\n`;
          this.filegenerating += `\t return this.service.update(${schemalower});\n`;
          this.filegenerating += `}\n`;
          break;
        case 'post':
          this.addgenrartinline('\tadding post');
          this.filegenerating += `@Post()\n`;
          this.filegenerating += `create(@Body() ${schemalower}: ${schema}) {\n`;
          this.filegenerating += `\t return this.service.create(${schemalower});\n`;
          this.filegenerating += `}\n`;
          break;
        case 'delete':
          this.addgenrartinline('\tadding delete');
          this.filegenerating += `@Delete('/:id')\n`;
          this.filegenerating += `delete(@Param() params) {\n\t return this.service.delete(+params.id);\n}\n`;
          break;
        default:
          break;
      }
    }
    this.filegenerating += '}';
    this.addgenrartinline('Saving controller... ');
    const args = { path: this.config.filePath, name: schema, file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('savecontroler', args);
    this.addgenrartinline('End generate controller... ');
    this.addgenrartinline('Begin generate service... ');
    this.servicegenerator(index, schema);
    this.addgenrartinline('End generate service... ');
    this.addgenrartinline('End generate Api ... ');
  }

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

  entitygenerator(ind: number) {
    this.addgenrartinline('Entity generator ... ');
    const fields = this.config.schemas[ind].schemastable;
    const relations = this.config.schemas[ind].schemarelations;
    // tslint:disable-next-line: quotemark
    this.filegenerating = "";
    this.generatingline += '\t adding imports ...';
    this.filegenerating += this.config.schemas[ind].imports + '\n';
    this.filegenerating += '@Entity()\n';
    this.filegenerating += 'export class ' + this.config.schemas[ind].name + ' {\n';
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < fields.length; index++) {
      const element = fields[index];
      this.generatecolumn(element);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < relations.length; index++) {
      const element = relations[index];
      this.generaterelation(element);
    }
    this.addgenrartinline('\t adding extra fields ...\n');
    this.filegenerating += this.config.schemas[ind].fields + '\n';
    this.filegenerating += '}\n';
    this.filegenerating = this.generateimports(this.reltables) + this.filegenerating;
    this.addgenrartinline('saving entity');
    const args = { path: this.config.filePath, name: this.config.schemas[ind].name, file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('saveentity', args);
  }

  generaterelation(element: Relations) {
    this.addgenrartinline('Relations generator ... /n');
    switch (element.type) {
      case 'onetomany':
        this.addgenrartinline(`\tadding relation @OneToMany table ${element.tablename}... /n`);
        this.ormj.OneToMany = true;
        this.filegenerating += '@OneToMany(type =>' + element.tablename + ',' + element.fieldc;
        this.filegenerating += ' =>' + element.fieldc + '.' + element.field + ' )\n';
        this.filegenerating += element.fieldr + ':' + element.tablename + '[];';
        this.reltables.push(element.tablename);
        break;
      case 'manytoone':
        this.ormj.ManyToOne = true; // ss
        this.addgenrartinline(`\tadding relation @ManytoOne table ${element.tablename}... /n`);
        this.filegenerating += '@ManyToOne (type =>' + element.tablename + ',' + element.fieldc + '=>' + element.fieldc +
          '.' + element.fieldr + ' )\n';
        this.filegenerating += element.fieldc + ':' + element.tablename + ';';
        this.reltables.push(element.tablename);
        break;
      default:
        break;
    }
  }

  generateimports(reltables: string[]): string {
    let importorm = 'import { Entity, Column ';
    let importclass = '';
    let insertstr = '';
    if (this.ormj.OneToMany === true) {
      insertstr += ', OneToMany';
    }
    if (this.ormj.ManyToOne === true) {
      insertstr += ', ManyToOne';
    }
    if (this.ormj.PrimaryGeneratedColumn === true) {
      insertstr += ', PrimaryGeneratedColumn';
    }
    // tslint:disable-next-line: quotemark
    importorm += insertstr + "} from 'typeorm';\n";
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.reltables.length; index++) {
      const element = this.reltables[index];
      importclass = `import {${element}} from "./${element}.entity"`;
    }
    return importorm + importclass;
  }

  generatecolumn(fieldcolumn: Schemaitem) {
    this.addgenrartinline(`\t generating column: ${fieldcolumn.name} ...`);
    if (fieldcolumn.keyautonumber === true) {
      this.ormj.PrimaryGeneratedColumn = true;
      this.filegenerating += '@PrimaryGeneratedColumn()\n';
      this.filegenerating += fieldcolumn.name + ':' + fieldcolumn.type + ';\n\n';
      this.keyfield = fieldcolumn.name;
    } else {
      switch (fieldcolumn.type) {
        case 'string':
          if (fieldcolumn.extraparameter === '') {
            this.filegenerating += '@Column()\n';
          }
          else {
            this.filegenerating += '@Column({' + fieldcolumn.extraparameter;
            if (fieldcolumn.length !== 0) {
              this.filegenerating += ' length:' + fieldcolumn.length.toString();
            }
            this.filegenerating += '})\n';
          }
          this.filegenerating += fieldcolumn.name + ':string;\n\n';
          break;
        case 'number':
          if (fieldcolumn.extraparameter === '') {
            this.filegenerating += '@Column()\n';
          }
          else {
            this.filegenerating += '@Column({' + fieldcolumn.extraparameter;
            if (fieldcolumn.length !== 0) {
              this.filegenerating += ' length:' + fieldcolumn.length.toString();
            }
            this.filegenerating += '})\n';
          }
          this.filegenerating += fieldcolumn.name + ':number;\n\n';
          break;
        case 'date':
          if (fieldcolumn.extraparameter === '') {
            this.filegenerating += '@Column()\n';
          }
          else {
            this.filegenerating += '@Column({' + fieldcolumn.extraparameter + '})\n';
          }
          this.filegenerating += fieldcolumn.name + ':date;\n\n';
          break;
        default:
          break;
      }
    }
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }

  addgenrartinline(message: string) {
    this.ngzone.runOutsideAngular(x => {
      this.generatingline += message + '\n';
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    });
  }

  generate(event: Event) {
    this.progressbar = true;
    this.generatingline = 'reading json file generator ...\n';
    this.config = this.electronservice.ipcRenderer.sendSync('loadconfig', 'config.json');
    this.addingPath();
    this.progressbar = false;
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }
}
