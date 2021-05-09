import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup} from '@angular/forms';

import { ContratanteService } from 'src/app/services/dashboard/contratante.service';
import { AsesorService } from 'src/app/services/dashboard/asesor.service';

import { Contratante } from 'src/app/models/contratante.model';
import { Asesor } from 'src/app/models/asesor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contratantes',
  templateUrl: './contratantes.component.html',
  styles: [
  ]
})
export class ContratantesComponent implements OnInit {

  // variables
  forma: FormGroup;
  contratantes: Contratante[] = [];
  contratante: Contratante;
  asesor: Asesor;

  pagina: number = 0;
  totalRegistros: number = 0;
  flag: boolean = false;
  hide: string = 'hide'; // variable para ocultar el modal
  form1Hide: boolean = false;
  form2Hide: boolean = false;
  nombre: string = '';
  cargando: boolean = true;
  message: string = '';


  constructor(public contratanteService: ContratanteService,
              public asesorService: AsesorService) { }

  ngOnInit(): void {

    this.cargarArls();

  }



  // Metodo para cargar las ARLs
  cargarArls() {

    this.contratanteService.obtenerArls( this.pagina )
                      .subscribe((resp: any) => {

                        this.cargando = false;
                        this.totalRegistros = resp.total;


                        if (this.totalRegistros === 0) {
                          this.message = resp.message;
                          this.flag = true;
                          return;

                        }

                        if (this.totalRegistros > 0){
                          // console.log(resp);
                          this.contratantes = resp.contratante;
                          this.flag = false;
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



// --------------------------------------------------------
// Selecciona la accion del Boton del Componente TABLE
// --------------------------------------------------------
setDataFromTable(event: any) {



  if (event[0] === 'Edit') { // EDITAR Arl

    this.contratante = event[1];
    this.nombre = 'ARL';
    this.mostrarModal();

    return;


  }

  if (event[0] === 'Edit-Asesor') { // EDITAR Asesor

    // codigo para Obtener los datos completos de la Asesor
    this.asesorService.obtenerAsesorByName(event[1].nombre.toString())
                    .subscribe((resp: any) => {

                     if (resp.asesor){
                      this.asesor = resp.asesor;
                      this.nombre = 'Asesor';
                      this.mostrarModal();
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

    return;

  }



  if (event[0] === 'Delete') { // ELIMINAR Arl

    this.contratante = event[1];
    this.eliminarRegistroArl(this.contratante);
    return;

  }

  if (event[0] === 'Delete-Asesor') { // ELIMINAR Asesor

          // codigo para Obtener los datos completos de la Asesor
          this.asesorService.obtenerAsesorByName(event[1].nombre.toString())
                             .subscribe((resp: any) => {
                              // console.log(resp);
                              if (resp) {
                                this.asesor = resp.asesor;
                                this.eliminarRegistroAsesor(this.asesor);
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

}




// ==========================================================================
//             +++++++++++ GUARDAR REGISTRO ARL: POST ++++++++++++++
// ==========================================================================
  registrarArl(event: FormGroup) {

    this.forma = event;

    Swal.fire({
      title: 'Espere',
      text: 'Guardando Información',
      icon: 'info',
      scrollbarPadding: false,
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.contratante = new Contratante(

      this.forma.controls.name.value,
      this.forma.controls.email.value,
      this.forma.controls.cell.value,
      this.forma.controls.city.value,
      this.forma.controls.adress.value,
      this.forma.controls.contract.value

 );

   // console.log(this.contratante);


    this.contratanteService.guardandoArl(this.contratante)
                            .subscribe( // usado para funcionar con API-PHP**
                               res => {
                                // console.log('HTTP response', res);
                                 Swal.fire({
                                  title: 'Registro Aceptado',
                                  icon: 'success',
                                  confirmButtonText: 'Cerrar',
                                  scrollbarPadding: false,
                                  allowOutsideClick: false
                                });
                                 this.form1Hide = false;
                                 this.forma.reset();
                                 this.contratante = null;
                                 this.asesor = null;
                                 this.nombre = null;
                                 this.cargarArls();

                                },
                               err => {
                                 console.log('HTTP Error', err.error);
                                 Swal.fire({
                                  title: '¡Error!',
                                  text: JSON.stringify(err.error.message),
                                  icon: 'error',
                                  confirmButtonText: 'Cerrar',
                                  scrollbarPadding: false,
                                  allowOutsideClick: false
                                });
                                 this.forma.reset();
                                },
                              // () => console.log('HTTP request completed.')


                          );

  }




// ==========================================================================
//             +++++++++++ GUARDAR REGISTRO ASESOR: POST ++++++++++++++
// ==========================================================================
registrarAsesor(event: FormGroup) {

  this.forma = event;

  if (this.forma.controls.selectArl.value._id !== 'Default') {
    this.contratante = this.forma.controls.selectArl.value;
  }

  if (this.forma.controls.selectArl.value._id === 'Default') {
    // this.contratante = null;
    Swal.fire('', 'Falta Seleccionar ARL', 'error');
    return;
  }

  Swal.fire({
    title: 'Espere',
    text: 'Guardando Información',
    icon: 'info',
    scrollbarPadding: false,
    allowOutsideClick: false
  });
  Swal.showLoading();

  this.asesor = new Asesor(

    this.forma.controls.name.value,
    this.forma.controls.email.value,
    this.forma.controls.cell.value,
    this.forma.controls.city.value,
    this.forma.controls.adress.value,
    null,
    null,
    null,
    null,
    null,
    null,
    this.contratante


);


 // console.log(this.asesor);


  this.asesorService.guardandoAsesor(this.asesor)
                          .subscribe( // usado para funcionar con API-PHP**
                             res => {
                              // console.log('HTTP response', res);
                               Swal.fire({
                                title: 'Registro Aceptado',
                                icon: 'success',
                                confirmButtonText: 'Cerrar',
                                scrollbarPadding: false,
                                allowOutsideClick: false
                              });

                               if (res.asesor && this.contratante) {
                                 // codigo para crear la empresa en la ARL
                                  this.contratante.asesores = res.asesor;
                                  this.contratanteService.ingresarDatasIntoArl(this.contratante, 'Asesor')
                                                        .subscribe( resp => this.cargarArls());

                              }


                               this.form2Hide = false;
                               this.forma.reset();
                               this.contratante = null;
                               this.asesor = null;
                               this.nombre = null;


                              },
                             err => {
                               console.log('HTTP Error', err.error);
                               Swal.fire({
                                title: '¡Error!',
                                text: JSON.stringify(err.error.message),
                                icon: 'error',
                                confirmButtonText: 'Cerrar',
                                scrollbarPadding: false,
                                allowOutsideClick: false
                              });
                               this.forma.reset();
                              },
                            // () => console.log('HTTP request completed.')


                        );

}


// ==========================================================================
//             +++++++++++ ACTUALIZAR REGISTRO ARL: PUT ++++++++++++++
// ==========================================================================
actualizarArl(event: FormGroup) {

  this.forma = event;

 // console.log(this.forma);

  this.contratante.nombre = this.forma.controls.name.value;
  this.contratante.telefono = this.forma.controls.cell.value;
  this.contratante.correo = this.forma.controls.email.value;
  this.contratante.ciudad = this.forma.controls.city.value;
  this.contratante.direccion = this.forma.controls.adress.value;
  this.contratante.contrato = this.forma.controls.contract.value;

  this.contratante.asesores = null;
  this.contratante.empresas = null;
  this.contratante.ordenes = null;


  this.contratanteService.actualizarArl(this.contratante)
                         .subscribe((resp: any) => {
                          this.cargarArls();
                          this.cerraModal();
                          Swal.fire({
                            title: 'Datos ARL Actualizados',
                            text: resp.contratante.nombre,
                            icon: 'success',
                            confirmButtonText: 'Cerrar',
                            scrollbarPadding: false,
                            allowOutsideClick: false
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


// ==========================================================================
//             +++++++++++ ACTUALIZAR REGISTRO ASESOR: PUT ++++++++++++++
// ==========================================================================
actualizarAsesor(event: FormGroup) {

  this.forma = event;

  if (this.forma.controls.selectArl.value._id !== 'Default') {

    this.contratante = this.forma.controls.selectArl.value;
  }

  if (this.forma.controls.selectArl.value._id === 'Default') {
    this.contratante = null;
  }

  this.asesor.nombre = this.forma.controls.name.value;
  this.asesor.telefono = this.forma.controls.cell.value;
  this.asesor.correo = this.forma.controls.email.value;
  this.asesor.ciudad = this.forma.controls.city.value;
  this.asesor.direccion = this.forma.controls.adress.value;

  this.asesor.contratante = this.contratante;

  this.asesor.ordenes = null;


  this.hide = 'hide'; // cierra el modal



  this.asesorService.obtenerAsesorByName(this.asesor.nombre.toString())
                  .subscribe((resp: any) => {
                        // console.log(resp);
                        if (resp.asesor.contratante) {

                             if (this.contratante._id.toString() === resp.asesor.contratante._id.toString()) {

                              this.asesorService.actualizarAsesor(this.asesor)
                                              .subscribe(res => {
                                                this.cargarArls();
                                                this.cerraModal();
                                                Swal.fire({
                                                  title: 'Datos Asesor Actualizados',
                                                  text: resp.asesor.nombre,
                                                  icon: 'success',
                                                  confirmButtonText: 'Cerrar',
                                                  scrollbarPadding: false,
                                                  allowOutsideClick: false
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
                              return;

                            }
                             if (this.contratante._id.toString() !==   resp.asesor.contratante._id.toString()) {

                              this.asesorService.actualizarAsesor(this.asesor)
                                              .subscribe(res => {
                                                if (this.contratante) { // codigo para crear el asesor en el Contratante
                                                  this.contratante.asesores = res;
                                                  this.contratanteService.ingresarDatasIntoArl(this.contratante, 'Asesor')
                                                                        .subscribe();

                                                }

                                                Swal.fire({
                                                  title: 'Datos Asesor Actualizados',
                                                  text: resp.asesor.nombre,
                                                  icon: 'success',
                                                  confirmButtonText: 'Cerrar',
                                                  scrollbarPadding: false,
                                                  allowOutsideClick: false
                                                });

                                                this.cargarArls();
                                                this.cerraModal();

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
                              return;

                            }

                        }
                        if (!resp.asesor.contratante) {

                          this.asesorService.actualizarAsesor(this.asesor)
                                              .subscribe(res => {
                                                if (this.contratante) { // codigo para crear el asesor en el Contratante
                                                  this.contratante.asesores = res;
                                                  this.contratante.empresas = null;
                                                  this.contratante.ordenes = null;
                                                  this.contratanteService.actualizarArl(this.contratante)
                                                                     .subscribe();

                                                }

                                                Swal.fire({
                                                  title: 'Datos Asesor Actualizados',
                                                  text: resp.asesor.nombre,
                                                  icon: 'success',
                                                  confirmButtonText: 'Cerrar',
                                                  scrollbarPadding: false,
                                                  allowOutsideClick: false
                                                });

                                                this.cargarArls();
                                                this.cerraModal();


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
                          return;


                        }

                  });



}



// ==========================================================================
//             +++++++++++ ELIMINAR REGISTRO ARL: DELETE ++++++++++++++
// ==========================================================================
  eliminarRegistroArl(index: Contratante) {

  // console.log(index);

 // validacion correcta Eliminar Registro
  Swal.fire({
              title: '¿Esta seguro?',
              text: 'Desea eliminar a ' + index.nombre,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, Eliminar',
              scrollbarPadding: false,
              allowOutsideClick: false
            }).then((result) => {
              if (result.value) {

                            this.contratanteService.borrarArl(index._id)
                                                    .subscribe(resp => {
                                                      this.cargarArls();

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


// ==========================================================================
//             +++++++++++ ELIMINAR REGISTRO: DELETE ++++++++++++++
// ==========================================================================
eliminarRegistroAsesor(index: Asesor) {

  // console.log(index);

 // validacion correcta Eliminar Registro
  Swal.fire({
              title: '¿Esta seguro?',
              text: 'Desea eliminar a ' + index.nombre,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, Eliminar',
              scrollbarPadding: false,
              allowOutsideClick: false
            }).then((result) => {
              if (result.value) {

                            this.asesorService.borrarAsesor(index._id)
                                                    .subscribe(resp => {
                                                      this.cargarArls();

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




 // =====================Metodos para cambiar la Pagina===========================================
// Metodo para cambiar la paginacion
cambiarPagina( valor: number) {

  // console.log(valor);


  const pagina = this.pagina + valor;

  if ( pagina >= this.totalRegistros ) {
    return;
  }

  if ( pagina < 0 ) {
    return;
  }

  // codigo si las validaciones estan correctas
  this.pagina += valor;
  this.cargarArls();

}


// =================================================================
//                 Codigo para el MODAL
// =================================================================
// metodo para cerrar el modal
cerraModal() {

  this.hide = 'hide';
  this.contratante = null;
  this.asesor = null;
  this.nombre = null;

 }

 // Metodo para Mostrar el modal
mostrarModal() {

  this.hide = '';


}


} // END class
