import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryComponent } from './library.component';
import { AddbookComponent, EditbookComponent, AddbookDialogComponent } from './components';

const routes: Routes = [
    { path: '',
        data: { title: 'library' },
        component: LibraryComponent,
        children: [
            { path: 'addbook', component: AddbookComponent, data: {title: 'Δημιουργία', animation: 'addbook'} },
            { path: 'editbook', component: EditbookComponent, data: {title: 'Βιβλίο', animation: 'editbook'}},
        ],
    }
];



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LibraryRoutingModule {}

export const routedComponents = {

    app: [ AddbookDialogComponent, ],

    others: [
        LibraryComponent,
        AddbookComponent,
        EditbookComponent
    ]
};
