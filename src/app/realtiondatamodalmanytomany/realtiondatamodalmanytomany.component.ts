import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Manytomany } from '../interfaces/manytomany';
import { Schemahead } from '../interfaces/schemahead';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-realtiondatamodalmanytomany',
  templateUrl: './realtiondatamodalmanytomany.component.html',
  styleUrls: ['./realtiondatamodalmanytomany.component.scss']
})
export class RealtiondatamodalmanytomanyComponent implements OnInit {
  tables:Schemahead[];
  profileForm: FormGroup;
  constructor(public configservice: ConfigService, public dialogRef: MatDialogRef<RealtiondatamodalmanytomanyComponent>, @Inject(MAT_DIALOG_DATA) public data: {id:number,data:Manytomany}) { }

  ngOnInit(): void {
    this.tables= [... this.configservice.getschema()];
    this.tables.splice(this.data.id -1,1);
    this.profileForm=new FormGroup({ relationname:new FormControl(this.data.data.relationname,Validators.required),
      table: new FormControl(this.data.data.table,Validators.required),
      manytomany: new FormControl(this.data.data.manytomany,Validators.required)
    });
  }
  onNoClick(){
    this.dialogRef.close();
  }
  onYesClick(){
    this.dialogRef.close({id:this.data.id,data:this.profileForm.value});
  }

}
