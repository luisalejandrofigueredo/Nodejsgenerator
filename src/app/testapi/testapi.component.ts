import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

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
  constructor(private httpclient:HttpClient) { }

  ngOnInit(): void {
  }

  dologin(){
    const url='http://127.0.0.1:3000/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'login':this.login,
        'password':this.password

      })};
    this.httpclient.post(url,'',httpOptions).subscribe(rep=> this.reponse=JSON.stringify(rep))
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

}
