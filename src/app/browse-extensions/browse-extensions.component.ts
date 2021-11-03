import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Extension } from "../interfaces/extension";
import { ConfigService } from '../service/config.service';
import { NewExtensionModalComponent } from "../new-extension-modal/new-extension-modal.component";
import { ExtensionsService } from "../service/extensions.service";
import { YesnoComponent } from '../yesno/yesno.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-browse-extensions',
  templateUrl: './browse-extensions.component.html',
  styleUrls: ['./browse-extensions.component.scss']
})
export class BrowseExtensionsComponent implements OnInit {
  dataSource = new MatTableDataSource<Extension>([]);
  dataUnSorted: Extension[];
  projectname: string;
  extensions: Extension[] = [];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private router:Router,private extensionService: ExtensionsService, private configService: ConfigService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.projectname = this.configService.config.projectname
    this.extensions = JSON.parse(JSON.stringify(this.configService.config.extension));
    this.dataSource.data = this.extensions;
  }

  gotoRoutes(index:number){
    this.router.navigate(['browseExtensionRoutes',index])
  }

  add() {
    const dialogRef = this.dialog.open(NewExtensionModalComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'my-outlined-dialog',
      data: { id: 0, name: '', description: '' } as Extension
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        if (this.extensions.length === undefined) {
          data.id = 1;
        } else {
          data.id = this.extensions.length + 1;
        }
        this.extensions.push(data);
        this.dataSource.data = this.extensions;
        this.table.renderRows();
        this.extensionService.add(data);
      }
    });
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(YesnoComponent, {
      panelClass: 'my-outlined-dialog'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.extensionService.delete(id);
        this.extensions = JSON.parse(JSON.stringify(this.configService.config.extension));
        this.dataSource.data = this.extensions;
        this.table.renderRows();
      }
    });
  }

  edit(id: number) {
    const dialogRef = this.dialog.open(NewExtensionModalComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'my-outlined-dialog',
      data: this.extensionService.getExtension(id) as Extension
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.extensions[id - 1] = data;
        this.dataSource.data = this.extensions;
        this.table.renderRows();
        this.extensionService.edit(id, data);
      }
    });
  }
}
