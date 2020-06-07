import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ElectronService } from 'ngx-electron';
import {ConfigService} from '../service/config.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // tslint:disable-next-line: max-line-length
  constructor(private breakpointObserver: BreakpointObserver,private electronservice: ElectronService, private configservice: ConfigService) {}

  openvisualcode(){
     this.electronservice.ipcRenderer.sendSync('openvisualcode', { path: this.configservice.config.filePath});
  }

}
