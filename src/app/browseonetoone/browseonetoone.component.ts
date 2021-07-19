import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../service/config.service';
import {RelationsService} from '../service/relations.service';
import {Onetoone} from '../interfaces/onetoone';
import { Schemahead } from '../interfaces/schemahead';
import { MatDialog } from '@angular/material/dialog';
import { RonetoonemodalComponent } from '../ronetoonemodal/ronetoonemodal.component';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { YesnoComponent } from '../yesno/yesno.component';
@Component({
  selector: 'app-browseonetoone',
  templateUrl: './browseonetoone.component.html',
  styleUrls: ['./browseonetoone.component.scss']
})
export class BrowseonetooneComponent implements OnInit {
  id:number;
  schemaname:string;
  dataSource: Onetoone[];

  constructor(private dialog:MatDialog,private relations:RelationsService,private activerouter:ActivatedRoute,private configservice:ConfigService) { }
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngOnInit(): void {
    this.activerouter.params.subscribe(params => {
      this.id = params.id;
      this.schemaname = this.configservice.getschemaname(this.id);
      this.dataSource=this.relations.getrelationsonetone(this.id);
    });
  }

  add(){
    const dialogRef=this.dialog.open(RonetoonemodalComponent,{data:{ id: this.id, data: { table:'',relationname:'' } as Onetoone }, width:"300px"});
    dialogRef.afterClosed().subscribe( (data:{id:number,data:Onetoone}) => { if (data !== undefined){
      this.relations.addrelationonetoone(this.id,data.data);
      this.dataSource = this.relations.getrelationsonetone(this.id);
      this.table.renderRows();
    }});

    
  }
  delete(id:number){
    const dialogRef=this.dialog.open(YesnoComponent,{data:'Delete this relation', width:"300px"});
    dialogRef.afterClosed().subscribe( (data:string) => { if (data !== undefined){
      this.relations.deleterelationonetoone(this.id,id);
      this.dataSource = this.relations.getrelationsonetone(this.id);
      this.table.renderRows();
    }});
  }

  edit(id:number){
    const reg=this.relations.getrelationsonetone(this.id)[id];
    const dialogRef=this.dialog.open(RonetoonemodalComponent,{data:{ id: this.id, data: reg }, width:"300px"});
    dialogRef.afterClosed().subscribe( (data:{id:number,data:Onetoone}) => { if (data !== undefined){
      this.relations.editrelationonetoone(this.id,id,data.data);
      this.dataSource = this.relations.getrelationsonetone(this.id);
      this.table.renderRows();
    }});
  }
}
