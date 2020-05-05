import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schemaitem } from '../interfaces/schema';
interface Type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-datamodal',
  templateUrl: './datamodal.component.html',
  styleUrls: ['./datamodal.component.scss']
})
export class DatamodalComponent implements OnInit {
  types: Type[] = [
    { value: 'number', viewValue: 'Number' },
    { value: 'string', viewValue: 'String' },
    { value: 'date', viewValue: 'date' }
  ];
  autonumber: boolean;
  index: boolean;
  selected: string;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DatamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Schemaitem) { }

  changed() {
    this.data.type = this.selected;
  }
  ngOnInit(): void {
    this.selected = this.data.type;
    this.autonumber = this.data.keyautonumber;
    this.index = this.data.index;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.data.keyautonumber = this.autonumber;
    this.data.index = this.index;
    this.data.type = this.selected;
    this.dialogRef.close(this.data);
  }


}
