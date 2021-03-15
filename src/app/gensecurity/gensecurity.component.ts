import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../service/config.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ElectronService } from 'ngx-electron';
import { Selectvalues } from '../selectvalues';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-gensecurity',
  templateUrl: './gensecurity.component.html',
  styleUrls: ['./gensecurity.component.scss']
})
export class GensecurityComponent implements OnInit {
  schemas: Selectvalues[] = [];
  fields: Selectvalues[] = [];
  path:string;
  file:string='';
  filelogin:string='';
  filegenerated= false;
  profileForm: FormGroup;

  constructor(private router:Router,private matsnackbar:MatSnackBar, private configservice: ConfigService,private electronservice: ElectronService,) { }

  ngOnInit(): void {
    const sec = this.configservice.getsecurity();
    if (sec.path === undefined){
          this.path= this.configservice.config.filePath;
    } else
    {
      this.path = sec.path;
    }
    if (sec.rolesclass === undefined){
      sec.rolesclass='RolesGuard';
    } 
    if (sec.logger === undefined){
      sec.logger=true;
    } 
    const schemasname = this.configservice.getschemasname();
    schemasname.forEach(element => {
      this.schemas.push({ value: element.id, viewValue: element.name });
    });
    if (sec.table !== undefined) {
      const tableid=this.configservice.getschemaid(sec.table);
      this.profileForm = new FormGroup({
        selectedValue: new FormControl(tableid, Validators.required),
        selectedFieldlogin: new FormControl(this.configservice.getfieldid(tableid,sec.login), Validators.required),
        selectedFieldpassword: new FormControl(this.configservice.getfieldid(tableid,sec.password), Validators.required),
        selectedFieldtoken: new FormControl(this.configservice.getfieldid(tableid,sec.bearertoken), Validators.required),
        selectedFieldroles: new FormControl(this.configservice.getfieldid(tableid,sec.roles), Validators.required),
        filegenerated: new FormControl(sec.filegenerated,Validators.required ),
        rolesclass: new FormControl(sec.rolesclass,Validators.required ),
        backdoor: new FormControl(sec.backdoor),
        logger: new FormControl(sec.logger)
      });
    } else {
      this.profileForm = new FormGroup({
        selectedValue: new FormControl('',Validators.required),
        selectedFieldlogin: new FormControl('',Validators.required),
        selectedFieldpassword: new FormControl('',Validators.required),
        selectedFieldtoken: new FormControl('',Validators.required),
        selectedFieldroles: new FormControl('', Validators.required),
        filegenerated: new FormControl('',Validators.required),
        rolesclass: new FormControl('',Validators.required ),
        backdoor: new FormControl(''),
        logger:new FormControl('')
      });
    }
    this.getfields();
  }

  changeschema() {
    this.getfields();
  }

  getpath(){
    this.electronservice.remote.dialog.showOpenDialog(this.electronservice.remote.getCurrentWindow(), { defaultPath: this.configservice.config.filePath, properties: ['openDirectory'] }).then(path=> this.path=path.filePaths[0]);
  }

  getfields(){
    const selValue = this.profileForm.get('selectedValue').value;
    const fields = this.configservice.getfieldschemaswithid(+selValue);
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
      roles: this.fields[this.profileForm.get('selectedFieldroles').value-1].viewValue,
      rolesclass: this.profileForm.get('rolesclass').value,
      filegenerated: this.profileForm.get('filegenerated').value,
      path: this.path,
      backdoor: this.profileForm.get('backdoor').value,
      logger: this.profileForm.get('logger').value
    };
    this.configservice.setsecurity(sec);
    this.matsnackbar.open('security update  ','Action update',{
      duration: 2000,
    });
    this.filegenerated=true;
  }
}