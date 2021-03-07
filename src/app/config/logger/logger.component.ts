import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {Selectvalues} from "../../selectvalues";
import {ConfigService} from "../../service/config.service";

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {
  profileForm: FormGroup;
  logdestination: Selectvalues[] = [{value:0,viewValue:'File'},
  {value:1,viewValue:"Terminal"},
  {value:2,viewValue:"Both"}]; 
  log:any;

  constructor(private configservice:ConfigService) { }

  ngOnInit(): void {    
    if (this.configservice.config.logger!== undefined){ //for compatibitli reason
      this.log=this.configservice.config.logger;
    } else {
      this.log={type:0,file:'info.log',maxsize:50000,typewarn:0,filewarn:'warn.log',maxsizewarn:10000,typeerror:0,fileerror:'error.log',maxsizeerror:10000};
    }
    this.profileForm = new FormGroup({
      type : new FormControl(this.log.type, Validators.required),
      file: new FormControl(this.log.file, Validators.required),
      maxsize:new FormControl(this.log.maxsize),
      typewarn : new FormControl(this.log.typewarn, Validators.required),
      filewarn: new FormControl(this.log.filewarn, Validators.required),
      maxsizewarn:new FormControl(this.log.maxsizewarn),
      typeerror : new FormControl(this.log.typeerror, Validators.required),
      fileerror: new FormControl(this.log.fileerror, Validators.required),
      maxsizeerror:new FormControl(this.log.maxsizeerror),      
    });
  }
update(){
 this.configservice.config.logger= this.log={type:0,file:'info.log',maxsize:50000,typewarn:0,filewarn:'warn.log',maxsizewarn:10000,typeerror:0,fileerror:'error.log',maxsizeerror:10000}; //comtp reasons
 this.configservice.config.logger.type=this.profileForm.get('type').value;
 this.configservice.config.logger.file=this.profileForm.get('file').value;
 this.configservice.config.logger.maxsize=this.profileForm.get('maxsize').value;
 this.configservice.config.logger.typewarn=this.profileForm.get('typewarn').value;
 this.configservice.config.logger.filewarn=this.profileForm.get('filewarn').value;
 this.configservice.config.logger.maxsizewarn=this.profileForm.get('maxsizewarn').value;
 this.configservice.config.logger.typeerror=this.profileForm.get('typeerror').value;
 this.configservice.config.logger.fileerror=this.profileForm.get('fileerror').value;
 this.configservice.config.logger.maxsizeerror=this.profileForm.get('maxsizeerror').value;
}
}
