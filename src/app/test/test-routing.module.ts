import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './test.component';
import { HomeComponent } from './testAnim/home.component';
import { AboutComponent } from './testAnim/about.component';

const routes: Routes = [
  { path: '', component: TestComponent, data: { state: 'test' } },
  { path: 'home', component: HomeComponent, data: { state: 'we' } },
  { path: 'about', component: AboutComponent, data: { state: 'about' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule {}
