import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../service/config.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Selectvalues } from "../selectvalues";
import { ElectronService } from 'ngx-electron';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConfigServiceService } from "../service/config/config-service.service";
import { WizardModalComponent } from "../wizard-modal/wizard-modal.component";
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
  constructor(private wizardDialog: MatDialog,private configPackageService:ConfigServiceService,private electron: ElectronService, private snackbar: MatSnackBar, public configservice: ConfigService, public dialogRef: MatDialogRef<ProjectmodalComponent>, @Inject(MAT_DIALOG_DATA) public data: { projectname: string }) { }
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
      description: new FormControl(''),
      workDirectory: new FormControl('', Validators.required)
    });
    this.profileFormDatabase = new FormGroup({
      driver: new FormControl(0, Validators.required),
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
    this.configservice.config.filePath= this.profileForm.get('workDirectory').value + `\\` + this.profileForm.get('projectname').value
    /* config database*/
    this.configservice.config.dbconfProduction.selecteddatabase=this.profileFormDatabase.get('driver').value;
    this.configservice.config.dbconfProduction.host=this.profileFormDatabase.get('host').value;
    this.configservice.config.dbconfProduction.port=this.profileFormDatabase.get('port').value;
    this.configservice.config.dbconfProduction.username=this.profileFormDatabase.get('username').value;
    this.configservice.config.dbconfProduction.password=this.profileFormDatabase.get('password').value;
    this.configservice.config.dbconfProduction.database=this.profileFormDatabase.get('database').value;
    /** config development  data base*/
    this.configservice.config.dbconf.selecteddatabase=this.profileFormDatabase.get('driver').value;
    this.configservice.config.dbconf.host=this.profileFormDatabase.get('host').value;
    this.configservice.config.dbconf.port=this.profileFormDatabase.get('port').value;
    this.configservice.config.dbconf.username=this.profileFormDatabase.get('username').value;
    this.configservice.config.dbconf.password=this.profileFormDatabase.get('password').value;
    this.configservice.config.dbconf.database=this.profileFormDatabase.get('database').value;
    if (this.profileFormTable.get('tableWithSecurity').value) {
      this.configservice.config.security.table=this.profileFormTable.get('tableName').value;
      this.configservice.config.security.login=this.profileFormTable.get('login').value;
      this.configservice.config.security.password=this.profileFormTable.get('password').value;
      this.configservice.config.security.roles=this.profileFormTable.get('roles').value;
      this.configservice.config.security.bearertoken=this.profileFormTable.get('bearer').value;
      this.configservice.config.security.count=this.profileFormTable.get('count').value;
      this.configservice.addschema({ id: 1,
          name: this.profileFormTable.get('tableName').value,
          description: '',
          imports: '',
          fields: '' ,
          security: true,
          classsecurity: 'RolesGuard',
          filesecurity: '',
          filesupload:false,mastersecurity: true}
      );
    }
    /** adding tables */
    this.configservice.addschemaitem(1,{
      id:1,
      name:'id',
      type:'number',
      length:255,
      index:false,
      extraparameter:'',
      keyautonumber:true
    });
    this.configservice.addschemaitem(1,{
      id:2,name:this.profileFormTable.get('login').value,
      type:'string',
      length:255,
      index:true,
      extraparameter:'',
      keyautonumber:false
    });
    this.configservice.addschemaitem(1,{
      id:3,name:this.profileFormTable.get('password').value,
      type:'string',
      length:255,
      index:false,
      extraparameter:'',
      keyautonumber:false
    });
    this.configservice.addschemaitem(1,{
      id:4,name:this.profileFormTable.get('roles').value,
      type:'string',
      length:255,
      index:false,
      extraparameter:'',
      keyautonumber:false
    });
    this.configservice.addschemaitem(1,{
      id:5,name:this.profileFormTable.get('bearer').value,
      type:'string',
      length:255,
      index:false,
      extraparameter:'',
      keyautonumber:false
    });
    this.configservice.addschemaitem(1,{
      id:6,name:this.profileFormTable.get('count').value,
      type:'number',
      length:10,
      index:false,
      extraparameter:'',
      keyautonumber:false
    });
    this.configservice.config.enableCors=true;
    this.configservice.config.jwtsk="test";
    this.configservice.config.jwtskProduction="test";
    const createDirectory = this.electron.ipcRenderer.sendSync('createDirectory', { directory: this.profileForm.get('workDirectory').value + `\\` + this.profileForm.get('projectname').value });
    const createPackageFile = this.electron.ipcRenderer.sendSync('createProject', { path: this.profileForm.get('workDirectory').value + `\\` + this.profileForm.get('projectname').value });
    const data={projectname:this.profileForm.get('projectname').value as string,description:this.profileForm.get('description').value as string}
    const dialogRef = this.wizardDialog.open(WizardModalComponent, { data: data ,disableClose:false });
    dialogRef.afterClosed().subscribe(()=>{
      this.dialogRef.close(this.profileForm.value);
    })
  }
}
