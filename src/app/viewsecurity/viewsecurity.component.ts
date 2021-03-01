import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-viewsecurity',
  templateUrl: './viewsecurity.component.html',
  styleUrls: ['./viewsecurity.component.scss']
})
export class ViewsecurityComponent implements OnInit {
  file:string;
  editorOptions = { theme: 'vs-dark', language: 'typescript' };
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.file = params.file;
    });
  }
}
