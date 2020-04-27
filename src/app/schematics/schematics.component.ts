import { Component, ViewChild, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { SerschemaService } from '../service/serschema.service';
import { ConfigService } from '../service/config.service';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatamodalComponent } from '../datamodal/datamodal.component';
import { YesnoComponent } from '../yesno/yesno.component';
import { Schemaitem } from '../interfaces/schema';
import { ActivatedRoute } from '@angular/router';
import { Schemaheadvector } from '../interfaces/schemahead';
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
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  buffer: Schemaitem;
  // tslint:disable-next-line: max-line-length
  constructor(private activerouter: ActivatedRoute, private configservice: ConfigService, public dialog: MatDialog, private snackBar: MatSnackBar, public schemaservice: SerschemaService, private electronservice: ElectronService) { }
  selected = '';
  schemaname = '';
  open = false;
  schemaitems: Schemaitem[] = [];
  id: number;
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.activerouter.params.subscribe(params => {
      this.id = params.id;
      this.schemaitems = [ ...this.configservice.getschematable(this.id)];
      this.schemaname = this.configservice.getschemaname(this.id);
      this.dataSource.data = this.schemaitems;
      /*if (this.schemaitems !== []){
        console.log(this.schemaitems);
        this.table.renderRows();
      }*/
    });
  }

  generateschema() {
    if (this.schemaservice.controlnumber() !== 0) {
      switch (this.schemaservice.controlnumber()) {
        case 1:
          this.snackBar.open('error', 'only one autonumber', { duration: 50000 });
          break;
        default:
          break;
      }
      return;
    }
    this.electronservice.ipcRenderer.send('genschema');
  }


  updatingdata(data: Schemaitem) {
    // tslint:disable-next-line: max-line-length
    this.schemaitems[data.id - 1] = { id: data.id, name: data.name, type: data.type, length: data.length, keyautonumber: data.keyautonumber };
    this.dataSource.data = this.schemaitems;
    this.table.renderRows();
  }

  addschema(data: Schemaitem) {
    let position = 0;
    if (this.schemaitems === undefined) {
      position = 1;
      this.schemaitems = [{ id: position, type: data.type, name: data.name, length: data.length, keyautonumber: data.keyautonumber }];
    }
    else {
      position = this.schemaitems.length + 1;
      this.schemaitems.push({ id: position, type: data.type, name: data.name, length: data.length, keyautonumber: data.keyautonumber });
    }
    // tslint:disable-next-line: max-line-length
    this.configservice.addschemaitem(this.id, { id: position, type: data.type, name: data.name, length: data.length, keyautonumber: data.keyautonumber });
    this.dataSource.data = this.schemaitems;
    this.table.renderRows();
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(YesnoComponent, {
      width: '300px',
      data: 'you are sure delete column?'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result:', result); if (result !== undefined) {
        console.log('borrando registro');
        this.schemaitems.splice(id - 1, 1);
        for (let index = 0; index < this.schemaitems.length; index++) {
          const element = this.schemaitems[index];
          // tslint:disable-next-line: max-line-length
          this.schemaitems[index] = { id: index + 1, type: element.type, name: element.name, length: element.length, keyautonumber: element.keyautonumber };
        }
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
      console.log('result:', result); if (result !== undefined) {
        console.log('editing data');

        this.updatingdata(result);
      }
    });
  }

  openadd() {
    console.log('abriendo');
    this.open = true;
    const dialogRef = this.dialog.open(DatamodalComponent, {
      width: '300px',
      data: { id: 0, type: '', name: '', length: 0, keyautonumber: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result:', result); if (result !== undefined) {
        console.log('salvandodatos');
        this.addschema(result);
      }
    });
  }

  save() {
    this.configservice.config.schemas[this.id - 1].schemastable = this.schemaitems;
  }
}
