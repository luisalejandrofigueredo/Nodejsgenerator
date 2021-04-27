import { Component, OnInit, ViewChild } from '@angular/core';
import {ConfigService} from '../service/config.service';
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
  fields = [];
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
      this.fields = this.configservice.getfields(this.id);
      this.apis = [...this.configservice.getapis(this.id)];
      this.dataSource.data = [...this.apis];
    });
  }

  navigate(){
   this.router.navigate(['/browse']);
  }


  openadd(){
    const matRef = this.dialog.open(ApidatamodalComponent, { width: '300px' ,
     data: { idschema:this.id, id: 0, type: '', operation: '' , path: '', fields: this.fields, field: '' , security: false, roles: '',extfiles:'' } as Typeoperation });
    matRef.afterClosed().subscribe(data => { if (data !== undefined){
      // tslint:disable-next-line: variable-name
      const _id = this.apis.length + 1;
      // tslint:disable-next-line: max-line-length
      this.apis.push({ id: _id , type: data.type, operation: data.operation, path: data.path, field: data.field, security: data.security, roles: data.roles});
      // tslint:disable-next-line: max-line-length
      this.configservice.addapi(this.id, { id: _id , type: data.type, operation: data.operation, path: data.path, field: data.field, security: data.security, roles: data.roles, extfiles:data.extfiles});
      this.dataSource.data = [...this.apis];
      this.table.renderRows();
      this.paginator.lastPage();
    }});
  }

  delete(id: number ){
    const dialogRef = this.dialog.open(YesnoComponent, { width: '300px',
    disableClose: true, data: 'delete api '});
    dialogRef.afterClosed().subscribe( data => { if (data !== undefined){
      this.apis.splice(id - 1, 1);
      // renum schema
      for (let index = 0; index < this.apis.length; index++) {
        this.apis[index].id = index + 1;
      }
      this.dataSource.data = this.apis;
      this.configservice.deleteapi(this.id, id);
      this.table.renderRows();
  }});
  }

  // tslint:disable-next-line: variable-name
  edit(_id: number){
    const reg = this.configservice.getapi(this.id, _id);
    const matRef = this.dialog.open(ApidatamodalComponent, { width: '300px' ,
     data: { idschema:this.id ,id: _id, 
      type: reg.type,
      operation: reg.operation,
      path: reg.path,
      field: reg.field,
      fields: this.fields,
      security: reg.security,
      roles: reg.roles , extfiles: reg.extfiles} as Typeoperation });
    matRef.afterClosed().subscribe(data => { if (data !== undefined){
      this.configservice.editapi(this.id, _id, data);
      this.apis = [...this.configservice.getapis(this.id)];
      this.dataSource.data = [...this.apis];
      this.table.renderRows();
    }});
  }
}
