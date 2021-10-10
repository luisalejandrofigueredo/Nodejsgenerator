import { Injectable } from '@angular/core';
import { Relations } from '../interfaces/relations';
import { ElectronService } from 'ngx-electron';
import { Schemaitem } from '../interfaces/schema';
import { ConfigService } from '../service/config.service';
import { RelationsService } from '../service/relations.service';
@Injectable({
  providedIn: 'root'
})
export class EntitiesService {
 private config: any;
 private text_string: string;
 private file_generating: string = '';
 private log: string = '';
 private log_files: string = '';
 private format: false;
 private orm_check = {
    PrimaryGeneratedColumn: false,
    OnetoOne: false,
    OneToMany: false,
    ManyToOne: false,
    Index: false
  };
  private keyfield: string;
  constructor(private electron_service: ElectronService,
    private configservice: ConfigService,
    private relationservice: RelationsService) { }

  generate_entities() {
    this.config = this.configservice.config
    for (let index = 0; index < this.config.schemas.length; index++) {
      const element = this.config.schemas[index];
      this.entity_generator(index);
    }
  }
  get text(): string {
    return this.text_string;
  }

  private entity_generator(ind: number) {
    this.file_generating='';
    const fields = this.config.schemas[ind].schemastable;
    const relations = this.config.schemas[ind].schemarelations;
    if (relations !== undefined) {
      this.add_relations_entity(relations);
    }
    // tslint:disable-next-line: quotemark
    this.add_generating_line('\t adding imports ...');
    this.file_generating += this.config.schemas[ind].imports + '\n';
    this.file_generating += '@Entity()\n';
    this.file_generating += 'export class ' + this.config.schemas[ind].name + ' {\n';
    fields.forEach(element => {
      this.generatecolumn(element);
    });
    this.generaterelationbody(relations, this.config.schemas[ind].name);
    this.add_generating_line('\t adding extra fields ...\n');
    this.file_generating += this.config.schemas[ind].fields + '\n';
    this.file_generating += '}\n';
    this.file_generating = this.generateimports(relations) + this.file_generating;
    this.add_generating_line('saving entity');
    if (this.electron_service.isElectronApp) {
      const args = {
        path: this.config.filePath,
        name: this.config.schemas[ind].name,
        file: this.file_generating,
        format: this.format
      };
      const end = this.electron_service.ipcRenderer.sendSync('saveentity', args);
      this.add_generating_line_file(end);
    }
  }

  private add_relations_entity(relations: Relations) {
    if (relations.OnetoOne !== undefined) {
      relations.OnetoOne.forEach(element => {
        this.file_generating += `import {${element.table}} from "./${element.table}.entity";\n`;
      });
    }
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        this.file_generating += `import {${element.table}} from "./${element.table}.entity";\n`;
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        this.file_generating += `import {${element.table}} from "./${element.table}.entity";\n`;
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        this.file_generating += `import {${element.table}} from "./${element.table}.entity";\n`;
      });
    }
  }


  private generatecolumn(fieldcolumn: Schemaitem) {
    this.add_generating_line(`\t generating column: ${fieldcolumn.name} ...`);
    if (fieldcolumn.keyautonumber === true) {
      this.orm_check.PrimaryGeneratedColumn = true;
      this.file_generating += '@PrimaryGeneratedColumn()\n';
      this.file_generating += fieldcolumn.name + ':' + fieldcolumn.type + ';\n\n';
      this.keyfield = fieldcolumn.name;
    } else {
      switch (fieldcolumn.type) {
        case 'string':
          if (fieldcolumn.index === true) {
            this.orm_check.Index = true;
            this.file_generating += '@Index()\n';
          }
          if (fieldcolumn.extraparameter === '') {
            this.file_generating += '@Column()\n';
          }
          else {
            this.file_generating += '@Column({' + fieldcolumn.extraparameter;
            if (fieldcolumn.length !== 0) {
              this.file_generating += ' length:' + fieldcolumn.length.toString();
            }
            this.file_generating += '})\n';
          }
          this.file_generating += fieldcolumn.name + ':string;\n\n';
          break;
        case 'number':
          if (fieldcolumn.extraparameter === '') {
            this.file_generating += '@Column()\n';
          }
          else {
            this.file_generating += '@Column({' + fieldcolumn.extraparameter;
            if (fieldcolumn.length !== 0) {
              this.file_generating += ' length:' + fieldcolumn.length.toString();
            }
            this.file_generating += '})\n';
          }
          this.file_generating += fieldcolumn.name + ':number;\n\n';
          break;
        case 'date':
          if (fieldcolumn.extraparameter === '') {
            this.file_generating += '@Column()\n';
          }
          else {
            this.file_generating += '@Column({' + fieldcolumn.extraparameter + '})\n';
          }
          this.file_generating += fieldcolumn.name + ': Date;\n\n';
          break;
        default:
          break;
      }
    }
  }
  private generateimports(relations: Relations): string {
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
    if (this.orm_check.PrimaryGeneratedColumn === true) {
      insertstr += ', PrimaryGeneratedColumn';
    }
    if (this.orm_check.Index === true) {
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

  private generaterelationbody(relations: Relations, table: string) {
    relations.OnetoOne.forEach(element => {
      this.file_generating += ` @OneToOne(() => ${element.table}, {
        cascade: true
    })\n`;
      this.file_generating += ` @JoinColumn()\n`;
      this.file_generating += `${element.relationname}:${element.table}\n`;
    });
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        this.file_generating += ` @OneToMany(() => ${element.table},${element.table.toLowerCase()}=>${element.table.toLowerCase()}.${element.manytoone})\n`;
        this.file_generating += `${element.relationname}:${element.table}[]\n`;
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        const onetomany = this.relationservice.getrelationsonetomany(this.configservice.getschemaid(element.table));
        const find = onetomany.find(element => element.table == table);
        this.file_generating += ` @ManyToOne(() => ${element.table},${element.table.toLowerCase()}=>${element.table.toLowerCase()}.${find.relationname})\n`;
        this.file_generating += `${element.relationname}:${element.table}\n`;
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        this.file_generating += ` @ManyToMany(() => ${element.table},${element.table.toLowerCase()}=>${element.table.toLowerCase()}.${element.manytomany})\n`;
        this.file_generating += ` @JoinTable()\n`;
        this.file_generating += `${element.relationname}:${element.table}[]\n`;
      });
    }
    this.add_generating_line('Relations generator ... /n');
  }

  private  add_generating_line_file(message: string) {
    this.log_files += message + '\n';
  }
  private add_generating_line(message: string) {
    this.log += message + '\n';
  }
}
