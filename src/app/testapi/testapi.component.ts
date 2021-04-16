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
  port: string;
  host: string;
  urlpri: string;
  url: string;
  login: string;
  loginheader: string;
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
    this.host = '127.0.0.1';
    this.port = this.configservice.config.port.toString();
    if (this.configservice.config.enablehttps === false) {
      this.urlpri = `http://${this.host}:${this.port}`;
    } else {
      this.urlpri = `https://${this.host}:${this.port}`;
    }
    if (localStorage.getItem('token') !== null) {
      this.token = localStorage.getItem('token');
      this.rtoken = localStorage.getItem('token');
    }
    this.schemas = this.configservice.getschema();
    this.profileForm = new FormGroup({
      Schema: new FormControl(this.schemas, Validators.required),
      operation: new FormControl('', Validators.required),
      header: new FormControl('', Validators.required),
      record: new FormControl(0),
      skip: new FormControl(0),
      limit: new FormControl(0),
      order: new FormControl('ASC'),
      field: new FormControl(''),
      login: new FormControl(''),
      newpassword: new FormControl(''),
      body: new FormControl(''),
      reponse: new FormControl('')
    });
  }

  changehost(){
    if (this.configservice.config.enablehttps === false) {
      this.urlpri = `http://${this.host}:${this.port}`;
    } else {
      this.urlpri = `https://${this.host}:${this.port}`;
    }
  }

  dologin() {
    this.url = this.urlpri + '/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'login': this.login,
        'password': this.password
      })
    };
    this.loginheader = JSON.stringify({ 'Content-Type': 'application/json', 'login': this.login, 'password': this.password }, null, 4);
    this.httpclient.post(this.url, '', httpOptions).subscribe((rep: { mensaje: string, token: string }) => {
      this.rtoken = rep.token;
      localStorage.setItem('token', rep.token);
      this.reponse = JSON.stringify(rep);
    })
  }

  copytoken() {
    this.token = this.rtoken;
  }

  dologout() {
    this.url = this.urlpri + '/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'login': this.logout,
        'authorization': 'Bearer '+this.rtoken
      })
    };
    this.httpclient.get(this.url, httpOptions).subscribe(rep => this.reponselogout = JSON.stringify(rep));
  }

  gheader() {
    this.profileForm.patchValue({
      header: JSON.stringify({
        'Content-Type': 'application/json',
        'authorization': 'Bearer '+this.token
      }, null, 4)
    })
  }

  change() {
    this.profileForm.patchValue({ body: '', reponse: '' });
    this.apis = [...this.configservice.getapis(this.profileForm.get('Schema').value)];
    this.schemastring = this.configservice.getschemaname(this.profileForm.get('Schema').value);
  }

  changeoperation() {
    this.profileForm.patchValue({ body: '', reponse: '' });
    const typea: string[] = (this.profileForm.get('operation').value).split(' ');
    const fields: Schemaitem[] = this.configservice.getschematable(this.profileForm.get('Schema').value);
    let body = '{';
    switch (typea[0]) {
      case 'put':
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
        this.profileForm.patchValue({ body: "" });
        break;
    }
  }

  send() {
    let httpOptions;
    const typea: string[] = (this.profileForm.get('operation').value).split(' ');
    console.log(typea[0]);
    console.log(typea[1]);
    switch (typea[0]) {
      case 'changepassword':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer '+this.rtoken
          })
        };
        this.url= this.urlpri+`/${this.schemastring}`+`/changepassword/${encodeURI(this.profileForm.get('login').value)}/${encodeURI(this.profileForm.get('newpassword').value)}`;
        this.httpclient.put(this.url,{},httpOptions).subscribe(res=> this.profileForm.patchValue({ reponse:JSON.stringify(res,null,4) }))
      break;
      case 'get':
        switch (typea[1]) {
          case 'getone':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/${this.profileForm.get('record').value}`;
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }));
            break;
          case 'getall':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}`;
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }));
            break;
          case 'skiplimit':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/skiplimit/${this.profileForm.get('skip').value}/${this.profileForm.get('limit').value}/${this.profileForm.get('order').value}`
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }));
            break
          case 'skiplimitbyfield':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/skiplimitorder${typea[2]}/${this.profileForm.get('skip').value}/${this.profileForm.get('limit').value}/${this.profileForm.get('order').value}`
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }));
            break
          case 'skiplimitfilter':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/skiplimitfilter${typea[2]}/${this.profileForm.get('skip').value}/${this.profileForm.get('limit').value}/${this.profileForm.get('order').value}/${this.profileForm.get('field').value}`
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }));
            break
          default:
            break;
        }
        break;
      case 'post':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer '+this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}`
        this.httpclient.post(this.url, this.profileForm.get('body').value, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res, null, 4) }));
        break;
      case 'put':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer '+this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}`;
        this.httpclient.put(this.url, this.profileForm.get('body').value, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res, null, 4) }));
        break;
      case 'delete':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer '+this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}/${this.profileForm.get('record').value}`
        this.httpclient.delete(this.url, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res, null, 4) }));
        break;
      default:
        break;
    }

  }

  expand() {
    this.url = "";
  }

}
