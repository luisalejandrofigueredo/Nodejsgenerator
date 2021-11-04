import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControllersExtension } from '../interfaces/controllers-extension';

@Component({
  selector: 'app-controller-modal',
  templateUrl: './controller-modal.component.html',
  styleUrls: ['./controller-modal.component.scss']
})
export class ControllerModalComponent implements OnInit {
  profileForm:FormGroup;
  constructor(public dialogRef: MatDialogRef<ControllerModalComponent>,@Inject(MAT_DIALOG_DATA) public data: ControllersExtension) { }

  ngOnInit(): void {
    this.profileForm=new FormGroup({name: new FormControl(this.data.name,Validators.required)})
  }

  onNoClick(){
    this.dialogRef.close();
  }
  onYesClick(){
    this.data.name=this.profileForm.get('name').value
    this.dialogRef.close(this.data);
  }
}
