import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SchematicsComponent} from './schematics/schematics.component';
import {ConfigComponent} from './config/config.component';
import {BrowseschematicsComponent} from './browseschematics/browseschematics.component';
import { ApiComponent } from './api/api.component';
import {GeneratorComponent} from './generator/generator.component';
import { BrowserelationsComponent } from './browserelations/browserelations.component';

const routes: Routes = [{
  path: 'schematics/:id',
  component: SchematicsComponent}, {
  path: 'config',
  component: ConfigComponent}, {
    path: 'browse',
    component: BrowseschematicsComponent
  }, { path: 'api/:id',
      component: ApiComponent},
    { path: 'generator',
    component: GeneratorComponent
  }, {
    path: 'browserelations/:id',
    component: BrowserelationsComponent
  }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
