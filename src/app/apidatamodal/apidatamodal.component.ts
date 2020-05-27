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
    { value: 'skiplimit', viewValue: 'Get skiplimit' },
    { value: 'count', viewValue: 'Count'}
  ];
  path: string;
  selectedValue: string;
  selectedOperation: string;
  constructor(public dialogRef: MatDialogRef<ApidatamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Typeoperation) { }

  ngOnInit(): void {
    this.selectedValue = this.data.type;
    this.selectedOperation = this.data.operation;
    this.path = this.data.path;
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
    this.data.path = this.path;
    this.data.type = this.selectedValue;
    this.data.operation = this.selectedOperation;
    this.dialogRef.close(this.data);
  }
}
