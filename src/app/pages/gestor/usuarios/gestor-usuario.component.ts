import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-gestor-usuario',
  templateUrl: './gestor-usuario.component.html',
  styles: [
  ]
})
export class GestorUsuarioComponent implements OnInit {

  // variables
  forma: FormGroup;
  regresar: string;

  usuarioEdit: Usuario;

  // ---------------------------------------
  constructor( private fb: FormBuilder,
               public usuarioService: UsuarioService,
               public route: ActivatedRoute) { }

  ngOnInit(): void {

    this.crearFormulario();

    this.rutaParametros();


  }

  // -----------------metodos----------------------

  // validaciones del Formulario de Programacion
get usuarioNoValido() {
  return this.forma.get('selectUsuario').invalid && this.forma.get('selectUsuario').touched;
}

  // ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {


  this.forma = this.fb.group({
      // es importante asociar los controles Input
    flag_admin: false,
    flag_usuarios: false,
    flag_especialistas: false,
    flag_ordenes: false,
    flag_eventos: false,
    flag_soportes: false,
    flag_archivos: false,
    flag_tarifas: false,
    flag_empresas: false,
    flag_graficas: false,
    flag_datos: false,
    flag_agenda: false,
    // flag_index: false,
    // flag: false,

      });




}


  // ------------------------------------------------------------------
// metodo para obtener la informacion desde la URL
  rutaParametros() {


    this.route.params.subscribe(parametros => {
      // console.log(parametros);
      this.regresar = parametros.page;

      if (parametros.id) {

        this.usuarioService.obtenerUsuarioByID(parametros.id.toString())
                            .subscribe((resp: Usuario) => {

                              // console.log(resp);

                             if (resp) {

                              this.usuarioEdit = resp;

                              this.forma.controls.flag_admin.setValue(this.usuarioEdit.flag_admin);
                              this.forma.controls.flag_usuarios.setValue(this.usuarioEdit.flag_usuarios);
                              this.forma.controls.flag_especialistas.setValue(this.usuarioEdit.flag_especialistas);
                              this.forma.controls.flag_ordenes.setValue(this.usuarioEdit.flag_ordenes);
                              this.forma.controls.flag_eventos.setValue(this.usuarioEdit.flag_eventos);
                              this.forma.controls.flag_soportes.setValue(this.usuarioEdit.flag_soportes);
                              this.forma.controls.flag_archivos.setValue(this.usuarioEdit.flag_archivos);
                              this.forma.controls.flag_tarifas.setValue(this.usuarioEdit.flag_tarifas);
                              this.forma.controls.flag_empresas.setValue(this.usuarioEdit.flag_empresas);
                              this.forma.controls.flag_graficas.setValue(this.usuarioEdit.flag_graficas);
                              this.forma.controls.flag_datos.setValue(this.usuarioEdit.flag_datos);
                              this.forma.controls.flag_agenda.setValue(this.usuarioEdit.flag_agenda);


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

    });


  }


  // -------------------------------------------------
  actualizarUsuario() {

    // console.log(this.forma.value);

      // let count = 0;

      // // codigo para validar los checkbox
      // Object.values( this.forma.controls ).forEach( control => {
      //   // console.log(control.pristine);
      //   if (control.pristine) {
      //     count = count + 1;
      //   }
      // });

      // if (count === 12) {
      //   return;
      // }

    this.usuarioEdit.flag_admin = this.forma.controls.flag_admin.value;
    this.usuarioEdit.flag_usuarios = this.forma.controls.flag_usuarios.value;
    this.usuarioEdit.flag_especialistas = this.forma.controls.flag_especialistas.value;
    this.usuarioEdit.flag_ordenes = this.forma.controls.flag_ordenes.value;
    this.usuarioEdit.flag_eventos = this.forma.controls.flag_eventos.value;
    this.usuarioEdit.flag_soportes = this.forma.controls.flag_soportes.value;
    this.usuarioEdit.flag_archivos = this.forma.controls.flag_archivos.value;
    this.usuarioEdit.flag_tarifas = this.forma.controls.flag_tarifas.value;
    this.usuarioEdit.flag_empresas = this.forma.controls.flag_empresas.value;
    this.usuarioEdit.flag_graficas = this.forma.controls.flag_graficas.value;
    this.usuarioEdit.flag_datos = this.forma.controls.flag_datos.value;
    this.usuarioEdit.flag_agenda = this.forma.controls.flag_agenda.value;

    if(
      this.forma.controls.flag_admin.value
      || this.forma.controls.flag_usuarios.value
      || this.forma.controls.flag_especialistas.value
      || this.forma.controls.flag_ordenes.value
      || this.forma.controls.flag_eventos.value
      || this.forma.controls.flag_soportes.value
      || this.forma.controls.flag_archivos.value
      || this.forma.controls.flag_tarifas.value
      || this.forma.controls.flag_empresas.value
      || this.forma.controls.flag_graficas.value
      || this.forma.controls.flag_datos.value
      || this.forma.controls.flag_agenda.value

     ) {

      this.usuarioEdit.flag = true;

    }

    if(
      !this.forma.controls.flag_admin.value
      && !this.forma.controls.flag_usuarios.value
      && !this.forma.controls.flag_especialistas.value
      && !this.forma.controls.flag_ordenes.value
      && !this.forma.controls.flag_eventos.value
      && !this.forma.controls.flag_soportes.value
      && !this.forma.controls.flag_archivos.value
      && !this.forma.controls.flag_tarifas.value
      && !this.forma.controls.flag_empresas.value
      && !this.forma.controls.flag_graficas.value
      && !this.forma.controls.flag_datos.value
      && !this.forma.controls.flag_agenda.value

     ) {

      this.usuarioEdit.flag = false;

    }


   // console.log(this.usuarioEdit);

    this.usuarioService.actualizarUsuario(this.usuarioEdit)
                        .subscribe(resp => {
                          this.rutaParametros();
                        });



  }


}// END class
