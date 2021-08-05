import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { YesnoComponent } from '../yesno/yesno.component';
import { MatSort } from '@angular/material/sort';
import { Relations } from '../interfaces/relations';
import { ConfigService } from '../service/config.service';
import { RelationdatamodalonetomanyComponent } from '../relationdatamodalonetomany/relationdatamodalonetomany.component';

@Component({
  selector: 'app-browserelations',
  templateUrl: './browserelations.component.html',
  styleUrls: ['./browserelations.component.scss']
})
export class BrowserelationsComponent implements OnInit {
  id: number;
  schemaname: string;
  constructor(private router:Router,private configservice: ConfigService, private activerouter: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activerouter.params.subscribe(params => {
      this.id = params.id;
      this.schemaname = this.configservice.getschemaname(this.id);
    });
  }
  // click and route in angualar 
  browseonetoone(){
   this.router.navigate(['browseonetoone',this.id]);
  }
  browseonetomany(){
    this.router.navigate(['browseonetomany',this.id]);
  }
  browsemanytomany(){
    this.router.navigate(['browsemanytomany',this.id]);
  }

}
