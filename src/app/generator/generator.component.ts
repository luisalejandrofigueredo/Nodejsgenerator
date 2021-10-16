import { Component, OnInit, ViewChild, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ConfigService } from '../service/config.service';
import { RelationsService } from '../service/relations.service';
import { EntitiesService } from '../service/entities.service';
import { ServiceGeneratorService } from "../service/service-generator.service";
import { GenerateControllerService } from '../service/generate-controller.service';
import { GenerateInterfacesService } from '../service/generate-interfaces.service';
import { GenerateRoutesService } from '../service/generate-routes.service';
import { GenerateMainService } from '../service/generate-main.service';
import { GenerateLoginService } from "../service/generate-login.service";
import { GenerateMiddlewaresService } from '../service/generate-middlewares.service';
@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit, OnChanges {
  generatingline = 'Ready for begin\n';
  progressbar = false;
  format: false;
  keyfield = '';
  @ViewChild('textgenerating', { static: false }) container: ElementRef;
  @ViewChild('fileswriting', { static: false }) containerfiles: ElementRef;
  constructor(
    private generateMain:GenerateMainService,
    private generateRoutes:GenerateRoutesService,
    private generateInterface:GenerateInterfacesService,
    private generateController:GenerateControllerService,
    private entities_service: EntitiesService,
    private configservice: ConfigService,
    private generator_service:ServiceGeneratorService,
    private relationservice: RelationsService,
    private ngzone: NgZone,
    private electronservice: ElectronService,
    private generateLogin:GenerateLoginService,
    private generateMiddleware:GenerateMiddlewaresService,
    ) { }
  config: any;
  filePath: string;
  line: string;
  filegenerating = '';
  generatingfile = '';
  fileapigenerating = '';
  reltables: string[] = [];
  appPath: string;
  ormj = { PrimaryGeneratedColumn: false, OnetoOne: false, OneToMany: false, ManyToOne: false, Index: false };
  ngOnInit(): void {
    if (this.electronservice.isElectronApp) {
      this.appPath = this.electronservice.ipcRenderer.sendSync('getpath');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    this.containerfiles.nativeElement.scrollTop = this.containerfiles.nativeElement.scrollHeight;
  }

  addingPath() {
    this.addgenrartinline('reading file path ...');
    this.filePath = this.configservice.config.filePath;
    this.addgenrartinline('generating  entities...');
    this.entities_service.generate_entities();
    this.addgenrartinline('End generate entities');
    this.addgenrartinline('Begin generate service...');
    this.generator_service.begin_generate();
    this.addgenrartinline('End generate  service...');
    this.addgenrartinline('Begin generate interface...');
    this.generateInterface.generateInterface();
    this.addgenrartinline('Begin generate interface...');
    this.addgenrartinline('Begin generate controllers...');
    this.generateController.generateController();
    this.addgenrartinline('End generate controllers...');
    this.addgenrartinline('Begin generate routes...');
    this.generateRoutes.beginGenerate();
    this.addgenrartinline('End generate routes...');
    this.addgenrartinline('Begin generate Main...');
    this.generateMain.beginGenerate();
    this.addgenrartinline('End generate main...');
    this.addgenrartinline('Begin generate Login...');
    this.generateLogin.beginGenerate();
    this.addgenrartinline('End generate Login...');
    this.addgenrartinline('Begin generate middlewares...');
    this.generateMiddleware.beginGenerate();
    this.addgenrartinline('End generate middlewares...');
  }


  addgenrartinline(message: string) {
    this.ngzone.runOutsideAngular(x => {
      this.line = message;
      this.generatingline += message + '\n';
      this.container.nativeElement.value = this.generatingline;
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    });
  }

  addgenrartinlinefile(message: string) {
    this.ngzone.runOutsideAngular(x => {
      this.generatingfile += message + '\n';
      this.containerfiles.nativeElement.value = this.generatingfile;
      this.containerfiles.nativeElement.scrollTop = this.containerfiles.nativeElement.scrollHeight;
    });
  }

 
  generate(event: Event) {
    this.progressbar = true;
    this.generatingline = 'reading json file generator ...\n';
    this.config = this.configservice.config;
    this.addingPath();
    this.progressbar = false;
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }
}