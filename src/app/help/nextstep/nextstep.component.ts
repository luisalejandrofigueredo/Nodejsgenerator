import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nextstep',
  templateUrl: './nextstep.component.html',
  styleUrls: ['./nextstep.component.scss']
})
export class NextstepComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  nextPage(){
    this.router.navigate(['helpNextStep2']);
  }
  prevPage(){
    this.router.navigate(['help']);
  }

}
