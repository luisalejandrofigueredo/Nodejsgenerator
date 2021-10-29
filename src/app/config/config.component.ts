import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from '../service/config.service';
import { Selectvalues } from "../selectvalues";
import { FormControl, Validators, FormGroup, FormArray, AbstractControl, FormBuilder } from '@angular/forms';
import { ConfigProductionComponent } from '../config-production/config-production.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  constructor(private fb:FormBuilder,private dialog: MatDialog, private configservice: ConfigService, private electron: ElectronService) { }
  filePath: string;
  enableCors = false;
  enablehttps = false;
  uploadfiles = false;
  corsHosts: string[] = [];
  dbconf: any;
  jwtsk: string;
  jwtskProduction: string;
  hide = true;
  hidep = true;
  port = 3000;
  driverdatabase: Selectvalues[] = [{ value: 0, viewValue: 'My Sql' },
  { value: 1, viewValue: "PostgreSQL" },
  { value: 2, viewValue: "SQLite" },
  { value: 3, viewValue: "Microsoft SQL Server" },
  { value: 4, viewValue: "sql.js" },
  { value: 5, viewValue: "Oracle" },
  { value: 6, viewValue: "SAP Hana" },
  { value: 7, viewValue: "MongoDB (experimental)" }];
  profileForm: FormGroup;
  hostForm: FormGroup;

  ngOnInit(): void {
    this.enableCors = this.configservice.config.enableCors;
    this.corsHosts = this.configservice.config.corsHost;
    if (this.corsHosts.length === 0) {
      this.corsHosts.push('*');
    }
    this.filePath = this.configservice.config.filePath;
    this.uploadfiles = this.configservice.config.enableuploadfiles;
    if (this.configservice.config.enableuploadfiles === undefined) { //for compa delete las version
      this.configservice.config.enableuploadfiles = false;
    } else {
      this.uploadfiles = this.configservice.config.enableuploadfiles;
    }
    if (this.configservice.config.port === undefined) { //for compa delete las version
      this.configservice.config.port = 3000;
    } else {
      this.port = this.configservice.config.port;
    }
    if (this.configservice.config.enablehttps === undefined) { //for compa delete las version
      this.configservice.config.enablehttps = false;
    } else {
      this.enablehttps = this.configservice.config.enablehttps;
    }
    if (this.configservice.config.jwtsk === undefined) { //for compa delete las version
      this.configservice.config.jwtsk = ''
    } else {
      this.jwtsk = this.configservice.config.jwtsk;
    }
    if (this.configservice.config.jwtskProduction === undefined) { //for compa delete las version
      this.configservice.config.jwtskProduction = ''
    } else {
      this.jwtskProduction = this.configservice.config.jwtskProduction;
    }
    this.dbconf = this.configservice.getdatabase();
    this.profileForm = new FormGroup({
      selecteddatabase: new FormControl(this.dbconf.selecteddatabase, Validators.required),
      host: new FormControl(this.dbconf.host, Validators.required),
      port: new FormControl(this.dbconf.port, Validators.required),
      username: new FormControl(this.dbconf.username, Validators.required),
      password: new FormControl(this.dbconf.password, Validators.required),
      database: new FormControl(this.dbconf.database, Validators.required),
    });
    this.hostForm = this.fb.group({ corsHosts: this.fb.array([])})
    this.corsHosts.forEach((corsHost, index) => {
      if (index === 0) {
        this.hostForm.setControl('corsHosts',this.fb.array([this.addHostControl(corsHost)]));
      } else {
        (this.hostForm.get('corsHosts').value as FormArray).push(this.addHostControl(corsHost));
      }
    });
  }

  addHostControl(name):FormGroup{
    return this.fb.group({host: this.fb.control(name)})
  }

  get aliasesArrayControl(): AbstractControl[] {
    return (this.hostForm.get('corsHosts') as FormArray).controls;
  }

  applicationConfig() {
    const dialogRef = this.dialog.open(ConfigProductionComponent, {
      width: '500px',
      panelClass: 'my-outlined-dialog',
      disableClose: true,
    });
  }

  browse() {
    // tslint:disable-next-line: max-line-length
    this.electron.remote.dialog.showOpenDialog(this.electron.remote.getCurrentWindow(), { properties: ['openDirectory'] }).then(result => {
      if (result.canceled === false) {
        this.configservice.setfilepath(result.filePaths[0]);
        this.filePath = result.filePaths[0];
      }
    });
  }
  updatedbconf() {
    this.dbconf.selecteddatabase = this.profileForm.get('selecteddatabase').value;
    this.dbconf.host = this.profileForm.get('host').value;
    this.dbconf.port = this.profileForm.get('port').value;
    this.dbconf.username = this.profileForm.get('username').value;
    this.dbconf.password = this.profileForm.get('password').value;
    this.dbconf.database = this.profileForm.get('database').value;
    this.configservice.setdatabase(this.dbconf);
  }
  changeuploadfiles() {
    this.configservice.config.enableuploadfiles = this.uploadfiles;
  }

  addHost() { 
    const hosts:FormArray = this.hostForm.controls.corsHosts as FormArray;
    hosts.push(this.addHostControl(''));
  }

  deleteHost(index: number) { 
    const hosts:FormArray = this.hostForm.controls.corsHosts as FormArray;
    hosts.removeAt(index);
  }

  changeport() {
    this.configservice.config.port = this.port;
  }

  change() {
    this.configservice.enableCors(this.enableCors);
  }

  changehttps() {
    this.configservice.config.enablehttps = this.enablehttps;
  }

  chsecret() {
    this.configservice.config.jwtsk = this.jwtsk;
    this.configservice.config.jwtskProduction = this.jwtskProduction;
  }
  save() {
    this.configservice.save();
  }

  updateHost(){
    const hosts:FormArray = this.hostForm.controls.corsHosts as FormArray;
    hosts.value;
    console.log('hosts',hosts);
  }
}
