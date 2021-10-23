import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nextstep2',
  templateUrl: './nextstep2.component.html',
  styleUrls: ['./nextstep2.component.scss']
})
export class Nextstep2Component implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  prevPage(){
    this.router.navigate(['helpNextStep']);
  }

  nextPage(){

  }

}
