import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicesExtension } from "../interfaces/services-extension";
@Component({
  selector: 'app-extension-service-modal',
  templateUrl: './extension-service-modal.component.html',
  styleUrls: ['./extension-service-modal.component.scss']
})
export class ExtensionServiceModalComponent implements OnInit {
  profileForm:FormGroup;
  constructor(public dialogRef: MatDialogRef<ExtensionServiceModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ServicesExtension) { 
    this.profileForm = new FormGroup({
      name: new FormControl(this.data.name, Validators.required)
    });
  }
  ngOnInit(): void {
  }
  onNoClick(){
    this.dialogRef.close();
  }
  onYesClick(){
    this.data.name=this.profileForm.get('name').value;
    this.dialogRef.close(this.data);
  }
}
