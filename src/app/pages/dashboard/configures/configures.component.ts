import { Component, OnInit } from '@angular/core';

import { ConfiguresService } from 'src/app/services/dashboard/configures.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Profesion } from 'src/app/models/profesion';
import { Ciudad } from 'src/app/models/ciudad';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-configures',
  templateUrl: './configures.component.html',
  styles: [
  ]
})
export class ConfiguresComponent implements OnInit {

  // variables
  profesiones: Profesion[] = [];
  profesion: Profesion;
  ciudades: Ciudad[] =[];
  ciudad: Ciudad;
  ROLE: string = '';
  termino: string;
  terminoCiudad: string;
  profesionColor: string = '#E61919';
  flagProfesion: boolean = false;
  flagCiudad: boolean = false;


  constructor(public configuresService: ConfiguresService,
              private usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.ROLE = this.usuarioService.usuario.role;

    this.cargarProfesiones();

    this.cargarCiudades();

  }



// -----------------------------------------------------------------
// Metodo usado para cargar las profesiones
cargarProfesiones() {

  this.configuresService.obtenerProfesionTodas()
                        .subscribe((resp: any) => {

                          if (!resp.profesion){
                            this.flagProfesion = true;
                          }
                          if (resp.profesion){
                            this.flagProfesion = false;
                            this.profesiones = resp.profesion;
                          }

                          // console.log(this.profesiones);
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

// Metodo usado para cargar las ciudades
cargarCiudades() {

  this.configuresService.obtenerCiudadTodas()
                        .subscribe((resp: any) => {

                          if (!resp.ciudad){
                            this.flagCiudad = true;
                          }
                          if (resp.ciudad){
                            this.flagCiudad = false;
                            this.ciudades = resp.ciudad;
                          }

                          // console.log(this.ciudades);


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


// ==========================================================================
//          +++++++++++ GUARDAR REGISTRO PROFESION: POST ++++++++++++++
// ==========================================================================
registrarProfesion(termino: string, color: any) {

  if (!termino) {
    Swal.fire('', 'Ingresa el nombre de la Profesión', 'info');
    return;
  }



  this.profesion = new Profesion(
      termino.toUpperCase(),
      {primary: color, secondary: color}
    );



  this.configuresService.obtenerProfesionByName(termino)
                        .subscribe((resp: any) => {
                          // console.log(resp);
                          if (resp.profesion) {
                            Swal.fire('La Profesion ' + termino, 'Ya existe en el sistema', 'warning');
                            return;
                          }
                          this.configuresService.crearProfesion(this.profesion)
                                                .subscribe(res => {
                                                  this.termino = '';
                                                  this.profesionColor = '#E61919';
                                                  this.cargarProfesiones();
                                              });

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

// =====================================================
//              Metodo para Editar
// =====================================================
editarProfesion(profesion: Profesion, newColor: string) {

  this.profesion = profesion;
  this.profesion.color = {primary: newColor, secondary: newColor};
  this.profesion.especialistas = null;

  this.configuresService.actualizarProfesion(this.profesion)
                        .subscribe(resp => {
                          // console.log(resp);
                          this.cargarProfesiones();

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

// =====================================================
//              Metodo para Eliminar
// =====================================================
eliminarProfesion(profesion: Profesion) {


 // validacion correcta Eliminar Registro
 Swal.fire({
  title: '¿Esta seguro?',
  text: 'Desea eliminar a ' + profesion.nombre,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, Eliminar',
  scrollbarPadding: false,
  allowOutsideClick: false
}).then((result) => {
    if (result.value) {
                this.configuresService.borrarProfesion(profesion._id.toString())
                        .subscribe(resp => {
                          this.cargarProfesiones();

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

// --------------------------------------------------------------------------------------------------
// ==========================================================================
//          +++++++++++ GUARDAR REGISTRO CIUDAD: POST ++++++++++++++
// ==========================================================================
registrarCiudad(termino: string) {


  if (!termino) {
    Swal.fire('', 'Ingresa el nombre de la Ciudad', 'info');
    return;
  }



  this.ciudad = new Profesion(
    this.capitalLetter(termino) // elimina las tildes y  primera en mayuscula
    );



  this.configuresService.obtenerCiudadByName(this.ciudad.nombre.toString())
                        .subscribe((resp: any) => {
                          // console.log(resp);
                          if (resp.ciudad) {
                            Swal.fire('La Ciudad ' + termino, 'Ya existe en el sistema', 'warning');
                            return;
                          }
                          this.configuresService.crearCiudad(this.ciudad)
                          .subscribe(res => {
                            this.terminoCiudad = '';
                            this.cargarCiudades();
                          });

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

// -----------------------------------------------------------------
//                Metodo para Cambiar las letras
// -----------------------------------------------------------------
// Metodo para eliminar tildes y solo primera letra en Mayuscula
  capitalLetter(str: any) {


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

    for (let i = 0; i < str.length; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1); // Primera letra en Mayuscula
    }

    return str.join(' ');
  }



// =====================================================
//              Metodo para Eliminar La Ciudad
// =====================================================
eliminarCiudad(ciudad: Ciudad) {


   // validacion correcta Eliminar Registro
   Swal.fire({
    title: '¿Esta seguro?',
    text: 'Desea eliminar a ' + ciudad.nombre,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar',
    scrollbarPadding: false,
    allowOutsideClick: false
  }).then((result) => {
      if (result.value) {
                  this.configuresService.borrarCiudad(ciudad._id.toString())
                          .subscribe(resp => {
                            this.cargarCiudades();

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

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
eliminarCollection(collection: string) {

 // console.log(collection);

     // validacion correcta Eliminar Registro
     Swal.fire({
      title: '¿Esta seguro?',
      text: 'Desea eliminar a ' + collection,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      scrollbarPadding: false,
      allowOutsideClick: false
    }).then((result) => {
        if (result.value) {
            this.configuresService.eliminarCollection(collection)
                                  .subscribe(resp => {

                                   // console.log(resp);
                                   if (resp.ok) {

                                     Swal.fire({
                                       title: `${resp.message}`,
                                       text: 'Se elimino correctamente',
                                       icon: 'success',
                                       scrollbarPadding: false,
                                       allowOutsideClick: false
                                      });

                                     // carga las Ciudades y las Profesiones cuando se eliminan los especialistas
                                     if (collection === 'Especialista') {
                                       this.cargarCiudades();
                                       this.cargarProfesiones();
                                     }

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




} // END class
