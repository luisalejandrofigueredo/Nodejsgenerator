import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from '../config.service';
import { ControllersExtensionService } from "../controllers-extension.service";
import { Extension } from "../../interfaces/extension";
@Injectable({
  providedIn: 'root'
})
export class ExtensionService {
  lineGenerating: string;
  constructor(private controllersService: ControllersExtensionService,
    private electronService: ElectronService,
    private configService: ConfigService) { }
  begin_generate(extension: Extension) {
    extension.routes.forEach(route => {
      const file = this.configService.config.filePath + '/src/routes/' + extension.name + '.route.ts'
      const exist = this.electronService.ipcRenderer.sendSync('ifFile', { path: file });
      if (exist !== 'found') {
        this.GenerateRoutesServiceExtension(extension, extension.id, route.id, file, route.name, route.path);
      }
    });
  }

  GenerateRoutesServiceExtension(extension: Extension, index: number, indexRoute: number, pathFile: string, routeName: string, routePath: string) {
    this.lineGenerating = '';
    this.lineGenerating += "import { Router } from 'express';\n"
    const controllers = this.controllersService.getControllers(index, indexRoute);
    controllers.forEach(controller => {
      this.lineGenerating += `import {${controller.name}} from '../controllers/${controller.name}.ts'\n`
    });
    this.lineGenerating += `import { Routes } from '../interfaces/routes.interface';\n`;
    this.lineGenerating += `class ${routeName} implements Routes {\n`;
    this.lineGenerating += `public path = '/${routePath}';\n`
    this.lineGenerating += `public router = Router();\n`;
    controllers.forEach(controller => {
      this.lineGenerating += `public ${controller.name}=new ${controller.name}();\n`
    });
    this.lineGenerating += 'constructor() {\n';
    this.lineGenerating += 'this.initializeRoutes();\n';
    this.lineGenerating += '}\n';
    this.lineGenerating += 'private initializeRoutes() {\n';
    extension.routes.forEach(route => {
      this.lineGenerating += `this.router.${route.type}(` + '`${this.path}`'
      route.controllers.forEach((controller) => {
        this.lineGenerating += `,this.${controller.name}`
        this.generateControllerService(controller.name);
      });
      this.lineGenerating += ');\n';
    });
    this.lineGenerating += '}\n';
    this.lineGenerating += `}\n`;
    const saveExtension = this.electronService.ipcRenderer.sendSync('saveExtensionRouter', { path: pathFile, file: this.lineGenerating });
  }

  generateControllerService(controllerName: string) {
    let lineGenerating="import { NextFunction, Request, Response } from 'express';\n";
    lineGenerating+=`class ${controllerName} {`;
    lineGenerating+='}';
    lineGenerating+=`export default ${controllerName};\n`;
    const file = this.configService.config.filePath + '/src/controllers/' + controllerName + '.controller.ts'
    const exist = this.electronService.ipcRenderer.sendSync('ifFile', { path: file });
    if (exist !== 'found') {
      const saveExtensionController = this.electronService.ipcRenderer.sendSync('saveExtensionController', { path: file, file: lineGenerating });
    }
  }
}
