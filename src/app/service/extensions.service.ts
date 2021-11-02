import { Injectable } from '@angular/core';
import { Extension } from '../interfaces/extension';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ExtensionsService {

  constructor(private configService:ConfigService) { }

  getExtension(id):Extension {
    return this.configService.config.extension[id-1];
  }
  add(data:Extension){
    this.configService.config.extension.push(data);
  }

  delete(id:number){
    let ids=1;
    this.configService.config.extension.splice(id,1);
    this.configService.config.extension.forEach((extension)=>{
      extension.id=ids;
      ids++;
    })
  }

  edit(id:number,data:Extension) {
   this.configService.config.extension[id-1]=data;
  }

}
