import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from '../service/config.service';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  constructor(private configservice: ConfigService, private electron: ElectronService) { }
  filePath: string;
  ngOnInit(): void {
  }
  browse() {
      // tslint:disable-next-line: max-line-length
      this.electron.remote.dialog.showOpenDialog(this.electron.remote.getCurrentWindow(), { properties: ['openDirectory'] }).then(result => {
        if (result.canceled === false) {
          this.configservice.setfilepath(result.filePaths[0]);
          this.filePath = result.filePaths[0];
        }
      });
  }
  save() {
    this.configservice.save();
  }
}
