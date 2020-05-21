import { Routes, RouterModule } from '@angular/router';
import { LibMapComponent } from './libmap.component';
import { AddLibraryComponent, SettingsComponent, LibrarySpaceComponent, CategoryThemeComponent, LibrarySpaceDialogComponent, AddCategoryDialogComponent } from './components';
import { NgModule } from '@angular/core';


const routes: Routes = [
    {
        path: '',
        data: { title: 'Χωροθέτηση' },
        component: LibMapComponent,
        children: [
            {
                path: '',
                redirectTo: 'library/map/addlib',
                data: { title: 'Δημιουργία Βιβλιοθήκης' }
            },
            {
                path: 'addlib',
                component: AddLibraryComponent,
                data: { title: 'Δημιουργία Βιβλιοθήκης' }
            },
            {
                path: 'bookcase',
                component: LibrarySpaceComponent,
                data: { title: 'Χαρτογράφηση Βιβλιοθήκης' }
            },
            {
                path: 'category',
                component: CategoryThemeComponent,
                data: { title: 'Θεματολογία' }
            },
            {
                path: 'ρυθμίσεις',
                component: SettingsComponent,
                data: { title: 'Ρυθμίσεις' }
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LibMapRoutingModule { }

export const routedComponents = {
    app: [LibrarySpaceDialogComponent, AddCategoryDialogComponent],

    others: [LibMapComponent, AddLibraryComponent, LibrarySpaceComponent, CategoryThemeComponent, SettingsComponent]
};