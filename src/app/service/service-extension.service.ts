import { Injectable } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { ServicesExtension } from "../interfaces/services-extension";

@Injectable({
  providedIn: 'root'
})
export class ServiceExtensionService {

  constructor(private configService:ConfigService) { }

  getServices(id:number,routeId:number):ServicesExtension[] {
    return this.configService.config.extension[id-1].routes[routeId-1].service;
  }

  getService(id:number,routeId:number,index:number):ServicesExtension {
    return this.configService.config.extension[id-1].routes[routeId-1].service[index-1];
  }

  add(id:number,routeId:number,data:ServicesExtension){
    this.configService.config.extension[id-1].routes[routeId-1].service.push(data);
  }

  edit(id:number,routeId:number,index:number,data:ServicesExtension){
    this.configService.config.extension[id-1].routes[routeId-1].service[index-1]=data;
  }

  delete(id:number,routeId:number,index:number){
    let idService=1;
    let services=this.configService.config.extension[id-1].routes[routeId-1].service.splice(index-1,1);
    services.forEach((service)=>{
      service.id=idService;
      idService++;
    });

  }
}
