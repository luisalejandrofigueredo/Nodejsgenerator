import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-projectmodal',
  templateUrl: './projectmodal.component.html',
  styleUrls: ['./projectmodal.component.scss']
})
export class ProjectmodalComponent implements OnInit {
  profileForm: FormGroup;;
  constructor(private snackbar: MatSnackBar, public configservice: ConfigService, public dialogRef: MatDialogRef<ProjectmodalComponent>, @Inject(MAT_DIALOG_DATA) public data: { projectname: string }) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      projectname: new FormControl(this.data.projectname, Validators.required),
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
  onYesClick() {
      this.configservice.config.projectname = this.profileForm.get('projectname').value;
      this.dialogRef.close( this.profileForm.value );
  }
}
