import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from '../service/config.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Relations} from '../interfaces/relations';
import { Schemahead } from '../interfaces/schemahead';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-relationdatamodalonetomany',
  templateUrl: './relationdatamodalonetomany.component.html',
  styleUrls: ['./relationdatamodalonetomany.component.scss']
})
export class RelationdatamodalonetomanyComponent implements OnInit {
  relations: Relations[] = [];
  vector: Schemahead[];
  selectedRelation = 0;
  selectedSchema: number;
  profileForm: FormGroup;
  // tslint:disable-next-line: max-line-length
  constructor(public configservice: ConfigService, public dialogRef: MatDialogRef<RelationdatamodalonetomanyComponent>, @Inject(MAT_DIALOG_DATA) public data: Relations) { }

  ngOnInit(): void {
    this.selectedSchema = this.data.table;
    this.vector = [...this.configservice.getschema()];
    this.vector.splice(this.data.idtable - 1, 1);
    if (this.vector.length !== 0){
      this.relations = [...this.configservice.getrelationfilter(this.selectedSchema - 1, 'onetomany')];
    }
    this.profileForm = new FormGroup({
      selectedSchema: new FormControl(this.data.table, Validators.required),
      selectedRelation: new FormControl(this.data.idtable - 1, Validators.required),
      fieldc: new FormControl(this.data.fieldc, Validators.required)
    });
  }

  changeschema(){
    this.relations = [...this.configservice.getrelationfilter(this.selectedSchema - 1, 'onetomany')];
  }

  changerelation(){
    
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
    this.data.type = 'manytoone';
    this.data.table = this.profileForm.get('selectedSchema').value;
    this.data.idtable = this.profileForm.get('selectedRelation').value;
    this.data.tablename = this.configservice.getschemaname(this.profileForm.get('selectedSchema').value);
    this.data.fieldr =  this.configservice.getrelation(this.profileForm.get('selectedSchema').value - 1, this.profileForm.get('selectedRelation').value - 1).fieldr;
    this.dialogRef.close(this.data);
  }
}
