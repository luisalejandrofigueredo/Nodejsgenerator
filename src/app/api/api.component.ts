import { Component, OnInit, ViewChild } from '@angular/core';
import {ConfigService} from '../service/config.service';
import {Schemahead} from '../interfaces/schemahead';
import {Typeoperation} from '../interfaces/typeoperation';
import { MatDialog } from '@angular/material/dialog';
import { ApidatamodalComponent } from '../apidatamodal/apidatamodal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {YesnoComponent} from '../yesno/yesno.component';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {
  apis = [];
  selected: string;
  dataSource = new MatTableDataSource([]);
  id: number;
  schemaname: string;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private activerouter: ActivatedRoute, private configservice: ConfigService, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.activerouter.params.subscribe(params => {
      this.id = params.id;
      this.schemaname = this.configservice.getschemaname(this.id);
      this.apis = this.configservice.getapis(this.schemaname);
      this.dataSource.data = this.apis;
    });
  }

  navigate(){
   this.router.navigate(['/browse']);
  }


  openadd(){
    const matRef = this.dialog.open(ApidatamodalComponent, { width: '300px' , data: {type: '' } as Typeoperation });
    matRef.afterClosed().subscribe(data => { if (data !== undefined){
      this.configservice.addoperation({id: this.id, name: this.schemaname}, data);
      const _id = this.dataSource.data.length + 1;
      this.apis.push({ id: _id , type: data.type});
      this.dataSource.data = this.apis;
      this.table.renderRows();
    }});

  }

  delete(id: number ){
    const dialogRef = this.dialog.open(YesnoComponent, { width: '300px',
    disableClose: true,
  data: 'delete api '});
    dialogRef.afterClosed().subscribe( data => { if (data !== undefined){
      this.apis.splice(id - 1, 1);
      // renum schema
      for (let index = 0; index < this.apis.length; index++) {
        this.apis[index].id = index + 1;
      }
      this.dataSource.data = this.apis;
      this.configservice.deleteoperation(this.schemaname, id - 1);
      this.table.renderRows();
  }});
  }
  edit(id: number){}

}
