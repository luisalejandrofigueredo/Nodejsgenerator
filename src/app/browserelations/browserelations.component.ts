import { Component, OnInit , ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RelationdatamodalComponent } from '../relationdatamodal/relationdatamodal.component';
import { Relations } from '../interfaces/relations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-browserelations',
  templateUrl: './browserelations.component.html',
  styleUrls: ['./browserelations.component.scss']
})
export class BrowserelationsComponent implements OnInit {
  id: number;
  relations: Relations[] = [];
  dataSource: any;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private activerouter: ActivatedRoute, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.activerouter.params.subscribe(params => { this.id = params.id;
                                                   this.dataSource =  new MatTableDataSource(this.relations);
    });
  }

  add() {
    const dialogRef = this.dialog.open(RelationdatamodalComponent, {
      width: '300px',
      disableClose: true,
      data: { id: this.id, type: '', field: '', table: 0 } as Relations
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        result.id = this.relations.length + 1;
        this.relations.push(result);
        this.table.renderRows();
      }
    });
  }

  // tslint:disable-next-line: variable-name
  edit(_id: number) {

  }

  // tslint:disable-next-line: variable-name
  delete(_id: number){

  }
}
