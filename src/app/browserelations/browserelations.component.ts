import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { YesnoComponent } from '../yesno/yesno.component';
import { MatSort } from '@angular/material/sort';
import { RelationdatamodalComponent } from '../relationdatamodal/relationdatamodal.component';
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
  relations: Relations[] = [];
  dataSource: any;
  schemaname: string;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private configservice: ConfigService, private activerouter: ActivatedRoute, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.activerouter.params.subscribe(params => {
      this.id = params.id;
      this.schemaname = this.configservice.getschemaname(this.id);
      this.relations = [...this.configservice.config.schemas[this.id - 1].schemarelations];
      this.dataSource = new MatTableDataSource(this.relations);
    });
  }
  addmanytone() {
    const dialogRef = this.dialog.open(RelationdatamodalonetomanyComponent, {
      width: '300px',
      disableClose: true,
      data: {
        id: 0,
        idtable: this.id,
        tablename: '',
        type: 'manytoone',
        field: '',
        table: 0, fieldc: '', fieldr: ''
      } as Relations
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        result.id = this.relations.length + 1;
        this.relations.push(result);
        this.configservice.addrelation(this.id, result);
        this.table.renderRows();
      }
    });
  }
  add() {
    const dialogRef = this.dialog.open(RelationdatamodalComponent, {
      width: '300px',
      disableClose: true,
      data: {
        id: 0,
        idtable: this.id,
        tablename: '',
        type: 'onetomany',
        field: '',
        table: 0, fieldc: '', fieldr: ''
      } as Relations
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        result.id = this.relations.length + 1;
        this.relations.push(result);
        this.configservice.addrelation(this.id, result);
        this.table.renderRows();
      }
    });
  }

  // tslint:disable-next-line: variable-name
  onetomany(_id: number) {
    const data = this.relations[_id - 1];
    if (data.type === 'onetomany') {
      const dialogRef = this.dialog.open(RelationdatamodalComponent, {
        width: '300px',
        disableClose: true,
        // tslint:disable-next-line: max-line-length
        data: {
          id: data.id,
          tablename: data.tablename,
          idtable: data.idtable,
          type: data.type,
          field: data.field,
          table: data.table,
          fieldr: data.fieldr,
          fieldc: data.fieldc
        } as Relations
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.relations[_id - 1] = result;
          this.configservice.editrelation(this.id, data.id, result);
          this.table.renderRows();
        }
      });
    } else {
      const dialogRef = this.dialog.open(RelationdatamodalonetomanyComponent, {
        width: '300px',
        disableClose: true,
        data: {
          id: data.id,
          idtable: this.id,
          tablename: data.tablename,
          type: data.type,
          field: data.field,
          table: data.table, fieldc: data.fieldc, fieldr: data.fieldr
        } as Relations
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.relations[_id - 1] = result;
          this.configservice.editrelation(this.id, data.id, result);
          this.table.renderRows();
        }
      });
    }
  }

  // tslint:disable-next-line: variable-name
  delete(_id: number) {
    const dialogRef = this.dialog.open(YesnoComponent, {
      width: '300px',
      data: 'you are sure delete relation?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.relations.splice(_id - 1, 1);
        this.table.renderRows();
      }
    });
  }
}
