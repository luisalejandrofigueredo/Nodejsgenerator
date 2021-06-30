import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-viewparameters',
  templateUrl: './viewparameters.component.html',
  styleUrls: ['./viewparameters.component.scss']
})
export class ViewparametersComponent implements OnInit {
  dataSource:{name:string;type:string,selected:boolean}[]=[];
  types: {value:string,viewValue:string}[] = [
    { value: 'number', viewValue: 'Number' },
    { value: 'string', viewValue: 'String' },
    { value: 'date', viewValue: 'date' },
    { value: 'arraystring',viewValue:'ArrayString'}

  ];
  constructor(public dialogRef: MatDialogRef<ViewparametersComponent>, @Inject(MAT_DIALOG_DATA) public data: {parameters:{name:string;type:string}[], filter:string}) { 
    data.parameters.forEach(element => {
      if(element.type===data.filter)
      {
       this.dataSource.push({name:element.name,type:element.type,selected:false});
      }
    });    
  }
  viewparameter(filter:string): string {
    return this.types.find(element=>element.value===filter).viewValue
  }
  ngOnInit(): void {
    
  }
  done(i) {
    this.dataSource.forEach((element,index) => {
      this.dataSource[index].selected=false;
    });
    this.dataSource[i].selected=true;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onYesClick(): void {
    let selected:{name:string,type:string};
    this.dataSource.forEach((element,index) => {
      if(this.dataSource[index].selected===true){
        selected={name:this.dataSource[index].name,type:this.dataSource[index].type}}
    });
    this.dialogRef.close(selected);
  }
}
