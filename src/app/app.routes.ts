import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    redirectTo: '',
    pathMatch: 'full'
},
{
    path: '', loadComponent: () => import('./home/home').then((m) => m.Home)
},];
