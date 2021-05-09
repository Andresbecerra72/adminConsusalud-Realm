import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';


import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ '../auth.component.css' ]
})
export class RegisterComponent implements OnInit {

  // valriables
  forma: FormGroup;
  usuario: Usuario;

  constructor( public router: Router,
               public usuarioService: UsuarioService) { }

  ngOnInit(): void {


    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      apellido: new FormControl(null, Validators.required),
      documento: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      telefono: new FormControl(null, Validators.required),
      ciudad: new FormControl(null, Validators.required),
      direccion: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      password_conf: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)

    }, {validators: this.sonIguales('password', 'password_conf')}); // este vaalidators llama la funcion para comparar los campos


    // codigo para llenar el formulario
    // this.forma.setValue({
    //   nombre: 'Test',
    //   apellido: '',
    //   documento: '',
    //   correo: 'test@test.com',
    //   telefono: '',
    //   ciudad: 'Bogota',
    //   direccion: '',
    //   password: '123456',
    //   password_conf: '123456',
    //   condiciones: true,

    // });


  }


  // -----------------------------------------
  // validacion de los inputs
  // -----------------------------------------
  get nombreNoValido() {
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
  }
  get apellidoNoValido() {
    return this.forma.get('apellido').invalid && this.forma.get('apellido').touched;
  }
  get documentoNoValido() {
    return this.forma.get('documento').invalid && this.forma.get('documento').touched;
  }
  get correoNoValido() {
    return this.forma.get('correo').invalid && this.forma.get('correo').touched;
  }
  get telefonoNoValido() {
    return this.forma.get('telefono').invalid && this.forma.get('telefono').touched;
  }
  get ciudadNoValido() {
    return this.forma.get('ciudad').invalid && this.forma.get('ciudad').touched;
  }
  get direccionNoValido() {
    return this.forma.get('direccion').invalid && this.forma.get('direccion').touched;
  }
  get passwordNoValido() {
    return this.forma.get('password').invalid && this.forma.get('password').touched;
  }


  // Metodo para registrar el Usuario Nuevo
  registrarUsuario(){


    if (this.forma.invalid) { // condicion si el formulario es Invalido
       // codigo para obtener los controles Input del formulario
    return  Object.values( this.forma.controls ).forEach( control => {
      control.markAsTouched(); // marca el input como tocado por el usuario
    });
    }


    if (!this.forma.value.condiciones) { // condicion si falta Aceptar los terminos
      Swal.fire({
        title: 'Atención',
        text: 'Falta aceptar las condiciones',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
        scrollbarPadding: false,
        allowOutsideClick: false
      });
      return;
    }


    // Mensaje de Alerta CARGANDO
    // Swal.fire({
    //   title: 'Espere',
    //   text: 'Guardando Información',
    //   icon: 'info',
    //   allowOutsideClick: false
    // });
    // Swal.showLoading();


    // Mensaje de Alerta ERROR
    // Swal.fire({
    //   title: '¡Error!',
    //   text: JSON.stringify(err.error),
    //   icon: 'error',
    //   confirmButtonText: 'Cerrar'
    // });



    // console.log(this.forma.value);
    const nombre = this.forma.value.nombre;
    const apellido = this.forma.value.apellido;
    const correo = this.forma.value.correo;

    this.usuario = new Usuario(

          this.capitalLetter(nombre),
          this.getMinuscula(correo),
          this.forma.value.password,
          this.capitalLetter(apellido),
          this.forma.value.documento,
          this.forma.value.telefono,
          this.forma.value.ciudad,
          this.forma.value.direccion

    );

    this.usuarioService.crearUsuario(this.usuario)
                       .subscribe( resp => {
                        this.router.navigate(['/login']); // navega a la Pagina del Login
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



  }

// metodo para dejar todo en minuscula
  getMinuscula(str: string) {

   return str.toLowerCase();

  }



// Metodo para validar los campos Password
sonIguales( campo1: string, campo2: string ){

  return ( group: FormGroup) => {

    const pass1 = group.controls[campo1].value;
    const pass2 = group.controls[campo2].value;

    if (pass1 === pass2) {
      return null;
    }
 // si los campos son diferentes retorna true
    return{
      sonIguales: true
    };
  };
}


// -----------------------------------------------------------------
//                Metodo para Cambiar las letras
// -----------------------------------------------------------------
// Metodo para eliminar tildes y solo primera letra en Mayuscula
capitalLetter(str: any) {


  if (!str) {
    return 'NA';
  }




  str = str.trim();

  const normalize = (() => {
    // tslint:disable-next-line: one-variable-per-declaration
    const from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
        to   = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
        mapping = {};

    for (let i = 0; i < from.length; i++ ) {
      mapping[ from.charAt( i ) ] = to.charAt( i );
    }

    return ( strg ) => {
        const ret = [];
        for ( let i = 0; i < strg.length; i++ ) {
            const c = strg.charAt( i );
            if ( mapping.hasOwnProperty( strg.charAt( i ) ) ) {
                ret.push( mapping[ c ] );
            }
            else {
                ret.push( c );
            }
        }
        return ret.join( '' );
    };

  })();


  str = normalize(str).toLowerCase(); // elimina las tildes y deja todo en Minuscula
  str = str.split(' ');

  for (let i = 0; i < str.length; i++) { // elimina espacios
    if ( str[i] === '' ) {
     // console.log('aqui');
      str.splice(i, 1); // remueve el registro
    }

  }

  for (let i = 0; i < str.length; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1); // Primera letra en Mayuscula
  }

  return str.join(' ');
}



}
