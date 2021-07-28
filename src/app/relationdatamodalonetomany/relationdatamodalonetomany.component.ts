import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from '../service/config.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Relations} from '../interfaces/relations';
import { Schemahead } from '../interfaces/schemahead';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Onetomany } from '../interfaces/onetomany';

@Component({
  selector: 'app-relationdatamodalonetomany',
  templateUrl: './relationdatamodalonetomany.component.html',
  styleUrls: ['./relationdatamodalonetomany.component.scss']
})
export class RelationdatamodalonetomanyComponent implements OnInit {
  tables:Schemahead[];
  profileForm: FormGroup;
  // tslint:disable-next-line: max-line-length
  constructor(public configservice: ConfigService, public dialogRef: MatDialogRef<RelationdatamodalonetomanyComponent>, @Inject(MAT_DIALOG_DATA) public data: {id:number,data:Onetomany}) { }

  ngOnInit(): void {
    this.tables= [... this.configservice.getschema()];
    this.tables.splice(this.data.id -1,1);
    this.profileForm=new FormGroup({ relationname:new FormControl(this.data.data.relationname,Validators.required),
      table: new FormControl(this.data.data.table,Validators.required),
      manytoone: new FormControl(this.data.data.manytoone,Validators.required)
    });
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
    this.dialogRef.close({id:this.data.id,data:this.profileForm.value});
  }
}
