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
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
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
import { HelpconfigComponent } from './help/helpconfig/helpconfig.component';
import { ConfigprincipalComponent } from './help/helpconfig/configprincipal/configprincipal.component';
import { ConfigloggerComponent } from './help/helpconfig/configlogger/configlogger.component';
import { ConfigdatabaseComponent } from './help/helpconfig/configdatabase/configdatabase.component';
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
    HelpconfigComponent,
    ConfigprincipalComponent,
    ConfigloggerComponent,
    ConfigdatabaseComponent,
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
    ClipboardModule,
    NgxElectronModule ],
  providers: [],
  bootstrap: [AppComponent],
  // tslint:disable-next-line: max-line-length
  entryComponents: [DatamodalComponent, FormschemamodalComponent, ApidatamodalComponent, RelationdatamodalonetomanyComponent,GenoptionsComponent,ParametersmodalComponent,GenoptionswithoperatorsComponent,AddarrayComponent]
})
export class AppModule { }
