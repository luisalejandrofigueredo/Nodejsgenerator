import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {ConfigService} from '../service/config.service';
import {Schemahead} from '../interfaces/schemahead';
import { Api } from "../interfaces/api";
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-testapi',
  templateUrl: './testapi.component.html',
  styleUrls: ['./testapi.component.scss']
})
export class TestapiComponent implements OnInit {
  login:string;
  logout:string;
  password:string;
  token:string;
  reponse:string;
  reponselogout:string;
  schemas:Schemahead[];
  Schema:number;
  schemastring:string;
  apis:Api[];
  operation:string;
  rtoken:string;
  profileForm: FormGroup;
  constructor(private httpclient:HttpClient,private configservice:ConfigService) { }

  ngOnInit(): void {
    this.schemas=this.configservice.getschema();
    this.profileForm = new FormGroup({
      Schema: new FormControl(this.schemas, Validators.required),
      operation: new FormControl(this.operation, Validators.required),
      header: new FormControl('',Validators.required),
      body:new FormControl(''),
      reponse:new FormControl('')
    });
  }

  dologin(){
    const url='http://127.0.0.1:3000/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'login':this.login,
        'password':this.password
      })};
    this.httpclient.post(url,'',httpOptions).subscribe((rep:{mensaje:string,token:string})=> {
      this.rtoken=rep.token;
      this.reponse=JSON.stringify(rep);
    })
  }

  copytoken(){
    this.token=this.rtoken;
  }

  dologout(){
    const url='http://127.0.0.1:3000/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'login':this.logout,
        'token':this.token
      })};
      this.httpclient.get(url,httpOptions).subscribe(rep=> this.reponselogout= JSON.stringify(rep));

  }

  gheader(){
    this.profileForm.patchValue({header: JSON.stringify({token: this.rtoken})})
  }

  change(){
    this.apis= [...this.configservice.getapis(this.profileForm.get('Schema').value)];
    this.schemastring= this.configservice.getschemaname(this.profileForm.get('Schema').value);
  }

  send()
  { 
    const typea:string[]=(this.profileForm.get('operation').value).split(' ');
    console.log(typea[0]);
    console.log(typea[1]);
    switch (typea[0]) {
      case 'get':
        switch (typea[1]) {
          case 'getall':
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'token':this.rtoken
              })};
            this.httpclient.get(`http://127.0.0.1:3000/${this.schemastring}`,httpOptions).subscribe(res=>
            this.profileForm.patchValue({reponse:JSON.stringify(res)}));
            break;
          default:
            break;
        }
        break;
    
      default:
        break;
    }

  }

}
