import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
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
import { SchematicsComponent } from './schematics/schematics.component';
import { NgxElectronModule } from 'ngx-electron';
import { DatamodalComponent } from './datamodal/datamodal.component';
import { YesnoComponent } from './yesno/yesno.component';
import { ConfigComponent } from './config/config.component';
import { BrowseschematicsComponent } from './browseschematics/browseschematics.component';
import { FormschemamodalComponent } from './formschemamodal/formschemamodal.component';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    LayoutModule,
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
    FormsModule,
    NgxElectronModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DatamodalComponent, FormschemamodalComponent]
})
export class AppModule { }
