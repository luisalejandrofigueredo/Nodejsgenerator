import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Relations } from '../interfaces/relations';
import {Schemahead} from '../interfaces/schemahead';
import {Schemaitem} from '../interfaces/schema';
import { ConfigService } from '../service/config.service';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-relationdatamodal',
  templateUrl: './relationdatamodal.component.html',
  styleUrls: ['./relationdatamodal.component.scss']
})
export class RelationdatamodalComponent implements OnInit {
  items = [{
    viewValue: 'One to Many',
    value: 'onetomany'
  }, {
    viewValue: 'Many to One',
    value: 'manytoone'
  }, {
    viewValue: 'One to One',
    value: 'onetoone'
  }, {
    viewValue: 'Many to Many',
    value: 'manytomany'
  }
  ];
  entitys: Schemahead[];
  entity: number;
  type: string;
  field: string;
  fields: Schemaitem[];
  // tslint:disable-next-line: max-line-length
  constructor(public configservice: ConfigService, public dialogRef: MatDialogRef<RelationdatamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Relations) { }

  ngOnInit(): void {
    this.entitys = [ ...this.configservice.getschema()];
    this.entitys.splice(this.data.id - 1 , 1);
    this.fields  = [ ...this.configservice.getschematable(this.data.id)];
  }

  selection($event: Event) {
    this.entitys = [ ...this.configservice.getschema()];
    this.entitys.splice(this.data.id - 1 , 1);
    this.fields  = [ ...this.configservice.getschematable(this.entity)];
  }

  onNoClick() {
    this.dialogRef.close();
  }
  onYesClick() {
    this.data.table = this.entity;
    this.data.type  = this.type;
    this.data.field = this.field;
    this.dialogRef.close(this.data);
  }

}
