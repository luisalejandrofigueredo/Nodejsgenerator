import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-install-files',
  templateUrl: './install-files.component.html',
  styleUrls: ['./install-files.component.scss']
})
export class InstallFilesComponent implements OnInit {
  private path: string = '';
  data_file: string = '';
  package: any;
  package_data: FormGroup;
  constructor(private ngzone: NgZone,
    private dialog: MatDialog,
    private configservice: ConfigService,
    private electron: ElectronService,
    public dialogRef: MatDialogRef<InstallFilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.path = this.configservice.config.filePath;
    this.data_file = this.electron.ipcRenderer.sendSync('copy_files', { path: this.path });
    this.package = JSON.parse(this.data_file);
    if (this.package.name !== undefined) {
      this.package_data = new FormGroup({
        name: new FormControl(this.package.name, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])),
        description: new FormControl(this.package.description, Validators.required),
      });
    } else {
      this.package_data = new FormGroup({
        name: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])),
        description: new FormControl('', Validators.required),
      });
    }
  }

  assign_values() {
    this.package.name=this.package_data.get('name').value;
    this.package.description=this.package_data.get('description').value;
    this.package.dependencies = {
      "bcrypt": "^5.0.1",
      "class-transformer": "^0.4.0",
      "class-validator": "^0.13.1",
      "compression": "^1.7.4",
      "config": "^3.3.6",
      "cookie-parser": "^1.4.5",
      "cors": "^2.8.5",
      "cross-env": "^7.0.3",
      "dotenv": "^10.0.0",
      "envalid": "^7.1.0",
      "https": "^1.0.0",
      "express": "^4.17.1",
      "helmet": "^4.6.0",
      "hpp": "^0.2.3",
      "jest": "^27.0.6",
      "jsonwebtoken": "^8.5.1",
      "morgan": "^1.10.0",
      "mysql": "^2.18.1",
      "pg": "^8.6.0",
      "pm2": "^5.1.0",
      "reflect-metadata": "^0.1.13",
      "swagger-jsdoc": "^6.0.0",
      "swagger-ui-express": "^4.1.6",
      "ts-jest": "^27.0.3",
      "ts-node": "^10.0.0",
      "typeorm": "^0.2.34",
      "typescript": "^4.3.5",
      "winston": "^3.3.3",
      "winston-daily-rotate-file": "^4.5.5"
    }
    this.package.devDependencies = {
      "@types/bcrypt": "^5.0.0",
      "@types/compression": "^1.7.1",
      "@types/config": "^0.0.39",
      "@types/cookie-parser": "^1.4.2",
      "@types/cors": "^2.8.11",
      "@types/dotenv": "^8.2.0",
      "@types/express": "^4.17.13",
      "@types/helmet": "^4.0.0",
      "@types/hpp": "^0.2.1",
      "@types/jest": "^26.0.24",
      "@types/jsonwebtoken": "^8.5.4",
      "@types/morgan": "^1.9.3",
      "@types/node": "^16.0.1",
      "@types/supertest": "^2.0.11",
      "@types/swagger-jsdoc": "^6.0.1",
      "@types/swagger-ui-express": "^4.1.3",
      "@types/winston": "^2.4.4",
      "@typescript-eslint/eslint-plugin": "^4.28.2",
      "@typescript-eslint/parser": "^4.28.2",
      "eslint": "^7.30.0",
      "eslint-config-prettier": "^8.3.0",
      "eslint-plugin-prettier": "^3.4.0",
      "husky": "^7.0.1",
      "lint-staged": "^11.0.0",
      "node-config": "^0.0.2",
      "node-gyp": "^8.1.0",
      "nodemon": "^2.0.9",
      "prettier": "^2.3.2",
      "supertest": "^6.1.3",
      "tsconfig-paths": "^3.10.1"
    }
  }
  on_Install_files() {
    this.assign_values();
    this.data_file = this.electron.ipcRenderer.sendSync('write_package', { path: this.path , data: JSON.stringify(this.package)});
  }
  onYesClick() {
    this.dialogRef.close()
  }

  change_values() { }

}
