import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../service/config.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ElectronService } from 'ngx-electron';
import { Selectvalues } from '../selectvalues';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Security } from '../interfaces/security';
@Component({
  selector: 'app-gensecurity',
  templateUrl: './gensecurity.component.html',
  styleUrls: ['./gensecurity.component.scss']
})
export class GensecurityComponent implements OnInit {
  schemas: Selectvalues[] = [];
  fields: Selectvalues[] = [];
  path: string;
  file: string = '';
  filelogin: string = '';
  filegenerated = false;
  profileForm: FormGroup;

  constructor(private router: Router, private matsnackbar: MatSnackBar, private configservice: ConfigService, private electronservice: ElectronService,) { }

  ngOnInit(): void {
    const sec = this.configservice.getsecurity();
    if (sec.path === undefined) {
      this.path = this.configservice.config.filePath;
    } else {
      this.path = sec.path;
    }
    if (sec.rolesclass === undefined) {
      sec.rolesclass = 'RolesGuard';
    }
    if (sec.logger === undefined) {
      sec.logger = true;
    }
    const schemasname = this.configservice.getschemasname();
    schemasname.forEach(element => {
      this.schemas.push({ value: element.id, viewValue: element.name });
    });
    if (sec.table !== undefined && sec.table!=="") {
      const tableid = this.configservice.getschemaid(sec.table);
      this.profileForm = new FormGroup({
        selectedValue: new FormControl(tableid, Validators.required),
        selectedFieldlogin: new FormControl(this.configservice.getfieldid(tableid, sec.login), Validators.required),
        selectedFieldpassword: new FormControl(this.configservice.getfieldid(tableid, sec.password), Validators.required),
        selectedFieldtoken: new FormControl(this.configservice.getfieldid(tableid, sec.bearertoken), Validators.required),
        selectedFieldroles: new FormControl(this.configservice.getfieldid(tableid, sec.roles), Validators.required),
        selectedFieldCount: new FormControl(this.configservice.getfieldid(tableid, sec.count), Validators.required),

      });
    } else {
      this.profileForm = new FormGroup({
        selectedValue: new FormControl(0, Validators.required),
        selectedFieldlogin: new FormControl('', Validators.required),
        selectedFieldpassword: new FormControl('', Validators.required),
        selectedFieldtoken: new FormControl('', Validators.required),
        selectedFieldroles: new FormControl('', Validators.required),
        selectedFieldCount: new FormControl('', Validators.required),
      });
    }
    this.getfields();
  }

  changeschema() {
    this.getfields();
  }

  getpath() {
    this.electronservice.remote.dialog.showOpenDialog(this.electronservice.remote.getCurrentWindow(), { defaultPath: this.configservice.config.filePath, properties: ['openDirectory'] }).then(path => this.path = path.filePaths[0]);
  }

  getfields() {
    const selValue = this.profileForm.get('selectedValue').value;
    if (+selValue !== 0) {
      const fields = this.configservice.getfieldschemaswithid(+selValue);
      this.fields = [];
      fields.forEach(element => {
        this.fields.push({ value: element.id, viewValue: element.name });
      });
    }
  }

  generatesecurity() {
    const sec = {
      table: this.schemas[this.profileForm.get('selectedValue').value - 1].viewValue,
      login: this.fields[this.profileForm.get('selectedFieldlogin').value - 1].viewValue,
      password: this.fields[this.profileForm.get('selectedFieldpassword').value - 1].viewValue,
      bearertoken: this.fields[this.profileForm.get('selectedFieldtoken').value - 1].viewValue,
      roles: this.fields[this.profileForm.get('selectedFieldroles').value - 1].viewValue,
      count: this.fields[this.profileForm.get('selectedFieldCount').value - 1].viewValue,
    } as Security;
    this.configservice.setsecurity(sec);
    this.matsnackbar.open('security update  ', 'Action update', {
      duration: 2000,
    });
    this.filegenerated = true;
  }
}