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
    this.generatefilesecurity();
    this.generatefileloginservice();
    this.matsnackbar.open('all generated not forget save schema','Action write file',{
      duration: 2000,
    });
    this.filegenerated=true;
  }

  generatefilesecurity() {
    const sec=this.configservice.getsecurity();
    this.file= `import { Injectable, Inject,CanActivate, ExecutionContext} from '@nestjs/common';\n`
    this.file+=`import { Reflector } from '@nestjs/core';\n`;
    this.file+=`import { JwtService } from '@nestjs/jwt';\n`;
    this.file+=`import { Request } from 'express';\n`;
    if (sec.logger === true){
      this.file+=`import { Logger } from 'winston';\n`;
  }
  //importing security service and entity
  this.file+=`import { ${sec.table}Service } from '../service/${sec.table.toLowerCase()}.service';\n`;
  this.file+=`import { ${sec.table} } from '../entitys/${sec.table.toLowerCase()}.entity';\n`;
  this.file+='@Injectable()\n';
  this.file+=`export class ${sec.rolesclass} implements CanActivate {\n`;
  this.file+='constructor(';
  if (sec.logger === true){
    this.file+=`@Inject('winston') private readonly logger: Logger,`;
   }
   this.file+='private reflector:Reflector,';
   this.file+=`private ${sec.table.toLowerCase()}service:${sec.table}Service,`;
   this.file+=`private readonly jwtService: JwtService){}\n`;
   this.file+=`async canActivate(context: ExecutionContext): Promise<boolean>\n`;
   this.file+='{\n';
   this.file+=` const roles = this.reflector.get<string[]>('roles', context.getHandler());\n`;
   this.file+=` const request:Request = context.switchToHttp().getRequest();\n`;
   this.file+=` const ip= request.ip;\n`;
   this.file+=` let ${sec.table.toLowerCase()}:${sec.table};\n`;
   this.file+=`if (request.headers.token === undefined) {\n`;
   this.file+=` const date= new Date();\n`;
   if (sec.logger === true){
    this.file+=" this.logger.warn(`Hacker from ip ${ip} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`)\n";
   }
   this.file+=' return false;\n }\n';
   this.file+='const username = this.jwtService.decode(request.headers.token as string) as {login:string | null} | null;\n';
   this.file+='if (username ===  null || username=== undefined) { this.logger.warn("hacker");return false; };\n';
   this.file+=`await this.${sec.table.toLowerCase()}service.getlogin(username.login).then( userb=> ${sec.table.toLowerCase()}=userb);\n`;
   this.file+=`if (${sec.table.toLowerCase()} === undefined || ${sec.table.toLowerCase()} === null) {\n`;
   this.file+=' this.logger.warn(`Undefined user hacker ip:${ip}`);\n';
   this.file+=` return false;\n`;
   this.file+='}\n';
   this.file+=`if (${sec.table.toLowerCase()}.${sec.bearertoken} === request.headers.bearer) {\n`;
   this.file+=` return true;`;
   this.file+=`} else { \n`;
   this.file+=` const date= new Date();`;
   this.file+=' this.logger.warn(`No logged false bearer from ip: ${ip} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);';
   this.file+=' return false;';
   this.file+=`}\n`;
   this.file+='}\n';
   this.file+='autroles(roles:string[],rolessuser:string):boolean {\n';
   this.file+=' const arolesuser:string[]=rolessuser.split(" ");\n';
   this.file+=' let find= false;\n';
   this.file+=' arolesuser.forEach(element => {\n';
   this.file+=' if (roles.find(elementa => elementa === element)) {\n';
   this.file+=' find=true;';
   this.file+='}});\n'
   this.file+=' return find;\n';
   this.file+='}\n}\n';
   const args = { path: this.configservice.config.filePath, name: 'roles', file: this.file };
   const end = this.electronservice.ipcRenderer.sendSync('savecanactivate', args);
}

generatefileloginservice(){
 const sec=this.configservice.getsecurity();
 this.filelogin='import { Controller, Inject, Get, Headers, Post, Ip } from "@nestjs/common";\n';
 this.filelogin+=`import { ${sec.table}Service } from '../service/${sec.table.toLowerCase()}.service';\n`;
 this.filelogin+=`import { ${sec.table} } from '../entitys/${sec.table.toLowerCase()}.entity';\n`;
 this.filelogin+='import { JwtService } from "@nestjs/jwt"\n';
 this.filelogin+='import * as bcrypt from "bcrypt";\n';
 this.filelogin+='import { Logger } from "winston";\n\n';
 this.filelogin+='@Controller("login")\n';
 this.filelogin+='export class LoginController {\n';
 this.filelogin+='constructor(@Inject("winston") private readonly logger: Logger,';
 this.filelogin+=`  private ${sec.table.toLowerCase()}service:${sec.table}Service,`;
 this.filelogin+='  private readonly jwtService: JwtService) { }\n';
 this.filelogin+='  @Post()\n';
 this.filelogin+='  async login(@Ip() ip,@Headers() header) {\n';
 this.filelogin+=`  const date = new Date();\n`;
 this.filelogin+=`  const ${sec.table.toLowerCase()}: ${sec.table} = (await this.${sec.table.toLowerCase()}service.getlogin(header.login));\n`;
 this.filelogin+=`  if ( ${sec.table.toLowerCase()} === undefined ||  ${sec.table.toLowerCase()} === null) {\n`;
 this.filelogin+='    const date = new Date(Date.now());\n';
 this.filelogin+="    this.logger.warn(`Login fail user no exist possible hacker atack from ip:${ip} ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);\n";
 this.filelogin+="    return { message:'no login'}\n";
 this.filelogin+='  }\n';
 this.filelogin+=`if (bcrypt.compareSync(header.password, ${sec.table.toLowerCase()}.${sec.password})) {`;
 this.filelogin+=` ${sec.table.toLowerCase()}.${sec.bearertoken} = this.jwtService.sign({ Login:${sec.table.toLowerCase()}.${sec.login} });`;
 this.filelogin+=` await this.${sec.table.toLowerCase()}service.update(${sec.table.toLowerCase()});`;
 this.filelogin+=" this.logger.info(`Login: ${";
 this.filelogin+=` ${sec.table.toLowerCase()}.${sec.login}}`;
 this.filelogin+=" ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);\n"
 this.filelogin+= " return { mensaje:'ok',token:";
 this.filelogin+= `${sec.table.toLowerCase()}.${sec.bearertoken}};\n`;
 this.filelogin+= "} else {\n"
 this.filelogin+= " this.logger.warn(`wrong password user ${";
 this.filelogin+=`${sec.table.toLowerCase()}.${sec.login}}`;
 this.filelogin+="}`)\n";
 this.filelogin+="return { mensaje:'no login'}}\n";
 this.filelogin+="}\n";
 this.filelogin+="@Get()\n";
 this.filelogin+=`async logout(@Ip() ip,@Headers() header) {\n`;
 this.filelogin+=`const ${sec.table.toLowerCase()}: ${sec.table} = (await this.${sec.table.toLowerCase()}service.getlogin(header.login));\n`;
 this.filelogin+='const date = new Date(Date.now());\n'
 this.filelogin+='const locdate= date.toLocaleDateString();\n';
 this.filelogin+='const hour= date.toLocaleTimeString();\n'
 this.filelogin+=`if (${sec.table.toLowerCase()} === undefined || ${sec.table.toLowerCase()} === null) {`;
 this.filelogin+='this.logger.warn(`Posible ataque hacker en logout usuario inexistente:${date} ${hour}`);\n';
 this.filelogin+=`return { mensaje:'error'};\n`;
 this.filelogin+='}\n';
 this.filelogin+=`if (${sec.table.toLowerCase()}.${sec.bearertoken} !== header.token) {\n`;
 this.filelogin+='this.logger.warn(`hacker attack false bearer token ${ip} ${date} ${hour}`);\n';
 this.filelogin+=`return { mensaje:'error'}`;
 this.filelogin+='}';
 this.filelogin+=`${sec.table.toLowerCase()}.${sec.bearertoken}=''\n`;
 this.filelogin+=`await this.${sec.table.toLowerCase()}service.update(${sec.table.toLowerCase()});\n`;
 this.filelogin+="this.logger.info(`logout:${";
 this.filelogin+=`${sec.table.toLowerCase()}.${sec.login}}`; 
 this.filelogin+='${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);\n';
 this.filelogin+="return { mensaje:'logout'};\n"
 this.filelogin+='}\n}\n';

 const args = { path: this.configservice.config.filePath, name: 'Login', file: this.filelogin };
 const end = this.electronservice.ipcRenderer.sendSync('saveController', args);   
}

viewfilegenerated(){
   this.router.navigate(['/viewsecurity',this.file,this.filelogin]);
}
}
