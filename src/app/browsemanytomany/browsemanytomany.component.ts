import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Manytomany } from '../interfaces/manytomany';
import { ConfigService } from '../service/config.service';
import { RelationsService } from '../service/relations.service';
import { RealtiondatamodalmanytomanyComponent } from '../realtiondatamodalmanytomany/realtiondatamodalmanytomany.component';
import { YesnoComponent } from '../yesno/yesno.component';
@Component({
  selector: 'app-browsemanytomany',
  templateUrl: './browsemanytomany.component.html',
  styleUrls: ['./browsemanytomany.component.scss']
})
export class BrowsemanytomanyComponent implements OnInit {
  id: number;
  schemaname: string;
  dataSource: Manytomany[];

  constructor(private router:Router,private dialog: MatDialog, private relations: RelationsService, private activerouter: ActivatedRoute, private configservice: ConfigService) { }
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.activerouter.params.subscribe(params => {
      this.id = params.id;
      this.schemaname = this.configservice.getschemaname(this.id);
      this.dataSource = this.relations.getrelationsmanytomany(this.id);
    });
   
  }
  add(){
    const dialogRef = this.dialog.open(RealtiondatamodalmanytomanyComponent, { data: { id: this.id, data: { table: '', relationname: '', manytomany: '' } as Manytomany }, width: "300px" });
    dialogRef.afterClosed().subscribe((data: { id: number, data: Manytomany }) => {
      if (data !== undefined) {
        this.relations.addrelationmanytomany(this.id, data.data);
        const manytooneid = this.configservice.getschemaid(data.data.table);
        this.relations.addrelationmanytomany(manytooneid, { relationname: data.data.manytomany, table: this.schemaname,manytomany:data.data.relationname } as Manytomany);
        this.dataSource = this.relations.getrelationsmanytomany(this.id);
        this.table.renderRows();
      }
    });
  }
  gotorelations(){
    this.router.navigate(['browserelations',this.id]);
  }
  delete(index:number){
    const dialogRef = this.dialog.open(YesnoComponent, { data: 'Delete this relation', width: "300px" });
    dialogRef.afterClosed().subscribe((data: string) => {
      if (data !== undefined) {
        const datarelations = this.relations.getrelationsmanytomany(this.id);
        const datareg = datarelations[index];
        const schemaid = this.configservice.getschemaid(datareg.table);
        const relid = this.relations.getrelationsmanytomany(schemaid);
        console.log('rel id',relid);
        if (relid.length !== 0) {
          const ind = relid.findIndex(element => element.relationname === datareg.manytomany)
          this.relations.deleterelationmanytomany(schemaid, ind);
          this.relations.deleterelationmanytomany(this.id, index);
        }
        this.dataSource = this.relations.getrelationsmanytomany(this.id);
        this.table.renderRows();
      }
    });
  }
  edit(index:number){
    const reg = this.relations.getrelationsmanytomany(this.id)[index];
    const dialogRef = this.dialog.open(RealtiondatamodalmanytomanyComponent, { data: { id: this.id, data: reg }, width: "300px" });
    dialogRef.afterClosed().subscribe((data: { id: number, data: Manytomany }) => {
      if (data !== undefined) {
        this.relations.editrelationmanytomany(this.id, index, data.data);
        const idmanytomany = this.configservice.getschemaid(reg.table);
        const relmanytoone = this.relations.getrelationsmanytomany(idmanytomany);
        const indexmanytomany = relmanytoone.findIndex(element => element.relationname === reg.manytomany);
        this.relations.editrelationmanytomany(idmanytomany, indexmanytomany, { relationname: data.data.manytomany, table: this.schemaname,manytomany:data.data.relationname } as Manytomany);
        console.log('inv many to many:', this.relations.getrelationsmanytomany(idmanytomany));
        this.dataSource = this.relations.getrelationsmanytomany(this.id);
        this.table.renderRows();
      }
    });
  }
}
