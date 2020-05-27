import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from '../service/config.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Relations} from '../interfaces/relations';
import { Schemahead } from '../interfaces/schemahead';
@Component({
  selector: 'app-relationdatamodalonetomany',
  templateUrl: './relationdatamodalonetomany.component.html',
  styleUrls: ['./relationdatamodalonetomany.component.scss']
})
export class RelationdatamodalonetomanyComponent implements OnInit {
  relations: Relations[] = [];
  vector: Schemahead[];
  selectedRelation = 0;
  selectedSchema: number;
  // tslint:disable-next-line: max-line-length
  constructor(public configservice: ConfigService, public dialogRef: MatDialogRef<RelationdatamodalonetomanyComponent>, @Inject(MAT_DIALOG_DATA) public data: Relations) { }

  ngOnInit(): void {
    this.selectedSchema = this.data.table;
    this.vector = [...this.configservice.getschema()];
    this.vector.splice(this.data.idtable - 1, 1);
    if (this.vector.length !== 0){
      this.relations = [...this.configservice.getrelationfilter(this.selectedSchema - 1, 'onetomany')];
      this.selectedRelation = this.data.idtable - 1;
    }
  }

  changeschema(){
    this.relations = [...this.configservice.getrelationfilter(this.selectedSchema - 1, 'onetomany')];
  }

  changerelation(){
    
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
    this.data.type = 'manytoone';
    this.data.table = this.selectedSchema;
    this.data.idtable = this.selectedRelation;
    this.data.tablename = this.configservice.getschemaname(this.selectedSchema);
    this.data.fieldr =  this.configservice.getrelation(this.selectedSchema - 1, this.selectedRelation - 1).fieldr;
    this.dialogRef.close(this.data);
  }
}
