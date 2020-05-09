import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import {Schemaitem} from '../interfaces/schema';
@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {
  generatingline = 'Ready for begin\n';
  progressbar = false;
  constructor(private electronservice: ElectronService) { }
  config: any;
  filePath: string;
  filegenerating = '';
  ngOnInit(): void {
  }
  addingPath() {
    this.generatingline += 'reading file path ...\n';
    this.filePath = this.config.filePath;
    this.generateschemas();
    this.generatingline += 'End generate';
  }
  generateschemas() {
    this.generatingline += 'begin generating schemas ...\n';
    const schemas = this.config.schemas;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < schemas.length; index++) {
      const element = schemas[index].name;
      this.generatingline += 'schema:' + element + '\n';
      this.entitygenerator(index);
    }
    this.generatingline += 'end generating schemas ...\n';
  }

  entitygenerator(ind: number) {
    this.generatingline += 'Entity generator ... \n';
    const fields = this.config.schemas[ind].schemastable;
    // tslint:disable-next-line: quotemark
    this.filegenerating  = "import { Entity, Column, PrimaryGeneratedColumn,ManyToOne } from 'typeorm';\n";
    this.generatingline += '\t adding imports ...\n';
    this.filegenerating += this.config.schemas[ind].imports + '\n';
    this.filegenerating += '@Entity()\n';
    this.filegenerating += 'export class ' + this.config.schemas[ind].name + ' {\n';
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < fields.length; index++) {
      const element = fields[index];
      this.generatecolumn(element);
    }
    this.generatingline += '\t adding extra fields ...\n';
    this.filegenerating += this.config.schemas[ind].fields + '\n';
    this.filegenerating += '}\n';
    this.generatingline += '\t saving entity\n';
    const args = { path: this.config.filePath , name: this.config.schemas[ind].name, file: this.filegenerating};
    const end = this.electronservice.ipcRenderer.sendSync('saveentity', args);
  }

  generatecolumn(fieldcolumn: Schemaitem){
    this.generatingline += `\t generating column: ${fieldcolumn.name} ...\n`;
    if (fieldcolumn.keyautonumber === true){
        this.filegenerating += '@PrimaryGeneratedColumn()\n';
        this.filegenerating += fieldcolumn.name + ':' + fieldcolumn.type + ';\n\n';
    } else {
      switch (fieldcolumn.type) {
        case 'string':
          this.filegenerating += '@Column({type:"varchar",length:' + fieldcolumn.length + ' ' + fieldcolumn.extraparameter + ' default:""})\n';
          this.filegenerating += fieldcolumn.name + ':string;\n\n';
          break;
        case 'number':
          this.filegenerating += '@Column({type:"number",length:' + fieldcolumn.length + + ' ' + fieldcolumn.extraparameter + ' ' + ' default:0})\n';
          this.filegenerating += fieldcolumn.name + ':number;\n\n';
          break;
        default:
          break;
      }
    }
  }

  generate(event: Event) {
    this.progressbar = true;
    this.generatingline = 'reading json file generator ...\n';
    this.config = this.electronservice.ipcRenderer.sendSync('loadconfig', 'config.json');
    this.addingPath();
    this.progressbar = false;
  }
}
