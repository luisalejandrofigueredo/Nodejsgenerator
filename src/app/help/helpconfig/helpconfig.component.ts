import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-helpconfig',
  templateUrl: './helpconfig.component.html',
  styleUrls: ['./helpconfig.component.scss']
})
export class HelpconfigComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  nextpage(){
    this.router.navigate(['configlogger']);
   } 

}
