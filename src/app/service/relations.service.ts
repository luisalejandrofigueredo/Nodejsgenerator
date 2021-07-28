import { Injectable } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { Relations } from '../interfaces/relations';
import { Onetoone } from '../interfaces/onetoone';
import { Onetomany } from '../interfaces/onetomany';
import { Manytoone } from '../interfaces/manytoone';

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

  getrelationsonetomany(schemaid: number): Onetomany[] {
    if (this.config.getrelations(schemaid).Onetomany!==undefined)
    return this.config.getrelations(schemaid).Onetomany
    else
    return [];
  }

  getrelationmanytoone(schemaid: number): Manytoone[] {
    if (this.config.getrelations(schemaid).Onetomany!==undefined)
    return this.config.getrelations(schemaid).Manytoone
    else
    return [];
  }

  addrelationonetomany(schemaid: number, onetomany: Onetomany) {
    let relations: Relations = this.config.getrelations(schemaid);
    if (relations.Onetomany===undefined) relations.Onetomany=[] as Onetomany[];
    relations.Onetomany.push(onetomany);
    this.config.setrelations(schemaid, relations);
  }

  addrelationmanytoone(schemaid: number, Manytoone: Manytoone) {
    let relations: Relations = this.config.getrelations(schemaid);
    if (relations.Manytoone===undefined) relations.Manytoone=[] as Manytoone[];
    relations.Manytoone.push(Manytoone);
    this.config.setrelations(schemaid, relations);
  }

  deleterelationmanytoone(schemaid: number, id: number) {
    let relations: Relations = this.config.getrelations(schemaid);
    relations.Manytoone.splice(id, 1);
    this.config.setrelations(schemaid, relations);
  }

  deleterelationonetomany(schemaid: number, id: number) {
    let relations: Relations = this.config.getrelations(schemaid);
    relations.Onetomany.splice(id, 1);
    this.config.setrelations(schemaid, relations);
  }

  editrelationmanytoone(schemaid: number, id: number, reg: Manytoone) {
    let relations: Relations = this.config.getrelations(schemaid);
    relations.Manytoone.splice(id, 1, reg);
    this.config.setrelations(schemaid, relations);
  }


  editrelationonetomany(schemaid: number, id: number, reg: Onetomany) {
    let relations: Relations = this.config.getrelations(schemaid);
    relations.Onetomany.splice(id, 1, reg);
    this.config.setrelations(schemaid, relations);
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
    relations.OnetoOne.splice(id, 1, reg);
    this.config.setrelations(schemaid, relations);
  }
}