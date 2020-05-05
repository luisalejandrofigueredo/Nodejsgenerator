import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringauxService {

  constructor() { }

  addtexttofile(file: string, stringtoadd: string, stringtofind: string): string {
    const pos = file.lastIndexOf(stringtofind);
    return file.substr(0, pos) + stringtoadd + '\r\n' + file.substr(pos, file.length);
  }

}
