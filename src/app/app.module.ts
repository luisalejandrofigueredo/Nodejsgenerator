import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http'
import {FormsModule , ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatStepperModule} from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {  MatSortModule } from '@angular/material/sort';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { SchematicsComponent } from './schematics/schematics.component';
import { DatamodalComponent } from './datamodal/datamodal.component';
import { NgxElectronModule } from 'ngx-electron';
import { YesnoComponent } from './yesno/yesno.component';
import { ConfigComponent } from './config/config.component';
import { BrowseschematicsComponent } from './browseschematics/browseschematics.component';
import { FormschemamodalComponent } from './formschemamodal/formschemamodal.component';
import { ApiComponent } from './api/api.component';
import { ApidatamodalComponent } from './apidatamodal/apidatamodal.component';
import { GeneratorComponent } from './generator/generator.component';
import { BrowserelationsComponent } from './browserelations/browserelations.component';
import { RelationdatamodalonetomanyComponent } from './relationdatamodalonetomany/relationdatamodalonetomany.component';
import { GensecurityComponent } from './gensecurity/gensecurity.component';
import { LoggerComponent } from './config/logger/logger.component';
import { HelpComponent } from './help/help.component';
import { TestapiComponent } from './testapi/testapi.component';
import { AuthpipePipe } from './authpipe.pipe';
import { GenoptionsComponent } from './genoptions/genoptions.component';
import { ParametersmodalComponent } from './parametersmodal/parametersmodal.component';
import { GenoptionswithoperatorsComponent } from './genoptionswithoperators/genoptionswithoperators.component';
import { ViewparametersComponent } from './viewparameters/viewparameters.component';
import { AddarrayComponent } from './addarray/addarray.component';
import { BrowseonetooneComponent } from './browseonetoone/browseonetoone.component';
import { RonetoonemodalComponent } from './ronetoonemodal/ronetoonemodal.component';
import { BrowseonetomanyComponent } from './browseonetomany/browseonetomany.component';
import { BrowsemanytomanyComponent } from './browsemanytomany/browsemanytomany.component';
import { RealtiondatamodalmanytomanyComponent } from './realtiondatamodalmanytomany/realtiondatamodalmanytomany.component';
import { ProjectmodalComponent } from './projectmodal/projectmodal.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';
import { EndComponent } from './end/end.component';
import { InstallFilesComponent } from './install-files/install-files.component';
import { ConfigdevelopemtComponent } from './configdevelopemt/configdevelopemt.component';
import { ConfigProductionComponent } from './config-production/config-production.component';
import { WizardModalComponent } from './wizard-modal/wizard-modal.component';
import { ViewschemasComponent } from './viewschemas/viewschemas.component';
import { MatTreeModule } from '@angular/material/tree';
import { NextstepComponent } from './help/nextstep/nextstep.component';
import { Nextstep2Component } from './help/nextstep2/nextstep2.component';
import { ExtensionComponent } from './extension/extension.component';
import { BrowseExtensionsComponent } from './browse-extensions/browse-extensions.component';
import { NewExtensionModalComponent } from './new-extension-modal/new-extension-modal.component';
import { BrowseExtensionRoutesComponent } from './browse-extension-routes/browse-extension-routes.component';
import { ExtensionRoutesModalComponent } from './extension-routes-modal/extension-routes-modal.component';
import { BrowseControllersComponent } from './browse-controllers/browse-controllers.component';
import { ControllerModalComponent } from './controller-modal/controller-modal.component';
import { BrowseServicesExtensionComponent } from './browse-services-extension/browse-services-extension.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SchematicsComponent,
    DatamodalComponent,
    YesnoComponent,
    ConfigComponent,
    BrowseschematicsComponent,
    FormschemamodalComponent,
    ApiComponent,
    ApidatamodalComponent,
    GeneratorComponent,
    BrowserelationsComponent,
    RelationdatamodalonetomanyComponent,
    GensecurityComponent,
    LoggerComponent,
    HelpComponent,
    TestapiComponent,
    AuthpipePipe,
    GenoptionsComponent,
    ParametersmodalComponent,
    GenoptionswithoperatorsComponent,
    ViewparametersComponent,
    AddarrayComponent,
    BrowseonetooneComponent,
    RonetoonemodalComponent,
    BrowseonetomanyComponent,
    BrowsemanytomanyComponent,
    RealtiondatamodalmanytomanyComponent,
    ProjectmodalComponent,
    AboutComponent,
    ErrorComponent,
    EndComponent,
    InstallFilesComponent,
    ConfigdevelopemtComponent,
    ConfigProductionComponent,
    WizardModalComponent,
    ViewschemasComponent,
    NextstepComponent,
    Nextstep2Component,
    ExtensionComponent,
    BrowseExtensionsComponent,
    NewExtensionModalComponent,
    BrowseExtensionRoutesComponent,
    ExtensionRoutesModalComponent,
    BrowseControllersComponent,
    ControllerModalComponent,
    BrowseServicesExtensionComponent,
  ],
  imports: [ 
    BrowserModule, 
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    LayoutModule,
    MatStepperModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSortModule,
    MatRadioModule,
    DragDropModule,
    ClipboardModule,
    NgxElectronModule,
    MatTreeModule ],
  providers: [],
  bootstrap: [AppComponent],
  // tslint:disable-next-line: max-line-length
  entryComponents: [DatamodalComponent, FormschemamodalComponent, ApidatamodalComponent, RelationdatamodalonetomanyComponent,GenoptionsComponent,ParametersmodalComponent,GenoptionswithoperatorsComponent,AddarrayComponent]
})
export class AppModule { }
