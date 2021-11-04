import { Injectable } from '@angular/core';
import { ControllersExtension } from '../interfaces/controllers-extension';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ControllersExtensionService {

  constructor(private configService:ConfigService) { }
  getControllers(id:number,indexRouter:number):ControllersExtension[]{
    return this.configService.config.extension[id-1].routes[indexRouter-1].controllers;
  }
  getController(id:number,indexRouter:number,indexController:number):ControllersExtension{
    return this.configService.config.extension[id-1].routes[indexRouter-1].controllers[indexController-1];
  }
  add(id:number,indexRouter:number,data:ControllersExtension){
    this.configService.config.extension[id-1].routes[indexRouter-1].controllers.push(data);
  }

  edit(id:number,indexRouter:number,indexController:number,data:ControllersExtension){
    this.configService.config.extension[id-1].routes[indexRouter-1].controllers[indexController-1]=data;
  }
}
