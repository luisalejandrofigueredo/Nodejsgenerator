import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from './config.service';
import { RelationsService } from './relations.service';
import { Api } from '../interfaces/api';
import { Manytoone } from '../interfaces/manytoone';
import { Manytomany } from '../interfaces/manytomany';
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
      this.textGenerated += `export default ${item.name}Controller`;
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
        case 'put': {
          const table = item.name;
          const tableLower = item.name.toLowerCase();
          this.textGenerated += `public update${table} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
          this.textGenerated += `  try {\n`;
          this.textGenerated += `   const ${tableLower}Data: any = req.body;\n`;
          this.textGenerated += `   const update${table}Data: ${table} = await this.${tableLower}Service.update(${tableLower}Data);\n`;
          this.textGenerated += `   res.status(200).json({ data: update${table}Data, message: 'updated' });\n`;
          this.textGenerated += `    } catch (error) {\n`;
          this.textGenerated += `    next(error);\n`;
          this.textGenerated += `  }\n`;
          this.textGenerated += `};\n\n`;
          break;
        }
        case 'post': {
          const table = item.name;
          const tableLower = item.name.toLowerCase();
          this.textGenerated += `public create${table} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {`;
          this.textGenerated += `  try {\n`;
          this.textGenerated += ` const ${tableLower}Data = req.body;\n`;
          this.textGenerated += `   const create${table}Data: ${table} = await this.${tableLower}Service.create(${tableLower}Data);\n`;
          this.textGenerated += `  res.status(201).json({ data: create${table}Data, message: 'created' });\n`;
          this.textGenerated += `  } catch (error) {\n`;
          this.textGenerated += `    next(error);\n`;
          this.textGenerated += `  }\n`;
          this.textGenerated += `};\n\n`;
          break;
        }
        case 'patch': {
          const table = item.name;
          const tableLower = item.name.toLowerCase();
          this.textGenerated += `public Patch${table}ById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
          this.textGenerated += ` try {\n`;
          this.textGenerated += `  const ${tableLower}Id = Number(req.params.id);\n`;
          this.textGenerated += `  const patch=req.body;\n`;
          this.textGenerated += `  const findPatch${table}Data: any= await this.${tableLower}Service.patch(${tableLower}Id,patch);\n`;
          this.textGenerated += `    res.status(200).json({ data: findPatch${table}Data, message: 'patch' });\n`;
          this.textGenerated += `  } catch (error) {\n`;
          this.textGenerated += `   next(error);\n`;
          this.textGenerated += `  }\n`;
          this.textGenerated += ` };\n\n`;
          break;
        }
        case 'delete': {
          const table = item.name;
          const tableLower = item.name.toLowerCase();
          this.textGenerated += `public delete${table} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
          this.textGenerated += `try {\n`
          this.textGenerated += `  const ${tableLower}Id = Number(req.params.id);\n`;
          this.textGenerated += `    const delete${table}Data: ${table} = await this.${tableLower}Service.delete(${tableLower}Id);\n`;
          this.textGenerated += `res.status(200).json({ data: delete${table}Data, message: 'deleted' });\n`
          this.textGenerated += `  } catch (error) {\n`;
          this.textGenerated += `   next(error);\n`;
          this.textGenerated += `  }\n`;
          this.textGenerated += ` };\n`;
          break;
        }
        case 'postonetomany': {
          const table = item.name;
          const tableLower = item.name.toLowerCase();
          const relationsOneToMany = this.relationservice.getrelationsonetomany(item.id);
          const relationOneToMany = relationsOneToMany.find(oneToMany => oneToMany.relationname === element.field);
          const invRelations: Manytoone[] = this.relationservice.getrelationmanytoone(this.config_service.getschemawithname(relationOneToMany.table));
          const manytoone = invRelations.find(manyToOne => manyToOne.table === table);
          this.textGenerated += `public post${element.path}onetomany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
          this.textGenerated += `const ${tableLower}Id = Number(req.params.id);\n`;
          this.textGenerated += `const relation=req.body;\n`;
          this.textGenerated += `try {\n`
          this.textGenerated += `const manyToOne=await this.${tableLower}Service.postonetomany${element.path}(${tableLower}Id,relation);\n`;
          this.textGenerated += `res.status(200).json({ data: manyToOne, message: 'post one ${table} to many ${relationOneToMany.table}' });\n`
          this.textGenerated += `  } catch (error) {\n`;
          this.textGenerated += `   next(error);\n`;
          this.textGenerated += `  }\n`;
          this.textGenerated += '}\n';
        }
          break;
        case 'postonetoone': {
          const table = item.name;
          const tableLower = item.name.toLowerCase();
          const relationsOneToOne = this.relationservice.getrelationsonetone(item.id);
          const relationOneToOne = relationsOneToOne.find(oneToOne => oneToOne.relationname === element.field);
          this.textGenerated += `public post${element.path}oneToOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
          this.textGenerated += `const ${tableLower}Id = Number(req.params.id);\n`;
          this.textGenerated += `const relation=req.body;\n`;
          this.textGenerated += `try {\n`
          this.textGenerated += `const oneToOne=await this.${tableLower}Service.postoneToOne${element.path}(${tableLower}Id,relation);\n`;
          this.textGenerated += `res.status(200).json({ data: oneToOne, message: 'post one ${table} to one ${relationOneToOne.table}' });\n`
          this.textGenerated += `  } catch (error) {\n`;
          this.textGenerated += `   next(error);\n`;
          this.textGenerated += `  }\n`;
          this.textGenerated += '}\n';
        }
          break;
        case 'postmanytomany': {
          const table = item.name;
          const tableLower = item.name.toLowerCase();
          const relationsManyToMany = this.relationservice.getrelationsmanytomany(item.id);
          const relationManyToMany = relationsManyToMany.find(manyToMany => manyToMany.relationname === element.field);
          const invRelations: Manytomany[] = this.relationservice.getrelationsmanytomany(this.config_service.getschemawithname(relationManyToMany.table));
          const manytomany = invRelations.find(manyToMany => manyToMany.table === table);
          this.textGenerated += `public post${element.path}manyToMany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
          this.textGenerated += `const ${tableLower}Id = Number(req.params.id);\n`;
          this.textGenerated += `const relation=req.body;\n`;
          this.textGenerated += `try {\n`
          this.textGenerated += `const manyToMany=await this.${tableLower}Service.postManyToMany${element.path}(${tableLower}Id,relation);\n`;
          this.textGenerated += `res.status(200).json({ data: manyToMany, message: 'post one ${table} to many ${relationManyToMany.table}' });\n`
          this.textGenerated += `  } catch (error) {\n`;
          this.textGenerated += `   next(error);\n`;
          this.textGenerated += `  }\n`;
          this.textGenerated += '}\n';
        }
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
        this.textGenerated += `public get${table} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
        this.textGenerated += ` try {\n`;
        this.textGenerated += `const findAll${table}Data: ${table}[] = await this.${tableLower}Service.findAll${table}();\n`;
        this.textGenerated += `   res.status(200).json({ data: findAll${table}Data, message: 'findAll' });\n`
        this.textGenerated += `  } catch (error) {\n`;
        this.textGenerated += `next(error);\n`;
        this.textGenerated += ` }\n`;
        this.textGenerated += `};\n\n`;
        break;
      }
      case 'getone': {
        this.textGenerated += `public get${table}ById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`
        this.textGenerated += `try {\n`;
        this.textGenerated += `const ${tableLower}Id = Number(req.params.id);\n`;
        this.textGenerated += `const findOne${table}Data: ${table} = await this.${tableLower}Service.find${table}ById(${tableLower}Id);\n`
        this.textGenerated += `  res.status(200).json({ data: findOne${table}Data, message: 'findOne' });\n`;
        this.textGenerated += `} catch (error) {\n`;
        this.textGenerated += ` next(error);\n`
        this.textGenerated += `}\n`
        this.textGenerated += '};\n\n';
        break;
      }
      case 'findandcount': {
        this.textGenerated += `public findAndCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`
        this.textGenerated += `try {\n`;
        this.textGenerated += `const findAndCountData: any = await this.${tableLower}Service.findAndCount();\n`
        this.textGenerated += `  res.status(200).json({ data: findAndCountData, message: 'findAndCount' });\n`;
        this.textGenerated += `} catch (error) {\n`;
        this.textGenerated += ` next(error);\n`
        this.textGenerated += `}\n`
        this.textGenerated += '};\n\n';
        break;
      }
      case 'skiplimit': {
        this.textGenerated += `public skipLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`
        this.textGenerated += `try {\n`;
        this.textGenerated += `const skip = Number(req.params.skip);\n`;
        this.textGenerated += `const limit = Number(req.params.limit);\n`;
        this.textGenerated += `const order = req.params.order\n`;
        this.textGenerated += `const skipLimit${table}Data: ${table}[] = await this.${tableLower}Service.skipLimit(skip,limit,order);\n`
        this.textGenerated += `  res.status(200).json({ data: skipLimit${table}Data, message: 'find skip limit' });\n`;
        this.textGenerated += `} catch (error) {\n`;
        this.textGenerated += ` next(error);\n`
        this.textGenerated += `}\n`
        this.textGenerated += '};\n\n';
        break;
      }
      case 'skiplimitbyfield': {
        this.textGenerated += `public skipLimit${itemApi.field} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`
        this.textGenerated += `try {\n`;
        this.textGenerated += `const skip = Number(req.params.skip);\n`;
        this.textGenerated += `const limit = Number(req.params.limit);\n`;
        this.textGenerated += `const order = req.params.order\n`;
        this.textGenerated += `const skipLimit${table}Data: ${table}[] = await this.${tableLower}Service.SkipLimit${itemApi.field}(skip,limit,order);\n`
        this.textGenerated += `  res.status(200).json({ data: skipLimit${table}Data, message: 'find skip limit order ${itemApi.field}' });\n`;
        this.textGenerated += `} catch (error) {\n`;
        this.textGenerated += ` next(error);\n`
        this.textGenerated += `}\n`
        this.textGenerated += '};\n\n';
        break;
      }
      case 'skiplimitfilter': {
        this.textGenerated += `public skipLimitFilter${itemApi.field} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`
        this.textGenerated += `try {\n`;
        this.textGenerated += `const skip = Number(req.params.skip);\n`;
        this.textGenerated += `const limit = Number(req.params.limit);\n`;
        this.textGenerated += `const order = req.params.order\n`;
        this.textGenerated += `const filter = req.params.filter\n`;
        this.textGenerated += `const skipLimit${table}Data: ${table}[] = await this.${tableLower}Service.skipLimitFilter${itemApi.field}(skip,limit,order,filter);\n`
        this.textGenerated += `  res.status(200).json({ data: skipLimit${table}Data, message: 'find skip limit filter by ${itemApi.field}' });\n`;
        this.textGenerated += `} catch (error) {\n`;
        this.textGenerated += ` next(error);\n`
        this.textGenerated += `}\n`
        this.textGenerated += '};\n\n';
        break;
      }
      case 'findwithoptions': {
        this.textGenerated += `public skipLimitOptions${itemApi.path} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`
        this.textGenerated += `try {\n`;
        this.textGenerated += `const findwithoptions = await this.${tableLower}Service.getfindwithoptions${table}(req.params.options);`
        this.textGenerated += `  res.status(200).json({ data: findwithoptions, message: 'find with options' });\n`;
        this.textGenerated += `} catch (error) {\n`;
        this.textGenerated += ` next(error);\n`
        this.textGenerated += `}\n`
        this.textGenerated += '};\n\n';
        break;
      }
      case 'findandcountwithoptions': {
        this.textGenerated += `public skipLimitOptions${itemApi.path} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`
        this.textGenerated += `try {\n`;
        this.textGenerated += `const findwithoptions = await this.${tableLower}Service.getfindandcountwithoptions${table}(req.params.options);`
        this.textGenerated += `  res.status(200).json({ data: findwithoptions, message: 'find and count with options' });\n`;
        this.textGenerated += `} catch (error) {\n`;
        this.textGenerated += ` next(error);\n`
        this.textGenerated += `}\n`
        this.textGenerated += '};\n\n';
        break;
      }
      case 'count': {
        this.textGenerated += `public get${table}Count = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
        this.textGenerated += ` try {\n`;
        this.textGenerated += `const findCount${table}Data: number = await this.${tableLower}Service.count${table}();\n`;
        this.textGenerated += `   res.status(200).json({ data: findCount${table}Data, message: 'count table:${table}' });\n`
        this.textGenerated += `  } catch (error) {\n`;
        this.textGenerated += `next(error);\n`;
        this.textGenerated += ` }\n`;
        this.textGenerated += `};\n\n`;
        break;
      }
      case 'findgenerated':
        this.textGenerated += `public get${table}FindGenerated${itemApi.path} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
        this.textGenerated += ` try {\n`;
        this.textGenerated += `const findGenerated${table}Data: any = await this.${tableLower}Service.findGenerated${table}${itemApi.path}(req);\n`;
        this.textGenerated += `   res.status(200).json({ data: findGenerated${table}Data, message: 'Find generated table:${table}' });\n`
        this.textGenerated += `  } catch (error) {\n`;
        this.textGenerated += `next(error);\n`;
        this.textGenerated += ` }\n`;
        this.textGenerated += `};\n\n`;
        break;
      case 'findandcountgenerated':
        this.textGenerated += `public get${table}FindAndCountGenerated${itemApi.path} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {\n`;
        this.textGenerated += ` try {\n`;
        this.textGenerated += `const findGenerated${table}Data: any = await this.${tableLower}Service.findAndCountGenerated${table}${itemApi.path}(req);\n`;
        this.textGenerated += `   res.status(200).json({ data: findGenerated${table}Data, message: 'Find generated table:${table}' });\n`
        this.textGenerated += `  } catch (error) {\n`;
        this.textGenerated += `next(error);\n`;
        this.textGenerated += ` }\n`;
        this.textGenerated += `};\n\n`;
        break;
      default:
        break;
    }
  }
}
