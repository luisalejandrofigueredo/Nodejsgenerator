import { Injectable } from '@angular/core';
import { Schemaitem } from '../interfaces/schema';

@Injectable({
  providedIn: 'root'
})

export class SerschemaService {
  schemas: Schemaitem[] = [];
  constructor() { }
  push(schema: Schemaitem) {
    this.schemas.push(schema);
  }
  update(schema: Schemaitem, index: number) {
    this.schemas[index - 1] = schema;
  }
  renum() {
    for (let index = 0; index < this.schemas.length; index++) {
      const element = this.schemas[index];
      // tslint:disable-next-line: max-line-length
      this.schemas[index] = { id: index + 1, type: element.type, name: element.name, length: element.length, keyautonumber: element.keyautonumber };
    }
  }

  controlnumber() {
    let autonumber = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.schemas.length; index++) {
      const element = this.schemas[index];
      if (element.keyautonumber === true) { autonumber++ ; }
    }
    if (autonumber > 1) { return 1; }
    return 0;
  }

}
