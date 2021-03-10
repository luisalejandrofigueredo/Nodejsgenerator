import { Component, OnInit, ViewChild, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Schemaitem } from '../interfaces/schema';
import { Relations } from '../interfaces/relations';
import { ConfigService } from '../service/config.service';


@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit, OnChanges {
  generatingline = 'Ready for begin\n';
  progressbar = false;
  keyfield = '';
  @ViewChild('textgenerating', { static: false }) container: ElementRef;
  @ViewChild('fileswriting', { static: false }) containerfiles: ElementRef;
  constructor(private configservice:ConfigService,private ngzone: NgZone, private electronservice: ElectronService) { }
  config: any;
  filePath: string;
  line:string;
  filegenerating = '';
  generatingfile = '';
  fileapigenerating = '';
  reltables: string[] = [];
  editorOptions = { theme: 'vs-dark', language: 'typescript' };
  ormj = { PrimaryGeneratedColumn: false, OneToMany: false, ManyToOne: false , Index: false };
  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    this.containerfiles.nativeElement.scrollTop = this.containerfiles.nativeElement.scrollHeight;
  }
  
  addingPath() {
    this.addgenrartinline('reading file path ...');
    this.filePath = this.configservice.config.filePath;
    this.generatedatabaseconfig();
    this.generateschemas();
    this.generatesecurityfile();
    this.addgenrartinline('End generate');
  }

  generatedatabaseconfig(){
    this.addgenrartinline('begin generating database config file ...');
    const database=this.configservice.getdatabase();
    let driver="";
    this.filegenerating='';
    switch (database.selecteddatabase) {
      case 0:
        driver='mysql';
        break;
      case 1:
        driver='postgres';
        break;
      case 2:
        driver='sqlite3';
        break;
      case 3:
        driver='mssql';
        break;
      case 4:
        driver='sql.js';
        break;
      case 5:
        driver='oracledb';
        break;      
      default:
        break;
    }
    const databaseconfig={
      "type":driver,
      "host":database.host,
      "port":database.port,
      "username":database.username,
      "password":database.password,
      "database":database.database,
      "entities": ["dist/**/*.entity.js"],
      "synchronize": true
    }
    this.addgenrartinline('end generating database config file.');
    this.filegenerating =JSON.stringify(databaseconfig);
    const args = { path: this.config.filePath, name: "ormconfig.json", file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('saveormconfig', args);
    this.addgenrartinlinefile(end);
  }
  
  generatesecurityfile(){
    this.addgenrartinline('begin generating security file ...');
    this.addgenrartinline('end generating security file ...');
  }

  generateschemas() {
    this.addgenrartinline('begin generating schemas ...');
    const schemas = this.configservice.getschema();
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < schemas.length; index++) {
      const element = schemas[index].name;
      this.generatingline += 'schema:' + element + '\n';
      this.ormj = { PrimaryGeneratedColumn: false, OneToMany: false, ManyToOne: false, Index: false };
      this.reltables = [];
      this.entitygenerator(index);
      this.apigenerator(index, schemas[index].name,schemas[index].mastersecurity);
      this.generatemodules(index, schemas[index].name,schemas[index].mastersecurity);
    }
    this.generateloginmodule()
    this.addgenrartinline('end generating schemas ...');
  }

  generateloginmodule():boolean {
    this.addgenrartinline('begin generating login module ...');
    let mastersec:any;
    mastersec=  this.configservice.getschemamastersecurity();
    if (mastersec === undefined) {
      this.addgenrartinline(`No schema master security fail in login module.`);
      return false;  
    }
    this.addgenrartinline(`begin generating module login for ${mastersec.name} ...`);
    this.filegenerating = "import { Module } from '@nestjs/common';\n"
    this.filegenerating +="import { JwtModule } from '@nestjs/jwt';\n"
    this.filegenerating +="import { TypeOrmModule } from '@nestjs/typeorm';\n"
    this.filegenerating +="import * as winston from 'winston';\n"
    this.filegenerating+="import { WinstonModule } from 'nest-winston';\n"
    this.filegenerating +=`import { ${mastersec.name}Service } from '../service/${mastersec.name}.service';\n`;
    this.filegenerating +=`import { ${mastersec.name} } from '../entitys/${mastersec.name}.entity';\n`;
    this.filegenerating+=`import { ${mastersec.name}Controller } from '../controller/${mastersec.name}.controller';\n`;
    this.filegenerating += "@Module({\n";
    this.filegenerating += `imports: [TypeOrmModule.forFeature([${mastersec.name}]),\n`;
    this.filegenerating += `JwtModule.register({  secret: '${this.configservice.config.jwtsk}' }),\n`;
    this.generatewinston();
    this.filegenerating += `providers:[${mastersec.name}Service],\n`;
    this.filegenerating += `controllers:[${mastersec.name}Controller]})\n`;
    this.filegenerating += `export class LoginModule{}`;
    const args = { path: this.config.filePath, name: 'login', file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('savemodule', args);
    this.addgenrartinlinefile(end);
    this.addgenrartinline('end generating login module ...');
    return true;
  }

  generatemodules(index:number,schema:string,mastersecurity:boolean):boolean{
    console.log('master security',mastersecurity);
    let mastersec:any;
    this.addgenrartinline(`begin generating module ${schema} ...`);
    mastersec=  this.configservice.getschemamastersecurity();
    if (mastersec === undefined) {
        this.addgenrartinline(`No schema master security.`);
        return false;  
    }
    this.filegenerating="import { Module } from '@nestjs/common';\n";
    this.filegenerating+="import { JwtModule } from '@nestjs/jwt';\n";
    this.filegenerating+="import { TypeOrmModule } from '@nestjs/typeorm';\n";
    this.filegenerating+="import * as winston from 'winston';\n";
    this.filegenerating+="import { WinstonModule } from 'nest-winston';\n";
    this.filegenerating+=`import { ${schema}Service } from '../service/${schema}.service'\n`;
    this.filegenerating+=`import { ${schema}Controller } from '../controller/${schema}.controller';\n`;
    this.filegenerating+=`import { ${schema} } from '../entitys/${schema}.entity';\n`;
    if (mastersecurity===false){
      this.filegenerating+=`import { ${mastersec.name}Service } from '../service/${mastersec.name}.service'\n`;
      this.filegenerating+=`import { ${mastersec.name}Controller } from '../controller/${mastersec.name}.controller';\n`;
      this.filegenerating+=`import { ${mastersec.name} } from '../entitys/${mastersec.name}.entity';\n`;
    }
    this.filegenerating+='@Module({\n';
    this.filegenerating+=`imports:[TypeOrmModule.forFeature([${schema}`;
    if (mastersecurity===false){
      this.filegenerating+=`,${mastersec.name}`;
    }
    this.filegenerating+=`]),\n`;
    this.filegenerating+=`JwtModule.register({  secret: '${this.configservice.config.jwtsk}' }),\n`;
    this.generatewinston();
    this.filegenerating+='providers:';
    this.filegenerating+=`[${schema}Service`;
    if (mastersecurity===false){
      this.filegenerating+=`,${mastersec.name}Service`;
    }
    this.filegenerating+=`],\n`;
    this.filegenerating+='controllers:'
    this.filegenerating+=`[${schema}Controller`;
    if (mastersecurity===false){
      this.filegenerating+=`,${mastersec.name}Controller`;
    }
    this.filegenerating+='],\n})\n';
    this.filegenerating+=`export class ${schema}Module{}`;
    const args = { path: this.config.filePath, name: schema, file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('savemodule', args);
    this.addgenrartinlinefile(end);
    this.addgenrartinline('end generating module ...');
    return(true);
   }

   generatewinston() {
     const sec=this.configservice.config.logger;
     this.filegenerating+='WinstonModule.forRoot({transports: [\n';
     if (sec.type===0 || sec.type===2){
       this.filegenerating+=`new winston.transports.File({ format:winston.format.simple(), level: 'info', filename:'${sec.file}', maxsize:${sec.maxsize}}),\n`;
    }
    if (sec.type===1 || sec.type===2){
      this.filegenerating+=`new winston.transports.Console({format: winston.format.combine(winston.format.colorize({all:true}),winston.format.simple()), level:'info' }),\n`;
    }
    if (sec.typewarn===0 || sec.typewarn===2){
      this.filegenerating+=`new winston.transports.File({ format:winston.format.simple(), level: 'warn', filename:'${sec.filewarn}', maxsize:${sec.maxsizewarn}}),\n`;
   }
   if (sec.typewarn===1 || sec.typewarn===2){
     this.filegenerating+=`new winston.transports.Console({format: winston.format.combine(winston.format.colorize({all:true}),winston.format.simple()), level:'warn' }),\n`;
   }
   if (sec.typeerror===0 || sec.typeerror===2){
    this.filegenerating+=`new winston.transports.File({ format:winston.format.simple(), level: 'error', filename:'${sec.fileerror}', maxsize:${sec.maxsizeerror}}),\n`;
   }
  if (sec.typeerror===1 || sec.typeerror===2){
   this.filegenerating+=`new winston.transports.Console({format: winston.format.combine(winston.format.colorize({all:true}),winston.format.simple()), level:'error' })\n`;
  }
  this.filegenerating+=`]})],\n`;
 }
  // generando api
  apigenerator(index: number, schema: string, mastersecurity: boolean) {
    const schemalower = schema.toLowerCase();
    this.addgenrartinline('Begin generate Api... ');
    this.addgenrartinline('Begin generate controller... ');
    this.filegenerating = 'import { Controller, Inject,Post, Body, Get, Put, Delete,Param,UseGuards,Headers, SetMetadata,Query} from "@nestjs/common";\n';
    this.filegenerating += `import { ${this.config.schemas[index].name} } from '../entitys/${this.config.schemas[index].name}.entity';\n`;
    if (this.config.schemas[index].security === true) {
      this.filegenerating += `import {${this.config.schemas[index].classsecurity} } from '${this.config.schemas[index].filesecurity}';\n`;
    }
    // tslint:disable-next-line: max-line-length
    this.filegenerating += `import { ${this.config.schemas[index].name}Service } from '../service/${this.config.schemas[index].name}.service';\n`;
    this.filegenerating += `@Controller('${this.config.schemas[index].name}')\n`;
    if (this.config.schemas[index].security === true) {
        this.filegenerating += `@UseGuards(${this.config.schemas[index].classsecurity})\n`;
    }
    this.filegenerating += `export class ${this.config.schemas[index].name}Controller {\n`;
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
              this.generatesecurity(element);
              this.filegenerating += 'get()\n';
              this.filegenerating += `{ \n\t return this.service.getall();\n}\n`;
              break;
            case 'getone':
              this.addgenrartinline('\tadding verb get getone');
              this.filegenerating += `@Get('${element.path}/:id')\n`;
              this.generatesecurity(element);
              this.filegenerating += `getone(@Param() params) {\n`;
              this.filegenerating += `\t return this.service.getOne(+params.id);\n }\n`;
              break;
            case 'skiplimit':
              this.addgenrartinline('\tadding verb get skiplimit by key');
              this.filegenerating += `@Get('skiplimit/:skip/:limit/:order')\n`;
              this.generatesecurity(element); 
              this.filegenerating += `getskiplimitorder (@Param('skip') skip:number,@Param('limit') limit:number,@Param('order') order:string)`;
              this.filegenerating += '{\n';
              this.filegenerating += '\t return this.service.skiplimit(skip,limit,order);\n';
              this.filegenerating += '}\n';
              break;
            case 'skiplimitbyfield':
                this.addgenrartinline('\tadding verb get skiplimit by field');
                this.filegenerating += `@Get('skiplimitorder${element.field}/:skip/:limit/:order')\n`;
                this.generatesecurity(element);
                this.filegenerating += `getskiplimitorder${element.field} (@Param('skip') skip:number,@Param('limit') limit:number,@Param('order') order:string)`;
                this.filegenerating += '{\n';
                this.filegenerating += `\t return this.service.skiplimit${element.field}(skip,limit,order);\n`;
                this.filegenerating += '}\n';
                break;
            case 'skiplimitfilter':
                this.addgenrartinline('\tadding verb get skiplimit by filter');
                this.filegenerating += `@Get('skiplimitfilter${element.field}/:skip/:limit/:order/:${element.field}')\n`;
                this.generatesecurity(element);
                this.filegenerating += `skiplimitfilter${element.field} (@Param('skip') skip:number,@Param('limit') limit:number,@Param('order') order:string,@Param('${element.field}') ${element.field}:string ) {\n`;
                this.filegenerating += `\t return this.service.skiplimitfilter${element.field}(skip,limit,order,${element.field});\n`;
                this.filegenerating += '}\n';
                break;
            default:
              break;
          }
          break;
        case 'put':
          this.addgenrartinline('\tadding put');
          this.filegenerating += `@Put()\n`;
          this.generatesecurity(element);
          this.filegenerating += `update(@Body() ${schemalower}: ${schema}) {\n`;
          this.filegenerating += `\t return this.service.update(${schemalower});\n`;
          this.filegenerating += `}\n`;
          break;
        case 'post':
          this.addgenrartinline('\tadding post');
          this.filegenerating += `@Post()\n`;
          this.generatesecurity(element);
          this.filegenerating += `create(@Body() ${schemalower}: ${schema}) {\n`;
          this.filegenerating += `\t return this.service.create(${schemalower});\n`;
          this.filegenerating += `}\n`;
          break;
        case 'delete':
          this.addgenrartinline('\tadding delete');
          this.filegenerating += `@Delete('/:id')\n`;
          this.generatesecurity(element);
          this.filegenerating += `delete(@Param() params) {\n\t return this.service.delete(+params.id);\n}\n`;
          break;
        default:
          break;
      }
    }
    this.filegenerating += '}';
    this.addgenrartinline('Saving controller... ');
    const args = { path: this.config.filePath, name: schema, file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('saveController', args);
    this.addgenrartinlinefile(end);
    this.addgenrartinline('End generate controller... ');
    this.addgenrartinline('Begin generate service... ');
    this.servicegenerator(index, schema,mastersecurity);
    this.addgenrartinline('End generate service... ');
    this.addgenrartinline('End generate Api ... ');
  }

  // generando seguridad
  generatesecurity(element: any){
    if (element.security !== undefined && element.security !== false){
      const array = element.roles.split(' ');
      const strarray = JSON.stringify(array);
      this.filegenerating += `@SetMetadata('roles', ${strarray})\n`;
    }

  }

  //generando servicio
  servicegenerator(index: number, schema: string,mastersecurity: boolean) {
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
    if (mastersecurity === true){
      this.filegenerating +='// get for security\n';
      this.addgenrartinline('\tadding predicate in service for security');
      const sec=this.configservice.getsecurity();
      this.filegenerating += `async getlogin(${sec.login}: string): Promise<${schema}> {\n`;
      this.filegenerating += `\t return await this.${schema}Repository.findOne({`;
      this.filegenerating += `where: [{ "${sec.login}": ${sec.login} }]`;
      this.filegenerating += `});\n`;
      this.filegenerating += `}\n`;
      this.addgenrartinline('\tend predicate for security');
    }
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
            this.filegenerating += `async delete(_id: number) {\n`;
            this.filegenerating += `\t const ${schemalower}: ${schema} = await this.${schema}Repository.findOne({where: [{ "id": _id }]});\n`;
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
    this.addgenrartinlinefile(end);
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
    this.addgenrartinlinefile(end);

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
    if (this.ormj.Index === true) {
      insertstr += ', Index';
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
          if (fieldcolumn.index === true){
            this.ormj.Index = true;
            this.filegenerating += '@Index()\n';
          }
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
      this.line=message;
      this.generatingline += message + '\n';
      this.container.nativeElement.value = this.generatingline;
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    });
  }

  addgenrartinlinefile(message: string) {
    this.ngzone.runOutsideAngular(x => {
      this.generatingfile += message + '\n';
      this.containerfiles.nativeElement.value = this.generatingfile;
      this.containerfiles.nativeElement.scrollTop = this.containerfiles.nativeElement.scrollHeight;
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