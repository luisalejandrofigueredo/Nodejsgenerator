import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schemahead } from '../interfaces/schemahead';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from '../service/config.service';


@Component({
  selector: 'app-formschemamodal',
  templateUrl: './formschemamodal.component.html',
  styleUrls: ['./formschemamodal.component.scss']
})
export class FormschemamodalComponent implements OnInit {
  Userdata: FormGroup;
  file: string;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<FormschemamodalComponent>, @Inject(MAT_DIALOG_DATA) public data: Schemahead, private electronservice: ElectronService, private configservice: ConfigService) { }
  ngOnInit(): void {
    this.Userdata = new FormGroup({
      name: new FormControl(this.data.name, Validators.compose([Validators.required, Validators.pattern('[A-Z][a-z]*')])),
      description: new FormControl(this.data.description),
      imports: new FormControl(this.data.imports),
      fields: new FormControl(this.data.fields),
      security: new FormControl(this.data.security),
      classsecurity: new FormControl(this.data.classsecurity),
      filesecurity: new FormControl(this.data.filesecurity)
    });
  }

  getfile() {
    // tslint:disable-next-line: max-line-length
    this.electronservice.remote.dialog.showOpenDialog(this.electronservice.remote.getCurrentWindow(), { defaultPath: this.configservice.config.filePath, properties: ['openFile'] }).then(result => {
      if (result.canceled === false) {
        if (this.electronservice.isWindows)  {
          const path = result.filePaths[0].replace(/\\/g, '/').replace('.ts', '');
          this.Userdata.patchValue({ filesecurity: path });
        } else {
          this.Userdata.patchValue({ filesecurity: result.filePaths[0].replace('.ts', '') });
        }
      }
    });
  }

  onNoClick() {
    console.log('no click');
    this.dialogRef.close(undefined);
  }
  onYesClick() {
    this.data.name = this.Userdata.value.name;
    this.data.description = this.Userdata.value.description;
    this.data.fields = this.Userdata.value.fields;
    this.data.imports = this.Userdata.value.imports;
    this.data.security = this.Userdata.value.security;
    this.data.classsecurity = this.Userdata.value.classsecurity;
    this.data.filesecurity = this.Userdata.value.filesecurity;
    this.dialogRef.close(this.data);
  }
}
