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
  @ViewChild('textgenerating', { static: true }) container: ElementRef;
  constructor(private ngzone: NgZone, private electronservice: ElectronService) { }
  config: any;
  filePath: string;
  filegenerating = '';
  fileapigenerating = '';
  reltables: string[] = [];
  editorOptions = { theme: 'vs-dark', language: 'javascript' };
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
      this.apigenerator(index);
    }
    this.addgenrartinline('end generating schemas ...');
  }

  apigenerator(index: number) {
    this.addgenrartinline('Begin generate Api... ');
    this.addgenrartinline('Begin generate controller... ');
    this.filegenerating = 'import { Controller, Inject,Post, Body, Get, Put, Delete,Param,UseGuards,Headers, SetMetadata,Query} from "@nestjs/common";\n';
    this.filegenerating += `import ${this.config.schemas[index].name}service from '../services/${this.config.schemas[index].name}.service'\n`;
    this.filegenerating += `@Controller('${this.config.schemas[index].name}')\n`;
    this.filegenerating += `export class ${this.config.schemas[index].name} {\n`;
    this.filegenerating += `constructor(private service:${this.config.schemas[index].name}service)\n`;
    // tslint:disable-next-line: prefer-for-of
    for (let ind = 0; ind < this.config.schemas[index].schemasapi.length; ind++) {
      const element = this.config.schemas[index].schemasapi[ind];
      switch (element.type) {
        case 'get':
          switch (element.operation) {
            case 'getall':
              this.addgenrartinline('adding verb get getall');
              this.filegenerating += '@Get()\n';
              this.filegenerating += 'get {}\n';
              this.filegenerating += '{}\n';
              break;
              case 'getone':
              this.addgenrartinline('adding verb get getone');
              this.filegenerating += `@Get(${element.path}/:id)\n`;
              this.filegenerating += `get${element.path} {}\n`;
              this.filegenerating += '{}\n';
              break;
              case 'skiplimit':
              this.addgenrartinline('adding verb get skiplimit'); 
              this.filegenerating += `@Get(${element.path}/:id)\n`;
              this.filegenerating += `get${element.path} (@param {}\n`;
              this.filegenerating += '{}\n';
              break;
            default:
              break;
          }
          break;
        case 'put':
          this.addgenrartinline('adding put');
          this.filegenerating += '@Put()\n';
          this.filegenerating += 'put {}\n';
          break;
        case 'post':
          this.addgenrartinline('adding post');
          this.filegenerating += '@Post()\n';
          this.filegenerating += 'post {}\n';
          break;
        case 'delete':
          this.addgenrartinline('adding post');
          this.filegenerating += '@Delete(/:id)\n';
          this.filegenerating += 'delete {}\n';
          break;
        default:
          break;
      }
    }
    this.addgenrartinline('End generate controller... ');
    this.addgenrartinline('Begin generate service... ');
    this.addgenrartinline('End generate service... ');
    this.addgenrartinline('End generate Api ... ');
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
    this.addgenrartinline('\t saving entity');
    const args = { path: this.config.filePath, name: this.config.schemas[ind].name, file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('saveentity', args);
  }

  generaterelation(element: Relations) {
    this.addgenrartinline('Relations generator ... /n');
    switch (element.type) {
      case 'onetomany':
        this.addgenrartinline(`adding relation @OneToMany table ${element.tablename}... /n`);
        this.ormj.OneToMany = true;
        this.filegenerating += '@OneToMany(type =>' + element.tablename + ',' + element.fieldc;
        this.filegenerating += ' =>' + element.fieldc + '.' + element.field + ' )\n';
        this.filegenerating += element.fieldr + ':' + element.tablename + '[];';
        this.reltables.push(element.tablename);
        break;
      case 'manytoone':
        this.ormj.ManyToOne = true; // ss
        this.addgenrartinline(`adding relation @ManytoOne table ${element.tablename}... /n`);
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
