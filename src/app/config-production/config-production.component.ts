import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Selectvalues } from '../selectvalues';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-config-production',
  templateUrl: './config-production.component.html',
  styleUrls: ['./config-production.component.scss']
})
export class ConfigProductionComponent implements OnInit {
  profileForm:FormGroup;
  dbconf:any;
  hidep = true;
  driverdatabase: Selectvalues[] = [{ value: 0, viewValue: 'My Sql' },
  { value: 1, viewValue: "PostgreSQL" },
  { value: 2, viewValue: "SQLite" },
  { value: 3, viewValue: "Microsoft SQL Server" },
  { value: 4, viewValue: "sql.js" },
  { value: 5, viewValue: "Oracle" },
  { value: 6, viewValue: "SAP Hana" },
  { value: 7, viewValue: "MongoDB (experimental)" }];
  constructor( private configservice: ConfigService,public dialogRef: MatDialogRef<ConfigProductionComponent>) { }

  ngOnInit(): void {
    if (this.configservice.config.dbconfProduction!== undefined){
     this.dbconf=this.configservice.config.dbconfProduction;
    }
    else{
      this.dbconf={ selecteddatabase: 0, host: '', port: 0, username: '', password: '', database: '',corsHost:'' };
      this.configservice.config.dbconfProduction={ selecteddatabase: 0, host: '', port: 0, username: '', password: '', database: '', corsHost:'' };
    }
    this.profileForm = new FormGroup({
      selecteddatabase: new FormControl(this.dbconf.selecteddatabase, Validators.required),
      host: new FormControl(this.dbconf.host, Validators.required),
      port: new FormControl(this.dbconf.port, Validators.required),
      username: new FormControl(this.dbconf.username, Validators.required),
      password: new FormControl(this.dbconf.password, Validators.required),
      database: new FormControl(this.dbconf.database, Validators.required)
    });
  }

  onYesClick(){
    this.configservice.config.dbconfProduction.selecteddatabase=this.profileForm.get('selecteddatabase').value;
    this.configservice.config.dbconfProduction.host=this.profileForm.get('host').value;
    this.configservice.config.dbconfProduction.port=this.profileForm.get('port').value;
    this.configservice.config.dbconfProduction.username=this.profileForm.get('username').value;
    this.configservice.config.dbconfProduction.password=this.profileForm.get('password').value;
    this.configservice.config.dbconfProduction.database=this.profileForm.get('database').value;
    this.dialogRef.close('ok');
  }
  onNoClick(){
    this.dialogRef.close();
  }

}
