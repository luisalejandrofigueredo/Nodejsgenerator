import { Component, OnInit , Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Schemahead} from '../interfaces/schemahead';
import {FormControl, Validators, FormGroup} from '@angular/forms';
@Component({
  selector: 'app-formschemamodal',
  templateUrl: './formschemamodal.component.html',
  styleUrls: ['./formschemamodal.component.scss']
})
export class FormschemamodalComponent implements OnInit {
  Userdata: FormGroup;
  constructor(public dialogRef: MatDialogRef<FormschemamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Schemahead) { }
  ngOnInit(): void {
    this.Userdata = new FormGroup({
      name: new FormControl(this.data.name, Validators.compose([Validators.required, Validators.pattern('[A-Z][a-z]*')])),
      description: new FormControl(this.data.description),
      imports: new FormControl(this.data.imports),
      fields: new FormControl(this.data.fields),
    });
  }

  onNoClick(){
    console.log('no click');
    this.dialogRef.close(undefined);
  }

  onYesClick(){
    this.data.name = this.Userdata.value.name;
    this.data.description = this.Userdata.value.description;
    this.data.fields = this.Userdata.value.fields;
    this.data.imports = this.Userdata.value.imports;
    this.dialogRef.close(this.data);
  }

}
