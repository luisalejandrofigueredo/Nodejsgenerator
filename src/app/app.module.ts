import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';
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
import { RelationdatamodalComponent } from './relationdatamodal/relationdatamodal.component';
import { RelationdatamodalonetomanyComponent } from './relationdatamodalonetomany/relationdatamodalonetomany.component';
import { GensecurityComponent } from './gensecurity/gensecurity.component';
import { ViewsecurityComponent } from './viewsecurity/viewsecurity.component';
import { LoggerComponent } from './config/logger/logger.component';
import { HelpComponent } from './help/help.component';
import { HelpconfigComponent } from './help/helpconfig/helpconfig.component';
import { ConfigprincipalComponent } from './help/helpconfig/configprincipal/configprincipal.component';
import { ConfigloggerComponent } from './help/helpconfig/configlogger/configlogger.component';
import { ConfigdatabaseComponent } from './help/helpconfig/configdatabase/configdatabase.component';
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
    RelationdatamodalComponent,
    RelationdatamodalonetomanyComponent,
    GensecurityComponent,
    ViewsecurityComponent,
    LoggerComponent,
    HelpComponent,
    HelpconfigComponent,
    ConfigprincipalComponent,
    ConfigloggerComponent,
    ConfigdatabaseComponent,
  ],
  imports: [ 
    BrowserModule, 
    BrowserAnimationsModule,
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
    NgxElectronModule,
    MonacoEditorModule ],
  providers: [{
    provide: MONACO_PATH,
    useValue: 'https://unpkg.com/monaco-editor@0.18.1/min/vs'
  }],
  bootstrap: [AppComponent],
  // tslint:disable-next-line: max-line-length
  entryComponents: [DatamodalComponent, FormschemamodalComponent, ApidatamodalComponent, RelationdatamodalComponent, RelationdatamodalonetomanyComponent]
})
export class AppModule { }
