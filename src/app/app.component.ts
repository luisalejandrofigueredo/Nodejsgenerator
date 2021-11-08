import { Component, NgZone, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { ProjectmodalComponent } from './projectmodal/projectmodal.component';
import { ConfigService } from './service/config.service';
import { YesnoComponent } from './yesno/yesno.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';
import { InstallFilesComponent } from './install-files/install-files.component';
import { MenuserviceService } from './service/system/menuservice.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Generator';
  recent: { name: string; path: string }[] = [];
  constructor(
    private menuService: MenuserviceService,
    private ngzone: NgZone,
    public dialog: MatDialog,
    private router: Router,
    private electron: ElectronService,
    private configservice: ConfigService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;
    this.router.onSameUrlNavigation = 'reload';
  }
  ngOnInit(): void {
    if (this.electron.isElectronApp) {
      if (localStorage.getItem('recent') !== null) {
        this.recent = JSON.parse(localStorage.getItem('recent'));
        this.electron.ipcRenderer.send('setrecent', this.recent);
        this.electron.ipcRenderer.on("error", (event, error) => this.error(error.message, error.error));
      }
      this.electron.ipcRenderer.on("navigate", (event, path) => this.navigate(path));
      this.electron.ipcRenderer.on("about", (event, file) => this.about());
      this.electron.ipcRenderer.on("tutorial", (event, file) => this.tutorial());
      this.electron.ipcRenderer.on("clearrecent", (event, file) => this.clearrecent());
      this.electron.ipcRenderer.on("loadrecent", (event, file) => this.loadrecent(file));
      this.electron.ipcRenderer.on("load file", () => this.loadfile());
      this.electron.ipcRenderer.on("saveas", () => this.saveas());
      this.electron.ipcRenderer.on("save", () => this.save());
      this.electron.ipcRenderer.on("new", () => this.new());
      this.electron.ipcRenderer.on("copy_files", () => this.install_files());
    }
  }
  navigate(path: string) {
    switch (path) {
      case 'config':
        this.ngzone.run(() => { this.router.navigate(['config']); });
        break;
      case 'browseschematics':
        this.ngzone.run(() => { this.router.navigate(['browse']); });
        break;
      case 'generator':
        this.ngzone.run(() => { this.router.navigate(['generator']); });
        break;
      case 'gensecurity':
        this.ngzone.run(() => { this.router.navigate(['gensecurity']); });
        break;
      case 'testapi':
        this.ngzone.run(() => { this.router.navigate(['testapi']); });
        break;
      case 'extensions':
        this.ngzone.run(() => { this.router.navigate(['browseExtension']); });
        break;
      default:
        break;
    }
  }
  error(message: string, error: string) {
    this.ngzone.run(() => {
      this.ngzone.run(() => {
        const dialogRef = this.dialog.open(ErrorComponent, {
          disableClose: true, data: { message: message, error: error }
        });
        dialogRef.afterClosed().subscribe(data => {
        });
      });
    });
  }
  install_files() {
    this.ngzone.run(() => {
      this.ngzone.run(() => {
        const dialogRef = this.dialog.open(InstallFilesComponent, {
          disableClose: true, data: ''
        });
        dialogRef.afterClosed().subscribe(data => {
        });
      });
    });
  }
  about() {
    this.menuService.menuDisabled();
    this.ngzone.run(() => {
      const dialogRef = this.dialog.open(AboutComponent, {
        width: '300px',
        disableClose: true, data: ''
      });
      dialogRef.afterClosed().subscribe(data => {
        this.menuService.menuEnabled();
        if (data) { this.router.navigate(['browse']) };
      });
    });
  }
  tutorial() {
    this.ngzone.run(() => { this.router.navigate(['help']); });
  }
  loadrecent(file: string) {
    this.configservice.loadfile(file);
    this.ngzone.run(() => { this.router.navigate(['browse']); });
  }
  clearrecent() {
    localStorage.removeItem("recent");
    this.recent = [];
  }

  new() {
    this.ngzone.run(() => {
      const dialogRef = this.dialog.open(YesnoComponent, {
        width: '300px',
        disableClose: true, data: 'New file and lose data'
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data !== undefined) {
          this.configservice.new();
          this.loadnewnamedialog();
          this.ngzone.run(() => { this.router.navigate(['browse']); });
        }
      });
    });
  }

  loadnewnamedialog() {
    if (this.electron.isElectronApp) {
      const projectname = (this.configservice.config.projectname !== undefined) ? this.configservice.config.projectname : "";
      const dialogRef = this.dialog.open(ProjectmodalComponent, {
        width: '100%',
        disableClose: true, data: { projectname: projectname }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data !== undefined) {
          const path = this.electron.remote.app.getAppPath();
          if (this.electron.isWindows) {
            this.configservice.config.schemapath = `${path}\\newfile.json`;
          }
          else {
            this.configservice.config.schemapath = `${path}\newfile.json`;
          }
          this.ngzone.run(() => { this.router.navigate(['browse']); });
        }
      });
    }
  }

  savelocalstrorage(name: string, path: string) {
    if (this.recent.find(element => element.name === name && element.path === path) !== undefined) {
      localStorage.setItem('recent', JSON.stringify(this.recent));
      if (this.electron.isElectronApp) {
        this.electron.ipcRenderer.send('setrecent', this.recent);
      }
    } else {
      this.recent.push({ name: name, path: path });
      localStorage.setItem('recent', JSON.stringify(this.recent));
      if (this.electron.isElectronApp) {
        this.electron.ipcRenderer.send('setrecent', this.recent);
      }
    };
  }
  loadnamedialog() {
    const projectname = (this.configservice.config.projectname !== undefined) ? this.configservice.config.projectname : "";
    const dialogRef = this.dialog.open(ProjectmodalComponent, {
      width: '300px',
      disableClose: true, data: { projectname: projectname }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.ngzone.run(() => { this.router.navigate(['browse']); });
      }
    });
  }

  save() {
    console.log('save');
    this.savelocalstrorage(this.configservice.config.projectname, this.configservice.config.schemapath);
    this.configservice.savefile();
  }
  loadfile() {
    console.log('load file');
    let file = ""
    this.electron.remote.dialog.showOpenDialog(this.electron.remote.getCurrentWindow(), {
      properties: ['openFile'], filters: [
        { name: 'schemas', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }).then(result => {
      if (result.canceled === false) {
        file = result.filePaths[0];
        this.configservice.loadfile(file);
        const projectname = (this.configservice.config.projectname !== undefined) ? this.configservice.config.projectname : "";
        if (projectname === "") {
          this.ngzone.run(() => {
            const dialogRef = this.dialog.open(ProjectmodalComponent, {
              width: '300px',
              disableClose: true, data: { projectname: projectname }
            });
            dialogRef.afterClosed().subscribe(data => {
              if (data !== undefined) {
                this.savelocalstrorage(this.configservice.config.projectname, this.configservice.config.schemapath);
                this.router.navigate(['browse']);
              }
            });
          });
        }
        this.savelocalstrorage(this.configservice.config.projectname, this.configservice.config.schemapath);
        this.ngzone.run(() => { this.router.navigate(['browse']); });
      }
    });
  }

  saveas() {
    console.log('saveas');
    let file = ""
    this.electron.remote.dialog.showSaveDialog(this.electron.remote.getCurrentWindow(), {
      filters: [
        { name: 'schemas', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }).then(result => {
      if (result.canceled === false) {
        file = result.filePath;
        this.ngzone.run(() => {
          this.configservice.config.schemapath = file;
          this.savelocalstrorage(this.configservice.config.projectname, this.configservice.config.schemapath);
          this.configservice.saveas(file);
        });
      }
    }
    );
  }
}
