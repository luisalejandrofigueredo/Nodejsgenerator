import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

interface Type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-schematics',
  templateUrl: './schematics.component.html',
  styleUrls: ['./schematics.component.scss']
})
export class SchematicsComponent implements OnInit {
  types: Type[] = [
    {value: 'number', viewValue: 'Number'},
    {value: 'string', viewValue: 'String'},
    {value: 'date', viewValue: 'date'}
  ];
  constructor(private electronservice: ElectronService) { }
  selected = '';
  open = false;
  ngOnInit(): void {
  }

  generateschema(){
    this.electronservice.ipcRenderer.send('genschema');
  }

  openadd(){
    console.log('abriendo');
    this.open = true;
  }

}
