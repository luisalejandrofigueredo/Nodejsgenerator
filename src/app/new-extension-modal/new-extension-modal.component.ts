import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { threadId } from 'worker_threads';
import { Extension } from "../interfaces/extension";
@Component({
  selector: 'app-new-extension-modal',
  templateUrl: './new-extension-modal.component.html',
  styleUrls: ['./new-extension-modal.component.scss']
})
export class NewExtensionModalComponent implements OnInit {
  profileForm:FormGroup;
  constructor(public dialogRef: MatDialogRef<NewExtensionModalComponent>,@Inject(MAT_DIALOG_DATA) public data: Extension) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl(this.data.name, Validators.compose([Validators.required, Validators.pattern('[A-Z][A-Za-z0-9_-]*')])),
      description: new FormControl(this.data.description),
    });
  }

  onNoClick(){
    this.dialogRef.close();
  }
  onYesClick(){
    this.data.name=this.profileForm.get('name').value;
    this.data.description=this.profileForm.get('description').value
    this.dialogRef.close(this.data);
  }

}
