import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';

import Swal from 'sweetalert2';

// esta linea sirve para llamar funciones js que estan fuera de Angular
declare function init_plugins(); // codigo para llamar script main.js
declare const gapi: any; // libreria de Google

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ '../auth.component.css' ]
})
export class LoginComponent implements OnInit {

  // variables
  remember: boolean = false;
  email: string;

  auth2: any; // variable Google

// ----------Constructor-------------------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              private router: Router,
              public usuarioService: UsuarioService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    init_plugins(); // carga la funcion del main.js
    this.googleInit();

    // activando el chexkBox recuerdame
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 0){
      this.remember = true;
    }
  }



// ==========================================================================
//             +++++++++++ AUTENTICACION CON GOOGLE ++++++++++++++
// ==========================================================================
    // metodo para Acceder - LOGIN GOOGLE
    googleInit() {

      gapi.load('auth2', () => {

            this.auth2 = gapi.auth2.init({
              client_id: '860183702817-9bkjplkcg6s13chpmhd6199quej4inkv.apps.googleusercontent.com',
              cookiepolicy: 'single_host_origin',
              scope: 'profile email'
            });

            this.attachSignin(document.getElementById('btnGoogle'));

      });

    }

    attachSignin(element: any){

      this.auth2.attachClickHandler(element, {}, (googleUser) => {
        // const profile = googleUser.getBasicProfile(); // obtiene el perfil de la cuenta de google
        // console.log(profile);

         const token = googleUser.getAuthResponse().id_token; // obtiene el token del usuario de google
        // console.log(token);

         // creando el usuario Google en la BD
         this.usuarioService.loginGoogle(token)
                             .subscribe(resp => {

                               this.navigateOut(['/dashboard']); // si el login es correcto ingresa al dashboard

                             }, err => {
                                 console.log('HTTP Error', err.error);
                                 Swal.fire({
                                  title: '¡Error!',
                                  text: JSON.stringify(err.error.message),
                                  icon: 'error',
                                  confirmButtonText: 'Cerrar',
                                  scrollbarPadding: false,
                                  allowOutsideClick: false
                                });
                              });

      });

    }

    // metodo usado cuando la navegacion es desde fuera de Angular
    navigateOut(commands: any[]): void {
      this.ngZone.run(() => this.router.navigate(commands)).then();
  }


// ==========================================================================
//             +++++++++++ AUTENTICACION NORMAL ++++++++++++++
// ==========================================================================
  // metodo para Acceder - LOGIN NORMAL
  ingresar( forma: NgForm){

    // console.log(forma.valid);
    if ( forma.invalid ) { // condicion para validar el formulario
      return;
    }

    // codigo cuando el formulario es valido
    // console.log(forma.value);

    const usuario = new Usuario(null, forma.value.correo, forma.value.password);


    this.usuarioService.login( usuario, forma.value.remember)
                        .subscribe( resp => {

                          // console.log(resp);
                          if (resp) {
                            this.router.navigate(['/dashboard']); // si el login es correcto ingresa al dashboard
                          }


                                }, err => {
                                 // console.log(err);
                                  Swal.fire({
                                    html: '<div class="alert alert-primary" role="alert">Acesso no Valido</div>',
                                    icon: 'info',
                                    scrollbarPadding: false,
                                    allowOutsideClick: false
                                  });
                                  return;

                              });


  }



// ---------------------------------------
// metodo para cambiar el tipo del Input y var el password
viewPassword() {

  const cambio = this.document.getElementById("txtPassword");
  const icono = this.document.getElementById("icon");

  // console.log(icono);

  if(cambio.getAttribute('type') === 'password') {

    cambio.setAttribute('type', 'text');

    // cambiando el icono del boton
    icono.classList.remove('fa-eye-slash');
    icono.classList.add('fa-eye');

  }else {

    cambio.setAttribute('type', 'password'); // cambia el tipo de Input

    // cambiando el icono del boton
    icono.classList.remove('fa-eye');
    icono.classList.add('fa-eye-slash');

  }








}

} // END class
