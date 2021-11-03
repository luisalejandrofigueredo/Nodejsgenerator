import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ConfigComponent } from "../config/config.component";
import { RoutesExtension } from '../interfaces/routes-extension';
import { ConfigService } from '../service/config.service';
import { ExtensionsService } from '../service/extensions.service';
@Component({
  selector: 'app-browse-extension-routes',
  templateUrl: './browse-extension-routes.component.html',
  styleUrls: ['./browse-extension-routes.component.scss']
})
export class BrowseExtensionRoutesComponent implements OnInit {
  projectname: string;
  extensionName: string;
  extensionTable: RoutesExtension[]=[];
  dataSource = new MatTableDataSource<RoutesExtension>([]);
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private extensionService: ExtensionsService, private configService: ConfigService, private activatedRouter: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.projectname = this.configService.config.projectname;
    this.activatedRouter.params.subscribe(param => {
      this.extensionService.getExtension(param.id).name;
      this.extensionName = this.configService.config.extension[param.id].name
    })
  }

  add(){}
  delete(index:number){}
  edit(index:number){}

}
