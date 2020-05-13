import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Schemaitem } from '../interfaces/schema';
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
      this.entitygenerator(index);
    }
    this.addgenrartinline('end generating schemas ...');
  }

  entitygenerator(ind: number) {
    this.addgenrartinline('Entity generator ... ');
    const fields = this.config.schemas[ind].schemastable;
    // tslint:disable-next-line: quotemark
    this.filegenerating = "import { Entity, Column, PrimaryGeneratedColumn,ManyToOne } from 'typeorm';\n";
    this.generatingline += '\t adding imports ...';
    this.filegenerating += this.config.schemas[ind].imports + '\n';
    this.filegenerating += '@Entity()\n';
    this.filegenerating += 'export class ' + this.config.schemas[ind].name + ' {\n';
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < fields.length; index++) {
      const element = fields[index];
      this.generatecolumn(element);
    }
    this.addgenrartinline('\t adding extra fields ...');
    this.filegenerating += this.config.schemas[ind].fields + '\n';
    this.filegenerating += '}\n';
    this.addgenrartinline('\t saving entity');
    const args = { path: this.config.filePath, name: this.config.schemas[ind].name, file: this.filegenerating };
    const end = this.electronservice.ipcRenderer.sendSync('saveentity', args);
  }

  generatecolumn(fieldcolumn: Schemaitem) {
    this.addgenrartinline(`\t generating column: ${fieldcolumn.name} ...`);
    if (fieldcolumn.keyautonumber === true) {
      this.filegenerating += '@PrimaryGeneratedColumn()\n';
      this.filegenerating += fieldcolumn.name + ':' + fieldcolumn.type + ';\n\n';
    } else {
      switch (fieldcolumn.type) {
        case 'string':
          if (fieldcolumn.extraparameter === '') {
            this.filegenerating += '@Column()\n';
          }
          else {
            this.filegenerating += '@Column({' + fieldcolumn.extraparameter ;
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
