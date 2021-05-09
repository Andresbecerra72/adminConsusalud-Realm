import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: [ '../auth.component.css' ]
})
export class RecoveryComponent implements OnInit {


  // variables
  forma: FormGroup;
  correo: string;
  documento: string = '';
  usuario: Usuario;

  optionsArray: any[] = ['0', '0', '0'];

  phone: string = '';
  opc1: number = 0;
  opc2: number = 0;
  opc3: number = 0;


  flagCorreo: boolean = false;
  flagTelefono: boolean = false;
  flagForma: boolean = false;



  // --------------------------------
  constructor(public usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.getOptions();

    this.crearFormulario();

  }

  // ---------Metodos-----------------------


// --------------------------------------------------
//        Metodo para Crear el Formulario
// --------------------------------------------------
  crearFormulario() {

    this.forma = new FormGroup({
      password: new FormControl(null, Validators.required),
      password_conf: new FormControl(null, Validators.required)

    }, {validators: this.sonIguales('password', 'password_conf')}); // este vaalidators llama la funcion para comparar los campos


  }

// --------------------------------------------------
//  Metodo para buscar el Usuario por No Documento
// --------------------------------------------------
  obtenerUsuario() {

    const characters = /[ &\/\\#,+()$~%.'":*?<>{}áéíóúÁÉÍÓÚñÑa-zA-Z_-]/g;

    if (this.documento === '' || !this.documento) {
      return;
    }


     // evita caracteres Especiales
    if (this.documento.match(characters)) {
      this.resetData();
      return;
    }


    this.usuarioService.obtenerUsuarioByDoc(this.documento)
                         .subscribe( (resp: any) => {

                          // console.log(resp);

                          if (resp) {

                            this.usuario = resp;
                            this.flagCorreo = true;

                            // codigo para ubicar las opciones de telefonos
                            this.optionsArray[this.opc1] = this.usuario.telefono;
                            this.optionsArray[this.opc2] = this.getPhone();
                            this.optionsArray[this.opc3] = this.getPhone();

                            // console.log(this.usuario);


                          }else {

                            this.resetData();

                            Swal.fire({
                              html: '<div class="alert alert-danger" role="alert">Usuario no valido</div>',
                              icon: 'error',
                              scrollbarPadding: false,
                              allowOutsideClick: false
                            });
                            return;

                          }

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


// --------------------------------------------------
//  Metodo para Confirmar el usuario con el Correo
// --------------------------------------------------
  confirmarUsuario() {


    // console.log(this.correo);

    if (this.flagCorreo) {

      if (this.correo === this.usuario.correo) {

        // Usuario Correo Valido Ok
        this.flagTelefono = true;


      }else {

        this.resetData();

        Swal.fire({
          html: '<div class="alert alert-danger" role="alert">Usuario no valido</div>',
          icon: 'error',
          scrollbarPadding: false,
          allowOutsideClick: false
        });
        return;


      }

    }


  }

// ------------------------------------------------
//    Metodo para la seleccion de Radio Buttom
// ------------------------------------------------
radioChecked(item: string){

  // console.log(item);

  if (item === this.usuario.telefono) {

     // Usuario Telefono Valido Ok
    this.flagForma = true;


  }else {

    this.resetData();

    Swal.fire({
      html: '<div class="alert alert-danger" role="alert">Usuario no valido</div>',
      icon: 'error',
      scrollbarPadding: false,
      allowOutsideClick: false
    });

    return;

  }

  }



// -----------------------------------------
// Metodo para Obtener numero de Telefono
// -----------------------------------------
getPhone() {

  const arrayCell = [];

  for (let i = 0; i < 2; i++) {
    const n = Math.floor((Math.random() * 3) + 1).toString();
    arrayCell.push(n);
  }
  for (let i = 0; i < 7; i++) {
    const n = Math.floor(Math.random() * 9).toString();
    arrayCell.push(n);
  }

  return `3${arrayCell.join('')}`;

}


// -----------------------------------------
// Metodo para Ordenar las Opciones
// -----------------------------------------
getOptions() {

  const opc1 = Math.floor(Math.random() * 3);
  let opc2 = Math.floor(Math.random() * 3);
  let opc3 = Math.floor(Math.random() * 3);
  while (opc1 === opc2 || opc1 === opc3 || opc2 === opc3) {
    opc2 = Math.floor(Math.random() * 3);
    opc3 = Math.floor(Math.random() * 3);
  }

  this.opc1 = opc1;
  this.opc2 = opc2;
  this.opc3 = opc3;

}



// metodo para reset todas las variables
resetData() {

  this.flagCorreo = false;
  this.flagTelefono = false;
  this.flagForma = false;
  this.usuario = null;
  this.documento = null;
  this.correo = null;

}


// -----------------------------------------
// Metodo para Cambiar la Contraseña en DB
// -----------------------------------------
  recover() {

     // console.log(this.forma);


     if ( this.forma.invalid ) { // condicion para validar el formulario
      return;
    }


    // si todo OK
     this.usuario.password = this.forma.value.password;
     this.usuario.activo = 'recover';

     // console.log(this.usuario);

     this.usuarioService.recoverPassword(this.usuario)
                         .subscribe(resp => {

                          Swal.fire({
                            html: `
                            <div class="alert alert-info" role="alert">Comunícate con el Administrador para activar el Acceso</div>
                            `,
                            icon: 'info',
                            scrollbarPadding: false,
                            allowOutsideClick: false
                          });

                          this.resetData();

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

} // END class
