import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../service/config.service';
import { Schemahead } from '../interfaces/schemahead';
import { Api } from "../interfaces/api";
import { Schemaitem } from '../interfaces/schema'
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-testapi',
  templateUrl: './testapi.component.html',
  styleUrls: ['./testapi.component.scss']
})
export class TestapiComponent implements OnInit {
  login: string;
  logout: string;
  password: string;
  token: string;
  reponse: string;
  reponselogout: string;
  schemas: Schemahead[];
  Schema: number;
  schemastring: string;
  apis: Api[];
  operation: string;
  rtoken: string;
  profileForm: FormGroup;
  constructor(private httpclient: HttpClient, private configservice: ConfigService) { }

  ngOnInit(): void {
    this.schemas = this.configservice.getschema();
    this.profileForm = new FormGroup({
      Schema: new FormControl(this.schemas, Validators.required),
      operation: new FormControl('', Validators.required),
      header: new FormControl('', Validators.required),
      getone: new FormControl(0),
      skip: new FormControl(0),
      limit: new FormControl(0),
      order: new FormControl('ASC'),
      field: new FormControl(''),
      body: new FormControl(''),
      reponse: new FormControl('')
    });
  }

  dologin() {
    const url = 'http://127.0.0.1:3000/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'login': this.login,
        'password': this.password
      })
    };
    this.httpclient.post(url, '', httpOptions).subscribe((rep: { mensaje: string, token: string }) => {
      this.rtoken = rep.token;
      this.reponse = JSON.stringify(rep);
    })
  }

  copytoken() {
    this.token = this.rtoken;
  }

  dologout() {
    const url = 'http://127.0.0.1:3000/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'login': this.logout,
        'token': this.token
      })
    };
    this.httpclient.get(url, httpOptions).subscribe(rep => this.reponselogout = JSON.stringify(rep));

  }

  gheader() {
    this.profileForm.patchValue({ header: JSON.stringify({ token: this.rtoken }) })
  }

  change() {
    this.apis = [...this.configservice.getapis(this.profileForm.get('Schema').value)];
    this.schemastring = this.configservice.getschemaname(this.profileForm.get('Schema').value);
  }

  changeoperation() {
    console.log(this.profileForm.get('operation').value);
    const typea: string[] = (this.profileForm.get('operation').value).split(' ');
    const fields: Schemaitem[] = this.configservice.getschematable(this.profileForm.get('Schema').value);
    let body = '{';
    switch (typea[0]) {
      case 'post':
        for (let index = 0; index < fields.length; index++) {
          const element = fields[index];
          switch (element.type) {
            case 'number':
              body += `"${element.name}"` + ':0,';
              break;
            case 'string':
              body += `"${element.name}"` + ':"",';
              break;
            case 'date':
              body += `"${element.name}"` + ':"2012-04-23T18:25:43.511Z",'
              break;
            default:
              break;
          }
        }
        body = body.substr(0, body.length - 1);
        body += body = '}';
        console.log(body);
        const jsonvar = JSON.parse(body)
        this.profileForm.patchValue({ body: JSON.stringify(jsonvar, null, 4) });
        break;
      default:
        break;
    }
  }

  send() {
    let httpOptions;
    let url: string;
    const typea: string[] = (this.profileForm.get('operation').value).split(' ');
    console.log(typea[0]);
    console.log(typea[1]);
    switch (typea[0]) {
      case 'get':
        switch (typea[1]) {
          case 'getone':
            httpOptions = {
              header: new HttpHeaders({
                'Content-Type': 'application/json',
                'token': this.rtoken
              })
            };
            this.httpclient.get(`http://127.0.0.1:3000/${this.schemastring}/getone/${this.profileForm.get('getone').value}`, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res,null,4) }));
            break;
          case 'getall':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'token': this.rtoken
              })
            };
            this.httpclient.get(`http://127.0.0.1:3000/${this.schemastring}`, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res,null,4) }));
            break;
          case 'skiplimit':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'token': this.rtoken
              })
            };
            url = `http://127.0.0.1:3000/${this.schemastring}/skiplimit/${this.profileForm.get('skip').value}/${this.profileForm.get('limit').value}/${this.profileForm.get('order').value}`
            this.httpclient.get(url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res,null,4) }));
            break
          case 'skiplimitbyfield':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'token': this.rtoken
              })
            };
            url = `http://127.0.0.1:3000/${this.schemastring}/skiplimitorder${typea[2]}/${this.profileForm.get('skip').value}/${this.profileForm.get('limit').value}/${this.profileForm.get('order').value}`
            this.httpclient.get(url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res,null,4) }));
            break
            case 'skiplimitfilter':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'token': this.rtoken
              })
            };
            url = `http://127.0.0.1:3000/${this.schemastring}/skiplimitfilter${typea[2]}/${this.profileForm.get('skip').value}/${this.profileForm.get('limit').value}/${this.profileForm.get('order').value}/${this.profileForm.get('field').value}`
            this.httpclient.get(url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res,null,4) }));
            break
          default:
            break;
        }
        break;
      case 'post':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'token': this.rtoken
          })
        };
        this.httpclient.post(`http://127.0.0.1:3000/${this.schemastring}`, this.profileForm.get('body').value, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res,null,4) }));
        break;
      default:
        break;
    }

  }

}
