import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AddbookComponent, EditbookComponent, AddBookDialogComponent, AddBookCaseDialogComponent, AddCategoryDialogComponent } from './components';
import { SmartResolveService } from '../../../services';
import { BookComponent } from './book.component';
import { BookListComponent } from './components';

const routes: Routes = [
    {
        path: '',
        data: { title: 'Βιβλία' },
        component: BookComponent,
        children: [
            {
                path: '',
                redirectTo: 'library/book/list',
                data: { title: 'Όλα' }
            },
            {
                path: 'list',
                data: { title: 'Όλα' },
                component: BookListComponent,
            },
            {
                path: 'add',
                component: AddbookComponent,
                data: { title: 'Καταχώρηση', animation: 'addbook' }
            },
            {
                path: 'add/:id',
                component: AddbookComponent,
                data: { title: 'Επεξεργασία', col: 'book', redirectTo: '/library/book/add', animation: 'addbook' },
                resolve: { _id: SmartResolveService }
            },
            {
                path: 'view',
                component: EditbookComponent,
                data: { title: 'Προβολή', animation: 'editbook' }
            },
            {
                path: 'view/:id',
                component: EditbookComponent,
                data: { title: 'Προβολή', col: 'book', redirectTo: '/library/book/view', animation: 'editbook' },
                resolve: { _id: SmartResolveService }
            },
            {
                path: 'contents',
                /* component: ContentsBookComponent, */
                data: { title: 'Περιεχόμενα', animation: 'editbook' }
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookRoutingModule { }

export const routedComponents = {
    app: [AddBookDialogComponent, AddBookCaseDialogComponent, AddCategoryDialogComponent],

    others: [BookComponent, BookListComponent, AddbookComponent, EditbookComponent]
};
