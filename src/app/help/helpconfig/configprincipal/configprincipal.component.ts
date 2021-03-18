import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-configprincipal',
  templateUrl: './configprincipal.component.html',
  styleUrls: ['./configprincipal.component.scss']
})
export class ConfigprincipalComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  nextpage(){
    this.router.navigate(['helpconfig']);
   }

}
