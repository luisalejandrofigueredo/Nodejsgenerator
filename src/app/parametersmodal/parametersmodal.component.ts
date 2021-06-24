import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder,AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-parametersmodal',
  templateUrl: './parametersmodal.component.html',
  styleUrls: ['./parametersmodal.component.scss']
})
export class ParametersmodalComponent implements OnInit {
  form:FormGroup;
  types: {value:string,viewValue:string}[] = [
    { value: 'number', viewValue: 'Number' },
    { value: 'string', viewValue: 'String' },
    { value: 'date', viewValue: 'date' }
  ];
  constructor(private fb:FormBuilder,private dialogRef: MatDialogRef<ParametersmodalComponent>, @Inject(MAT_DIALOG_DATA) public data) { 
    this.form = this.fb.group({parameters:this.fb.array([])});
  }

  ngOnInit(): void {
     this.data.forEach(element => {
      const param:FormArray = this.form.controls.parameters as FormArray;
      param.push(this.fb.group({
      name: this.fb.control(element.name,Validators.required),
      type: this.fb.control(element.type,Validators.required)
    }));
    });
  }
 
  getparameters():FormArray {
    return this.form.get('parameters') as FormArray
  }

  get aliasesArrayControl():AbstractControl[] {
    return (this.form.get('parameters') as FormArray).controls;
  }

  addparameter(){
    const param:FormArray = this.form.controls.parameters as FormArray;
    param.push(this.fb.group({
      name: this.fb.control('',Validators.required),
      type: this.fb.control('',Validators.required)
    }));
  }

  deleteparameter(lessonIndex: number) {
    this.getparameters().removeAt(lessonIndex);
  }

  track(item:any,index:number){
    return index;
  }
  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
    this.dialogRef.close({ parameters: (this.form.get('parameters') as FormArray).value});
  }
}
