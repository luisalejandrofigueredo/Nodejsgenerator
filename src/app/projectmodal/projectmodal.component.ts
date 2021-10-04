import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../service/config.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Selectvalues } from "../selectvalues";
import { ElectronService } from 'ngx-electron';
import { MatCheckboxChange } from '@angular/material/checkbox';
@Component({
  selector: 'app-projectmodal',
  templateUrl: './projectmodal.component.html',
  styleUrls: ['./projectmodal.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class ProjectmodalComponent implements OnInit {
  profileForm: FormGroup;
  profileFormDatabase: FormGroup;
  profileFormTable: FormGroup;
  hidep = true;
  constructor(private electron: ElectronService, private snackbar: MatSnackBar, public configservice: ConfigService, public dialogRef: MatDialogRef<ProjectmodalComponent>, @Inject(MAT_DIALOG_DATA) public data: { projectname: string }) { }
  driverdatabase: Selectvalues[] = [{ value: 0, viewValue: 'My Sql' },
  { value: 1, viewValue: "PostgreSQL" },
  { value: 2, viewValue: "SQLite" },
  { value: 3, viewValue: "Microsoft SQL Server" },
  { value: 4, viewValue: "sql.js" },
  { value: 5, viewValue: "Oracle" },
  { value: 6, viewValue: "SAP Hana" },
  { value: 7, viewValue: "MongoDB (experimental)" }];
  ngOnInit(): void {
    this.profileForm = new FormGroup({
      projectname: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[A-Z][a-z]*')])),
      workDirectory: new FormControl('', Validators.required)
    });
    this.profileFormDatabase = new FormGroup({
      driver: new FormControl('', Validators.required),
      host: new FormControl('127.0.0.1', Validators.required),
      port: new FormControl(3306, Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      database: new FormControl('', Validators.required),
    });
    this.profileFormTable = new FormGroup({
      tableWithSecurity: new FormControl(true),
      tableName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[A-Z][a-z]*')])),
      login: new FormControl('login', Validators.required),
      password: new FormControl('password', Validators.required),
      roles: new FormControl('roles', Validators.required),
      bearer: new FormControl('bearer', Validators.required),
      count: new FormControl('count', Validators.required)
    });
  }
  generateTable(event:MatCheckboxChange) {
    if (event.checked === true) {
      this.profileFormTable.get('tableName').enable();
      this.profileFormTable.get('login').enable();
      this.profileFormTable.get('password').enable();
      this.profileFormTable.get('roles').enable();
      this.profileFormTable.get('bearer').enable();
      this.profileFormTable.get('count').enable()
    } else {
      this.profileFormTable.get('tableName').disable();
      this.profileFormTable.get('login').disable();
      this.profileFormTable.get('password').disable();
      this.profileFormTable.get('roles').disable();
      this.profileFormTable.get('bearer').disable();
      this.profileFormTable.get('count').disable();
    }
  }

  workDirectoryClick() {
    this.electron.remote.dialog.showOpenDialog(this.electron.remote.getCurrentWindow(), { properties: ['openDirectory'] }).then(result => {
      if (result.canceled === false) {
        this.profileForm.get('workDirectory').setValue(result.filePaths[0]);
      }
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  onYesClick() {
    this.configservice.config.projectname = this.profileForm.get('projectname').value;
    const createDirectory = this.electron.ipcRenderer.sendSync('createDirectory', { directory: this.profileForm.get('workDirectory').value + `\\` + this.profileForm.get('projectname').value });
    this.dialogRef.close(this.profileForm.value);
  }
}
