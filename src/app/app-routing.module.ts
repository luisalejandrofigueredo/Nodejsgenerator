import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SchematicsComponent} from './schematics/schematics.component';
import {ConfigComponent} from './config/config.component';
import {BrowseschematicsComponent} from './browseschematics/browseschematics.component';
const routes: Routes = [{
  path: 'schematics/:id',
  component: SchematicsComponent}, {
  path: 'config',
  component: ConfigComponent}, {
    path: 'browse',
    component: BrowseschematicsComponent
  }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
