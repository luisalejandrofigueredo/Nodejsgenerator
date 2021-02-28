import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {Selectvalues} from '../selectvalues';
@Component({
  selector: 'app-gensecurity',
  templateUrl: './gensecurity.component.html',
  styleUrls: ['./gensecurity.component.scss']
})
export class GensecurityComponent implements OnInit {
  schemas: Selectvalues[] = [];
  fields: Selectvalues[] = [];
  selectedValue: string;
  selectedFieldlogin: string;
  selectedFieldpassword: string;
  selectedFieldtoken: string;
  profileForm: FormGroup;

  constructor(private configservice: ConfigService) { }

  ngOnInit(): void {
    const sec = this.configservice.getsecurity();
    if (sec.table !== undefined) {
      this.profileForm = new FormGroup({
        selectedValue: new FormControl(sec.table, Validators.required),
        selectedFieldlogin: new FormControl(sec.login, Validators.required),
        selectedFieldpassword: new FormControl(sec.password, Validators.required),
        selectedFieldtoken: new FormControl(sec.bearertoken, Validators.required),
        filegenerated: new FormControl(sec.filegenerated,Validators.required ),
        backdoor: new FormControl(sec.backdoor)
      });
      this.getfields();
    } else {
      this.profileForm = new FormGroup({
        selectedValue: new FormControl(''),
        selectedFieldlogin: new FormControl(''),
        selectedFieldpassword: new FormControl(''),
        selectedFieldtoken: new FormControl(''),
        filegenerated: new FormControl(''),
        backdoor: new FormControl('')
      });
    }
    const schemasname = this.configservice.getschemasname();
    schemasname.forEach(element => {
      this.schemas.push({ value: element.id, viewValue: element.name });
    });
  }

  changeschema() {
    this.getfields();
  }

  getfields(){
    const selValue = this.profileForm.get('selectedValue').value;
    const fields = this.configservice.getfieldswithid(+selValue);
    this.fields = [];
    fields.forEach(element => {
      this.fields.push({ value: element.id, viewValue: element.name });
    });
  }

  generatesecurity(){
    const sec = {table: this.schemas[this.profileForm.get('selectedValue').value-1].viewValue,
      login: this.fields[this.profileForm.get('selectedFieldlogin').value-1].viewValue,
      password: this.fields[this.profileForm.get('selectedFieldpassword').value-1].viewValue,
      bearertoken: this.fields[this.profileForm.get('selectedFieldtoken').value-1].viewValue,
      filegenerated: this.profileForm.get('filegenerated').value,
      backdoor: this.profileForm.get('backdoor').value};
      console.log('sec',sec)
    this.configservice.setsecurity(sec);
  }
}
