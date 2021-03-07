import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {Selectvalues} from "../../selectvalues";

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

  constructor() { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      type : new FormControl(0, Validators.required),
      file: new FormControl('info.log', Validators.required),
      maxsize:new FormControl(50000),
      typewarn : new FormControl(0, Validators.required),
      filewarn: new FormControl('warn.log', Validators.required),
      maxsizewarn:new FormControl(10000),
      typeerror : new FormControl(0, Validators.required),
      fileerror: new FormControl('error.log', Validators.required),
      maxsizeerror:new FormControl(10000),      
    });
  }
update(){
  
}
}
