import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-gensecurity',
  templateUrl: './gensecurity.component.html',
  styleUrls: ['./gensecurity.component.scss']
})
export class GensecurityComponent implements OnInit {
  schemas: any[] = [];
  fields: any[] = [];
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
      });
      this.getfields();
    } else {
      this.profileForm = new FormGroup({
        selectedValue: new FormControl(''),
        selectedFieldlogin: new FormControl(''),
        selectedFieldpassword: new FormControl(''),
        selectedFieldtoken: new FormControl(''),
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
    const sec = {table: this.selectedValue,
      login: this.selectedFieldlogin,
      password: this.selectedFieldpassword,
      bearertoken: this.selectedFieldtoken};
    this.configservice.setsecurity(sec);
  }
}
