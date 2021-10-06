import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { Typeoperation } from '../interfaces/typeoperation';
import { MatDialog } from '@angular/material/dialog';
import { ApidatamodalComponent } from '../apidatamodal/apidatamodal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { YesnoComponent } from '../yesno/yesno.component';
import { MatSort, Sort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Api } from '../interfaces/api';
import { element } from 'protractor';
interface Type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {
  apis:Api[]=[];
  fields = [];
  selected: string;
  types: Type[] = [
    { value: 'get', viewValue: 'Get' },
    { value: 'put', viewValue: 'Put' },
    { value: 'post', viewValue: 'Post' },
    { value: 'delete', viewValue: 'Delete' },
    { value: 'patch', viewValue: 'Patch' }
  ];
  operations: Type[] = [
    { value: 'getall', viewValue: 'Get All' },
    { value: 'getone', viewValue: 'Get One' },
    { value: 'skiplimit', viewValue: 'Get skiplimit by key' },
    { value: 'skiplimitbyfield', viewValue: 'Get skiplimit by field' },
    { value: 'skiplimitfilter', viewValue: 'Get limit filter' },
    { value: 'count', viewValue: 'Count' },
    { value: 'findandcount', viewValue: 'Find and Count' },
    { value: 'findandcountwithoptions', viewValue: 'Find and Count with options' },
    { value: 'findwithoptions', viewValue: 'Find with options' },
    { value: 'findgenerated', viewValue: 'Find with parameters' },
    { value: 'findandcountgenerated', viewValue: 'Find and count with parameters' }
  ];
  dataSource = new MatTableDataSource([]);
  id: number;
  schemaname: string;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private activerouter: ActivatedRoute, private configservice: ConfigService, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.activerouter.params.subscribe(params => {
      this.id = params.id;
      this.schemaname = this.configservice.getschemaname(this.id);
      this.fields = this.configservice.getfields(this.id);
      this.apis = JSON.parse(JSON.stringify(this.configservice.getapis(this.id)));
      this.apis.forEach((api: Api) => {
        api.type = this.changeVisibleTypes(api.type);
        api.operation = this.changeVisibleOperation(api.operation);
      });
      this.dataSource.data = this.apis;
      console.log('on init local api',this.apis);
      console.log('on init service',this.configservice.getapis(this.id));
    });
  }

  changeVisibleTypes(type: string): string {
    if (this.types.findIndex((constType) => constType.value === type) !== -1) {
      return this.types[this.types.findIndex((constType) => constType.value === type)].viewValue;
    } else {
      return type;
    }
  }

  changeVisibleOperation(paramOperation: string): string {
    if (this.operations.findIndex((operation) => operation.value === paramOperation) !== -1) {
      return this.operations[this.operations.findIndex((operation) => operation.value === paramOperation)].viewValue;
    }
    else {
      return paramOperation;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  navigate() {
    this.router.navigate(['/browse']);
  }


  openadd() {
    const matRef = this.dialog.open(ApidatamodalComponent, {
      width: '300px',
      data: {
        idschema: this.id,
        id: 0,
        type: '',
        operation: '',
        path: '',
        fields: this.fields,
        field: '',
        security: false,
        roles: '',
        extfiles: '',
        options: '',
        parameters: []
      } as Typeoperation
    });
    matRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        console.log('data', data);
        const _id = this.apis.length + 1;
        this.configservice.addapi(this.id,
          {
            id: _id,
            type: data.type,
            operation: data.operation,
            path: data.path,
            field: data.field,
            security: data.security,
            roles: data.roles,
            extfiles: data.extfiles,
            options: data.options,
            parameters: data.parameters
          });
        this.apis = JSON.parse(JSON.stringify(this.configservice.getapis(this.id)));
        this.apis.forEach((api: Api) => {
          api.type = this.changeVisibleTypes(api.type);
          api.operation = this.changeVisibleOperation(api.operation);
        });
        this.dataSource.data = this.apis;
        this.table.renderRows();
        this.paginator.lastPage();
      }
    });
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(YesnoComponent, {
      width: '300px',
      disableClose: true, data: 'delete api '
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.configservice.deleteapi(this.id, id);
        this.apis = JSON.parse(JSON.stringify(this.configservice.getapis(this.id)));
        this.apis.forEach((api: Api) => {
          api.type = this.changeVisibleTypes(api.type);
          api.operation = this.changeVisibleOperation(api.operation);
        });
        this.dataSource.data = this.apis;
        this.table.renderRows();
      }
    });
  }

  // tslint:disable-next-line: variable-name
  edit(_id: number) {
    const reg = this.configservice.getapi(this.id, _id);
    const matRef = this.dialog.open(ApidatamodalComponent, {
      width: '300px',
      data: {
        idschema: this.id, id: _id,
        type: reg.type,
        operation: reg.operation,
        path: reg.path,
        field: reg.field,
        fields: this.fields,
        security: reg.security,
        roles: reg.roles,
        extfiles: reg.extfiles,
        options: reg.options,
        parameters: (reg.parameters !== undefined) ? reg.parameters : []
      } as Typeoperation
    });
    matRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.configservice.editapi(this.id, _id, data);
        this.apis = JSON.parse(JSON.stringify(this.configservice.getapis(this.id)));
        this.apis.forEach((api: Api) => {
          api.type = this.changeVisibleTypes(api.type);
          api.operation = this.changeVisibleOperation(api.operation);
        });
        this.dataSource.data = this.apis;
        this.table.renderRows();
      }
    });
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.apis, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.apis;
    this.table.renderRows();
  }
}
