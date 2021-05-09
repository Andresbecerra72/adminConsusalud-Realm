import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { LoginGuardGuard } from '../services/guards/login-guard.guard';

import { PagesComponent } from './pages.component';





const pagesRoutes: Routes = [
  {
    path: '',
     component: PagesComponent,
     canActivate: [ LoginGuardGuard ],
     canLoad: [ LoginGuardGuard ],
     loadChildren: () => import('./child-routes.module').then( m => m.ChildRoutesModule)
  }
];


@NgModule({
  imports: [ RouterModule.forChild(pagesRoutes)  ],
  exports: [ RouterModule ]
})


export class PAGES_ROUTES { }

// export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
