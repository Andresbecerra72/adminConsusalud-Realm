import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UsuarioService } from '../usuario/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate, CanLoad {

  constructor( private usuarioService: UsuarioService,
               private router: Router) {}

  canLoad(route: Route, segments: import("@angular/router").UrlSegment[]): boolean | import("rxjs").Observable<boolean> | Promise<boolean> {

   return true;  // TODO: no realiza ninguna validacion

  }




  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot ) {


    if (this.usuarioService.estaLogueado()) {

    // console.log('Paso por loginGuard');
      return true;

    } else {

    //  console.log('Bloqueado por LoginGuard');
      this.router.navigate(['/login']);
      return false;

   }


  }

}
