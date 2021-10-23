import { Injectable } from '@angular/core';
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
    let security: boolean = false;
    schema.forEach(element => { if (element.security === true) { security = true } });
    if (security) {
      this.generateLogin();
    }
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

  generateLogin() {
    this.lineGenerating = '';
    this.lineGenerating += `import { Router } from 'express';\n`;
    this.lineGenerating += `import LoginController from '../controllers/login.controller';\n`;
    this.lineGenerating += `import { Routes } from '../interfaces/routes.interface';\n`;
    this.lineGenerating += `class loginRoute implements Routes {\n`;
    this.lineGenerating += `public router = Router();\n`;
    this.lineGenerating += `public loginController = new LoginController();\n`;
    this.lineGenerating += `constructor() {\n`
    this.lineGenerating += `this.initializeRoutes();\n`;
    this.lineGenerating += `}\n`
    this.lineGenerating += `private initializeRoutes() {\n`;
    this.lineGenerating += "this.router.post(`/login`, this.loginController.login);\n";
    this.lineGenerating += "this.router.post(`/logout`, this.loginController.logout);\n";
    this.lineGenerating += "}\n";
    this.lineGenerating += "}\n";
    this.lineGenerating += "export default loginRoute\n"
    const args = {
      path: this.config_service.config.filePath,
      name: 'login',
      file: this.lineGenerating,
      format: false
    };
    const end = this.electron_service.ipcRenderer.sendSync('saveRoutes', args);
  }

  generateBody(apis: Api[], schema: Schemahead) {
    const schemaLower = schema.name.toLowerCase();
    const schemaName = schema.name;
    this.lineGenerating += `class ${schemaName}Route implements Routes {\n`;
    this.lineGenerating += `public path = '/${schemaName}';\n`
    this.lineGenerating += `public router = Router();\n`;
    if (schema.filesupload === true) {
      apis.forEach(element => {
        if (element.type === 'uploadfile') {
          const extfiles = element.extfiles.trim().replace(/\s/g, '|');
          this.lineGenerating += `
       private storage= multer.diskStorage({
         destination: './public/data/uploads/',
         filename: function (req, file, cb) {
           cb(null, '${schemaName}' + '-' + Date.now() + (Math.random()*10000).toString(16) + '.' + file.originalname.split('.').pop())
         }
       });
      private  fileFilter = (req: any,file: any,cb: any) => {
       if (!file.originalname.match(/.(${extfiles})$/)) {
         req.fileValidationError="Only files ${element.extfiles}!";
         return cb(new Error('Only ${element.extfiles} files are allowed!'), false);
     }
     cb(null, true);
     }
     private upLoad=multer({storage:this.storage,fileFilter:this.fileFilter})
       `;
        }
      });
    }
    this.lineGenerating += `public ${schemaLower}Controller = new ${schemaName}Controller();\n`;
    if (schema.security === true) {
      this.lineGenerating += `public ${schemaLower}Middleware = new ${schemaName}Middleware();\n`;
    }
    this.lineGenerating += `constructor() {\n`;
    this.lineGenerating += ` this.initializeRoutes();\n`
    this.lineGenerating += '}\n\n';
    this.lineGenerating += `private initializeRoutes() {\n`;
    this.generateRoutes(apis, schema);
    this.lineGenerating += '}\n';
    this.lineGenerating += `export default ${schemaName}Route\n`;
  }

  generateSecurity(api: Api, schema: Schemahead): string {
    if (schema.security === true) {
      if (api.security === true) {
        return `this.${schema.name.toLowerCase()}Middleware.${api.type + api.path}Middleware,`
      } else {
        return '';
      }
    } else {
      return '';
    }
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
          this.lineGenerating += 'this.router.post(`${this.path}`,' + this.generateSecurity(element, schema) + `this.${schemaLower}Controller.create${schemaName});\n`;
          break;
        case 'put':
          this.lineGenerating += 'this.router.put(`${this.path}`,' + this.generateSecurity(element, schema) + `this.${schemaLower}Controller.update${schemaName});\n`;
          break;
        case 'delete':
          this.lineGenerating += 'this.router.delete(`${this.path}/:id`,' + this.generateSecurity(element, schema) + `this.${schemaLower}Controller.delete${schemaName});\n`;
          break;
        case 'patch':
          this.lineGenerating += 'this.router.patch(`${this.path}/:id`,' + this.generateSecurity(element, schema) + `this.${schemaLower}Controller.Patch${schemaName}ById);\n`;
          break;
        case 'postonetomany':
          this.lineGenerating += 'this.router.post(`${this.path}/onetomany/' + element.path + '/:id`,' + this.generateSecurity(element, schema) + `this.${schemaLower}Controller.post${element.path}onetomany);\n`;
          break;
        case 'postonetoone':
          this.lineGenerating += 'this.router.post(`${this.path}/oneToOne/' + element.path + '/:id`,' + this.generateSecurity(element, schema) + `this.${schemaLower}Controller.post${element.path}oneToOne);\n`;
          break;
        case 'postmanytomany':
          this.lineGenerating += 'this.router.post(`${this.path}/ManyToMany/' + element.path + '/:id`,' + this.generateSecurity(element, schema) + `this.${schemaLower}Controller.post${element.path}manyToMany);\n`;
          break;
        case 'uploadfile':
          this.lineGenerating += 'this.router.post(`${this.path}/Upload/' + element.path + '`,' + this.generateSecurity(element, schema) + `this.upLoad.single('file')` + `,this.${schemaLower}Controller.postUpload${element.path});\n`;
          break;
        case 'uploadfiles':
          this.lineGenerating += 'this.router.post(`${this.path}/UploadFiles/' + element.path + '`,' + this.generateSecurity(element, schema) + `this.upLoad.array('files')` + `,this.${schemaLower}Controller.postUploadFiles${element.path});\n`;
          break;
        case 'getfile':
          this.lineGenerating += 'this.router.get(`${this.path}/getFile/' + element.path + '/:filename`,' + this.generateSecurity(element, schema) + `this.${schemaLower}Controller.postGetFile${element.path});\n`;
          break;
        case 'changepassword':
          this.lineGenerating += 'this.router.put(`${this.path}/changepassword/' + element.path +'`' + this.generateSecurity(element, schema) + `,this.${schemaLower}Controller.changepassword${schemaName});\n`;
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
        this.lineGenerating += 'this.router.get(`${this.path\}`,' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.get${schemaName});\n`;
        break;
      case 'getone':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/${api.path}` + '/:id`,' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.get${schemaName}ById);\n`;
        break;
      case 'findandcount':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/${api.path}` + '`,' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.findAndCount);\n`;
        break;
      case 'skiplimit':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/${api.path}` + '/:skip/:limit/:order`,' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.skipLimit);\n`;
        break;
      case 'skiplimitbyfield':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/skiplimitorder${api.field}` + '/:skip/:limit/:order`,' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.skipLimit${api.field});\n`;
        break;
      case 'skiplimitfilter':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/skiplimitfilter${api.field}` + '/:skip/:limit/:order/:filter`,' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.skipLimitFilter${api.field});\n`;
        break;
      case 'findwithoptions':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/findwithoptions${api.path}` + '/:options`,' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.skipLimitOptions${api.path});\n`;
        break;
      case 'findandcountwithoptions':
        this.lineGenerating += 'this.router.get(`${this.path}' + `/findandcountwithoptions${api.path}` + '/:options`,' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.skipLimitOptions${api.path});\n`;
        break;
      case 'count':
        this.lineGenerating += 'this.router.get(`${this.path}/count`,' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.get${schemaName}Count);\n`;
        break;
      case 'findgenerated':
        this.lineGenerating += 'this.router.get(`${this.path}/findgenerated' + api.path
        api.parameters.forEach((param, index) => {
          this.lineGenerating += '/:' + param.name
        })
        this.lineGenerating += '`' + ',' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.get${schemaName}FindGenerated${api.path});\n`;
        break;
      case 'findandcountgenerated': {
        this.lineGenerating += 'this.router.get(`${this.path}/findandcountgenerated' + api.path
        api.parameters.forEach((param, index) => {
          this.lineGenerating += '/:' + param.name
        })
        this.lineGenerating += '`' + ',' + this.generateSecurity(api, schema) + `this.${schemaLower}Controller.get${schemaName}FindAndCountGenerated${api.path});\n`;
        break;
      }
      default:
        break;
    }
  }


  generateHeader(Api: Api[], schema: Schemahead) {
    this.lineGenerating += `import { Router } from 'express';\n`;
    this.lineGenerating += `import ${schema.name}Controller from '../controllers/${schema.name}.controller';\n`;
    if (schema.security === true) {
      this.lineGenerating += `import ${schema.name}Middleware from '../middlewares/${schema.name}Middleware.middleware';\n`;
    }
    this.lineGenerating += `import { Routes } from '../interfaces/routes.interface';\n`;
    if (schema.filesupload === true) {
      this.lineGenerating += `import multer from 'multer';\n`;
    }
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