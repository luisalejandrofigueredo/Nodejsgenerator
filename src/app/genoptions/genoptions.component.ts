import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Api } from "../interfaces/api";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { YesnoComponent } from '../yesno/yesno.component';

@Component({
  selector: 'app-genoptions',
  templateUrl: './genoptions.component.html',
  styleUrls: ['./genoptions.component.scss']
})
export class GenoptionsComponent implements OnInit {

  fields: any[] = [];
  api: Api;
  selected: number[] = [];
  selectedorder: { field: number, order: string }[] = [];
  selectedwhere: { field: number, value: string }[] = [];
  profileForm: FormGroup;
  profileFormOrder: FormGroup;
  profileFormWhere: FormGroup;
  gensel: boolean = false;
  genwhe: boolean = false;
  genord: boolean = false;
  optiongenerated: string = "";
  overlay: any;

  constructor(public dialogRefYes: MatDialog, public dialogRef: MatDialogRef<GenoptionsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private configservice: ConfigService) { }
  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;
  ngOnInit(): void {
    this.fields = this.data.fields;
    this.profileForm = new FormGroup({
      field: new FormControl(0, Validators.required),
      textselect: new FormControl('')
    });
    this.profileFormOrder = new FormGroup({
      field: new FormControl(0, Validators.required),
      order: new FormControl('', Validators.required),
      textselect: new FormControl('')
    });
    this.profileFormWhere = new FormGroup({
      field: new FormControl(0, Validators.required),
      value: new FormControl('', Validators.required),
      textselect: new FormControl('')
    });
  }
  change() { }
  changeorder() { }
  removefield() {
    if (this.selected.some((element) => element === this.profileForm.get('field').value)) {
      let index = this.selected.findIndex(element => element === this.profileForm.get('field').value);
      this.selected.splice(index, 1);
      this.generatefield();
      return;
    }
  }
  generatefield() {
    let textselect = '"select":[';
    this.selected.forEach((element, index) => {
      if (index === 0) {
        textselect += `"${this.fields[element - 1].name}"`;
      } else {
        textselect += `,"${this.fields[element - 1].name}"`;
      }
    });
    textselect += ']';
    this.profileForm.patchValue({ textselect: textselect });
  }


  addfield() {
    if (this.selected.some(element => element === this.profileForm.get('field').value)) return;
    this.selected.push(this.profileForm.get('field').value);
    this.generatefield();
  }
  
  removefieldwhere() {
    if (this.selectedwhere.some((element) => element.field === this.profileFormWhere.get('field').value)) {
      let index = this.selectedwhere.findIndex(element => element.field === this.profileFormWhere.get('field').value);
      this.selectedwhere.splice(index, 1);
      this.generatewhere();
      return;
    }
  }
  
  generatewhere() {
    let textselect = '"where":{';
    this.selectedwhere.forEach((element, index) => {
      if (index === 0) {
        if (this.fields[element.field - 1].type === 'number') {
          textselect += `"${this.fields[element.field - 1].name}":${element.value}`
        } else { textselect += `"${this.fields[element.field - 1].name}":"${element.value}"`; }
      } else {
        if (this.fields[element.field - 1].type === 'number') {
          textselect += `,"${this.fields[element.field - 1].name}":${element.value}`;
        }
        else {
          textselect += `,"${this.fields[element.field - 1].name}":"${element.value}"`;
        }
      }
    });
    textselect += '}';
    this.profileFormWhere.patchValue({ textselect: textselect });
  }
  
  addfieldwhere() {
    if (this.selectedwhere.some(element => element.field === this.profileFormWhere.get('field').value)) {
      const dialogRef = this.dialogRefYes.open(YesnoComponent, {
        width: '500px',
        autoFocus: false,
        disableClose: false,
        data: 'Change the value field?'
      });
      dialogRef.afterClosed().subscribe(ret => {
        if (ret !== undefined) {
          let index = this.selectedwhere.findIndex(element => element.field === this.profileFormWhere.get('field').value);
          this.selectedwhere.splice(index, 1, { field: this.profileFormWhere.get('field').value, value: this.profileFormWhere.get('value').value });
          this.generatewhere();
        }
      });
      return;
    };
    this.selectedwhere.push({ field: this.profileFormWhere.get('field').value, value: this.profileFormWhere.get('value').value });
    this.generatewhere();
  }
  
  addfieldorder() {
    if (this.selectedorder.some(element => element.field === this.profileFormWhere.get('field').value)) { return };
    this.selectedorder.push({ field: this.profileFormOrder.get('field').value, order: this.profileFormOrder.get('order').value });
    let textselect = '"order":{';
    this.selectedorder.forEach((element, index) => {
      if (index === 0) {
        textselect += `"${this.fields[element.field - 1].name}":"${element.order}"`;
      } else {
        textselect += `,"${this.fields[element.field - 1].name}":"${element.order}"`;
      }
    });
    textselect += '}';
    this.profileFormOrder.patchValue({ textselect: textselect });
  }
  
  
  genselect() {
    this.gensel = true;
    this.panels.toArray().forEach(p => p.close());
  }

  genWhere() {
    this.genwhe = true;
    this.panels.toArray().forEach(p => p.close());
  }

  genOrder() {
    this.genord = true;
    this.panels.toArray().forEach(p => p.close());
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.optiongenerated = "{";
    if (this.gensel === true) { this.optiongenerated += this.profileForm.get('textselect').value };
    if (this.genwhe) {
      if (this.gensel === true) { this.optiongenerated += "," }
      this.optiongenerated += this.profileFormWhere.get('textselect').value;
    };
    if (this.genord) {
      if (this.gensel === true || this.genwhe === true) { this.optiongenerated += "," }
      this.optiongenerated += this.profileFormOrder.get('textselect').value;
    };
    this.optiongenerated += "}";
    this.dialogRef.close(this.optiongenerated);
  }

}
