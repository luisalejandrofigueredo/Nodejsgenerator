import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesExtension } from '../interfaces/routes-extension';
import { ConfigService } from '../service/config.service';
import { ExtensionsService } from '../service/extensions.service';
import { RoutesExtensionService } from "../service/routes-extension.service";
import { ExtensionRoutesModalComponent } from "../extension-routes-modal/extension-routes-modal.component";
import { MatDialog } from '@angular/material/dialog';
import { YesnoComponent } from '../yesno/yesno.component';

@Component({
  selector: 'app-browse-extension-routes',
  templateUrl: './browse-extension-routes.component.html',
  styleUrls: ['./browse-extension-routes.component.scss']
})
export class BrowseExtensionRoutesComponent implements OnInit {
  projectname: string;
  extensionName: string;
  extensionTable: RoutesExtension[] = [];
  dataSource = new MatTableDataSource<RoutesExtension>([]);
  id: number;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dialog: MatDialog,
    private router: Router,
    private routesExtension: RoutesExtensionService,
    private extensionService: ExtensionsService,
    private configService: ConfigService,
    private activatedRouter: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.projectname = this.configService.config.projectname;
    this.activatedRouter.params.subscribe(param => {
      this.extensionName = this.extensionService.getExtension(param.id).name;
      this.dataSource.data = this.routesExtension.getRoutes(param.id);
      this.id = param.id;
    });
  }

  home() {
    this.router.navigate(['browseExtension']);
  }

  add() {
    const routes = this.routesExtension.getRoutes(this.id);
    let id: number;
    if (routes.length === undefined || routes.length === 0) {
      id = 1;
    } else {
      id = routes.length++;
    }
    const extensionRoutes: RoutesExtension = { id: id, name: '', path: '',type:'' ,controllers: [],service:[] };
    const dialogRef = this.dialog.open(ExtensionRoutesModalComponent, { data: extensionRoutes });
    dialogRef.afterClosed().subscribe((data: RoutesExtension) => {
      if (data !== undefined) {
        this.routesExtension.add(id, data);
        this.dataSource.data = this.routesExtension.getRoutes(this.id);
        this.table.renderRows();
      }
    });
  }

  edit(index: number) {
    const routes = this.routesExtension.getRoutes(this.id);
    const dataRoutes=routes[index-1];
    const extensionRoutes: RoutesExtension = dataRoutes;
    const dialogRef = this.dialog.open(ExtensionRoutesModalComponent, { data: extensionRoutes });
    dialogRef.afterClosed().subscribe((data: RoutesExtension) => {
      if (data !== undefined) {
        this.routesExtension.edit(this.id,index,data);
        this.dataSource.data = this.routesExtension.getRoutes(this.id);
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
        this.routesExtension.delete(this.id,index);
        this.dataSource.data = this.routesExtension.getRoutes(this.id);
        this.table.renderRows();
      }
    });
  }

  controllers(index:number){
    this.router.navigate(['browseControllers',this.id,index]);    
  }
  
  service(index:number){
    this.router.navigate(['browseServiceExtension',this.id,index]);    
  }

}
