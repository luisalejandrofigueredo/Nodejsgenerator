import { Injectable } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { Relations } from '../interfaces/relations';
import { Onetoone } from '../interfaces/onetoone';

@Injectable({
  providedIn: 'root'
})
export class RelationsService {

  constructor(private config: ConfigService) { }

  getrelationsonetone(schemaid: number): Onetoone[] {
    if (this.config.getrelations(schemaid).OnetoOne!==undefined)
    return this.config.getrelations(schemaid).OnetoOne
    else
    return [];
  }

  addrelationonetoone(schemaid: number, onetoone: Onetoone) {
    let relations: Relations = this.config.getrelations(schemaid);
    if (relations.OnetoOne===undefined) relations={ OnetoOne:[] }as Relations;
    relations.OnetoOne.push(onetoone);
    this.config.setrelations(schemaid, relations);
  }

  deleterelationonetoone(schemaid: number, id: number) {
    let relations: Relations = this.config.getrelations(schemaid);
    relations.OnetoOne.splice(id, 1);
    this.config.setrelations(schemaid, relations);
  }
  editrelationonetoone(schemaid: number, id: number, reg: Onetoone) {
    let relations: Relations = this.config.getrelations(schemaid);
    console.log('relations:',relations);
    console.log('id',id);
    console.log('reg',reg);
    relations.OnetoOne.splice(id, 1, reg);
    this.config.setrelations(schemaid, relations);
  }
}