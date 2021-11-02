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
      name: new FormControl(this.data.name, Validators.compose([Validators.required, Validators.pattern('[A-Z][A-Za-z0-9_-]*')])),
      description: new FormControl(this.data.description),
      imports: new FormControl(this.data.imports),
      fields: new FormControl(this.data.fields),
      security: new FormControl(this.data.security),
      classsecurity: new FormControl(this.data.classsecurity),
      filesecurity: new FormControl(this.data.filesecurity),
      mastersecurity:new FormControl(this.data.mastersecurity),
      filesupload:new FormControl(this.data.filesupload),
      index: new FormControl(this.data.index)
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
    this.dialogRef.close(undefined);
  }
  onYesClick() {
    this.data.name = this.Userdata.get('name').value;
    this.data.description = this.Userdata.get('description').value;
    this.data.fields = this.Userdata.get('fields').value;
    this.data.imports = this.Userdata.get('imports').value;
    this.data.security = this.Userdata.get('security').value;
    this.data.classsecurity = this.Userdata.get('classsecurity').value;
    this.data.filesecurity = this.Userdata.get('filesecurity').value;
    this.data.mastersecurity= this.Userdata.get('mastersecurity').value;
    this.data.filesupload= this.Userdata.get('filesupload').value,
    this.data.index=this.Userdata.get('index').value,
    this.dialogRef.close(this.data);
  }
}
