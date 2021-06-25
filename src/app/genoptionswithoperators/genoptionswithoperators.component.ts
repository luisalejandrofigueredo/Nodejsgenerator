import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Api } from '../interfaces/api';
import { ConfigService } from '../service/config.service';
import { ViewparametersComponent } from '../viewparameters/viewparameters.component';
import { YesnoComponent } from '../yesno/yesno.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-genoptionswithoperators',
  templateUrl: './genoptionswithoperators.component.html',
  styleUrls: ['./genoptionswithoperators.component.scss']
})
export class GenoptionswithoperatorsComponent implements OnInit {
  fields: { id: number; type: string; name: string }[] = [];
  api: Api;
  selected: number[] = [];
  selectedorder: { field: number, order: string }[] = [];
  selectedwhere: { operation: string; field: number, value: string; value2?: string }[] = [];
  operators: { value: string, viewValue: string }[] = [
    { value: 'value', viewValue: 'Value' },
    { value: 'parameter', viewValue: 'Parameter' },
    { value: 'not', viewValue: 'Not' },
    { value: 'lessthan', viewValue: "LessThan" },
    { value: 'lessthanorequal', viewValue: 'LessThanOrEqual' },
    { value: 'morethan', viewValue: 'MoreThan' },
    { value: 'morethanorequal', viewValue: 'MoreThanOrEqual' },
    { value: 'equal', viewValue: 'Equal' },
    { value: 'like', viewValue: 'Like' },
    { value: 'between', viewValue: 'Between' },
    { value: 'in', viewValue: 'In' },
    { value: 'any', viewValue: 'Any' }
  ];
  profileForm: FormGroup;
  profileFormOrder: FormGroup;
  profileFormWhere: FormGroup;
  profileFormskiplimit: FormGroup;
  gensel: boolean = false;
  genwhe: boolean = false;
  genord: boolean = false;
  genskip: boolean = false;
  optiongenerated: string = "";
  overlay: any;
  constructor(private electron: ElectronService, public dialogRefYes: MatDialog, public dialogRef: MatDialogRef<GenoptionswithoperatorsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private configservice: ConfigService) { }
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
      operator: new FormControl('', Validators.required),
      field: new FormControl(0, Validators.required),
      value: new FormControl('', Validators.required),
      value2: new FormControl('', Validators.required),
      textselect: new FormControl('')
    });
    this.profileFormskiplimit = new FormGroup({
      skip: new FormControl(0, Validators.required),
      limit: new FormControl(10, Validators.required),
      textselect: new FormControl('')
    });
    this.profileFormWhere.get('value2').disable();
  }

  selectoperator(event) {
    this.profileFormWhere.patchValue({value:'',value2:''});
    this.profileFormWhere.get('value2').disable();
    switch (event.value) {
      case 'between':
        this.profileFormWhere.get('value2').enable();
        break;
      default:
        break;
    }

  }
  goToLink() {
    this.electron.ipcRenderer.send('helpoptions');
  }
  insertfield(event) {
    switch (this.fields[event.value - 1].type) {
      case 'string':
        this.operators = [
          { value: 'value', viewValue: 'Value' },
          { value: 'parameter', viewValue: 'Parameter' },
          { value: 'not', viewValue: 'Not' },
          { value: 'equal', viewValue: 'Equal' },
          { value: 'like', viewValue: 'Like' },
          { value: 'in', viewValue: 'In' },
          { value: 'any', viewValue: 'Any' },
          { value: 'raw', viewValue: 'Raw' }];
        break;
      case 'number':
        this.operators = [{ value: 'value', viewValue: 'Value' },
        { value: 'parameter', viewValue: 'Parameter' },
        { value: 'not', viewValue: 'Not' },
        { value: 'lessthan', viewValue: "LessThan" },
        { value: 'lessthanorequal', viewValue: 'LessThanOrEqual' },
        { value: 'morethan', viewValue: 'MoreThan' },
        { value: 'morethanorequal', viewValue: 'MoreThanOrEqual' },
        { value: 'equal', viewValue: 'Equal' },
        { value: 'between', viewValue: 'Between' },
        { value: 'raw', viewValue: 'Raw' },
        ];
        break;
      default:
        break;
    }
  }
  addparameter(index:number) {
    const filter:string=this.fields[index-1].type;
    const dialogRef = this.dialogRefYes.open(ViewparametersComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { parameters: this.data.parameters,filter:filter }
    });
    dialogRef.afterClosed().subscribe((ret: { name: string, type: string }) => {
      if (ret !== undefined) {
        this.profileFormWhere.patchValue({ value: "`${" + `${ret.name}` + "}`" })
      }
    });
  }

  addparametervalue2(index:number) {
    const filter:string=this.fields[index-1].type;
    const dialogRef = this.dialogRefYes.open(ViewparametersComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { parameters: this.data.parameters ,filter:filter}
    });
    dialogRef.afterClosed().subscribe((ret: { name: string, type: string }) => {
      if (ret !== undefined) {
        this.profileFormWhere.patchValue({ value2: "`${" + `${ret.name}` + "}`" })
      }
    });
  }
  addparameterskip(){
    const filter:string='number';
    const dialogRef = this.dialogRefYes.open(ViewparametersComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { parameters: this.data.parameters ,filter:filter}
    });
    dialogRef.afterClosed().subscribe((ret: { name: string, type: string }) => {
      if (ret !== undefined) {
        this.profileFormskiplimit.patchValue({ skip: "`${" + `${ret.name}` + "}`" })
      }
    });
  }

  addparameterlimit(){
    const filter:string='number';
    const dialogRef = this.dialogRefYes.open(ViewparametersComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { parameters: this.data.parameters ,filter:filter}
    });
    dialogRef.afterClosed().subscribe((ret: { name: string, type: string }) => {
      if (ret !== undefined) {
        this.profileFormskiplimit.patchValue({ limit: "`${" + `${ret.name}` + "}`" })
      }
    });
  }
  
  removefield() {
    if (this.selected.some((element) => element === this.profileForm.get('field').value)) {
      let index = this.selected.findIndex(element => element === this.profileForm.get('field').value);
      this.selected.splice(index, 1);
      this.generatefield();
      return;
    }
  }
  generatefield() {
    let textselect = 'select:[';
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
    let textselect = 'where:{';
    this.selectedwhere.forEach((element, index) => {
      switch (element.operation) {
        case 'between':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}": Between(${element.value},${element.value2})`;
          } else {
            textselect += `,"${this.fields[element.field - 1].name}": Between(${element.value},${element.value2})`;
          }
          break;
        case 'value':
          if (index === 0) {
            if (this.fields[element.field - 1].type === 'number') {
              textselect += `"${this.fields[element.field - 1].name}":${element.value}`
            } else { textselect += `"${this.fields[element.field - 1].name}":"${element.value}"`; }
          } else {
            if (this.fields[element.field - 1].type === 'number') {
              textselect += `"${this.fields[element.field - 1].name}":${element.value}`;
            }
            else {
              textselect += `,"${this.fields[element.field - 1].name}":"${element.value}"`;
            }
          }
          break;
        case 'parameter':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}":` + `${element.value}`;
          } else {
            textselect += `,"${this.fields[element.field - 1].name}":` + `${element.value}`;
          }
          break;
        default:
          break;
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
          if (this.profileFormWhere.get('operator').value === 'between') {
            this.selectedwhere.splice(index, 1, { operation: this.profileFormWhere.get('operator').value, field: this.profileFormWhere.get('field').value, value: this.profileFormWhere.get('value').value,value2:this.profileFormWhere.get('value2').value});
          } else{
            this.selectedwhere.splice(index, 1, { operation: this.profileFormWhere.get('operator').value, field: this.profileFormWhere.get('field').value, value: this.profileFormWhere.get('value').value });
          }
          this.generatewhere();
        }
      });
      return;
    };
    if (this.profileFormWhere.get('operator').value === 'between') {
       this.selectedwhere.push({ operation: this.profileFormWhere.get('operator').value, field: this.profileFormWhere.get('field').value, value: this.profileFormWhere.get('value').value,value2: this.profileFormWhere.get('value2').value });
    } else {
       this.selectedwhere.push({ operation: this.profileFormWhere.get('operator').value, field: this.profileFormWhere.get('field').value, value: this.profileFormWhere.get('value').value });
     }
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

  genskiplimit() {
    this.profileFormskiplimit.patchValue({ textselect: 'skip:' + this.profileFormskiplimit.get('skip').value + ',' + 'take:' + this.profileFormskiplimit.get('limit').value });
    this.genskip = true;
    this.panels.toArray().forEach(p => p.close());
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
    if (this.genskip) {
      if (this.gensel === true || this.genwhe === true || this.genord === true) { this.optiongenerated += "," }
      this.optiongenerated += this.profileFormskiplimit.get('textselect').value;
    }
    this.optiongenerated += "}";
    this.dialogRef.close({ options: this.optiongenerated });
  }
}
