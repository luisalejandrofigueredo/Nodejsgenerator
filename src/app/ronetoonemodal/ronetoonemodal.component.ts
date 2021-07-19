import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Onetoone } from '../interfaces/onetoone';
import { ConfigService } from '../service/config.service';
import { Schemahead } from '../interfaces/schemahead';
@Component({
  selector: 'app-ronetoonemodal',
  templateUrl: './ronetoonemodal.component.html',
  styleUrls: ['./ronetoonemodal.component.scss']
})
export class RonetoonemodalComponent implements OnInit {
  profileForm:FormGroup;
  tables:Schemahead[];
  constructor(private config:ConfigService,public dialogRef: MatDialogRef<RonetoonemodalComponent>, @Inject(MAT_DIALOG_DATA) public data:{ id:number ,data:Onetoone}) { }
  ngOnInit(): void {
    this.tables= [... this.config.getschema()];
    this.tables.splice(this.data.id -1,1);
    this.profileForm=new FormGroup({ relationname:new FormControl(this.data.data.relationname,Validators.required),
      table: new FormControl(this.data.data.table,Validators.required)});
  }

  onYesClick(){
    this.dialogRef.close({id:this.data.id,data:this.profileForm.value});
  }
  onNoClick(){
    this.dialogRef.close();
  }
}
