import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { ItemCardComponent } from './components/item-card/item-card.component';


@NgModule({
  declarations: [
    StoreComponent,
    ItemListComponent,
    ItemFormComponent,
    ItemCardComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class StoreModule { }
