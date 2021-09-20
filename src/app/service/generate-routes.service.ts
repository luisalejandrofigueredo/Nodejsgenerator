import { Injectable } from '@angular/core';
import { Schema } from 'inspector';
import { ElectronService } from 'ngx-electron';
import { Api } from '../interfaces/api';
import { Schemahead } from '../interfaces/schemahead';
import { SchematicsComponent } from '../schematics/schematics.component';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GenerateRoutesService {
  lineGenerating = '';
  constructor(private electron_service: ElectronService,
    private config_service: ConfigService) { }
  beginGenerate() {
    this.lineGenerating = '';
    this.createRoutesInterfaces();
    const schema: Schemahead[] = this.config_service.getschema();
    schema.forEach(element => {
      this.lineGenerating += '';
      const apis: Api[] = this.config_service.getapis(element.id);
      this.generateHeader(apis, element);
      this.generateBody(apis, element);
      if (this.electron_service.isElectronApp) {
        const args = {
          path: this.config_service.config.filePath,
          name: element.name,
          file: this.lineGenerating,
          format: false
        };
        const end = this.electron_service.ipcRenderer.sendSync('saveRoutes', args);
      }
    });
  }

  generateBody(api: Api[], schema: Schemahead) {
    const schemaLower = schema.name.toLowerCase();
    const schemaName = schema.name;
    this.lineGenerating += `class ${schemaName}Route implements Routes {\n`;
    this.lineGenerating += `public path = '/${schemaLower}';\n`
    this.lineGenerating += `public router = Router();\n`;
    this.lineGenerating += `public ${schemaLower}Controller = new ${schemaName}Controller();\n`;
    this.lineGenerating += `constructor() {\n`;
    this.lineGenerating += ` this.initializeRoutes();\n`
    this.lineGenerating += '}\n\n';
    this.lineGenerating += `private initializeRoutes() {\n`;
    this.generateRoutes(api, schema);
    this.lineGenerating += '}\n';
  }

  generateRoutes(api: Api[], schema: Schemahead) {
    const schemaLower = schema.name.toLowerCase();
    const schemaName = schema.name;
    api.forEach(element => {
      switch (element.type) {
        case 'get':
          this.generateRoutesGet(element, schema);
          break;
        case 'post' :
          this.lineGenerating += 'this.router.post(`${this.path}`,' + `this.${schemaLower}Controller.create${schemaName});\n`;
          break;
        case 'put':
          this.lineGenerating+= 'this.router.put(`${this.path}/:id(\\d+)`,'+`this.${schemaLower}Controller.update${schemaName});\n`;
          break;
        default:
          break;
      }
    });
    this.lineGenerating += '}\n';
  }

  generateRoutesGet(api: Api, schema: Schemahead) {
    const schemaLower = schema.name.toLowerCase();
    const schemaName = schema.name;
    switch (api.operation) {
      case 'getall':
        this.lineGenerating += 'this.router.get(`${this.path\}`,' + `this.${schemaLower}Controller.get${schemaName});\n`;
        break;
      case 'getone':
        this.lineGenerating += 'this.router.get(`${this.path}/:id(\\d+)`,' + `this.${schemaLower}Controller.get${schemaName}ById);\n`;
        break;
      default:
        break;
    }

  }


  generateHeader(Api: Api[], schema: Schemahead) {
    this.lineGenerating += `import { Router } from 'express';\n`;
    this.lineGenerating += `import ${schema.name}Controller from '@controllers/users.controller';\n`;
    this.lineGenerating += `import { Routes } from '@interfaces/routes.interface';\n`;
  }

  createRoutesInterfaces() {
    this.lineGenerating += `import { Router } from 'express';\n`;
    this.lineGenerating += `export interface Routes {\n`;
    this.lineGenerating += `\tpath?: string;\n`;
    this.lineGenerating += `\trouter: Router;\n`
    this.lineGenerating += `}\n`;
    if (this.electron_service.isElectronApp) {
      const args = {
        path: this.config_service.config.filePath,
        name: 'routes',
        file: this.lineGenerating,
        format: false
      };
      const end = this.electron_service.ipcRenderer.sendSync('saveInterfaces', args);
    }
  }
}