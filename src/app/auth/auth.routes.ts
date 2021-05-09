import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PAGES_ROUTES } from '../pages/pages.routes';

import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegisterComponent } from './register/register.component';




const authRoutes: Routes = [

    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'recover', component: RecoveryComponent}

  ];


@NgModule({
    imports: [
      RouterModule.forChild(authRoutes),
      PAGES_ROUTES
    ],
    exports: [
      RouterModule
    ]

  })


export class AUTH_ROUTES {}


// export const AUTH_ROUTES = RouterModule.forChild(authRoutes);
