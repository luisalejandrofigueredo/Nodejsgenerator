import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Api } from '../interfaces/api';
import { Schemahead } from '../interfaces/schemahead';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GenerateMiddlewaresService {
  lineGenerating: string = '';
  constructor(private electron_service: ElectronService,
    private configService: ConfigService) { }
  beginGenerate() {
    const security = this.configService.config.security
    const tableSecurity = security.table;
    const schemas: Schemahead[] = this.configService.getschema();
    schemas.forEach(schema => {
      this.lineGenerating='';
      if (schema.security === true) {
        this.lineGenerating += `import { NextFunction, Request, Response } from 'express';\n`;
        this.lineGenerating += `import { HttpException } from '@exceptions/HttpException';\n`;
        this.lineGenerating += `import  {${tableSecurity}} from '../entity/${tableSecurity}.entity';\n`;
        this.lineGenerating += `import { logger } from '../utils/logger';\n`;
        this.lineGenerating += `import { getRepository } from 'typeorm';\n`;
        this.lineGenerating += ` export class ${schema.name}Middleware {\n`;
        this.lineGenerating += `constructor(){}\n`
        const apis: Api[] = this.configService.getapis(schema.id);
        apis.forEach(api => {
          if (api.security === true) {
            this.lineGenerating += `public ${api.type + api.path}Middleware = async (req: Request, res: Response, next: NextFunction)=> {\n`
            this.lineGenerating += `return async (req,res,next)=>{`;
            this.lineGenerating += `const roles='${api.roles}';\n`;
            this.lineGenerating += `const rolesArray=roles.split(" ");\n`;
            this.lineGenerating += `const bearer=req.headers.authorization.split(" ").pop();\n`
            this.lineGenerating += `const ${tableSecurity.toLowerCase()}Repository = getRepository(${tableSecurity});\n`
            this.lineGenerating += `let find=false;`
            this.lineGenerating += `let User=await ${tableSecurity.toLowerCase()}Repository.findOne({where:{${security.login}:req.headers.login}});\n`
            this.lineGenerating += `if (User) {\n`
            this.lineGenerating += `if (User.${security.bearertoken}.search(bearer)===-1) {`;
            this.lineGenerating += '  logger.error(`Error hacker attack false bearer from IP ${req.ip}`);\n'
            this.lineGenerating += ` res.status(401).json({ message: 'Unauthorized'  });\n`;
            this.lineGenerating += `}`;
            this.lineGenerating += `const userRoles='${api.roles}';\n`;
            this.lineGenerating += `const userRolesArray=userRoles.split(" ");\n`;
            this.lineGenerating += `userRolesArray.forEach(element => {\n`
            this.lineGenerating += 'let result = rolesArray.find( role => role === element );\n';
            this.lineGenerating += 'if (result) {find=true}\n'
            this.lineGenerating += '});\n';
            this.lineGenerating += 'if (find===false) {\n';
            this.lineGenerating += '  logger.error(`Error hacker attack false token from IP ${req.ip} unauthorized role`);\n'
            this.lineGenerating += ` res.status(401).json({ message: 'Unauthorized'  });\n`;
            this.lineGenerating += '} else {\n';
            this.lineGenerating += `next();\n`
            this.lineGenerating += '}\n';
            this.lineGenerating += `} else {\n`;
            this.lineGenerating += '   logger.error(`Error hacker attack false token from IP false bearer token${req.ip}`);\n'
            this.lineGenerating += `  res.status(401).json({ message: 'Unauthorized' });\n`;
            this.lineGenerating += `}\n`
            this.lineGenerating += `try {\n`;
            this.lineGenerating += `} catch (error) {\n`;
            this.lineGenerating += `next(error);\n`;
            this.lineGenerating += `}\n`
            this.lineGenerating += `}\n`;
            this.lineGenerating += `};\n`
          }
        });
        this.lineGenerating += '};\n'
        this.lineGenerating += `export default ${schema.name}Middleware;\n`;
        const args = {
          path: this.configService.config.filePath,
          name: schema.name + 'Middleware',
          file: this.lineGenerating,
          format: false
        };
        const end = this.electron_service.ipcRenderer.sendSync('saveMiddlewares', args);
      }
    });
  }
}
