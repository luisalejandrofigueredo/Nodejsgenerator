import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigServiceService {
  private data_file: string = '';
  private package: any;
  constructor(private electron: ElectronService, private configservice: ConfigService) { }
  install(name: string, description: string):Observable<true> {
    let installPromise = Observable.create(observer => {
      const path = this.configservice.config.filePath;
      this.data_file = this.electron.ipcRenderer.sendSync('copy_files', { path: path });
      this.package = JSON.parse(this.data_file);
      this.package.name = name;
      this.package.description = description;
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
      this.data_file = this.electron.ipcRenderer.sendSync('write_package', { path: path, data: JSON.stringify(this.package, null, 4) });
      observer.next(true);
      const installPackage = this.electron.ipcRenderer.send('installPackages', { path: path });
      observer.complete();
    }
    );
    return installPromise;
  }
}
