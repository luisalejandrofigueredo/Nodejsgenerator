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
    this.profileForm = new FormGroup({
      selecteddatabase: new FormControl(0, Validators.required),
      host: new FormControl('', Validators.required),
      port: new FormControl(3306, Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      database: new FormControl('',Validators.required ),
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
  change(){
    this.configservice.enableCors(this.enableCors);
  }
  save() {
    this.configservice.save();
  }
}
