import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from '../service/config.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Relations} from '../interfaces/relations';
import { Schemahead } from '../interfaces/schemahead';
import { FormControl, Validators, FormGroup } from '@angular/forms';

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
  profileForm: FormGroup;
  // tslint:disable-next-line: max-line-length
  constructor(public configservice: ConfigService, public dialogRef: MatDialogRef<RelationdatamodalonetomanyComponent>, @Inject(MAT_DIALOG_DATA) public data: Relations) { }

  ngOnInit(): void {
    
   
  }

  changeschema(){
   
  }

  changerelation(){
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
   
  }
}
