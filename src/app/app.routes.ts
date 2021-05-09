import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { NopagefoundComponent } from './404/nopagefound.component';

import { AUTH_ROUTES } from './auth/auth.routes';



const routes: Routes = [

  {path: '**', component: NopagefoundComponent}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    AUTH_ROUTES
  ],
  exports: [
    RouterModule
  ]

})

export class APP_ROUTES {}

// export const APP_ROUTES = RouterModule.forRoot(routes, { useHash: true });
