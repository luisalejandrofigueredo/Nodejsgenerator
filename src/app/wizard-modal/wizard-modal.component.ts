import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronService } from 'ngx-electron';
import { Subscription } from 'rxjs';
import { ConfigServiceService } from '../service/config/config-service.service';

@Component({
  selector: 'app-wizard-modal',
  templateUrl: './wizard-modal.component.html',
  styleUrls: ['./wizard-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardModalComponent implements OnInit, OnDestroy, OnChanges {
  installing = false;
  sub: Subscription;
  constructor(private ngzone: NgZone, private electron: ElectronService,
    private ref: ChangeDetectorRef,
    private configPackageService: ConfigServiceService,
    public dialogRef: MatDialogRef<WizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectname: string, description: string }) {
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  ngOnInit(): void {
    this.electron.ipcRenderer.on("endProcess", () => this.endProcess());
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log('changes:', changes);
  }
  get installingValue(): boolean {
    return this.installing;
  }

  set installingValue(installing: boolean) {
    this.installing = installing;
  }

  onYesClick(value: boolean): void {
    this.runProcess();
  }

  endProcess() {
    this.ngzone.run(() => {
      this.dialogRef.close(true);
    })
  }

  runProcess() {
    this.sub = this.configPackageService.install(this.data.projectname, this.data.description)
      .subscribe(next => { this.installingValue = next }, error => { }, () => { });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
