import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from './config.service';
import { RelationsService } from './relations.service';
import { Api } from '../interfaces/api';
@Injectable({
  providedIn: 'root'
})
export class GenerateControllerService {
  security: any;
  textGenerated: String;
  format: boolean = false;
  constructor(private electron_service: ElectronService,
    private config_service: ConfigService,
    private relationservice: RelationsService) { }
  generateController() {
    this.security = this.config_service.config.security;
    this.config_service.config.schemas.forEach((item, index) => {
      this.AddHeader(item, index);
      this.createBody(item, index);
      this.textGenerated += '}\n'
      if (this.electron_service.isElectronApp) {
        const args = {
          path: this.config_service.config.filePath,
          name: item.name,
          file: this.textGenerated,
          format: this.format
        };
        const end = this.electron_service.ipcRenderer.sendSync('saveController', args);
      }
    });
  }

  AddHeader(item, index) {
    this.textGenerated = '';
    const nameLower = item.name.toLowerCase();
    this.textGenerated += `import { NextFunction, Request, Response } from 'express';\n`
    this.textGenerated += `import { ${item.name} } from '../interfaces/${item.name}.interface';\n`;
    this.textGenerated += `import ${item.name}Service from '../services/${item.name}.service';\n`;
    this.textGenerated += `class ${item.name}Controller {\n`;
    this.textGenerated += `public ${nameLower}Service = new ${item.name}Service();\n`;
  }
  createBody(item, index) {
    const schemasApi = item.schemasapi as Api[];
    schemasApi.forEach(element => {
      switch (element.type) {
        case 'get':
          this.createBodyGets(element, item.name);
          break;
        default:
          break;
      }
    });

  }
  createBodyGets(itemApi: Api, table: string) {
    const tableLower = table.toLowerCase();
    switch (itemApi.operation) {
      case 'getall': {
        console.log('Get all',itemApi.operation);
        this.textGenerated += `public get${table} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
        this.textGenerated += ` try {\n`;
        this.textGenerated += `const findAll${table}Data: ${table}[] = await this.${tableLower}Service.findAll${table}();\n`;
        this.textGenerated += `   res.status(200).json({ data: findAll${table}Data, message: 'findAll' });\n`
        this.textGenerated += `  } catch (error) {\n`;
        this.textGenerated += `next(error);\n`;
        this.textGenerated += ` }\n`;
        this.textGenerated += `};\n`;
        break;
      }
      default:
        break;
    }
  }
}
