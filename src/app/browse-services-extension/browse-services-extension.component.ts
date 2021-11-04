import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ServicesExtension } from "../interfaces/services-extension";
@Component({
  selector: 'app-browse-services-extension',
  templateUrl: './browse-services-extension.component.html',
  styleUrls: ['./browse-services-extension.component.scss']
})
export class BrowseServicesExtensionComponent implements OnInit {
  projectname: string;
  extensionName: string;
  serviceExtension: ServicesExtension;
  routeName: string;
  id: number;
  routeId: number;
  dataSource = new MatTableDataSource<ServicesExtension>([]);
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor() { }

  ngOnInit(): void {
  }

  home(){}

  add(){}

  edit(index:number){}

  delete(index:number){}

}
