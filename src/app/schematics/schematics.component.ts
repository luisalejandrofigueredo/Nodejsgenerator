import { Component, ViewChild, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from '../service/config.service';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DatamodalComponent } from '../datamodal/datamodal.component';
import { YesnoComponent } from '../yesno/yesno.component';
import { Schemaitem } from '../interfaces/schema';
import {CdkDragDrop, moveItemInArray,CdkDragHandle} from '@angular/cdk/drag-drop';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Schemaheaditems } from '../interfaces/schemahead';
interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-schematics',
  templateUrl: './schematics.component.html',
  styleUrls: ['./schematics.component.scss']
})
export class SchematicsComponent implements OnInit {
  types: Type[] = [
    { value: 'number', viewValue: 'Number' },
    { value: 'string', viewValue: 'String' },
    { value: 'date', viewValue: 'date' }
  ];
  dataSource = new MatTableDataSource<Schemaitem>([]);
  @ViewChild(MatTable) table: MatTable<Schemaitem>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  buffer: Schemaitem;
  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private activerouter: ActivatedRoute, private configservice: ConfigService, public dialog: MatDialog, private snackBar: MatSnackBar, private electronservice: ElectronService) { }
  selected = '';
  schemaname = '';
  open = false;
  schemaitems: Schemaitem[] = [];
  id: number;
  ngOnInit(): void {
    this.activerouter.params.subscribe(params => {
      this.id = params.id;
      this.schemaitems = [ ...this.configservice.getschematable(this.id)];
      this.schemaname = this.configservice.getschemaname(this.id);
      this.dataSource =  new MatTableDataSource(this.schemaitems);
      this.dataSource.paginator = this.paginator;
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log('data on view init',this.dataSource.data)
    this.table.renderRows();
  }

  updatingdata(data: Schemaitem) {
    // tslint:disable-next-line: max-line-length
    this.schemaitems[data.id - 1] = { id: data.id,
       name: data.name,
        type: data.type,
        length: data.length,
        keyautonumber: data.keyautonumber,
        extraparameter: data.extraparameter,
        index: data.index,
         };
    this.configservice.editschemaitem(this.id, data.id - 1, data);
    this.dataSource.data = this.schemaitems;
    this.table.renderRows();
  }

  addschema(data: Schemaitem) {
    let position = 0;
    if (this.schemaitems === undefined) {
      position = 1;
      // tslint:disable-next-line: max-line-length
      this.schemaitems = [{ id: position,
         type: data.type,
          name: data.name,
          length: data.length,
          keyautonumber: data.keyautonumber,
          extraparameter: data.extraparameter,
          index: data.index,
          }];
    }
    else {
      position = this.schemaitems.length + 1;
      // tslint:disable-next-line: max-line-length
      this.schemaitems.push({ id: position,
         type: data.type,
          name: data.name,
          length: data.length,
          keyautonumber: data.keyautonumber,
          extraparameter: data.extraparameter,
          index: data.index, });
    }
    // tslint:disable-next-line: max-line-length
    this.configservice.addschemaitem(this.id, { id: position,
       type: data.type,
       name: data.name,
       length: data.length,
       keyautonumber: data.keyautonumber,
       extraparameter: data.extraparameter,
       index: data.index,
       });
    this.dataSource.data = this.schemaitems;
    this.table.renderRows();
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(YesnoComponent, {
      width: '300px',
      data: 'you are sure delete column?'
    });
    dialogRef.afterClosed().subscribe(result => {
       if (result !== undefined) {
        this.schemaitems.splice(id - 1, 1);
        for (let index = 0; index < this.schemaitems.length; index++) {
          const element = this.schemaitems[index];
          // tslint:disable-next-line: max-line-length
          this.schemaitems[index] = { id: index + 1,
             type: element.type,
              name: element.name,
               length: element.length,
                keyautonumber: element.keyautonumber,
                extraparameter: element.extraparameter,
                index: element.index,
                };
        }
        this.configservice.deleteschmeaitem(this.id, id);
        this.dataSource.data = this.schemaitems;
        this.table.renderRows();
      }
    });
  }

  edit(id: number) {
    const buffer: Schemaitem = { ...this.schemaitems[id - 1] };
    const dialogRef = this.dialog.open(DatamodalComponent, {
      width: '400px',
      data: buffer,
    });
    dialogRef.afterClosed().subscribe(result => {
       if (result !== undefined) {
        this.updatingdata(result);
      }
    });
  }

  openadd() {
    this.open = true;
    const dialogRef = this.dialog.open(DatamodalComponent, {
      width: '300px',
      disableClose: true,
      data: { id: 0, type: '',
       name: '',
       length: 0,
       keyautonumber: false,
       index: false,
       extraparameter: '',
       security: false,
       roles: '' } as Schemaitem
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.addschema(result);
      }
    });
  }
  navigate(){
    this.router.navigate(['/browse']);
   }
   drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.schemaitems, event.previousIndex, event.currentIndex);
    this.dataSource.data=this.schemaitems;
    this.table.renderRows();
   }
}
