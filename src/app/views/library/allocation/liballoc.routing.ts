import { LibDistributeComponent, BookCaseDialogComponent } from './components'
import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import { LibAllocComponent } from './liballoc.component'

const routes: Routes = [
    {
        path: '',
        data: { title: 'Κατανομή' },
        component: LibAllocComponent,
        children: [
            {
                path: '',
                redirectTo: 'library/allocation/distribute',
                data: { title: 'Βιβλιοθέτηση' },
                pathMatch: 'full'
            },
            {
                path: 'distribute',
                component: LibDistributeComponent,
                data: { title: 'Βιβλιοθέτηση' }
            }/* ,
            {
                path: 'bookcase',
                component: BookCaseComponent,
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
            }, */
        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LibAllocRoutingModule { }

export const routedComponents = {

    // Dialog's set
    app: [BookCaseDialogComponent],

    // Componenet's set
    others: [LibAllocComponent, LibDistributeComponent]
}
