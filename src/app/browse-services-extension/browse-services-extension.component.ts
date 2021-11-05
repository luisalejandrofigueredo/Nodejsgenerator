import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesExtension } from "../interfaces/services-extension";
import { ConfigService } from '../service/config.service';
import { ControllersExtensionService } from '../service/controllers-extension.service';
import { ExtensionsService } from '../service/extensions.service';
import { RoutesExtension } from "../interfaces/routes-extension";
import { RoutesExtensionService } from '../service/routes-extension.service';
import {ExtensionServiceModalComponent} from '../extension-service-modal/extension-service-modal.component';
import { ServiceExtensionService } from "../service/service-extension.service";
import { YesnoComponent } from '../yesno/yesno.component';
@Component({
  selector: 'app-browse-services-extension',
  templateUrl: './browse-services-extension.component.html',
  styleUrls: ['./browse-services-extension.component.scss']
})
export class BrowseServicesExtensionComponent implements OnInit {
  projectname: string;
  extensionName: string;
  routeExtension:RoutesExtension;
  serviceExtension: ServicesExtension;
  routeName: string;
  id: number;
  routeId: number;
  dataSource = new MatTableDataSource<ServicesExtension>([]);
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog,
    private router: Router,
    private extensionService: ExtensionsService,
    private routesExtension: RoutesExtensionService,
    /*private controllerService: ControllersExtensionService,*/
    private serviceExtensionService: ServiceExtensionService,
    private activatedRouter: ActivatedRoute,
    private configService: ConfigService) { }

  ngOnInit(): void {
    this.projectname = this.configService.config.projectname;
    this.activatedRouter.params.subscribe(param => {
      this.id = param.id;
      this.routeId = param.routesId;
      this.extensionName = this.extensionService.getExtension(param.id).name;
      this.routeExtension = this.routesExtension.getRoute(param.id, param.routesId);
      this.routeName = this.routeExtension.name;
      this.dataSource.data = this.routeExtension.service;
    });
  }

  home(){
    this.router.navigate(['browseExtensionRoutes', this.id]);
  }

  add(){
    const dialogRef = this.dialog.open(ExtensionServiceModalComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'my-outlined-dialog',
      data: { id: 0, name: '' } as ServicesExtension
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        if (this.serviceExtensionService.getServices(this.id, this.routeId).length === undefined || this.serviceExtensionService.getServices(this.id, this.routeId).length === 0) {
          data.id = 1;
        } else {
          data.id = this.serviceExtensionService.getServices(this.id, this.routeId).length + 1;
        }
        this.serviceExtensionService.add(this.id, this.routeId, data);
        this.dataSource.data = this.serviceExtensionService.getServices(this.id, this.routeId);
        this.table.renderRows();
      }
    });
  }

  edit(index:number){
    const data=this.serviceExtensionService.getService(this.id, this.routeId,index);
    const dialogRef = this.dialog.open(ExtensionServiceModalComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'my-outlined-dialog',
      data: data as ServicesExtension
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.serviceExtensionService.edit(this.id, this.routeId,index,data);
        this.dataSource.data = this.serviceExtensionService.getServices(this.id, this.routeId);
        this.table.renderRows();
      }
    });
  }

  delete(index:number){
    const dialogRef = this.dialog.open(YesnoComponent, {
      panelClass: 'my-outlined-dialog'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.serviceExtensionService.delete(this.id,this.routeId,index);
        this.dataSource.data = this.serviceExtensionService.getServices(this.id, this.routeId);;
        this.table.renderRows();
      }
    });

  }

}
