import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Relations } from '../interfaces/relations';
import { Schemaitem } from '../interfaces/schema';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GenerateInterfacesService {
  config: any;
  file_generating: string;
  format: boolean = false;
  constructor(private configservice: ConfigService, private electron_service: ElectronService,) { }

  generateInterface() {
    this.config = this.configservice.config
    for (let index = 0; index < this.config.schemas.length; index++) {
      this.file_generating = '';
      const element = this.config.schemas[index];
      console.log('generate element interface', element);
      this.interface_generator(index, element.name, false);
      if (this.electron_service.isElectronApp) {
        const args = {
          path: this.config.filePath,
          name: this.config.schemas[index].name,
          file: this.file_generating,
          format: this.format
        };
        const end = this.electron_service.ipcRenderer.sendSync('saveInterfaces', args);
      }
    }
  }

  generateInterfaceWithRelations(relation: { table: string; name: string }[]) {
    this.config = this.configservice.config
    for (let index = 0; index < this.config.schemas.length; index++) {
      this.file_generating = '';
      const element = this.config.schemas[index];
      console.log('generate element interface', element);
      this.interface_generator(index, element.name, true);
      if (this.electron_service.isElectronApp) {
        const args = {
          path: this.config.filePath,
          name: this.config.schemas[index].name + 'Relations',
          file: this.file_generating,
          format: this.format
        };
        const end = this.electron_service.ipcRenderer.sendSync('saveInterfaces', args);
      }
    }
  }
  private interface_generator(ind: number, name: string, genRelations: boolean) {
    const fields = this.config.schemas[ind].schemastable;
    const relations = this.config.schemas[ind].schemarelations;
    if (relations !== undefined) {
      if (genRelations) {
        this.add_relations_entity(relations);
      }
    }
    this.file_generating += `\nexport interface ${name} {\n`;
    this.generateFields(fields)
    this.file_generating += '}\n'
  }

  private generateFields(fields: Schemaitem[]) {
    fields.forEach(element => {
      switch (element.type) {
        case 'string':
          this.file_generating += '\t' + element.name + ':string;\n';
          break;
        case 'number':
          this.file_generating += '\t' + element.name + ':number;\n';
          break;
        case 'date':
          this.file_generating += '\t' + element.name + ': Date;\n';
          break;
        default:
          break;
      }
    });

  };
  private add_relations_entity(relations: Relations) {
    if (relations.OnetoOne !== undefined) {
      relations.OnetoOne.forEach(element => {
        this.file_generating += `import {${element.table}} from "../interfaces/${element.table}.interface";`;
      });
    }
    if (relations.Onetomany !== undefined) {
      relations.Onetomany.forEach(element => {
        this.file_generating += `import {${element.table}} from "../interfaces/${element.table}.interface";`;
      });
    }
    if (relations.Manytoone !== undefined) {
      relations.Manytoone.forEach(element => {
        this.file_generating += `import {${element.table}} from "../interfaces/${element.table}.interface";`;
      });
    }
    if (relations.Manytomany !== undefined) {
      relations.Manytomany.forEach(element => {
        this.file_generating += `import {${element.table}} from "../interfaces/${element.table}.interface";`;
      });
    }
  }
}
