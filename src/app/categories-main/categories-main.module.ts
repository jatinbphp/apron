import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesMainPageRoutingModule } from './categories-main-routing.module';

import { CategoriesMainPage } from './categories-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesMainPageRoutingModule
  ],
  declarations: [CategoriesMainPage]
})
export class CategoriesMainPageModule {}
