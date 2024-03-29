import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../service/config.service';
import { Schemahead } from '../interfaces/schemahead';
import { Api } from "../interfaces/api";
import { Schemaitem } from '../interfaces/schema'
import { FormControl, Validators, FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GenoptionsComponent } from '../genoptions/genoptions.component';
import { Overlay } from '@angular/cdk/overlay';
import { AddarrayComponent } from '../addarray/addarray.component';
import { Relations } from '../interfaces/relations';
import { ErrorComponent } from '../error/error.component';
import { MatSelectChange } from '@angular/material/select';

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
  bodyLogin:string;
  logout: string;
  password: string;
  token: string;
  reponse: string;
  reponselogout: string;
  schemas: Schemahead[];
  Schema: number;
  schemastring: string;
  apis: Api[];
  api: Api;
  operation: string;
  rtoken: string;
  profileForm: FormGroup;
  form = new FormData();
  operationarray: { value: string, viewValue: string }[] = [
    { value: 'getall', viewValue: 'Get All' },
    { value: 'getone', viewValue: 'Get One' },
    { value: 'skiplimit', viewValue: 'Get skiplimit by key' },
    { value: 'skiplimitbyfield', viewValue: 'Get skiplimit by field' },
    { value: 'skiplimitfilter', viewValue: 'Get limit filter' },
    { value: 'count', viewValue: 'Count' },
    { value: 'findandcount', viewValue: 'Find and Count' },
    { value: 'findandcountwithoptions', viewValue: 'Find and Count with options' },
    { value: 'findwithoptions', viewValue: 'Find with options' },
    { value: 'findgenerated', viewValue: 'Find with options and parameters' },
    { value: 'findandcountgenerated', viewValue: 'Find with options and parameters' }
  ];
  constructor(private fb: FormBuilder, private httpclient: HttpClient, private dialog: MatDialog, private genoption: MatDialog, private configservice: ConfigService, private overlay: Overlay) { }

  ngOnInit(): void {
    this.api = { id: 0, field: '', path: '', extfiles: '', type: '', roles: '', security: false, operation: '', options: '', parameters: [] };
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
      operation: new FormControl(0, Validators.required),
      header: new FormControl('', Validators.required),
      record: new FormControl(0),
      skip: new FormControl(0),
      limit: new FormControl(0),
      order: new FormControl('ASC'),
      field: new FormControl(''),
      file: new FormControl(['']),
      parameters: new FormArray([]),
      files: new FormControl(null),
      login: new FormControl(''),
      test: new FormControl(false),
      newpassword: new FormControl(''),
      body: new FormControl(''),
      reponse: new FormControl('')
    });
  }

  viewValue(value: string): string {
    if (value === "") return "";
    return this.operationarray.find(element => element.value === value).viewValue
  }

  onFileSelected(event) {
    this.form.getAll("file").forEach(element => { this.form.delete("file") });
    this.form.getAll("files").forEach(element => { this.form.delete("files") });
    const file: File = (event.target as HTMLInputElement).files[0];
    if (file) {
      this.form.set("file", file, file.name);
    }
  }
  onFilesSelected(event) {
    const files: FileList = event.target.files;
    this.form.getAll("file").forEach(element => { this.form.delete("file") });
    this.form.getAll("files").forEach(element => { this.form.delete("files") });
    Array.from(files).forEach(element => {
      this.form.append("files", element, element.name);
    });
  }
  changehost() {
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
        'Content-Type': 'application/json'
      })
    };
    this.loginheader = JSON.stringify({ 'Content-Type': 'application/json'}, null, 4);
    this.bodyLogin=JSON.stringify({ login:this.login,password:this.password},null,4);
    this.httpclient.post(this.url, {login:this.login,password:this.password}, httpOptions).subscribe((rep: { data: string, mensaje: string }) => {
      this.rtoken = rep.data;
      localStorage.setItem('token', rep.data);
      this.reponse = JSON.stringify(rep);
    }, error => { this.error(error) })
  }

  copytoken() {
    this.token = this.rtoken;
  }

  dologout() {
    this.url = this.urlpri + '/logout';
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.token}`,
      })
    };
    this.httpclient.post(this.url, '', httpOptions).subscribe(rep => this.reponselogout = JSON.stringify(rep), error => { this.error(error) });
  }

  gheader() {
    if (this.api.type === 'getfile') {
      this.profileForm.patchValue({
        header: `
      Please set reponse type to blob in Angular HttpCLient add in options parameter
      'authorization': 'Bearer '${this.token}`
      });
    } else {
      if (this.api.type !== 'uploadfile' && this.api.type !== 'uploadfiles') {
        this.profileForm.patchValue({
          header: JSON.stringify({
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.token
          }, null, 4)
        })
      } else {
        this.profileForm.patchValue({
          header: 'if you use Angular HttpClient not set Content-type\n' + JSON.stringify({
            'Content-Type': 'multipart/form-data',
            'authorization': 'Bearer ' + this.token
          }, null, 4)
        })
      }
    }
  }

  opengenoption() {
    const dialogRef = this.genoption.open(GenoptionsComponent, {
      width: '500px',
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: false,
      data: { fields: this.configservice.getfieldschemaswithid(this.profileForm.get('Schema').value) }
    });
    dialogRef.afterClosed().subscribe(ret => { if (ret !== undefined) { this.profileForm.patchValue({ 'body': ret }) } })
  }

  change() {
    this.profileForm.patchValue({ body: '', reponse: '', operation: 0 });
    this.apis = [...this.configservice.getapis(this.profileForm.get('Schema').value)];
    this.schemastring = this.configservice.getschemaname(this.profileForm.get('Schema').value);
  }
  get getlegtharray(): number {
    return (this.profileForm.get('parameters') as FormArray).length;
  }

  changeoperation(event: MatSelectChange) {
    let typea: Array<string> = [];
    const apinumber = event.value;
    this.profileForm.patchValue({ body: '', reponse: '', test: false });
    const fields: Schemaitem[] = this.configservice.getschematable(this.profileForm.get('Schema').value);
    const relations: Relations = this.configservice.getrelations(this.profileForm.get('Schema').value);
    this.api = this.configservice.getapi(this.profileForm.get('Schema').value, apinumber);
    typea = [this.api.type, this.api.operation];
    let body = '{';
    (this.profileForm.get('parameters') as FormArray).disable();
    switch (typea[0]) {
      case 'get':
        if (typea[1] === 'findgenerated' || typea[1] === 'findandcountgenerated') {
          (this.profileForm.get('parameters') as FormArray).clear();
          (this.profileForm.get('parameters') as FormArray).enable();
          this.api.parameters.forEach(element => {
            return (this.profileForm.get('parameters') as FormArray).push(this.fb.group({
              type: element.type,
              name: this.fb.control(element.name),
              value: this.fb.control('', Validators.required)
            }));
          });
        }
        if (typea[1] = 'findwithoptions') {
          this.profileForm.patchValue({ body: '{ "where": {"id": 1},"order": {"id": "ASC"},"skip": 0,"take": 10,"cache": true }' });
        }
        if (typea[1] = 'findandcountwithoptions') {
          this.profileForm.patchValue({ body: '{ "where": {"id": 1},"order": {"id": "ASC"},"skip": 0,"take": 10,"cache": true }' });
        }
        break;
      case 'uploadfile':
        break;
      case 'uploadfiles':
        break;
      case 'put':
        {
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
          const jsonvar = JSON.parse(body)
          this.profileForm.patchValue({ body: JSON.stringify(jsonvar, null, 4) });
        }
        break;
      case 'patch':
        {
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
          const jsonVar = JSON.parse(body)
          this.profileForm.patchValue({ body: JSON.stringify(jsonVar, null, 4) });
        }
        break;
      case 'post':
        {
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
          const jsonvar = JSON.parse(body)
          this.profileForm.patchValue({ body: JSON.stringify(jsonvar, null, 4) });
        }
        break;
      case 'postonetoone':
        {
          const onetoone = relations.OnetoOne.find(element => element.relationname = this.api.field);
          const fieldrelation = this.configservice.getschematable(this.configservice.getschemawithname(onetoone.table));
          fieldrelation.forEach((element, index) => {
            if (element.name !== 'id') {
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
          });
          body = body.substr(0, body.length - 1);
          body += body = '}';
          const jsonvar = JSON.parse(body)
          this.profileForm.patchValue({ body: JSON.stringify(jsonvar, null, 4) });
        }
        break;
      case 'postonetomany':
        {
          const onetomany = relations.Onetomany.find(element => element.relationname = this.api.field);
          const fieldrelation = this.configservice.getschematable(this.configservice.getschemawithname(onetomany.table));
          fieldrelation.forEach((element, index) => {
            if (element.name !== 'id') {
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
          });
          body = body.substr(0, body.length - 1);
          body += body = '}';
          const jsonvar = JSON.parse(body)
          this.profileForm.patchValue({ body: JSON.stringify(jsonvar, null, 4) });
        }
        break;
      case 'postmanytomany':
        {
          const manytomany = relations.Manytomany.find(element => element.relationname = this.api.field);
          const fieldrelation = this.configservice.getschematable(this.configservice.getschemawithname(manytomany.table));
          fieldrelation.forEach((element, index) => {
            if (element.name !== 'id') {
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
          });
          body = body.substr(0, body.length - 1);
          body += body = '}';
          const jsonvar = JSON.parse(body)
          this.profileForm.patchValue({ body: JSON.stringify(jsonvar, null, 4) });
        }
        break;
        case 'changepassword':{
          this.profileForm.patchValue({ body: JSON.stringify({login:'',password:''},null,4)});
        }
        break;
      default:
        this.profileForm.patchValue({ body: "" });
        break;
    }
  }

  changefile() {
    this.url = this.urlpri + `/${this.schemastring}/getFile/${this.api.path}/${this.profileForm.get('field').value}`;
  }

  ifarray(index: number) {
    if (this.api.parameters[index].type === "arraystring") {
      return true;
    } else {
      return false;
    }
  }
  addstringarray(index: number) {
    const dialogRef = this.genoption.open(AddarrayComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { values: (this.profileForm.get('parameters') as FormArray).at(index).get('value').value }
    });
    dialogRef.afterClosed().subscribe((ret: { values: [{ value: string }] }) => {
      let array: string = '';
      if (ret !== undefined) {
        ret.values.forEach((element, index) => {
          if (index === 0) {
            array = `${element.value}`;
          }
          else {
            array += ',' + `${element.value}`;
          }
        });
        (this.profileForm.get('parameters') as FormArray).at(index).patchValue({ value: array })
      }
    });
  }

  async send() {
    let httpOptions;
    let typea: string[];
    typea = [this.api.type, this.api.operation];
    switch (typea[0]) {
      case 'getfile':
        {
          if (this.profileForm.get('test').value !== true) {
            const headers = new HttpHeaders({ 'authorization': 'Bearer ' + this.token });
            this.url = this.urlpri + `/${this.schemastring}/getFile/${this.api.path}/${this.profileForm.get('field').value}`;
            const blob = await this.httpclient.get(this.url, { headers, responseType: 'blob' }).toPromise();
            const reader = new FileReader();
            reader.onloadend = () => this.profileForm.patchValue({ reponse: reader.result as string });
            reader.readAsDataURL(blob);
          }
        }
        break;
      case 'uploadfile':
        httpOptions = {
          headers: new HttpHeaders({
            'authorization': 'Bearer ' + this.token,
          })
        };
        this.url = this.urlpri + `/${this.schemastring}/Upload/${this.api.path}`;
        this.httpclient.post(this.url, this.form, httpOptions).subscribe(res => this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
        break;
      case 'uploadfiles':
        httpOptions = {
          headers: new HttpHeaders({
            'authorization': 'Bearer ' + this.token
          })
        };
        this.url = this.urlpri + `/${this.schemastring}/UploadFiles/${this.api.path}`;
        this.httpclient.post(this.url, this.form, httpOptions).subscribe(res => this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
        break;
      case 'changepassword':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}` + `/changepassword`;
        this.httpclient.put(this.url, this.profileForm.get('body').value , httpOptions).subscribe(res => this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) })
        break;
      case 'patch':
        {
          httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'authorization': 'Bearer ' + this.rtoken
            })
          };
          this.url = this.urlpri + `/${this.schemastring}/${this.profileForm.get('record').value}`;
          this.httpclient.patch(this.url, this.profileForm.get('body').value, httpOptions).subscribe(res =>
            this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
        }
        break;
      case 'get':
        switch (typea[1]) {
          case 'findandcountgenerated':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/findandcountgenerated${this.api.path}`;
            (this.profileForm.get('parameters') as FormArray).value.forEach(element => {
              if (element.type === 'string' || element.type === 'date' || element.type === 'arraystring')
                this.url += `/${encodeURI(element.value)}`
              else {
                this.url += `/${element.value}`;
              }
            });
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break;
          case 'findgenerated':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/findgenerated${this.api.path}`;
            (this.profileForm.get('parameters') as FormArray).value.forEach(element => {
              if (element.type === 'string' || element.type === 'date' || element.type === 'arraystring')
                this.url += `/${encodeURI(element.value)}`
              else {
                this.url += `/${element.value}`;
              }
            });
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break;
          case 'findwithoptions':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/findwithoptions${this.api.path}/${encodeURIComponent(this.profileForm.get('body').value)}`;
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break;
          case 'findandcountwithoptions':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/findandcountwithoptions${this.api.path}/${encodeURIComponent(this.profileForm.get('body').value)}`;
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break;
          case 'findandcount':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/findandcount`;
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break;
          case 'count':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/count`;
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break;
          case 'getone':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/getone/${this.profileForm.get('record').value}`;
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break;
          case 'getall':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}`;
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break;
          case 'skiplimit':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/skiplimit/${this.profileForm.get('skip').value}/${this.profileForm.get('limit').value}/${this.profileForm.get('order').value}`
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break
          case 'skiplimitbyfield':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/skiplimitorder${this.api.field}/${this.profileForm.get('skip').value}/${this.profileForm.get('limit').value}/${this.profileForm.get('order').value}`
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break
          case 'skiplimitfilter':
            httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + this.rtoken
              })
            };
            this.url = this.urlpri + `/${this.schemastring}/skiplimitfilter${this.api.field}/${this.profileForm.get('skip').value}/${this.profileForm.get('limit').value}/${this.profileForm.get('order').value}/${this.profileForm.get('field').value}`
            this.httpclient.get(this.url, httpOptions).subscribe(res =>
              this.profileForm.patchValue({ reponse: JSON.stringify(res, null, 4) }), error => { this.error(error) });
            break
          default:
            break;
        }
        break;
      case 'postonetoone':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}/oneToOne/${this.api.path}/${this.profileForm.get('record').value}`;
        this.httpclient.post(this.url, this.profileForm.get('body').value, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res, null, 4) }), error => { this.error(error) });
        break;
      case 'postonetomany':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}/onetomany/${this.api.path}/${this.profileForm.get('record').value}`;
        this.httpclient.post(this.url, this.profileForm.get('body').value, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res, null, 4) }), error => { this.error(error) });
        break;
      case 'postmanytomany':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}/ManyToMany/${this.api.path}/${this.profileForm.get('record').value}`;
        this.httpclient.post(this.url, this.profileForm.get('body').value, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res, null, 4) }), error => { this.error(error) });
        break;
      case 'post':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}`
        this.httpclient.post(this.url, this.profileForm.get('body').value, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res, null, 4) }), error => { this.error(error) });
        break;
      case 'put':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}`;
        this.httpclient.put(this.url, this.profileForm.get('body').value, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res, null, 4) }), error => { this.error(error) });
        break;
      case 'delete':
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + this.rtoken
          })
        };
        this.url = this.urlpri + `/${this.schemastring}/${this.profileForm.get('record').value}`
        this.httpclient.delete(this.url, httpOptions).
          subscribe(res => this.profileForm.patchValue({ "reponse": JSON.stringify(res, null, 4) }), error => { this.error(error) });
        break;
      default:
        break;
    }

  }
  get aliasesArrayControl(): AbstractControl[] {
    return (this.profileForm.get('parameters') as FormArray).controls;
  }
  expand() {
    this.url = "";
  }

  error(error: HttpErrorResponse) {
    console.log('error:',error);
    const dialogRef = this.dialog.open(ErrorComponent, {
      disableClose: false,
      data: { message: 'Check your server', error: error.error.message }
    });
  }


}
