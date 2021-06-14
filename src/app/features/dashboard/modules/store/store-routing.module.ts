import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { StoreComponent } from './store.component';

const routes: Routes = [
  {
    path: '',
    component: StoreComponent,
    children: [
      {
        path: '',
        redirectTo: 'item-list',
        pathMatch: 'full'
      },
      {
        path: 'item-list',
        component: ItemListComponent
      },
      {
        path: 'item-new',
        component: ItemFormComponent
      },
      {
        path: 'item-edit/:id',
        component: ItemFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
