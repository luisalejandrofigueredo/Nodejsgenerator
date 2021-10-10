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
      this.lineGenerating = '';
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
    this.lineGenerating += `public path = '/${schemaName}';\n`
    this.lineGenerating += `public router = Router();\n`;
    this.lineGenerating += `public ${schemaLower}Controller = new ${schemaName}Controller();\n`;
    this.lineGenerating += `constructor() {\n`;
    this.lineGenerating += ` this.initializeRoutes();\n`
    this.lineGenerating += '}\n\n';
    this.lineGenerating += `private initializeRoutes() {\n`;
    this.generateRoutes(api, schema);
    this.lineGenerating += '}\n';
    this.lineGenerating += `export default ${schemaName}Route\n`;
  }

  generateRoutes(api: Api[], schema: Schemahead) {
    const schemaLower = schema.name.toLowerCase();
    const schemaName = schema.name;
    api.forEach(element => {
      switch (element.type) {
        case 'get':
          this.generateRoutesGet(element, schema);
          break;
        case 'post':
          this.lineGenerating += 'this.router.post(`${this.path}`,' + `this.${schemaLower}Controller.create${schemaName});\n`;
          break;
        case 'put':
          this.lineGenerating += 'this.router.put(`${this.path}`,' + `this.${schemaLower}Controller.update${schemaName});\n`;
          break;
        case 'delete':
          this.lineGenerating += 'this.router.delete(`${this.path}/:id`,' + `this.${schemaLower}Controller.delete${schemaName});\n`;
          break;
        case 'patch':
          this.lineGenerating += 'this.router.patch(`${this.path}/:id`,' + `this.${schemaLower}Controller.Patch${schemaName}ById);\n`;
          break;
        case 'postonetomany':
          this.lineGenerating += 'this.router.post(`${this.path}/onetomany/' + element.path + '/:id`,' + `this.${schemaLower}Controller.post${element.path}onetomany);\n`;
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
    const { path } = api
    switch (api.operation) {
      case 'getall':
        this.lineGenerating += 'this.router.get(`${this.path\}`,' + `this.${schemaLower}Controller.get${schemaName});\n`;
        break;
      case 'getone':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/${api.path}` + '/:id`,' + `this.${schemaLower}Controller.get${schemaName}ById);\n`;
        break;
      case 'findandcount':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/${api.path}` + '`,' + `this.${schemaLower}Controller.findAndCount);\n`;
        break;
      case 'skiplimit':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/${api.path}` + '/:skip/:limit/:order`,' + `this.${schemaLower}Controller.skipLimit);\n`;
        break;
      case 'skiplimitbyfield':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/skiplimitorder${api.field}` + '/:skip/:limit/:order`,' + `this.${schemaLower}Controller.skipLimit${api.field});\n`;
        break;
      case 'skiplimitfilter':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/skiplimitfilter${api.field}` + '/:skip/:limit/:order/:filter`,' + `this.${schemaLower}Controller.skipLimitFilter${api.field});\n`;
        break;
      case 'findwithoptions':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/findwithoptions${api.path}` + '/:options`,' + `this.${schemaLower}Controller.skipLimitOptions${api.path});\n`;
        break;
      case 'findandcountwithoptions':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/findandcountwithoptions${api.path}` + '/:options`,' + `this.${schemaLower}Controller.skipLimitOptions${api.path});\n`;
        break;
      case 'count':
        this.lineGenerating += 'this.router.get(`${this.path}/count`,' + `this.${schemaLower}Controller.get${schemaName}Count);\n`;
        break;
      case 'findgenerated':
        this.lineGenerating += 'this.router.get(`${this.path}/findgenerated' + api.path
        api.parameters.forEach((param, index) => {
          this.lineGenerating += '/:' + param.name
        })
        this.lineGenerating += '`' + ',' + `this.${schemaLower}Controller.get${schemaName}FindGenerated${api.path});\n`;
        break;
      case 'findandcountgenerated': {
        this.lineGenerating += 'this.router.get(`${this.path}/findandcountgenerated' + api.path
        api.parameters.forEach((param, index) => {
          this.lineGenerating += '/:' + param.name
        })
        this.lineGenerating += '`' + ',' + `this.${schemaLower}Controller.get${schemaName}FindAndCountGenerated${api.path});\n`;
        break;
      }
      default:
        break;
    }

  }


  generateHeader(Api: Api[], schema: Schemahead) {
    this.lineGenerating += `import { Router } from 'express';\n`;
    this.lineGenerating += `import ${schema.name}Controller from '../controllers/${schema.name}.controller';\n`;
    this.lineGenerating += `import { Routes } from '../interfaces/routes.interface';\n`;
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