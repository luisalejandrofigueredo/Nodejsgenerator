import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Api } from '../interfaces/api';
import { ConfigService } from '../service/config.service';
import { ViewparametersComponent } from '../viewparameters/viewparameters.component';
import { YesnoComponent } from '../yesno/yesno.component';
import { AddarrayComponent } from '../addarray/addarray.component';
import { Schemahead, Schemaheaditems } from '../interfaces/schemahead';
import { Relations } from '../interfaces/relations';

@Component({
  selector: 'app-genoptionswithoperators',
  templateUrl: './genoptionswithoperators.component.html',
  styleUrls: ['./genoptionswithoperators.component.scss']
})
export class GenoptionswithoperatorsComponent implements OnInit {
  fields: { id: number; type: string; name: string }[] = [];
  api: Api;
  relationsarray: string[] = [];
  relationsselected: string[] = [];
  selected: number[] = [];
  selectedorder: { field: number, order: string }[] = [];
  selectedwhere: { operation: string; field: number, type: string, value: string; value2?: string; not?: boolean }[] = [];
  operators: { value: string, viewValue: string, vnot: boolean }[] = [
    { value: 'value', viewValue: 'Value', vnot: false },
    { value: 'parameter', viewValue: 'Parameter', vnot: false },
    { value: 'not', viewValue: 'Not', vnot: false },
    { value: 'lessthan', viewValue: "LessThan", vnot: false },
    { value: 'lessthanorequal', viewValue: 'LessThanOrEqual', vnot: false },
    { value: 'morethan', viewValue: 'MoreThan', vnot: false },
    { value: 'morethanorequal', viewValue: 'MoreThanOrEqual', vnot: false },
    { value: 'equal', viewValue: 'Equal', vnot: false },
    { value: 'like', viewValue: 'Like', vnot: false },
    { value: 'between', viewValue: 'Between', vnot: false },
    { value: 'in', viewValue: 'In', vnot: false },
    { value: 'any', viewValue: 'Any', vnot: false }
  ];
  profileForm: FormGroup;
  profileFormOrder: FormGroup;
  profileFormWhere: FormGroup;
  profileFormRelation: FormGroup;
  profileFormskiplimit: FormGroup;
  relations: Relations;
  gensel: boolean = false;
  genwhe: boolean = false;
  genord: boolean = false;
  genskip: boolean = false;
  genrelation: boolean = false;
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
    this.profileFormRelation = new FormGroup({
      relationname: new FormControl(''),
      textselect: new FormControl('')
    });
    this.profileFormOrder = new FormGroup({
      field: new FormControl(0, Validators.required),
      order: new FormControl('', Validators.required),
      textselect: new FormControl('')
    });
    this.profileFormWhere = new FormGroup({
      operator: new FormControl('', Validators.required),
      not: new FormControl(false),
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
    this.fillrelations(this.configservice.getrelations(this.data.schemaid));
  }

  fillrelations(relations: Relations) {
    relations.OnetoOne.forEach(item => {
      this.relationsarray.push(item.relationname)
    })
  }

  addrelation() {
    if (this.relationsselected.some((element) => element === this.profileFormRelation.get('relationname').value)) { return }
    this.relationsselected.push(this.profileFormRelation.get('relationname').value);
    this.genrelationfields();
  }

  removerelation(){
    if (this.relationsselected.some((element) => element === this.profileForm.get('relationname').value)) {
      let index = this.selected.findIndex(element => element === this.profileForm.get('relationname').value);
      this.relationsselected.splice(index, 1);
      this.genrelationfields();
      return;
    }
    this.genrelationfields();
  }

  genrelationfields() {
    let relstring="";
    if (this.relationsselected.length===0) {return};
    relstring='relations:[';
    this.relationsselected.forEach((element,index)=>{
      if (index===0){
        relstring+='"'+element+'"';
      } else {
        relstring+=','+'"'+element+'"';
      }
    });
    relstring+=']';
    this.profileFormRelation.patchValue({ textselect:relstring});
}

  selectoperator(event) {
    this.profileFormWhere.patchValue({ value: '', value2: '' });
    this.profileFormWhere.get('value2').disable();
    switch (event.value) {
      case 'raw':
        this.profileFormWhere.patchValue({ value: '${alias} ' });
        break;
      case 'in':
        this.profileFormWhere.patchValue({ value: '' });
        break;
      case 'any':
        this.profileFormWhere.patchValue({ value: '' });
        break;
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
          { value: 'value', viewValue: 'Value', vnot: false },
          { value: 'parameter', viewValue: 'Parameter', vnot: false },
          { value: 'equal', viewValue: 'Equal', vnot: true },
          { value: 'like', viewValue: 'Like', vnot: true },
          { value: 'in', viewValue: 'In', vnot: true },
          { value: 'any', viewValue: 'Any', vnot: true },
          { value: 'raw', viewValue: 'Raw', vnot: false }];
        break;
      case 'number':
        this.operators = [{ value: 'value', viewValue: 'Value', vnot: false },
        { value: 'parameter', viewValue: 'Parameter', vnot: false },
        { value: 'lessthan', viewValue: "LessThan", vnot: true },
        { value: 'lessthanorequal', viewValue: 'LessThanOrEqual', vnot: true },
        { value: 'morethan', viewValue: 'MoreThan', vnot: true },
        { value: 'morethanorequal', viewValue: 'MoreThanOrEqual', vnot: true },
        { value: 'equal', viewValue: 'Equal', vnot: true },
        { value: 'between', viewValue: 'Between', vnot: true },
        { value: 'raw', viewValue: 'Raw', vnot: false },
        ];
        break;
      default:
        break;
    }
  }

  addarray() {
    const dialogRef = this.dialogRefYes.open(AddarrayComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { values: this.profileFormWhere.get('value').value }
    });
    dialogRef.afterClosed().subscribe((ret: { values: [{ value: string }] }) => {
      let array: string = '';
      if (ret !== undefined) {
        ret.values.forEach((element, index) => {
          if (index === 0) {
            array = `"${element.value}"`;
          }
          else {
            array += ',"' + `${element.value}"`;
          }
        });
        this.profileFormWhere.patchValue({ value: array })
      }
    });

  }
  ifnot(oper: string): boolean {
    if (oper === "") return false;
    return this.operators.find(operator => operator.value === oper).vnot;
  }
  addparameter(index: number) {
    let filter: string;
    if (this.profileFormWhere.get('operator').value === 'in' || this.profileFormWhere.get('operator').value === 'any') {
      filter = 'arraystring';
    } else {
      filter = this.fields[index - 1].type;
    }
    const dialogRef = this.dialogRefYes.open(ViewparametersComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { parameters: this.data.parameters, filter: filter }
    });
    dialogRef.afterClosed().subscribe((ret: { name: string, type: string }) => {
      if (ret !== undefined) {
        this.profileFormWhere.patchValue({ value: `${ret.name}` })
      }
    });
  }

  addparametervalue2(index: number) {
    const filter: string = this.fields[index - 1].type;
    const dialogRef = this.dialogRefYes.open(ViewparametersComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { parameters: this.data.parameters, filter: filter }
    });
    dialogRef.afterClosed().subscribe((ret: { name: string, type: string }) => {
      if (ret !== undefined) {
        this.profileFormWhere.patchValue({ value2: "`${" + `${ret.name}` + "}`" })
      }
    });
  }
  addparameterskip() {
    const filter: string = 'number';
    const dialogRef = this.dialogRefYes.open(ViewparametersComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { parameters: this.data.parameters, filter: filter }
    });
    dialogRef.afterClosed().subscribe((ret: { name: string, type: string }) => {
      if (ret !== undefined) {
        this.profileFormskiplimit.patchValue({ skip: "`${" + `${ret.name}` + "}`" })
      }
    });
  }

  addparameterlimit() {
    const filter: string = 'number';
    const dialogRef = this.dialogRefYes.open(ViewparametersComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: false,
      data: { parameters: this.data.parameters, filter: filter }
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
  notinwhere(not: boolean, operatorbody: string): string {
    if (not)
      return 'Not(' + operatorbody + ')';
    else return operatorbody;

  }
  generatewhere() {
    let textselect = 'where:{';
    this.selectedwhere.forEach((element, index) => {
      switch (element.operation) {
        case 'equal':
          if (element.type === 'number') {
            if (index === 0) {
              textselect += `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `Equal(${element.value})`);
            }
            else {
              textselect += `,"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `Equal(${element.value})`);
            }
          } else {
            if (index === 0) {
              textselect += `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `Equal("${element.value}")`);
            }
            else {
              textselect += `,"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `Equal("${element.value}")`);
            }

          }
          break;
        case 'lessthan':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `LessThan(${element.value})`);
          }
          else {
            textselect += ',' + `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `LessThan(${element.value})`);
          }
          break;
        case 'lessthanorequal':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `LessThanOrEqual(${element.value})`);
          }
          else {
            textselect += ',' + `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `LessThanOrEqual(${element.value})`);
          }
          break;
        case 'morethan':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `MoreThan(${element.value})`);
          }
          else {
            textselect += `,"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `MoreThan(${element.value})`);
          }
          break;
        case 'morethanorequal':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `MoreThanOrEqual(${element.value})`);
          }
          else {
            textselect += `,"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `MoreThanOrEqual(${element.value})`);
          }
          break;
        case 'between':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `Between(${element.value},${element.value2})`);
          } else {
            textselect += `,"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `Between(${element.value},${element.value2})`);
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
        case 'in':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `In(${element.value})`);
          }
          else {
            textselect += ',' + `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `In(${element.value})`);
          }
          break;
        case 'any':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `Any(${element.value})`);
          }
          else {
            textselect += ',' + `"${this.fields[element.field - 1].name}":` + this.notinwhere(element.not, `Any(${element.value})`);
          }
          break;
        case 'raw':
          if (index === 0) {
            textselect += `"${this.fields[element.field - 1].name}":` + "Raw(alias =>" + "`" + element.value + "`)";
          }
          else {
            textselect += `,"${this.fields[element.field - 1].name}":` + "Raw(alias =>" + "`" + element.value + "`)";
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
    const type: string = this.fields[this.profileFormWhere.get('field').value - 1].type;
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
            this.selectedwhere.splice(index, 1, { operation: this.profileFormWhere.get('operator').value, field: this.profileFormWhere.get('field').value, value: this.profileFormWhere.get('value').value, type: type, value2: this.profileFormWhere.get('value2').value, not: this.profileFormWhere.get('not').value });
          } else {
            this.selectedwhere.splice(index, 1, { operation: this.profileFormWhere.get('operator').value, field: this.profileFormWhere.get('field').value, type: type, value: this.profileFormWhere.get('value').value, value2: this.profileFormWhere.get('value2').value, not: this.profileFormWhere.get('not').value });
          }
          this.generatewhere();
        }
      });
      return;
    };
    if (this.profileFormWhere.get('operator').value === 'between') {
      this.selectedwhere.push({ operation: this.profileFormWhere.get('operator').value, field: this.profileFormWhere.get('field').value, value: this.profileFormWhere.get('value').value, type: type, value2: this.profileFormWhere.get('value2').value, not: this.profileFormWhere.get('not').value });
    } else {
      this.selectedwhere.push({ operation: this.profileFormWhere.get('operator').value, field: this.profileFormWhere.get('field').value, value: this.profileFormWhere.get('value').value, type: type, not: this.profileFormWhere.get('not').value });
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

  genRelation(){
    this.genrelation=true;
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
    if (this.genrelation) {
      if (this.gensel === true || this.genwhe === true) { this.optiongenerated += "," }
      this.optiongenerated += this.profileFormRelation.get('textselect').value;
    }
    if (this.genord) {
      if (this.gensel === true || this.genwhe === true || this.genrelation === true) { this.optiongenerated += "," }
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
