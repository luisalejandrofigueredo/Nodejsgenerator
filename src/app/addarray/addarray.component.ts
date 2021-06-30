import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addarray',
  templateUrl: './addarray.component.html',
  styleUrls: ['./addarray.component.scss']
})
export class AddarrayComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddarrayComponent>, @Inject(MAT_DIALOG_DATA) public data: { values: string }) {
    this.form = this.fb.group({ values: this.fb.array([]) });
  }

  ngOnInit(): void {
    if (this.data.values !== '') {
      this.data.values.split(',').forEach(element => {
        const values: FormArray = this.form.controls.values as FormArray;
        values.push(this.fb.group({
          value: this.fb.control(element, Validators.required),
        }));
      });
    }
  }

  addvalue() {
    const values: FormArray = this.form.controls.values as FormArray;
    values.push(this.fb.group({
      value: this.fb.control('', Validators.required),
    }));
  }

  deletevalue(lessonIndex: number) {
    this.getarray().removeAt(lessonIndex);
  }

  track(item: any, index: number) {
    return index;
  }

  getarray(): FormArray {
    return this.form.get('values') as FormArray
  }

  get aliasesArrayControl(): AbstractControl[] {
    return (this.form.get('values') as FormArray).controls;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onYesClick() {
    this.dialogRef.close({ values: (this.form.get('values') as FormArray).value });
  }
}
