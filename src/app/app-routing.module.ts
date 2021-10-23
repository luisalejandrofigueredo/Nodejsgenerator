import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchematicsComponent } from './schematics/schematics.component';
import { ConfigComponent } from './config/config.component';
import { BrowseschematicsComponent } from './browseschematics/browseschematics.component';
import { ApiComponent } from './api/api.component';
import { GeneratorComponent } from './generator/generator.component';
import { BrowserelationsComponent } from './browserelations/browserelations.component';
import { GensecurityComponent } from './gensecurity/gensecurity.component';
import { HelpComponent } from './help/help.component';
import { TestapiComponent } from './testapi/testapi.component';
import { BrowseonetooneComponent } from './browseonetoone/browseonetoone.component';
import { BrowseonetomanyComponent } from './browseonetomany/browseonetomany.component';
import { BrowsemanytomanyComponent } from './browsemanytomany/browsemanytomany.component';
import {NextstepComponent} from './help/nextstep/nextstep.component';
import { Nextstep2Component } from "../app/help/nextstep2/nextstep2.component";
const routes: Routes = [{
  path: 'schematics/:id',
  component: SchematicsComponent
}, {
  path: 'config',
  component: ConfigComponent
}, {
  path: 'browse',
  component: BrowseschematicsComponent
}, {
  path: 'api/:id',
  component: ApiComponent
},
{
  path: 'generator',
  component: GeneratorComponent
}, 
{
  path: 'browserelations/:id',
  component: BrowserelationsComponent
},
{
  path: 'gensecurity',
  component: GensecurityComponent
},
{
  path: 'help',
  component: HelpComponent
},
{ path:'helpNextStep',
  component:NextstepComponent
},
{ path:'helpNextStep2',
  component:Nextstep2Component
},
{
  path: 'testapi',
  component: TestapiComponent,
},
{
  path: 'browseonetoone/:id',
  component: BrowseonetooneComponent
},
{
  path: 'browseonetomany/:id',
  component: BrowseonetomanyComponent
},
{
  path: 'browsemanytomany/:id',
  component: BrowsemanytomanyComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
