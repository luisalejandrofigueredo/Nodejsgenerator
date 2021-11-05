import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ControllersExtension } from '../interfaces/controllers-extension';
import { RoutesExtension } from '../interfaces/routes-extension';
import { ConfigService } from '../service/config.service';
import { ControllersExtensionService } from '../service/controllers-extension.service';
import { ExtensionsService } from '../service/extensions.service';
import { RoutesExtensionService } from '../service/routes-extension.service';
import { ControllerModalComponent } from "../controller-modal/controller-modal.component";
import { YesnoComponent } from '../yesno/yesno.component';

@Component({
  selector: 'app-browse-controllers',
  templateUrl: './browse-controllers.component.html',
  styleUrls: ['./browse-controllers.component.scss']
})
export class BrowseControllersComponent implements OnInit {
  projectname: string;
  extensionName: string;
  routeExtension: RoutesExtension;
  id: number;
  routeId: number;
  routeName: string;
  dataSource = new MatTableDataSource<ControllersExtension>([]);
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog,
    private router: Router,
    private extensionService: ExtensionsService,
    private routesExtension: RoutesExtensionService,
    private controllerService: ControllersExtensionService,
    private activatedRouter: ActivatedRoute,
    private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.projectname = this.configService.config.projectname;
    this.activatedRouter.params.subscribe(param => {
      this.id = param.id;
      this.routeId = param.routesId;
      this.extensionName = this.extensionService.getExtension(param.id).name;
      this.routeExtension = this.routesExtension.getRoute(param.id, param.routesId);
      this.routeName = this.routeExtension.name;
      this.dataSource.data = this.routeExtension.controllers;
    });
  }

  home() {
    this.router.navigate(['browseExtensionRoutes', this.id]);
  }

  add() {
    const dialogRef = this.dialog.open(ControllerModalComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'my-outlined-dialog',
      data: { id: 0, name: '' } as ControllersExtension
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        if (this.controllerService.getControllers(this.id, this.routeId).length === undefined || this.controllerService.getControllers(this.id, this.routeId).length === 0) {
          data.id = 1;
        } else {
          data.id = this.controllerService.getControllers(this.id, this.routeId).length + 1;
        }
        this.controllerService.add(this.id, this.routeId, data);
        this.dataSource.data = this.controllerService.getControllers(this.id, this.routeId);
        this.table.renderRows();
      }
    });
  }

  edit(index: number) {
    const data: ControllersExtension = this.controllerService.getController(this.id, this.routeId, index);
    const dialogRef = this.dialog.open(ControllerModalComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'my-outlined-dialog',
      data: data as ControllersExtension
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.controllerService.edit(this.id, this.routeId, index, data);
        this.dataSource.data = this.controllerService.getControllers(this.id, this.routeId);
        this.table.renderRows();
      }
    });
  }

  delete(index: number) {
    const dialogRef = this.dialog.open(YesnoComponent, {
      panelClass: 'my-outlined-dialog'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.controllerService.delete(this.id,this.routeId,index);
        this.dataSource.data = this.controllerService.getControllers(this.id,this.routeId);
        this.table.renderRows();
      }
    });
  }
}
