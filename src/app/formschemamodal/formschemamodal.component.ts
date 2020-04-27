import { Component, OnInit , Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Schemahead} from '../interfaces/schemahead';
@Component({
  selector: 'app-formschemamodal',
  templateUrl: './formschemamodal.component.html',
  styleUrls: ['./formschemamodal.component.scss']
})
export class FormschemamodalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FormschemamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Schemahead) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
    this.dialogRef.close(this.data);
  }

}
