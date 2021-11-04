import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { ExtensionsService } from './extensions.service';
import {RoutesExtension} from '../interfaces/routes-extension';
@Injectable({
  providedIn: 'root'
})
export class RoutesExtensionService {
  constructor(private configService:ConfigService) { }
  getRoutes(index:number):RoutesExtension[]{
    const extensions=this.configService.config.extension[index-1];
    const routes=extensions.routes;
    return routes;
  }
  getRoute(index:number,indexRoute:number):RoutesExtension{
    const extensions=this.configService.config.extension[index-1];
    const routes=extensions.routes;
    return routes[indexRoute-1];
  }
  add(index:number,routeExtension:RoutesExtension) {
    let extensions=this.configService.config.extension[index-1];
    extensions.routes.push(routeExtension);
  }
  edit(index:number,routeIndex:number,routeExtension:RoutesExtension) {
    let extensions=this.configService.config.extension[index-1];
    extensions.routes[routeIndex-1]=routeExtension;
  }

  delete(index:number,routeIndex:number){
    let extensions=this.configService.config.extension[index-1];
    extensions.routes.splice(routeIndex-1,1);
  }
}
