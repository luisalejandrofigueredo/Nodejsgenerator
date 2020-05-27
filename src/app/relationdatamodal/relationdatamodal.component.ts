import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Relations } from '../interfaces/relations';
import {Schemahead} from '../interfaces/schemahead';
import {Schemaitem} from '../interfaces/schema';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-relationdatamodal',
  templateUrl: './relationdatamodal.component.html',
  styleUrls: ['./relationdatamodal.component.scss']
})
export class RelationdatamodalComponent implements OnInit {
  entitys: Schemahead[];
  fieldrel: string;
  impfieldc = 'name of the class';
  entity: number;
  type  = 'onetomany';
  field: string;
  fields: Schemaitem[];
  fieldc: string;
  fieldr: string;
  // tslint:disable-next-line: max-line-length
  constructor(public configservice: ConfigService, public dialogRef: MatDialogRef<RelationdatamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Relations) { }

  ngOnInit(): void {
    this.entitys = [ ...this.configservice.getschema()];
    this.entitys.splice(this.data.idtable - 1 , 1);
    if (this.data.table !== 0){
      this.fields  = [ ...this.configservice.getschematable(this.data.table)];
    }
    this.entity = this.data.table;
    this.type = this.data.type;
    this.field = this.data.field;
    this.fieldc = this.data.fieldc;
    this.fieldr = this.data.fieldr;
  }

  selectiontype(e: Event) {
  
  }

  selection($event: Event) {
    this.entitys = [ ...this.configservice.getschema()];
    this.entitys.splice(this.data.idtable - 1 , 1);
    this.fields  = [ ...this.configservice.getschematable(this.entity)];
  }

  onNoClick() {
    this.dialogRef.close();
  }
  onYesClick() {
    this.data.table = this.entity;
    this.data.tablename = this.configservice.config.schemas[this.entity - 1].name;
    this.data.type  = this.type;
    this.data.field = this.field;
    this.data.fieldr = this.fieldr;
    this.data.fieldc = this.fieldc;
    this.dialogRef.close(this.data);
  }
}
