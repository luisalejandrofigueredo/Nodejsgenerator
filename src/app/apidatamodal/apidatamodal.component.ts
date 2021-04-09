import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Typeoperation } from '../interfaces/typeoperation';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {ConfigService} from '../service/config.service';
import { Schemahead } from '../interfaces/schemahead';
interface Type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-apidatamodal',
  templateUrl: './apidatamodal.component.html',
  styleUrls: ['./apidatamodal.component.scss']
})
export class ApidatamodalComponent implements OnInit {
  types: Type[] = [
    { value: 'get', viewValue: 'Get' },
    { value: 'put', viewValue: 'Put' },
    { value: 'post', viewValue: 'Post' },
    { value: 'delete', viewValue: 'Delete'}
  ];

  operation: Type[] = [
    { value: 'getall', viewValue: 'Get All' },
    { value: 'getone', viewValue: 'Get One' },
    { value: 'skiplimit', viewValue: 'Get skiplimit by key' },
    { value: 'skiplimitbyfield' , viewValue: 'Get skiplimit by field' },
    { value: 'skiplimitfilter', viewValue: 'Get limit filter'},
    { value: 'count', viewValue: 'Count'}
  ];

  fields: string[];
  path: string;
  selectedValue: string;
  selectedOperation: string;
  selectedfield: string;
  security: boolean;
  roles: string;
  profileForm: FormGroup;
  idschema:number;
  schema:Schemahead;
  constructor(private configservice:ConfigService ,public dialogRef: MatDialogRef<ApidatamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Typeoperation) { }

  ngOnInit(): void {
    this.idschema=this.data.idschema;
    this.schema=this.configservice.getschemawithid(this.idschema);
    if (this.schema.mastersecurity===true){
      this.types.push({value:'changepassword', viewValue: 'Put change password'});
    }
    this.fields=this.data.fields;
    console.log('fields:',this.data.fields);
    this.profileForm = new FormGroup({
      selectedValue: new FormControl(this.data.type, Validators.required),
      selectedOperation: new FormControl(this.data.operation, Validators.required),
      path : new FormControl(this.data.path, Validators.required),
      selectedfield: new FormControl(this.data.field, Validators.required),
      security: new FormControl(this.data.security, Validators.required),
      roles: new FormControl(this.data.roles, Validators.required),
    });
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
    this.data.type = this.profileForm.get('selectedValue').value;
    this.data.path = this.profileForm.get('path').value;
    this.data.operation = this.profileForm.get('selectedOperation').value;
    this.data.field = this.profileForm.get('selectedfield').value;
    this.data.security = this.profileForm.get('security').value;
    this.data.roles = this.profileForm.get('roles').value;
    this.dialogRef.close(this.data);
  }
}
