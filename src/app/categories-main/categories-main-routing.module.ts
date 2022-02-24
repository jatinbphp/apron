import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesMainPage } from './categories-main.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriesMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesMainPageRoutingModule {}
