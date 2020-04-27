import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { ConfigService } from '../service/config.service';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormschemamodalComponent } from '../formschemamodal/formschemamodal.component';
import {YesnoComponent} from '../yesno/yesno.component';
import { Schemahead } from '../interfaces/schemahead';
@Component({
  selector: 'app-browseschematics',
  templateUrl: './browseschematics.component.html',
  styleUrls: ['./browseschematics.component.scss']
})
export class BrowseschematicsComponent implements OnInit {
  dataSource = new MatTableDataSource<Schemahead>([]);
  schema: Schemahead[] = [];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private route: Router, public dialog: MatDialog, private configservice: ConfigService) { }
  ngOnInit(): void {
    this.schema = [ ...this.configservice.getschema()];
    console.log('schema', this.schema);
    this.dataSource.data = this.schema;
    this.dataSource.paginator = this.paginator;
  }

  add() {
    const dialogRef = this.dialog.open(FormschemamodalComponent, {
      width: '300px',
      data: { id: 0, name: '', description: '' }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        if ( this.schema.length === undefined){
          data.id = 1;
        } else {
        data.id = this.schema.length + 1; }
        console.log('data', data);
        this.schema.push(data);
        this.dataSource.data = this.schema;
        this.table.renderRows();
        console.log('schema:', this.schema);
        this.configservice.addschema(data);
      }
    });
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(YesnoComponent, { width: '300px',
  data: 'delete all schema'});
    dialogRef.afterClosed().subscribe( data => { if (data !== undefined){
      this.schema.splice(id - 1, 1);
      this.dataSource.data = this.schema;
      this.table.renderRows();
  }});
  }

  edit(id: number) {
    const _data = { ...this.schema[id - 1]};
    const dialogRef = this.dialog.open(FormschemamodalComponent, {
      width: '300px',
      data: _data
    });
    dialogRef.afterClosed().subscribe(data => { if (data !== undefined){
      this.schema[id - 1] = data;
      this.dataSource.data = this.schema;
      this.table.renderRows();
      this.configservice.editschema(data, id - 1);
    }});
  }

  save() {
   this.configservice.save();
  }

  edit_data(_id: number){
    this.route.navigate(['/schematics', _id]);
  }
}
