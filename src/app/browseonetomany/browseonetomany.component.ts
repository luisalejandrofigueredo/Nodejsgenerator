import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Onetomany } from '../interfaces/onetomany';
import { ConfigService } from '../service/config.service';
import { RelationsService } from '../service/relations.service';
import { RelationdatamodalonetomanyComponent } from '../relationdatamodalonetomany/relationdatamodalonetomany.component';
import { YesnoComponent } from '../yesno/yesno.component';
import { Manytoone } from '../interfaces/manytoone';
@Component({
  selector: 'app-browseonetomany',
  templateUrl: './browseonetomany.component.html',
  styleUrls: ['./browseonetomany.component.scss']
})
export class BrowseonetomanyComponent implements OnInit {
  id: number;
  schemaname: string;
  dataSource: Onetomany[];

  constructor(private router:Router,private dialog: MatDialog, private relations: RelationsService, private activerouter: ActivatedRoute, private configservice: ConfigService) { }
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.activerouter.params.subscribe(params => {
      this.id = params.id;
      this.schemaname = this.configservice.getschemaname(this.id);
      this.dataSource = this.relations.getrelationsonetomany(this.id);
    });
  }

  add() {
    const dialogRef = this.dialog.open(RelationdatamodalonetomanyComponent, { data: { id: this.id, data: { table: '', relationname: '', manytoone: '' } as Onetomany }, width: "300px" });
    dialogRef.afterClosed().subscribe((data: { id: number, data: Onetomany }) => {
      if (data !== undefined) {
        this.relations.addrelationonetomany(this.id, data.data);
        const manytooneid = this.configservice.getschemaid(data.data.table);
        this.relations.addrelationmanytoone(manytooneid, { relationname: data.data.manytoone, table: this.schemaname } as Manytoone);
        console.log('many to one:', this.relations.getrelationmanytoone(manytooneid));
        this.dataSource = this.relations.getrelationsonetomany(this.id);
        this.table.renderRows();
      }
    });

  }

  edit(index: number) {
    const reg = this.relations.getrelationsonetomany(this.id)[index];
    const dialogRef = this.dialog.open(RelationdatamodalonetomanyComponent, { data: { id: this.id, data: reg }, width: "300px" });
    dialogRef.afterClosed().subscribe((data: { id: number, data: Onetomany }) => {
      if (data !== undefined) {
        this.relations.editrelationonetomany(this.id, index, data.data);
        const idmanytoone = this.configservice.getschemaid(reg.table);
        const relmanytoone = this.relations.getrelationmanytoone(idmanytoone);
        const indexmanytoone = relmanytoone.findIndex(element => element.relationname === reg.manytoone);
        this.relations.editrelationmanytoone(idmanytoone, indexmanytoone, { relationname: data.data.manytoone, table: this.schemaname });
        console.log('many to one:', this.relations.getrelationmanytoone(idmanytoone));
        this.dataSource = this.relations.getrelationsonetomany(this.id);
        this.table.renderRows();
      }
    });
  }

  delete(index: number) {
    const dialogRef = this.dialog.open(YesnoComponent, { data: 'Delete this relation', width: "300px" });
    dialogRef.afterClosed().subscribe((data: string) => {
      if (data !== undefined) {
        const datarelations = this.relations.getrelationsonetomany(this.id);
        const datareg = datarelations[index];
        const schemaid = this.configservice.getschemaid(datareg.table);
        const relid = this.relations.getrelationmanytoone(schemaid);
        console.log('rel id',relid);
        if (relid.length !== 0) {
          const ind = relid.findIndex(element => element.relationname === datareg.manytoone)
          this.relations.deleterelationmanytoone(schemaid, ind);
        }
        this.relations.deleterelationonetomany(this.id, index);
        this.dataSource = this.relations.getrelationsonetomany(this.id);
        this.table.renderRows();
      }
    });
  }
  gotorelations(){
    this.router.navigate(['browserelations',this.id]);    
  }
}
