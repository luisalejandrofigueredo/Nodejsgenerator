import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Relations } from '../interfaces/relations';
import {Schemahead} from '../interfaces/schemahead';
import {Schemaitem} from '../interfaces/schema';
import { ConfigService } from '../service/config.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-relationdatamodal',
  templateUrl: './relationdatamodal.component.html',
  styleUrls: ['./relationdatamodal.component.scss']
})
export class RelationdatamodalComponent implements OnInit {
  entitys: Schemahead[];
  fieldrel: string;
  entity: number;
  type  = 'onetomany';
  field: string;
  fields: Schemaitem[];
  fieldc: string;
  fieldr: string;
  profileForm: FormGroup;
  // tslint:disable-next-line: max-line-length
  constructor(public configservice: ConfigService, public dialogRef: MatDialogRef<RelationdatamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Relations) { }

  ngOnInit(): void {
    this.entitys = [ ...this.configservice.getschema()];
    this.entitys.splice(this.data.idtable - 1 , 1);
    if (this.data.table !== 0){
      this.fields  = [ ...this.configservice.getschematable(this.data.table)];
    }
    this.profileForm = new FormGroup({
      entity: new FormControl(this.data.table, Validators.required),
      type: new FormControl(this.data.type, Validators.required),
      field: new FormControl(this.data.field, Validators.required),
      fieldc: new FormControl(this.data.fieldc, Validators.required),
      fieldr: new FormControl(this.data.fieldr, Validators.required)
    });
  }

  selectiontype(e: Event) {
  }

  selection($event: Event) {
    this.entitys = [ ...this.configservice.getschema()];
    this.entitys.splice(this.data.idtable - 1 , 1);
    this.fields  = [ ...this.configservice.getschematable(this.profileForm.get('entity').value)];
  }

  onNoClick() {
    this.dialogRef.close();
  }
  onYesClick() {
    this.data.table = this.profileForm.get('entity').value;
    this.data.tablename = this.configservice.config.schemas[this.profileForm.get('entity').value - 1].name;
    this.data.type  = this.profileForm.get('type').value;
    this.data.field = this.profileForm.get('field').value;
    this.data.fieldr = this.profileForm.get('fieldr').value;
    this.data.fieldc = this.profileForm.get('fieldc').value;
    this.dialogRef.close(this.data);
  }
}
