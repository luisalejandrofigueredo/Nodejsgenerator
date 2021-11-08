import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoutesExtension } from '../interfaces/routes-extension'
@Component({
  selector: 'app-extension-routes-modal',
  templateUrl: './extension-routes-modal.component.html',
  styleUrls: ['./extension-routes-modal.component.scss']
})
export class ExtensionRoutesModalComponent implements OnInit {
  types = [{ value: 'get', viewValue: 'Get' },
   { value: 'post', viewValue: 'Post' },
   { value: 'put', viewValue: 'Put' },
   { value: 'patch', viewValue: 'Patch' }];
  profileForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<ExtensionRoutesModalComponent>, @Inject(MAT_DIALOG_DATA) public data: RoutesExtension) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl(this.data.name, Validators.required),
      path: new FormControl(this.data.path, Validators.required),
      type: new FormControl(this.data.type, Validators.required),
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
  onYesClick() {
    this.data.name = this.profileForm.get('name').value;
    this.data.path = this.profileForm.get('path').value;
    this.data.type = this.profileForm.get('type').value;
    this.dialogRef.close(this.data)
  }

}
