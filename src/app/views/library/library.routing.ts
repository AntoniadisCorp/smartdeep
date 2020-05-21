import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryComponent } from './library.component';

const routes: Routes = [
  {
    path: '',
    data: { title: 'Βιβλιοθήκη' },
    
    children: [
      {
        path: '',
        component: LibraryComponent,
        data: { title: 'Αρχική' }
      },
      {
        path: 'map',
        loadChildren: () => import('./map/libmap.module').then( mod => mod.LibMapModule)
      },
      {
        path: 'book',
        loadChildren: () => import('./book/book.module').then( mod => mod.BookModule)
      },
      {
        path: 'allocation', // distribution
        loadChildren: () => import('./allocation/liballoc.module').then( mod => mod.LibAllocModule)
      },/*{
        path: 'contributors', //  συνεργάτης συνεισφέρων εισφορέας, φορείς // operators εκδότες - συγγραφεις - δανειστές
        loadChildren: () => import()
      }, */
      /* { // Δανεισμός
        path: 'lending',
      }, */
    ]
  },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }

export const routedComponents = {
  app: [],

  others: [LibraryComponent]
};
