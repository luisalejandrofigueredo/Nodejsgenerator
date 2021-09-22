import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Typeoperation } from '../interfaces/typeoperation';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ConfigService } from '../service/config.service';
import { Schemahead } from '../interfaces/schemahead';
import { ParametersmodalComponent } from '../parametersmodal/parametersmodal.component';
import { GenoptionswithoperatorsComponent } from '../genoptionswithoperators/genoptionswithoperators.component';

interface Type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-apidatamodal',
  templateUrl: './apidatamodal.component.html',
  styleUrls: ['./apidatamodal.component.scss']
})
export class ApidatamodalComponent implements OnInit {
  relations: { relationname: string, table: string }[] = [];
  types: Type[] = [
    { value: 'get', viewValue: 'Get' },
    { value: 'put', viewValue: 'Put' },
    { value: 'post', viewValue: 'Post' },
    { value: 'delete', viewValue: 'Delete' },
    { value: 'patch', viewValue: 'Patch' }
  ];

  operation: Type[] = [
    { value: 'getall', viewValue: 'Get All' },
    { value: 'getone', viewValue: 'Get One' },
    { value: 'skiplimit', viewValue: 'Get skiplimit by key' },
    { value: 'skiplimitbyfield', viewValue: 'Get skiplimit by field' },
    { value: 'skiplimitfilter', viewValue: 'Get limit filter' },
    { value: 'count', viewValue: 'Count' },
    { value: 'findandcount', viewValue: 'Find and Count' },
    { value: 'findandcountwithoptions', viewValue: 'Find and Count with options' },
    { value: 'findwithoptions', viewValue: 'Find with options' },
    { value: 'findgenerated', viewValue: 'Find generated' },
    { value: 'findandcountgenerated', viewValue: 'Find and count generated' }
  ];
  placeholder = 'Relation one to one'
  fields: string[];
  path: string;
  selectedValue: string;
  selectedOperation: string;
  selectedfield: string;
  security: boolean;
  roles: string;
  profileForm: FormGroup;
  idschema: number;
  schema: Schemahead;
  constructor(private dialog: MatDialog, private configservice: ConfigService, public dialogRef: MatDialogRef<ApidatamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Typeoperation) { }

  ngOnInit(): void {
    this.idschema = this.data.idschema;
    this.schema = this.configservice.getschemawithid(this.idschema);
    const onetoone = (this.configservice.getrelations(this.data.idschema).OnetoOne !== undefined) ? this.configservice.getrelations(this.data.idschema).OnetoOne : [];
    const onetomany = (this.configservice.getrelations(this.data.idschema).Onetomany !== undefined) ? this.configservice.getrelations(this.data.idschema).Onetomany : [];
    const manytoone = (this.configservice.getrelations(this.data.idschema).Manytoone !== undefined) ? this.configservice.getrelations(this.data.idschema).Manytoone : [];
    const manytomany = (this.configservice.getrelations(this.data.idschema).Manytomany !== undefined) ? this.configservice.getrelations(this.data.idschema).Manytomany : [];
    if (onetoone.length !== 0) {
      this.types.splice(3, 0, { value: 'postonetoone', viewValue: 'Post One to One' });
    }
    if (onetomany.length !== 0) {
      this.types.splice(3, 0, { value: 'postonetomany', viewValue: 'Post One to Many' });
    }
    if (manytoone.length !== 0) {
      this.types.splice(3, 0, { value: 'postmanytoone', viewValue: 'Post Many to one' });
    }
    if (manytomany.length !== 0) {
      this.types.splice(3, 0, { value: 'postmanytomany', viewValue: 'Post Many to many' });
    }
    if (this.schema.mastersecurity === true) {
      this.types.push({ value: 'changepassword', viewValue: 'Put change password' });
    }
    if (this.schema.filesupload == true) {
      this.types.push({ value: 'uploadfile', viewValue: 'Up load file' });
    }
    if (this.schema.filesupload == true) {
      this.types.push({ value: 'uploadfiles', viewValue: 'Up load multiple files' });
    }
    if (this.schema.filesupload == true) {
      this.types.push({ value: 'getfile', viewValue: 'Get file' });
    }
    this.fields = this.data.fields;
    this.profileForm = new FormGroup({
      selectedValue: new FormControl(this.data.type, Validators.required),
      selectedOperation: new FormControl(this.data.operation, Validators.required),
      path: new FormControl(this.data.path, Validators.required),
      selectedfield: new FormControl(this.data.field, Validators.required),
      relations: new FormControl('', Validators.required),
      security: new FormControl(this.data.security, Validators.required),
      extfiles: new FormControl(this.data.extfiles, Validators.required),
      roles: new FormControl(this.data.roles, Validators.required),
      options: new FormControl(this.data.options, Validators.required),
      parameters: new FormControl(JSON.stringify(this.data.parameters), Validators.required)
    });
    this.profileForm.get('selectedOperation').disable;
    this.profileForm.get('parameters').disable;
    this.profileForm.get('relations').disable;
    this.chargerelations();
  }
  generatecode() {
    const dialogRef = this.dialog.open(GenoptionswithoperatorsComponent, {
      width: '100%',
      disableClose: true,
      panelClass:'my-outlined-dialog',
      data: { fields: this.configservice.getfieldschemaswithid(this.idschema), schemaid: this.idschema, parameters: JSON.parse(this.profileForm.get('parameters').value) }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.profileForm.patchValue({ options: result.options });
      }
    });
  }
  generateparameters() {
    const dialogRef = this.dialog.open(ParametersmodalComponent, {
      width: '500px',
      disableClose: true,
      panelClass:'my-outlined-dialog',
      data: (this.profileForm.get('parameters').value !== "") ? JSON.parse(this.profileForm.get('parameters').value as string) : []
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.profileForm.patchValue({ parameters: JSON.stringify(result.parameters) });
      }
    });
  }
  operationchange() {
    if (this.profileForm.get('selectedOperation').value === 'findgenerated') {
      this.profileForm.get('selectedOperation').enable;
      this.profileForm.get('parameters').enable;
    }
    else {
      this.profileForm.get('selectedOperation').disable;
      this.profileForm.get('parameters').disable;
    }
  }
  selectchange() {
    this.relations = [];
    this.chargerelations();
  }

  chargerelations(){
    if (this.profileForm.get('selectedValue').value === 'postonetoone') {
      this.profileForm.get('relations').setValue(this.data.field);
      this.profileForm.get('relations').enable;
      this.placeholder = 'Relation one to one';
      const onetoone = this.configservice.getrelations(this.data.idschema).OnetoOne;
      onetoone.forEach(element => {
        this.relations.push({ relationname: element.relationname, table: element.table })
      });
    }
    if (this.profileForm.get('selectedValue').value === 'postmanytoone') {
      this.placeholder = 'Relation many to one';
      this.profileForm.get('relations').setValue(this.data.field);
      this.profileForm.get('relations').enable;
      const manytoone = this.configservice.getrelations(this.data.idschema).Manytoone;
      manytoone.forEach(element => {
        this.relations.push({ relationname: element.relationname, table: element.table })
      });
    }
    if (this.profileForm.get('selectedValue').value === 'postonetomany') {
      this.placeholder = 'Relation one to many';
      this.profileForm.get('relations').setValue(this.data.field);
      this.profileForm.get('relations').enable;
      const onetomany = this.configservice.getrelations(this.data.idschema).Onetomany;
      onetomany.forEach(element => {
        this.relations.push({ relationname: element.relationname, table: element.table })
      });
    }
    if (this.profileForm.get('selectedValue').value === 'postmanytomany') {
      this.placeholder = 'Relation many to many';
      this.profileForm.get('relations').setValue(this.data.field);
      this.profileForm.get('relations').enable;
      const manytomany = this.configservice.getrelations(this.data.idschema).Manytomany;
      manytomany.forEach(element => {
        this.relations.push({ relationname: element.relationname, table: element.table })
      });
    }
  }
  onNoClick() {
    this.dialogRef.close();
  }

  onYesClick() {
    this.data.type = this.profileForm.get('selectedValue').value;
    this.data.path = this.profileForm.get('path').value;
    this.data.operation = this.profileForm.get('selectedOperation').value;
    this.data.field = this.profileForm.get('selectedfield').value;
    this.data.security = this.profileForm.get('security').value;
    this.data.roles = this.profileForm.get('roles').value;
    this.data.extfiles = this.profileForm.get('extfiles').value,
      this.data.options = this.profileForm.get('options').value;
    if (this.profileForm.get('selectedValue').value == 'postonetoone' || this.profileForm.get('selectedValue').value == 'postonetomany' || this.profileForm.get('selectedValue').value == 'postmanytoone' || this.profileForm.get('selectedValue').value == 'postmanytomany') {
      this.data.field = this.profileForm.get('relations').value
    }
    if (this.profileForm.get('selectedOperation').value === 'findgenerated' || this.profileForm.get('selectedOperation').value === 'findandcountgenerated') {
      this.data.parameters = JSON.parse(this.profileForm.get('parameters').value as string);
    }
    else {
      this.data.parameters = [];
    }
    this.dialogRef.close(this.data);
  }
}
