import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from '../service/config.service';
import {Selectvalues} from "../selectvalues";
import { FormControl, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  constructor(private configservice: ConfigService, private electron: ElectronService) { }
  filePath: string;
  enableCors = false;
  dbconf:any;
  jwtsk:string;
  hide=true;
  hidep=true;
  driverdatabase: Selectvalues[] = [{value:0,viewValue:'My Sql'},
  {value:1,viewValue:"PostgreSQL"},
  {value:2,viewValue:"SQLite"},
  {value:3,viewValue:"Microsoft SQL Server"},
  {value:4,viewValue:"sql.js"},
  {value:5,viewValue:"Oracle"},
  {value:6,viewValue:"SAP Hana"},
  {value:7,viewValue:"MongoDB (experimental)"}]; 
  profileForm: FormGroup;

  ngOnInit(): void {
    this.enableCors = this.configservice.config.enableCors;
    this.filePath = this.configservice.config.filePath;
    if (this.configservice.config.jwtsk === undefined){ //for compa delete las version
        this.configservice.config.jwtsk=''
    } else{
      this.jwtsk=this.configservice.config.jwtsk;
    }
    this.dbconf= this.configservice.getdatabase();
    this.profileForm = new FormGroup({
      selecteddatabase: new FormControl(this.dbconf.selecteddatabase, Validators.required),
      host: new FormControl(this.dbconf.host, Validators.required),
      port: new FormControl(this.dbconf.port, Validators.required),
      username: new FormControl(this.dbconf.username, Validators.required),
      password: new FormControl(this.dbconf.password, Validators.required),
      database: new FormControl(this.dbconf.database,Validators.required ),
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
  updatedbconf(){
    this.dbconf.selecteddatabase=this.profileForm.get('selecteddatabase').value;
    this.dbconf.host=this.profileForm.get('host').value;
    this.dbconf.port=this.profileForm.get('port').value;
    this.dbconf.username=this.profileForm.get('username').value;
    this.dbconf.password=this.profileForm.get('password').value;
    this.dbconf.database=this.profileForm.get('database').value;
    this.configservice.setdatabase(this.dbconf);
  }
  
  change(){
    this.configservice.enableCors(this.enableCors);
  }
  chsecret(){
    this.configservice.config.jwtsk=this.jwtsk;
  }
  save() {
    this.configservice.save();
  }
}
