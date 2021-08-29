import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronService } from 'ngx-electron';
import { Subscription } from 'rxjs';
import { ConfigService } from '../service/config.service';
import { EndComponent } from '../end/end.component';
import { ErrorComponent } from '../error/error.component';
@Component({
  selector: 'app-fastproject',
  templateUrl: './fastproject.component.html',
  styleUrls: ['./fastproject.component.scss']
})
export class FastprojectComponent implements OnInit {
  filePath: string;
  userPath: string;
  installnestjs: boolean = true;
  loadsampleproject: boolean = true;
  Fastproject: FormGroup;
  observable: Subscription;
  paths = { home: "", programPath: "" };
  progressbar = false;
  action = '';
  disable: boolean = false;
  
  constructor(private ngzone: NgZone,private dialog: MatDialog,private configservice: ConfigService, private electron: ElectronService, public dialogRef: MatDialogRef<FastprojectComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.electron.ipcRenderer.on("state", (_event, state) => this.state(state));
    this.electron.ipcRenderer.on("addtext", (_event, text) => this.addtext(text));
    this.paths = this.electron.ipcRenderer.sendSync('userpath');
    this.filePath = this.paths.home;
    console.log('app path', this.paths.programPath);
    this.Fastproject = new FormGroup({
      package: new FormControl('npm', Validators.required),
      installnestjs: new FormControl(this.installnestjs),
      projectname: new FormControl('', Validators.required),
      loadsampleproject: new FormControl(this.loadsampleproject, Validators.required),
      textarea: new FormControl('')
    })
  }

  ngOnDestroy(): void {
  }
  addtext(text: string) {
    const newvalue = this.Fastproject.get('textarea').value + text;
    this.Fastproject.get('textarea').setValue(newvalue);
  }

  state(state: string) {
    switch (state) {
      case 'installnestjs': {
        this.action = 'Installing Nestjs'
        this.progressbar = true;
        break;
      }
      case 'createproject':
        {
          this.action = 'Creating Nestjs project please wait ...'
          this.progressbar = true;
          const create = this.electron.ipcRenderer.send('createproject', { paths: this.paths, projectname: this.Fastproject.get('projectname').value, package: this.Fastproject.get('package').value });
          break;
        }
      case 'loadsampleproject': {
        this.action = 'Creating sample data'
        this.progressbar = true;
        const sampledata = this.electron.ipcRenderer.send('loadsampledata', { paths: this.paths, projectname: this.Fastproject.get('projectname').value, loadsampleproject: this.Fastproject.get('loadsampleproject').value });
        break;
      }
      case 'load': {
        this.action = 'Loading...'
        this.progressbar = true;
        if (this.electron.isWindows) {
          this.configservice.loadfile(this.filePath + '\\sample\\sample.json');
          this.configservice.config.filePath = this.paths.home + '\\' + this.Fastproject.get('projectname').value;
          this.close();
        } else {
          this.configservice.loadfile(this.filePath + '/sample/sample.json');
          this.configservice.config.filePath = this.filePath + '/' + this.Fastproject.get('projectname').value;
          this.close();
        }
        break;
      }
      case 'exit': {
        console.log('exit');
        this.close();
        break;
      }
      default:
        break;
    }
  }

  close(){
    this.ngzone.run(() => {
      const dialogRefe = this.dialog.open(EndComponent, {
        disableClose: true, data: {directory:this.filePath + '\\'+this.Fastproject.get('projectname').value}
      });
      dialogRefe.afterClosed().subscribe(data => {
        this.dialogRef.close('true');
      });
    });
  }
  

  browse() {
    this.userPath = this.paths.home;
    this.electron.remote.dialog.showOpenDialog(this.electron.remote.getCurrentWindow(), { defaultPath: this.userPath, properties: ['openDirectory'] }).then(result => {
      if (result.canceled === false) {
        this.configservice.setfilepath(result.filePaths[0]);
        this.filePath = result.filePaths[0];
      }
    });
  }
  onNoClick() {
    this.dialogRef.close()
  }
  onYesClick() {
    this.disable = true;
    this.progressbar = true;
    if (this.Fastproject.get('installnestjs').value === true) {
      const install = this.electron.ipcRenderer.send('installnestjs', this.paths);
    }
  }
}
