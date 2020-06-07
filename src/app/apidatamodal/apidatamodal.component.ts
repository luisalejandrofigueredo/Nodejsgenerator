import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Typeoperation} from '../interfaces/typeoperation';
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
  constructor(public dialogRef: MatDialogRef<ApidatamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Typeoperation) { }

  ngOnInit(): void {
    this.selectedValue = this.data.type;
    this.selectedOperation = this.data.operation;
    this.path = this.data.path;
    this.fields = this.data.fields;
    this.selectedfield = this.data.field;
    this.security = this.data.security;
    this.roles = this.data.roles;
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
    this.data.path = this.path;
    this.data.type = this.selectedValue;
    this.data.operation = this.selectedOperation;
    this.data.field = this.selectedfield;
    this.data.roles = this.roles;
    this.data.security = this.security;
    this.dialogRef.close(this.data);
  }
}
