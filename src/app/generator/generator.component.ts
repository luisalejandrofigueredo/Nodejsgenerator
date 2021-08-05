import { Component, OnInit, ViewChild, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Schemaitem } from '../interfaces/schema';
import { Relations } from '../interfaces/relations';
import { ConfigService } from '../service/config.service';
import { Api } from '../interfaces/api';
import { RelationsService } from '../service/relations.service';
import { Manytoone } from '../interfaces/manytoone';
import { Manytomany } from '../interfaces/manytomany';


@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit, OnChanges {
  generatingline = 'Ready for begin\n';
  progressbar = false;
  format: false;
  keyfield = '';
  @ViewChild('textgenerating', { static: false }) container: ElementRef;
  @ViewChild('fileswriting', { static: false }) containerfiles: ElementRef;
  constructor(private configservice: ConfigService, private relationservice: RelationsService, private ngzone: NgZone, private electronservice: ElectronService) { }
  config: any;
  filePath: string;
  line: string;
  filegenerating = '';
  generatingfile = '';
  fileapigenerating = '';
  reltables: string[] = [];
  editorOptions = { theme: 'vs-dark', language: 'typescript' };
  ormj = { PrimaryGeneratedColumn: false, OnetoOne: false, OneToMany: false, ManyToOne: false, Index: false };
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    this.containerfiles.nativeElement.scrollTop = this.containerfiles.nativeElement.scrollHeight;
  }

  addingPath() {
    this.addgenrartinline('reading file path ...');
    this.filePath = this.configservice.config.filePath;
    this.loadtemplate('roles.guard.ts', 'login.controller.ts');
    this.generatedatabaseconfig();
    this.generateenablecors();
    this.generateschemas();
    this.generateappmodule();
    this.addgenrartinline('End generate');
  }
  generateenablecors() {
    this.addgenrartinline('begin generating main module ...');
    this.filegenerating = '';
    this.filegenerating += "import { NestFactory } from '@nestjs/core';\n";
    this.filegenerating += "import { AppModule } from './app.module';\n\n";
    if (this.configservice.config.enablehttps === true) {
      this.filegenerating += "const fs = require('fs');\n"
      this.filegenerating += 'const httpsOptions = {\n'
      this.filegenerating += " key: fs.readFileSync('./secrets/private-key.pem'),\n"
      this.filegenerating += " cert: fs.readFileSync('./secrets/public-certificate.pem'),\n"
      this.filegenerating += "};\n";
    }
    this.filegenerating += "async function bootstrap() {\n";
    if (this.configservice.config.enablehttps === false) {
      this.filegenerating += "  const app = await NestFactory.create(AppModule);\n";
    } else {
      this.filegenerating += "  const app = await NestFactory.create(AppModule,{  httpsOptions });\n";
    }
    if (this.configservice.config.enableCors === true) {
      this.filegenerating += "  app.enableCors();\n"
    }
    this.filegenerating += `  await app.listen(${this.configservice.config.port});\n`;
    this.filegenerating += "}\n";
    this.filegenerating += "bootstrap();\n"
    this.addgenrartinline('end generate main module ...');
    const args = { path: this.config.filePath, name: "main.ts", file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('savemain', args);
    this.addgenrartinlinefile(end);
  }
  generateappmodule() {
    this.addgenrartinline('begin generating app module ...');
    this.filegenerating = "import { Module , forwardRef } from '@nestjs/common';\n";
    this.filegenerating += "import { TypeOrmModule } from '@nestjs/typeorm';\n";
    this.filegenerating += "import { AppController } from './app.controller';\n";
    this.filegenerating += "import { AppService } from './app.service';\n";
    if (this.configservice.config.enableuploadfiles === true) {
      this.filegenerating += "import { MulterModule } from '@nestjs/platform-express';\n";
    }
    const schemas = this.configservice.getschema();
    for (let index = 0; index < schemas.length; index++) {
      const element = schemas[index].name;
      this.filegenerating += `import {${element}Module} from './module/${element}.module';\n`;
    }
    this.filegenerating += `import {LoginModule} from './module/Login.module';\n`;
    this.filegenerating += '@Module({\n';
    this.filegenerating += 'imports:[TypeOrmModule.forRoot()';
    if (this.configservice.config.enableuploadfiles === true) {
      this.filegenerating += ",MulterModule.register({\n dest: './uploads',\n})\n";
    }
    for (let index = 0; index < schemas.length; index++) {
      const element = schemas[index].name;
      this.filegenerating += `,forwardRef(() =>${element}Module)`;
    }
    this.filegenerating += ',forwardRef(()=>LoginModule)';
    this.filegenerating += '],\n';
    this.filegenerating += 'controllers:[AppController],\n';
    this.filegenerating += 'providers: [AppService],\n';
    this.filegenerating += '})\n';
    this.filegenerating += 'export class AppModule {}';
    const args = { path: this.config.filePath, name: 'app', file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('saveappmodule', args);
    this.addgenrartinlinefile(end);
    this.addgenrartinline('end  generating app module ...');
  }

  generatedatabaseconfig() {
    this.addgenrartinline('begin generating database config file ...');
    const database = this.configservice.getdatabase();
    let driver = "";
    this.filegenerating = '';
    switch (database.selecteddatabase) {
      case 0:
        driver = 'mysql';
        break;
      case 1:
        driver = 'postgres';
        break;
      case 2:
        driver = 'sqlite3';
        break;
      case 3:
        driver = 'mssql';
        break;
      case 4:
        driver = 'sql.js';
        break;
      case 5:
        driver = 'oracledb';
        break;
      default:
        break;
    }
    const databaseconfig = {
      "type": driver,
      "host": database.host,
      "port": database.port,
      "username": database.username,
      "password": database.password,
      "database": database.database,
      "entities": ["dist/**/*.entity.js"],
      "synchronize": true
    }
    this.addgenrartinline('end generating database config file.');
    this.filegenerating = JSON.stringify(databaseconfig);
    const args = { path: this.config.filePath, name: "ormconfig.json", file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('saveormconfig', args);
    this.addgenrartinlinefile(end);
  }


  generateschemas() {
    this.addgenrartinline('begin generating schemas ...');
    const schemas = this.configservice.getschema();
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < schemas.length; index++) {
      const element = schemas[index].name;
      this.generatingline += 'schema:' + element + '\n';
      this.ormj = { PrimaryGeneratedColumn: false, OnetoOne: false, OneToMany: false, ManyToOne: false, Index: false };
      this.reltables = [];
      this.entitygenerator(index);
      this.apigenerator(index, schemas[index].name, schemas[index].mastersecurity, schemas[index].filesupload);
      this.generatemodules(index, schemas[index].name, schemas[index].mastersecurity, schemas[index].filesupload);
    }
    this.generateloginmodule()
    this.addgenrartinline('end generating schemas ...');
  }

  generateloginmodule(): boolean {
    this.addgenrartinline('begin generating login module ...');
    let mastersec: any;
    mastersec = this.configservice.getschemamastersecurity();
    if (mastersec === undefined) {
      this.addgenrartinline(`No schema master security fail in login module.`);
      return false;
    }
    this.addgenrartinline(`begin generating module login for ${mastersec.name} ...`);
    this.filegenerating = "import { Module, forwardRef } from '@nestjs/common';\n"
    this.filegenerating += "import { JwtModule } from '@nestjs/jwt';\n"
    this.filegenerating += "import { TypeOrmModule } from '@nestjs/typeorm';\n"
    this.filegenerating += "import * as winston from 'winston';\n"
    this.filegenerating += "import { WinstonModule } from 'nest-winston';\n"
    this.filegenerating += `import { ${mastersec.name}Service } from '../service/${mastersec.name}.service';\n`;
    this.filegenerating += `import { ${mastersec.name} } from '../entitys/${mastersec.name}.entity';\n`;
    this.filegenerating += `import { ${mastersec.name}Module } from '../module/${mastersec.name}.module';\n`;
    this.importrelationentity(this.configservice.getschemaid(mastersec.name) - 1);
    this.filegenerating += `import { LoginController } from '../controller/Login.controller';\n`;
    this.filegenerating += "@Module({\n";
    this.filegenerating += `imports: [forwardRef(()=>${mastersec.name}Module),TypeOrmModule.forFeature([${mastersec.name} ${this.relationsname(mastersec.name)}]),\n`;
    this.filegenerating += `JwtModule.register({  secret: '${this.configservice.config.jwtsk}' }),\n`;
    this.generatewinston();
    this.filegenerating += `providers:[],\n`;
    this.filegenerating += `controllers:[LoginController]})\n`;
    this.filegenerating += `export class LoginModule{}`;
    const args = { path: this.config.filePath, name: 'Login', file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('savemodule', args);
    this.addgenrartinlinefile(end);
    this.addgenrartinline('end generating login module ...');
    return true;
  }

  generatemodules(index: number, schema: string, mastersecurity: boolean, filesupload: boolean): boolean {
    console.log('master security', mastersecurity);
    let mastersec: any;
    this.addgenrartinline(`begin generating module ${schema} ...`);
    mastersec = this.configservice.getschemamastersecurity();
    if (mastersec === undefined) {
      this.addgenrartinline(`No schema master security.`);
      return false;
    }
    this.filegenerating = "import { Module ,forwardRef} from '@nestjs/common';\n";
    this.filegenerating += "import { JwtModule } from '@nestjs/jwt';\n";
    this.filegenerating += "import { TypeOrmModule } from '@nestjs/typeorm';\n";
    this.filegenerating += "import * as winston from 'winston';\n";
    this.filegenerating += "import { WinstonModule } from 'nest-winston';\n";
    this.filegenerating += `import { ${schema}Service } from '../service/${schema}.service'\n`;
    this.filegenerating += `import { ${schema}Controller } from '../controller/${schema}.controller';\n`;
    this.filegenerating += `import { ${schema} } from '../entitys/${schema}.entity';\n`;
    this.importrelationservicemodules(index);
    this.importrelationentity(index);
    if (mastersecurity === false) {
      this.filegenerating += `import { ${mastersec.name}Service } from '../service/${mastersec.name}.service'\n`;
      this.filegenerating += `import { ${mastersec.name}Controller } from '../controller/${mastersec.name}.controller';\n`;
      this.filegenerating += `import { ${mastersec.name}Module } from '../module/${mastersec.name}.module';\n`;
      this.filegenerating += `import { ${mastersec.name} } from '../entitys/${mastersec.name}.entity';\n`;
    }
    this.filegenerating += '@Module({\n';
    this.filegenerating += `imports:[`;
    this.filegenerating += this.modulesservicerelation(index);
    if (mastersecurity === false) {
      this.filegenerating += `forwardRef(() =>${mastersec.name}Module),`;
    }
    this.filegenerating += `TypeOrmModule.forFeature([${schema}`;
    this.filegenerating += this.relationstables(index);
    if (mastersecurity === false) {
      this.filegenerating += `,${mastersec.name}`;
    }
    this.filegenerating += `]),\n`;
    this.filegenerating += `JwtModule.register({  secret: '${this.configservice.config.jwtsk}' }),\n`;
    this.generatewinston();
    this.filegenerating += 'providers:';
    this.filegenerating += `[${schema}Service`;
    this.filegenerating += `],\n`;
    this.filegenerating += 'controllers:'
    this.filegenerating += `[${schema}Controller`;
    if (mastersecurity === false) {
      this.filegenerating += `,${mastersec.name}Controller`;
    }
    this.filegenerating += `],\n`;
    this.filegenerating += `exports:[${schema}Service]`;
    this.filegenerating += `\n})\n`;
    this.filegenerating += `export class ${schema}Module{}`;
    const args = { path: this.config.filePath, name: schema, file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('savemodule', args);
    this.addgenrartinlinefile(end);
    this.addgenrartinline('end generating module ...');
    return (true);
  }

  modulesservicerelation(index: number): string {
    let ret = ''
    let modulearray: string[] = [];
    const mastersec = this.configservice.getsecurity().table
    const relations: Relations = this.config.schemas[index].schemarelations;
    if (relations.OnetoOne !== undefined) {
      relations.OnetoOne.forEach(element => {
        if (element.table !== mastersec) {
          if (modulearray.find(item => item === element.table) === undefined) {
            modulearray.push(element.table);
          }
        }
      });
    }
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        if (element.table !== mastersec) {
          if (modulearray.find(item => item === element.table) === undefined) {
            modulearray.push(element.table);
          }
        }
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        if (element.table !== mastersec) {
          if (modulearray.find(item => item === element.table) === undefined) {
            modulearray.push(element.table);
          }
        }
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        if (element.table !== mastersec) {
          if (modulearray.find(item => item === element.table) === undefined) {
            modulearray.push(element.table);
          }
        }
      });
    }
    modulearray.forEach((element, index) => {
      if (index === 0) {
        ret += `forwardRef(()=>${element}Module)`;
      } else {
        ret += `, forwardRef(()=>${element}Module)`;
      }
    });
    if (ret !== '') ret += ','
    return ret;
  }


  generatewinston() {
    const sec = this.configservice.config.logger;
    this.filegenerating += 'WinstonModule.forRoot({transports: [\n';
    if (sec.type === 0 || sec.type === 2) {
      this.filegenerating += `new winston.transports.File({ format:winston.format.simple(), level: 'info', filename:'${sec.file}', maxsize:${sec.maxsize}}),\n`;
    }
    if (sec.type === 1 || sec.type === 2) {
      this.filegenerating += `new winston.transports.Console({format: winston.format.combine(winston.format.colorize({all:true}),winston.format.simple()), level:'info' }),\n`;
    }
    if (sec.typewarn === 0 || sec.typewarn === 2) {
      this.filegenerating += `new winston.transports.File({ format:winston.format.simple(), level: 'warn', filename:'${sec.filewarn}', maxsize:${sec.maxsizewarn}}),\n`;
    }
    if (sec.typewarn === 1 || sec.typewarn === 2) {
      this.filegenerating += `new winston.transports.Console({format: winston.format.combine(winston.format.colorize({all:true}),winston.format.simple()), level:'warn' }),\n`;
    }
    if (sec.typeerror === 0 || sec.typeerror === 2) {
      this.filegenerating += `new winston.transports.File({ format:winston.format.simple(), level: 'error', filename:'${sec.fileerror}', maxsize:${sec.maxsizeerror}}),\n`;
    }
    if (sec.typeerror === 1 || sec.typeerror === 2) {
      this.filegenerating += `new winston.transports.Console({format: winston.format.combine(winston.format.colorize({all:true}),winston.format.simple()), level:'error' })\n`;
    }
    this.filegenerating += `]})],\n`;
  }
  // generando api
  multerutilgenerator(index: number, elementpath: string, extfiles: string) {
    this.addgenrartinline('Begin generate multer util ... ');
    console.log('ext files', extfiles);
    const filename = 'file-upload' + elementpath;
    let filegenerating = "import { extname } from 'path';\n";
    filegenerating += "import { HttpException, HttpStatus } from '@nestjs/common';";
    filegenerating += `export const FileFilter${elementpath} = (req, file, callback) => {\n`;
    let exfilest = extfiles.trim();
    exfilest = exfilest.replace(/ /g, "|");
    filegenerating += `if (!file.originalname.match(/\.(${exfilest})$/)) {\n`;
    filegenerating += 'return callback(\n';
    filegenerating += 'new HttpException(\n';
    filegenerating += ` 'Only type ${extfiles} files are allowed!',\n`;
    filegenerating += 'HttpStatus.BAD_REQUEST,\n';
    filegenerating += '),\n';
    filegenerating += 'false,\n';
    filegenerating += ');\n';
    filegenerating += '}\n';
    filegenerating += 'callback(null, true);\n';
    filegenerating += `};\n`;
    filegenerating += `export const editFileName${elementpath} = (req, file, callback) => {\n`;
    filegenerating += `const name = file.originalname.split('.')[0];\n`;
    filegenerating += `const fileExtName = extname(file.originalname);\n`;
    filegenerating += 'const randomName = Array(4)\n';
    filegenerating += '.fill(null)\n';
    filegenerating += '.map(() => Math.round(Math.random() * 10).toString(10))\n';
    filegenerating += `.join('');\n`;
    filegenerating += 'callback(null, `${name}${randomName}${fileExtName}`);';
    filegenerating += '};\n'
    const args = { path: this.config.filePath, name: filename, file: filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('saveutilmuter', args);
    this.addgenrartinlinefile(end);
    this.addgenrartinline('End generate multer util... ');
  }
  apigenerator(index: number, schema: string, mastersecurity: boolean, filesupload: boolean) {
    const schemalower = schema.toLowerCase();
    this.addgenrartinline('Begin generate Api... ');
    this.addgenrartinline('Begin generate controller... ');
    this.filegenerating = "import { Controller, Inject,Post, Body, Get, Put, Delete,Param,UseGuards,Headers, SetMetadata,Query,Patch";
    if (filesupload === true) {
      this.filegenerating += ', UseInterceptors, UploadedFile, UploadedFiles, Res, HttpStatus';
    }
    this.filegenerating += ' } from "@nestjs/common";\n';
    if (filesupload === true) {
      this.filegenerating += "import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';\n";
      this.filegenerating += "import { diskStorage } from 'multer';\n";
      for (let ind = 0; ind < this.config.schemas[index].schemasapi.length; ind++) {
        const element = this.config.schemas[index].schemasapi[ind];
        if (element.type === 'uploadfile') {
          this.filegenerating += `import { editFileName${element.path}, FileFilter${element.path} } from '../controller/file-upload${element.path}.utils';`
          this.multerutilgenerator(index, element.path, element.extfiles)
        }
        if (element.type === 'uploadfiles') {
          this.filegenerating += `import { editFileName${element.path}, FileFilter${element.path} } from '../controller/file-upload${element.path}.utils';`
          this.multerutilgenerator(index, element.path, element.extfiles)
        }
      }
    }
    this.filegenerating += `import { ${this.config.schemas[index].name} } from '../entitys/${this.config.schemas[index].name}.entity';\n`;
    this.importrelationentity(index);
    if (this.config.schemas[index].security === true) {
      this.filegenerating += `import {${this.config.schemas[index].classsecurity} } from '../roles/roles.guard';\n`;
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
      const element: Api = this.config.schemas[index].schemasapi[ind];
      switch (element.type) {
        case 'getfile':
          this.addgenrartinline('\tadding getfile file');
          this.filegenerating += `@Get('${element.path}/:filename')\n`;
          this.generatesecurity(element);
          this.filegenerating += `getImage(@Param('filename') image, @Res() res) {\n`;
          this.filegenerating += `const response = res.sendFile(image, { root: './uploads' });\n`;
          this.filegenerating += 'return {\n';
          this.filegenerating += 'status: HttpStatus.OK,\n';
          this.filegenerating += 'data: response,\n';
          this.filegenerating += '};\n';
          this.filegenerating += '}\n';
          break;
        case 'uploadfile':
          this.addgenrartinline('\tadding upload file');
          this.filegenerating += `@Post('${element.path}')\n`;
          this.generatesecurity(element);
          this.filegenerating += ` @UseInterceptors(\n`;
          this.filegenerating += `FileInterceptor('file', {\n`;
          this.filegenerating += `storage: diskStorage({\n`;
          this.filegenerating += `destination: './uploads',\n`;
          this.filegenerating += `filename: editFileName${element.path},\n`;
          this.filegenerating += '}),\n';
          this.filegenerating += `fileFilter: FileFilter${element.path},\n`;
          this.filegenerating += '}),\n';
          this.filegenerating += ')\n';
          this.filegenerating += `async uploadedFile${element.path}(@UploadedFile() file) {\n`;
          this.filegenerating += `  const response = {\n`;
          this.filegenerating += `    originalname: file.originalname,\n`;
          this.filegenerating += `    filename: file.filename,\n`;
          this.filegenerating += `};\n`;
          this.filegenerating += `return {\n`;
          this.filegenerating += ' status: HttpStatus.OK,\n';
          this.filegenerating += " message: 'File uploaded successfully!',\n";
          this.filegenerating += ' data: response,\n';
          this.filegenerating += '};\n';
          this.filegenerating += "}\n"
          break;
        case 'uploadfiles':
          this.addgenrartinline('\tadding upload files');
          this.filegenerating += `@Post('${element.path}')\n`;
          this.generatesecurity(element);
          this.filegenerating += ' @UseInterceptors(\n';
          this.filegenerating += "FilesInterceptor('files', 10, {\n";
          this.filegenerating += 'storage: diskStorage({\n',
            this.filegenerating += "destination: './uploads',\n";
          this.filegenerating += `filename: editFileName${element.path},\n`;
          this.filegenerating += '}),\n';
          this.filegenerating += `fileFilter: FileFilter${element.path},`;
          this.filegenerating += '}),\n';
          this.filegenerating += ')\n';
          this.filegenerating += 'async uploadMultipleFiles(@UploadedFiles() files) {\n';
          this.filegenerating += 'const response = [];\n';
          this.filegenerating += 'files.forEach(file => {\n';
          this.filegenerating += 'const fileReponse = {\n';
          this.filegenerating += 'originalname: file.originalname,\n';
          this.filegenerating += 'filename: file.filename,\n';
          this.filegenerating += '};\n';
          this.filegenerating += 'response.push(fileReponse);\n';
          this.filegenerating += '});\n';
          this.filegenerating += 'return {\n';
          this.filegenerating += 'status: HttpStatus.OK,\n';
          this.filegenerating += "message: 'Files uploaded successfully!',\n";
          this.filegenerating += 'data: response,\n';
          this.filegenerating += `};\n`;
          this.filegenerating += '}\n';
          break;
        case 'changepassword':
          this.addgenrartinline('\tadding put changepassword');
          this.filegenerating += `@Put('changepassword/:login/:password')\n`;
          this.generatesecurity(element);
          this.filegenerating += `changepassword(@Param() params) {\n`;
          this.filegenerating += `\t return this.service.changepassword(decodeURI(params.login),decodeURI(params.password));\n`;
          this.filegenerating += `}\n`;
          break;
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
              this.filegenerating += `@Get('getone/:id')\n`;
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
              this.addgenrartinline(`\tadding verb get skiplimit order by field ${element.field}`);
              this.filegenerating += `@Get('skiplimitorder${element.field}/:skip/:limit/:order')\n`;
              this.generatesecurity(element);
              this.filegenerating += `getskiplimitorder${element.field} (@Param('skip') skip:number,@Param('limit') limit:number,@Param('order') order:string)`;
              this.filegenerating += '{\n';
              this.filegenerating += `\t return this.service.skiplimit${element.field}(skip,limit,order);\n`;
              this.filegenerating += '}\n';
              break;
            case 'skiplimitfilter':
              this.addgenrartinline(`\tadding verb get skiplimit filter by field ${element.field}`);
              this.filegenerating += `@Get('skiplimitfilter${element.field}/:skip/:limit/:order/:${element.field}')\n`;
              this.generatesecurity(element);
              this.filegenerating += `skiplimitfilter${element.field} (@Param('skip') skip:number,@Param('limit') limit:number,@Param('order') order:string,@Param('${element.field}') ${element.field}:string ) {\n`;
              this.filegenerating += `\t return this.service.skiplimitfilter${element.field}(skip,limit,order,${element.field});\n`;
              this.filegenerating += '}\n';
              break;
            case 'count':
              this.addgenrartinline('\tadding count');
              this.filegenerating += `@Get('count')\n`;
              this.generatesecurity(element);
              this.filegenerating += 'count(){\n';
              this.filegenerating += '\t return this.service.getCount();\n'
              this.filegenerating += '}\n';
              break;
            case 'findandcount':
              this.addgenrartinline('\tadding findandcount');
              this.filegenerating += `@Get('findandcount')\n`;
              this.generatesecurity(element);
              this.filegenerating += 'findandcount(){\n';
              this.filegenerating += '\t return this.service.getfindandcount();\n'
              this.filegenerating += '}\n';
              break;
            case 'findandcountwithoptions':
              this.addgenrartinline(`\tadding find and count with options ${element.path}`);
              this.filegenerating += `@Get('findandcountwithoptions${element.path}/:options')\n`;
              this.generatesecurity(element);
              this.filegenerating += `findandcountwithoptions${element.path}(@Param('options') options:string){\n`;
              this.filegenerating += `\t return this.service.getfindandcountwithoptions${element.path}(options);\n`
              this.filegenerating += '}\n';
              break;
            case 'findwithoptions':
              this.addgenrartinline(`\tadding find with options ${element.path}`);
              this.filegenerating += `@Get('findwithoptions${element.path}/:options')\n`;
              this.generatesecurity(element);
              this.filegenerating += `findwithoptions${element.path}(@Param('options') options:string){\n`;
              this.filegenerating += `\t return this.service.getfindwithoptions${element.path}(options);\n`
              this.filegenerating += '}\n';
              break;
            case 'findgenerated':
              {
                this.addgenrartinline(`adding find generated ${element.path}`);
                this.filegenerating += `@Get('findgenerated${element.path}`;
                element.parameters.forEach(elempar => {
                  this.filegenerating += `/:${elempar.name}`;
                });
                this.filegenerating += `')\n`;
                this.generatesecurity(element);
                this.filegenerating += `findgenerated${element.path}(`;
                element.parameters.forEach((elempar, index) => {
                  if (index === 0) {
                    this.filegenerating += `@Param('${elempar.name}') `;
                    this.filegenerating += ` ${elempar.name}`;
                    this.filegenerating += (elempar.type === "string" || elempar.type === 'date' || elempar.type === 'arraystring') ? ':string' : ':number';
                  } else {
                    this.filegenerating += `,@Param('${elempar.name}')`;
                    this.filegenerating += ` ${elempar.name}`;
                    this.filegenerating += (elempar.type === "string" || elempar.type === 'date' || elempar.type === 'arraystring') ? ':string' : ':number';
                  }
                });
                this.filegenerating += ` ){\n`;
                this.filegenerating += `\t return this.service.getfindgenerated${element.path}(`;
                element.parameters.forEach((elemepar, index) => {
                  if (index === 0) {
                    this.filegenerating += `${elemepar.name}`;
                  }
                  else {
                    this.filegenerating += `,${elemepar.name}`;
                  }
                });
                this.filegenerating += ');\n';
                this.filegenerating += '}\n';
              }
              break;
            case 'findandcountgenerated':
              {
                this.addgenrartinline(`adding find and count generated ${element.path}`);
                this.filegenerating += `@Get('findandcountgenerated${element.path}`;
                element.parameters.forEach(elempar => {
                  this.filegenerating += `/:${elempar.name}`;
                });
                this.filegenerating += `')\n`;
                this.generatesecurity(element);
                this.filegenerating += `findandcountgenerated${element.path}(`;
                element.parameters.forEach((elempar, index) => {
                  if (index === 0) {
                    this.filegenerating += `@Param('${elempar.name}') `;
                    this.filegenerating += ` ${elempar.name}`;
                    this.filegenerating += (elempar.type === "string" || elempar.type === 'date' || elempar.type === 'arraystring') ? ':string' : ':number';
                  } else {
                    this.filegenerating += `,@Param('${elempar.name}')`;
                    this.filegenerating += ` ${elempar.name}`;
                    this.filegenerating += (elempar.type === "string" || elempar.type === 'date' || elempar.type === 'arraystring') ? ':string' : ':number';
                  }
                });
                this.filegenerating += ` ){\n`;
                this.filegenerating += `\t return this.service.getfindandcountgenerated${element.path}(`;
                element.parameters.forEach((elemepar, index) => {
                  if (index === 0) {
                    this.filegenerating += `${elemepar.name}`;
                  }
                  else {
                    this.filegenerating += `,${elemepar.name}`;
                  }
                });
                this.filegenerating += ');\n';
                this.filegenerating += '}\n';
              }
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
        case 'patch':
          this.addgenrartinline('\tadding patch');
          this.filegenerating += `@Patch('/:id')\n`;
          this.generatesecurity(element);
          this.filegenerating += `patch(@Param() params,@Body() patchbody:any)`;
          this.filegenerating += `{\n\t return this.service.patch(+params.id,patchbody);\n}\n`;
          break;
        case 'postonetoone':
          {
            this.addgenrartinline('\tadding postonetoone');
            this.filegenerating += `@Post('${element.path}/:id')\n`;
            this.generatesecurity(element);
            this.filegenerating += `post${element.path}(@Param('id') id: number,@Body() reg: any) {\n`;
            this.filegenerating += `\t return this.service.post${element.field}(id,reg);\n`;
            this.filegenerating += `}\n`;
          }
          break;
        case 'postonetomany': {
          this.addgenrartinline('\tadding postonetomany');
          this.filegenerating += `@Post('${element.path}/:id')\n`;
          const relations: Relations = this.configservice.getrelations(this.configservice.getschemawithname(schema));
          const onetomany = relations.Onetomany.find(elementotm => elementotm.relationname = element.field);
          this.generatesecurity(element);
          this.filegenerating += `post${element.path}(@Param('id') id: number,@Body() reg: ${onetomany.table}) {\n`;
          this.filegenerating += `\t return this.service.post${element.field}(id,reg);\n`;
          this.filegenerating += `}\n`;
        }
          break;
        case 'postmanytomany': {
          this.addgenrartinline('\tadding postmanytomany');
          this.filegenerating += `@Post('${element.path}/:id')\n`;
          const relations: Relations = this.configservice.getrelations(this.configservice.getschemawithname(schema));
          const manytomany = relations.Manytomany.find(elementotm => elementotm.relationname = element.field);
          this.generatesecurity(element);
          this.filegenerating += `post${element.path}(@Param('id') id: number,@Body() reg: ${manytomany.table}) {\n`;
          this.filegenerating += `\t return this.service.post${element.field}(id,reg);\n`;
          this.filegenerating += `}\n`;
        }
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
    this.servicegenerator(index, schema, mastersecurity);
    this.addgenrartinline('End generate service... ');
    this.addgenrartinline('End generate Api ... ');
  }

  // generando seguridad
  generatesecurity(element: any) {
    if (element.security !== undefined && element.security !== false) {
      const array = element.roles.split(' ');
      const strarray = JSON.stringify(array);
      this.filegenerating += `@SetMetadata('roles', ${strarray})\n`;
    }

  }

  relationsname(table: string): string {
    return this.relationstables(this.configservice.getschemaid(table) - 1);
  }

  relationstables(index): string {
    let ret = ''
    let modulearray: string[] = [];
    const mastersec = this.configservice.getsecurity().table
    const relations: Relations = this.config.schemas[index].schemarelations;
    if (relations.OnetoOne !== undefined) {
      relations.OnetoOne.forEach(element => {
        if (element.table !== mastersec) {
          if (modulearray.find(item => item === element.table) === undefined) {
            modulearray.push(element.table);
          }
        }
      });
    }
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        if (element.table !== mastersec) {
          if (modulearray.find(item => item === element.table) === undefined) {
            modulearray.push(element.table);
          }
        }
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        if (element.table !== mastersec) {
          if (modulearray.find(item => item === element.table) === undefined) {
            modulearray.push(element.table);
          }
        }
      });
    }
    modulearray.forEach(element => {
      ret += `, ${element}`;
    });
    return ret;
  }
  importservicerelations(index: number): string {
    let ret = ''
    let repositoryarray: string[] = [];
    const relations: Relations = this.config.schemas[index].schemarelations;
    if (relations.OnetoOne !== undefined) {
      relations.OnetoOne.forEach(element => {
        if (repositoryarray.find(item => item === element.table) === undefined) {
          repositoryarray.push(element.table);
        }
      });
    }
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        if (repositoryarray.find(item => item === element.table) === undefined) {
          repositoryarray.push(element.table);
        }
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        if (repositoryarray.find(item => item === element.table) === undefined) {
          repositoryarray.push(element.table);
        }
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        if (repositoryarray.find(item => item === element.table) === undefined) {
          repositoryarray.push(element.table);
        }
      });
    }
    repositoryarray.forEach(element => {
      ret += `,  @Inject(forwardRef(() => ${element}Service)) private ${element.toLocaleLowerCase()}Service: ${element}Service`;
    });
    return ret;
  }

  importrelationentity(index: number) {
    let relationsarray: string[] = [];
    const mastersec = this.configservice.getsecurity().table;
    const relations: Relations = this.config.schemas[index].schemarelations;
    if (relations.OnetoOne !== undefined) {
      relations.OnetoOne.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          if (element.table !== mastersec) {
            relationsarray.push(element.table);
          }
        }
      });
    }
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          if (element.table !== mastersec) {
            relationsarray.push(element.table);
          }
        }
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          if (element.table !== mastersec) {
            relationsarray.push(element.table);
          }
        }
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          if (element.table !== mastersec) {
            relationsarray.push(element.table);
          }
        }
      });
    }
    relationsarray.forEach(table => {
      this.filegenerating += `import { ${table} } from '../entitys/${table}.entity';\n`;
    });
  }
  importrelationservicemodules(index: number) {
    let relationsarray: string[] = [];
    const relations: Relations = this.config.schemas[index].schemarelations;
    const mastersec = this.configservice.getsecurity().table;
    if (relations.OnetoOne !== undefined) {
      relations.OnetoOne.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          if (mastersec !== element.table) {
            relationsarray.push(element.table);
          }
        }
      });
    }
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          if (mastersec !== element.table) {
            relationsarray.push(element.table);
          }
        }
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          if (mastersec !== element.table) {
            relationsarray.push(element.table);
          }
        }
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          if (mastersec !== element.table) {
            relationsarray.push(element.table);
          }
        }
      });
    }
    relationsarray.forEach(table => {
      this.filegenerating += `import { ${table}Service } from '../service/${table}.service';\n`;
      this.filegenerating += `import { ${table}Module } from '../module/${table}.module';\n`;
    });
  }
  importrelationservice(index: number) {
    let relationsarray: string[] = [];
    const relations: Relations = this.config.schemas[index].schemarelations;
    const mastersec = this.configservice.getsecurity().table;
    if (relations.OnetoOne !== undefined) {
      relations.OnetoOne.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          relationsarray.push(element.table);
        }
      });
    }
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          relationsarray.push(element.table);
        }
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          relationsarray.push(element.table);
        }
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        if (relationsarray.find(item => item === element.table) === undefined) {
          relationsarray.push(element.table);
        }
      });
    }
    relationsarray.forEach(table => {
      this.filegenerating += `import { ${table}Service } from '../service/${table}.service';\n`;
    });
  }
  manytomanyservice(schema: string): string {
    const schemas = this.configservice.getschema();
    const schemalower = schema.toLocaleLowerCase();
    let ret: string = '';
    schemas.forEach(element => {
      if (element.name !== schema) {
        const relations = this.configservice.getrelations(element.id);
        if (relations.Manytomany !== undefined) {
          relations.Manytomany.forEach(relmanytomany => {
            if (relmanytomany.table === schema) {
              ret += `async createmanytomany${element.name}(${schemalower}: any ): Promise<${schema}> {\n`;
              ret += `\t return await this.${schema}Repository.save(${schemalower});\n`;
              ret += `}\n`;
            }
          });
        }
      }
    });
    return ret;
  }
  onetomanyservice(schema: string): string {
    const schemas = this.configservice.getschema();
    const schemalower = schema.toLocaleLowerCase();
    let ret: string = '';
    schemas.forEach(element => {
      if (element.name !== schema) {
        const relations = this.configservice.getrelations(element.id);
        if (relations.Onetomany !== undefined) {
          relations.Onetomany.forEach(relonetomany => {
            if (relonetomany.table === schema) {
              ret += `async createonetomany${element.name}(${schemalower}: any ): Promise<${schema}> {\n`;
              ret += `\t return await this.${schema}Repository.save(${schemalower});\n`;
              ret += `}\n`;
            }
          });
        }
      }
    });
    return ret;
  }
  onetooneservice(schema: string): string {
    const schemas = this.configservice.getschema();
    const schemalower = schema.toLocaleLowerCase();
    let ret: string = '';
    schemas.forEach(element => {
      if (element.name !== schema) {
        const relations = this.configservice.getrelations(element.id);
        if (relations.OnetoOne !== undefined) {
          relations.OnetoOne.forEach(relonetoone => {
            if (relonetoone.table === schema) {
              ret += `async createonetoone${element.name}(${schemalower}: any ): Promise<${schema}> {\n`;
              ret += `\t return await this.${schema}Repository.save(${schemalower});\n`;
              ret += `}\n`;
            }
          });
        }
      }
    });
    return ret;
  }
  //generando servicio
  servicegenerator(index: number, schema: string, mastersecurity: boolean) {
    let options = "";
    const schemalower = schema.toLowerCase();
    const sec = this.configservice.getsecurity();
    this.filegenerating = '';
    this.filegenerating += `import { Injectable, Inject, UseGuards, forwardRef } from '@nestjs/common';\n`;
    this.filegenerating += `import { InjectRepository } from '@nestjs/typeorm';\n`;
    this.filegenerating += `import { Repository, Not, MoreThanOrEqual, MoreThan, Equal, Like, ILike, Between, LessThan ,In, Any, IsNull, Raw } from 'typeorm';\n`;
    this.filegenerating += `import * as bcrypt from 'bcrypt';\n`;
    this.filegenerating += `import { ${this.config.schemas[index].name} } from '../entitys/${this.config.schemas[index].name}.entity';\n`;
    this.importrelationservice(index);
    this.importrelationentity(index);
    this.filegenerating += `@Injectable()\n`;
    this.filegenerating += `export class ${schema}Service {\n`;
    this.filegenerating += `constructor(@InjectRepository(${schema}) private ${schema}Repository: Repository<${schema}> ${this.importservicerelations(index)}) { }\n`;
    // tslint:disable-next-line: prefer-for-of
    if (mastersecurity === true) {
      this.filegenerating += '// get for security\n';
      this.addgenrartinline('\tadding predicate in service for security');
      this.filegenerating += `async getlogin(${sec.login}: string): Promise<${schema}> {\n`;
      this.filegenerating += `\t return await this.${schema}Repository.findOne({`;
      this.filegenerating += `where: [{ "${sec.login}": ${sec.login} }]`;
      this.filegenerating += `});\n`;
      this.filegenerating += `}\n`;
      this.filegenerating += '// get for security\n';
    }
    this.filegenerating += this.onetooneservice(schema);
    this.filegenerating += this.onetomanyservice(schema);
    this.filegenerating += this.manytomanyservice(schema);
    for (let ind = 0; ind < this.config.schemas[index].schemasapi.length; ind++) {
      const relations: Relations = this.config.schemas[index].schemarelations;
      const element: Api = this.config.schemas[index].schemasapi[ind];
      switch (element.type) {
        case 'changepassword':
          this.addgenrartinline('\tadding service change password');
          this.filegenerating += `async changepassword(${sec.login}: string, newpassword:string): Promise<${schema}> {\n`;
          this.filegenerating += `let reponse: Promise<${schema}>;\n`;
          this.filegenerating += `\t await this.${schema}Repository.findOne({`;
          this.filegenerating += `where: [{ "${sec.login}": ${sec.login} }]`;
          this.filegenerating += `}).then(rep =>{ rep.${sec.password}=bcrypt.hashSync(newpassword,5);\n`;
          this.filegenerating += `reponse=this.${schema}Repository.save(rep);\n`
          this.filegenerating += `});\n`;
          this.filegenerating += 'return reponse;\n';
          this.filegenerating += `}\n`;
          this.addgenrartinline('\tend service to change password');
          break;
        case 'get':
          switch (element.operation) {
            case 'findandcountgenerated':
              options = element.options;
              this.addgenrartinline('\tadding find and count generated');
              this.filegenerating += `async getfindandcountgenerated${element.path}( `
              element.parameters.forEach((elementpar, index) => {
                if (index === 0) {
                  this.filegenerating += elementpar.name;
                  this.filegenerating += (elementpar.type === 'string' || elementpar.type === 'date' || elementpar.type === 'arraystring') ? ':string' : ':number';
                } else {
                  this.filegenerating += ', ' + elementpar.name;
                  this.filegenerating += (elementpar.type === 'string' || elementpar.type === 'date' || elementpar.type === 'arraystring') ? ':string' : ':number';
                }
              });
              this.filegenerating += `):Promise<any[]> {\n`;
              element.parameters.forEach((elementpar, index) => {
                if (elementpar.type === 'arraystring') {
                  this.filegenerating += `const arraystring${elementpar.name}:string[]=${elementpar.name}.split(',');\n`;
                  const regex = new RegExp(elementpar.name, 'g');
                  options = options.replace(regex, 'arraystring' + elementpar.name);
                }
              });
              this.filegenerating += `\treturn await this.${schema}Repository.findAndCount(${options});\n`;
              this.filegenerating += `}\n`;
              break;
            case 'findgenerated':
              options = element.options;
              this.addgenrartinline('\tadding find generated');
              this.filegenerating += `async getfindgenerated${element.path}( `
              element.parameters.forEach((elementpar, index) => {
                if (index === 0) {
                  this.filegenerating += elementpar.name;
                  this.filegenerating += (elementpar.type === 'string' || elementpar.type === 'date' || elementpar.type === 'arraystring') ? ':string' : ':number';
                } else {
                  this.filegenerating += ', ' + elementpar.name;
                  this.filegenerating += (elementpar.type === 'string' || elementpar.type === 'date' || elementpar.type === 'arraystring') ? ':string' : ':number';
                }
              });
              this.filegenerating += `):Promise<any[]> {\n`;
              element.parameters.forEach((elementpar, index) => {
                if (elementpar.type === 'arraystring') {
                  this.filegenerating += `const arraystring${elementpar.name}:string[]=${elementpar.name}.split(',');\n`;
                  const regex = new RegExp(elementpar.name, 'g');
                  options = options.replace(regex, 'arraystring' + elementpar.name);
                }
              });
              this.filegenerating += `\treturn await this.${schema}Repository.find(${options});\n`;
              this.filegenerating += `}\n`;
              break;
            case 'findwithoptions':
              this.addgenrartinline('\tadding find  with options');
              this.filegenerating += `async getfindwithoptions${element.path}(options:string): Promise<any[]> {\n`;
              this.filegenerating += `\treturn await this.${schema}Repository.find(JSON.parse(decodeURI(options)));\n`;
              this.filegenerating += `}\n`;
              break;
            case 'findandcountwithoptions':
              this.addgenrartinline('\tadding find and count with options');
              this.filegenerating += `async getfindandcountwithoptions${element.path}(options:string): Promise<[any,number]> {\n`;
              this.filegenerating += `\treturn await this.${schema}Repository.findAndCount(JSON.parse(decodeURI(options)));\n`;
              this.filegenerating += `}\n`;
              break;
            case 'findandcount':
              this.addgenrartinline('\tadding find and count');
              this.filegenerating += `async getfindandcount(): Promise<[${schema}[],number]> {\n`;
              this.filegenerating += `\treturn await this.${schema}Repository.findAndCount();\n`;
              this.filegenerating += `}\n`;
              break;
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
              this.filegenerating += `\treturn await this.${schema}Repository.createQueryBuilder("${schema}").orderBy('${element.field}', 'ASC').offset(skip).limit(limit).where("${schema}.${element.field} like :${element.field}",{ ${element.field}: ${element.field}+'%'}).getMany();\n`;
              this.filegenerating += `} else {\n`;
              this.filegenerating += `\treturn await this.${schema}Repository.createQueryBuilder("${schema}").orderBy('${element.field}', 'DESC').offset(skip).limit(limit).where("${schema}.${element.field} like :${element.field}",{ ${element.field}: ${element.field}+'%'}).getMany();\n`;
              this.filegenerating += `}\n}\n`;
              break;
            case 'count':
              this.addgenrartinline('\tadding service get count');
              this.filegenerating += `async getCount(): Promise<number> {\n`;
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
          if (mastersecurity === true) {
            this.filegenerating += `${schemalower}.${sec.password}=bcrypt.hashSync(${schemalower}.${sec.password},5);\n`;
          }
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
        case 'patch':
          this.addgenrartinline('\tadding patch service');
          this.filegenerating += `async patch(_id: number,patchbody:any) {\n`;
          this.filegenerating += `return await this.${schema}Repository.createQueryBuilder().update(${schema}).set(patchbody).where("id = :id", { id:_id }).execute();`;
          this.filegenerating += '}\n';
          break;
        case 'postonetoone':
          this.addgenrartinline('\tadding postonetoone service');
          this.filegenerating += `async post${element.field}(id:number,reg:any): Promise<any> {\n`;
          this.filegenerating += ` let register:any= await this.${schema}Repository.findOne({where:{'id':id},relations:['${element.field}']})\n`;
          this.createfieldrelationsonetoone(schema, element);
          this.filegenerating += `\t return await this.${schema}Repository.save(register);\n`;
          this.filegenerating += `}\n`;
          break;
        case 'postonetomany': {
          const relations: Relations = this.configservice.getrelations(this.configservice.getschemawithname(schema));
          const onetomany = relations.Onetomany.find(elementotm => elementotm.relationname = element.field);
          const invrelations: Relations = this.configservice.getrelations(this.configservice.getschemawithname(onetomany.table));
          const manytoone = invrelations.Manytoone.find(elementmtoo => elementmtoo.table = schema);
          this.addgenrartinline('\tadding postonetomany service');
          this.filegenerating += `async post${element.field}(id:number,reg:${onetomany.table}): Promise<${onetomany.table}> {\n`;
          this.filegenerating += `let ${onetomany.table.toLowerCase()}:${onetomany.table};\n`;
          this.filegenerating += `const register:any= await this.${schema}Repository.findOne({where:{'id':id}});\n`;
          this.createfieldrelationsonetomany(schema, element, manytoone);
          this.filegenerating += `}\n`;
        }
          break;
        case 'postmanytomany': {
          const relations: Relations = this.configservice.getrelations(this.configservice.getschemawithname(schema));
          const manytomany = relations.Manytomany.find(elementotm => elementotm.relationname = element.field);
          const invrelations: Relations = this.configservice.getrelations(this.configservice.getschemawithname(manytomany.table));
          const rmanytomany = invrelations.Manytomany.find(elementmtoo => elementmtoo.table = schema);
          this.addgenrartinline('\tadding postmanytomany service');
          this.filegenerating += `async post${element.field}(id:number,reg:${manytomany.table}): Promise<${schema}> {\n`;
          this.filegenerating += `\tlet ${manytomany.table.toLowerCase()}:${manytomany.table};\n`;
          this.filegenerating += `\tlet register:${schema}= await this.${schema}Repository.findOne({where:{'id':id},relations:["${manytomany.relationname}"]});\n`;
          this.createfieldrelationsmanytomany(schema, element, rmanytomany);
          this.filegenerating += `\tregister.${manytomany.relationname}.push(save);\n`;
          this.filegenerating += `\treturn await this.${schema}Repository.save(register);\n`;
          this.filegenerating += `}\n`;
        }
          break;
        default:
          break;
      }
    }
    this.filegenerating += `}\n`;
    const args = { path: this.config.filePath, name: schema, file: this.filegenerating, format: this.format };
    const end = this.electronservice.ipcRenderer.sendSync('saveservice', args);
    this.addgenrartinlinefile(end);
  }

  createfieldrelationsmanytomany(schema: string, api: Api, pammanytomany: Manytomany) {
    const relations: Relations = this.configservice.getrelations(this.configservice.getschemawithname(schema));
    const manytomany = relations.Manytomany.find(element => element.relationname = api.field);
    const fieldrelation = this.configservice.getschematable(this.configservice.getschemawithname(manytomany.table));
    this.filegenerating += `${manytomany.table.toLowerCase()} = new ${manytomany.table}();\n`;
    fieldrelation.forEach((element, index) => {
      if (element.name !== 'id') {
        this.filegenerating += `${manytomany.table.toLowerCase()}.${element.name}` + `=reg.${element.name};\n`;
      }
    });
    this.filegenerating += `const save=await this.${manytomany.table.toLocaleLowerCase()}Service.createmanytomany${schema}(${manytomany.table.toLowerCase()});\n`;
  }

  createfieldrelationsonetomany(schema: string, api: Api, mamytoone: Manytoone) {
    const relations: Relations = this.configservice.getrelations(this.configservice.getschemawithname(schema));
    const onetomany = relations.Onetomany.find(element => element.relationname = api.field);
    const fieldrelation = this.configservice.getschematable(this.configservice.getschemawithname(onetomany.table));
    this.filegenerating += `${onetomany.table.toLowerCase()} = new ${onetomany.table}();\n`;
    fieldrelation.forEach((element, index) => {
      if (element.name !== 'id') {
        this.filegenerating += `${onetomany.table.toLowerCase()}.${element.name}` + `=reg.${element.name};\n`;
      }
    });
    this.filegenerating += `${onetomany.table.toLowerCase()}.${mamytoone.relationname}` + `=register;\n`;
    this.filegenerating += `return await this.${onetomany.table.toLocaleLowerCase()}Service.createonetomany${schema}(${onetomany.table.toLowerCase()});\n`;
  }

  createfieldrelationsonetoone(schema: string, api: Api) {
    const relations: Relations = this.configservice.getrelations(this.configservice.getschemawithname(schema));
    const onetoone = relations.OnetoOne.find(element => element.relationname = api.field);
    const fieldrelation = this.configservice.getschematable(this.configservice.getschemawithname(onetoone.table));
    this.filegenerating += `let  ${onetoone.table.toLowerCase()}:${onetoone.table} = new ${onetoone.table}();\n`;
    fieldrelation.forEach((element, index) => {
      if (element.name !== 'id') {
        this.filegenerating += `${onetoone.table.toLowerCase()}.${element.name}` + `=reg.${element.name};\n`;
      }
    });
    this.filegenerating += `await this.${onetoone.table.toLocaleLowerCase()}Service.createonetoone${schema}(${onetoone.table.toLowerCase()});\n`;
    this.filegenerating += `register.${onetoone.relationname}=${onetoone.table.toLowerCase()};\n`;
  }

  entitygenerator(ind: number) {
    this.addgenrartinline('Entity generator ... ');
    const fields = this.config.schemas[ind].schemastable;
    const relations = this.config.schemas[ind].schemarelations;
    this.filegenerating = "";
    if (relations !== undefined) {
      this.addrelationsentity(relations);
    }
    // tslint:disable-next-line: quotemark
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
    this.generaterelationbody(relations, this.config.schemas[ind].name);
    this.addgenrartinline('\t adding extra fields ...\n');
    this.filegenerating += this.config.schemas[ind].fields + '\n';
    this.filegenerating += '}\n';
    this.filegenerating = this.generateimports(relations) + this.filegenerating;
    this.addgenrartinline('saving entity');
    const args = { path: this.config.filePath, name: this.config.schemas[ind].name, file: this.filegenerating, format: this.format };
    const end = this.electronservice.ipcRenderer.sendSync('saveentity', args);
    this.addgenrartinlinefile(end);
  }
  addrelationsentity(relations: Relations) {
    if (relations.OnetoOne !== undefined) {
      relations.OnetoOne.forEach(element => {
        this.filegenerating += `import {${element.table}} from "./${element.table}.entity";`;
      });
    }
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        this.filegenerating += `import {${element.table}} from "./${element.table}.entity";`;
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        this.filegenerating += `import {${element.table}} from "./${element.table}.entity";`;
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        this.filegenerating += `import {${element.table}} from "./${element.table}.entity";`;
      });
    }
  }

  generaterelationbody(relations: Relations, table: string) {
    relations.OnetoOne.forEach(element => {
      this.filegenerating += ` @OneToOne(() => ${element.table}, {
        cascade: true
    })\n`;
      this.filegenerating += ` @JoinColumn()\n`;
      this.filegenerating += `${element.relationname}:${element.table}\n`;
    });
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        this.filegenerating += ` @OneToMany(() => ${element.table},${element.table.toLowerCase()}=>${element.table.toLowerCase()}.${element.manytoone})\n`;
        this.filegenerating += `${element.relationname}:${element.table}[]\n`;
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        const onetomany = this.relationservice.getrelationsonetomany(this.configservice.getschemaid(element.table));
        const find = onetomany.find(element => element.table == table);
        this.filegenerating += ` @ManyToOne(() => ${element.table},${element.table.toLowerCase()}=>${element.table.toLowerCase()}.${find.relationname})\n`;
        this.filegenerating += `${element.relationname}:${element.table}\n`;
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        this.filegenerating += ` @ManyToMany(() => ${element.table},${element.table.toLowerCase()}=>${element.table.toLowerCase()}.${element.manytomany})\n`;
        this.filegenerating += ` @JoinTable()\n`;
        this.filegenerating += `${element.relationname}:${element.table}[]\n`;
      });
    }
    this.addgenrartinline('Relations generator ... /n');
  }

  generateimports(relations: Relations): string {
    let importorm = 'import { Entity, Column ';
    let joincolummn = false;
    let insertstr = '';
    if (relations.OnetoOne !== undefined && relations.OnetoOne.length !== 0) {
      insertstr += ', OneToOne';
      joincolummn = true;
    }
    if (relations.Onetomany !== undefined && relations.Onetomany.length !== 0) {
      insertstr += ', OneToMany';
    }
    if (relations.Manytoone !== undefined && relations.Manytoone.length !== 0) {
      insertstr += ', ManyToOne';
    }
    if (relations.Manytomany !== undefined && relations.Manytomany.length !== 0) {
      insertstr += ', ManyToMany, JoinTable';
    }
    if (this.ormj.PrimaryGeneratedColumn === true) {
      insertstr += ', PrimaryGeneratedColumn';
    }
    if (this.ormj.Index === true) {
      insertstr += ', Index';
    }
    if (joincolummn) {
      insertstr += ', JoinColumn';
    }
    // tslint:disable-next-line: quotemark
    importorm += insertstr + "} from 'typeorm';\n";
    // tslint:disable-next-line: prefer-for-of
    return importorm;
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
          if (fieldcolumn.index === true) {
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
          this.filegenerating += fieldcolumn.name + ': Date;\n\n';
          break;
        default:
          break;
      }
    }
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }

  addgenrartinline(message: string) {
    this.ngzone.runOutsideAngular(x => {
      this.line = message;
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

  loadtemplate(filetemplate: string, loginfiletemplate: string) {
    this.addgenrartinline('load templates for can activate...');
    let template = this.electronservice.ipcRenderer.sendSync('loadtemplate', `./templates/${filetemplate}`);
    template = this.replacetemplate(template);
    this.addgenrartinline('end generate templates can activate...');
    this.addgenrartinline('begin save  can activate..');
    let args = { path: this.configservice.config.filePath, name: 'roles', file: template };
    let end = this.electronservice.ipcRenderer.sendSync('savecanactivate', args);
    this.addgenrartinline('end save  can activate...');
    this.addgenrartinlinefile(end);
    /*generate login*/
    this.addgenrartinline('load templates for login..');
    template = this.electronservice.ipcRenderer.sendSync('loadtemplate', `./templates/${loginfiletemplate}`);
    this.addgenrartinline('end load templates for login');
    template = this.replacetemplate(template);
    args = { path: this.configservice.config.filePath, name: 'Login', file: template };
    end = this.electronservice.ipcRenderer.sendSync('saveController', args);
    this.addgenrartinlinefile(end);
  }

  replacetemplate(template: string): string {
    const sec = this.configservice.getsecurity();
    template = template.replace(/\/\*tablelower\*\//g, `${sec.table.toLowerCase()}`);
    template = template.replace(/\/\*table\*\//g, `${sec.table}`);
    template = template.replace(/\/\*roles\*\//g, `${sec.roles}`);
    template = template.replace(/\/\*login\*\//g, `${sec.login}`);
    template = template.replace(/\/\*bearertoken\*\//g, `${sec.bearertoken}`);
    template = template.replace(/\/\*password\*\//g, `${sec.password}`);
    return (template);
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