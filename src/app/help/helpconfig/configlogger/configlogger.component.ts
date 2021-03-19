import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-configlogger',
  templateUrl: './configlogger.component.html',
  styleUrls: ['./configlogger.component.scss']
})
export class ConfigloggerComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  nextpage(){
    this.router.navigate(['helpconfig']);
   }
}
