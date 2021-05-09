import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { ContratanteService } from 'src/app/services/dashboard/contratante.service';
import { EmpresaService } from 'src/app/services/dashboard/empresa.service';
import { SedeService } from 'src/app/services/dashboard/sede.service';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { RealmSedeService } from 'src/app/services/realm/realm-sede.service';

import { Empresa } from 'src/app/models/empresa.model';
import { Contratante } from 'src/app/models/contratante.model';
import { Sede } from 'src/app/models/sede.model';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styles: [
  ]
})
export class EmpresasComponent implements OnInit {

  // Elementos
  @ViewChild('input') inputTxt: ElementRef<any>;

  // variables
  forma: FormGroup;
  contratante: Contratante;
  empresas: Empresa[] = [];
  empresasTemp: Empresa[] = [];
  empresa: Empresa;
  sede: Sede;

  pagina: number = 0;
  totalRegistros: number = 0;
  totalRegistrosTemp: number = 0;
  flag: boolean = false;
  flagBuscador: boolean = false;
  hide: string = 'hide'; // variable para ocultar el modal
  form1Hide: boolean = false;
  form2Hide: boolean = false;
  nombre: string = '';
  cargando: boolean = true;
  message: string = '';


  constructor(public contratanteService: ContratanteService,
              public empresaService: EmpresaService,
              public sedeService: SedeService,
              public realmSedeService: RealmSedeService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit(): void {

    this.cargarEmpresas();
    // codigo para escuchar cambios en el modalUpload - CAMBIAR IMG
    this.modalUploadService.notificacion
                           .subscribe( (resp: any) => this.cargarEmpresas());


  }



  // Metodo para cargar las ARLs
  cargarEmpresas() {

    this.empresaService.obtenerEmpresas( this.pagina )
                      .subscribe((resp: any) => {

                        this.cargando = false;
                        this.totalRegistros = resp.total;
                        this.totalRegistrosTemp = resp.total;


                        if (this.totalRegistros === 0) {
                          this.message = resp.message;
                          this.flag = true;
                          return;

                        }

                        if (this.totalRegistros > 0){
                          // console.log(resp);
                          this.empresas = resp.empresa;
                          this.empresasTemp = resp.empresa;
                          this.flag = false;
                          this.flagBuscador = true;
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

          // console.log(event);

          if (event[0] === 'Edit') { // EDITAR Empresa

            this.empresa = event[1];
            this.nombre = 'Empresa';
            this.mostrarModal();

            return;

          }

          if (event[0] === 'Edit-Sede') { // EDITAR Sede

            // codigo para Obtener los datos completos de la SEDE
            this.sedeService.obtenerSedeByName(event[1].nombre.toString())
                            .subscribe((resp: any) => {
                             // console.log(resp);
                             if (resp.sede){
                              this.sede = resp.sede;
                              this.nombre = 'Sede';
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

          if (event[0] === 'Delete') { // ELIMINAR Empresa

            this.empresa = event[1];
            this.eliminarRegistroEmpresa(this.empresa);
            return;

          }
          if (event[0] === 'Delete-Sede') { // ELIMINAR Sede

            // codigo para Obtener los datos completos de la SEDE
            this.sedeService.obtenerSedeByName(event[1].nombre.toString())
             .subscribe((resp: any) => {
              // console.log(resp);
              if (resp) {
                this.sede = resp.sede;
                this.eliminarRegistroSede(this.sede);
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

          if (event[0] === 'Image') { // CAMBIAR IMAGEN

            const id = event[1].toString();

            this.modalUploadService.mostrarModal('empresas', id);

            return;

          }

}



// ==========================================================================
//             +++++++++++ GUARDAR REGISTRO EMPRESA: POST ++++++++++++++
// ==========================================================================
registrarEmpresa(event: FormGroup) {

  this.forma = event;

  if (this.forma.controls.selectArl.value._id !== 'Default') {
    this.contratante = this.forma.controls.selectArl.value;
  }

  if (this.forma.controls.selectArl.value._id === 'Default') {
    this.contratante = null;
  }

  if (!this.forma.controls.nit.value) {
    Swal.fire('', 'Ingresa el Número NIT', 'error');
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

  const razon = this.forma.controls.name.value; // mayuscula

  this.empresa = new Empresa(

    razon.toUpperCase(),
    this.forma.controls.email.value,
    this.forma.controls.cell.value,
    this.forma.controls.nit.value,
    this.forma.controls.city.value,
    this.forma.controls.contacto.value,
    null,
    null,
    null,
    null,
    this.contratante
);


  this.empresaService.guardandoEmpresa(this.empresa)
                     .subscribe( // usado para funcionar con API-PHP**
                         (resp: any) => {
                           // console.log('HTTP response', res);
                           Swal.fire({
                            title: 'Registro Aceptado',
                            icon: 'success',
                            confirmButtonText: 'Cerrar',
                            scrollbarPadding: false,
                            allowOutsideClick: false
                          });

                           if (this.contratante) { // codigo para crear la empresa en la ARL
                            this.contratante.empresas = resp.empresa;
                            this.contratante.asesores = null;
                            this.contratante.ordenes = null;
                            this.contratanteService.actualizarArl(this.contratante)
                                                  .subscribe();
                          }
                           this.form1Hide = false;
                           this.forma.reset();
                           this.empresa = null;
                           this.sede = null;
                           this.nombre = null;
                           this.cargarEmpresas();

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
//             +++++++++++ GUARDAR REGISTRO SEDE: POST ++++++++++++++
// ==========================================================================
registrarSede(event: FormGroup) {

  this.forma = event;

  if (this.forma.controls.selectEmpresa.value._id !== 'Default') {

    this.empresa = this.forma.controls.selectEmpresa.value;
  }

  if (this.forma.controls.selectEmpresa.value._id === 'Default') {
    // this.empresa = null;
    Swal.fire('', 'Falta Seleccionar la Empresa', 'error');
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

  this.sede = new Sede(

      this.forma.controls.name.value,
      this.forma.controls.email.value,
      this.forma.controls.cell.value,
      this.forma.controls.contacto.value,
      this.forma.controls.city.value,
      this.forma.controls.adress.value,
      null,
      null,
      null,
      null,
      this.empresa

);




  this.sedeService.guardandoSede(this.sede)
                  .subscribe( // usado para funcionar con API-PHP**
                        (resp: any) => {

                         console.log('HTTP response', resp);

                          Swal.fire({
                           title: 'Registro Aceptado',
                           icon: 'success',
                           confirmButtonText: 'Cerrar',
                           scrollbarPadding: false,
                           allowOutsideClick: false
                         });

                          if (resp.sede) {

                            if (this.empresa) { // codigo para crear la Sede en la Empresa
                              this.empresa.sedes = resp.sede;
                              this.empresa.ordenes = null;
                              this.empresaService.ingresarSedeOrdenIntoEmpresa(this.empresa)
                                                  .subscribe(resEmpresa =>  this.cargarEmpresas());
                             }

                         }



                          this.form2Hide = false;
                          this.forma.reset();
                          this.empresa = null;
                          this.sede = null;
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


/* TODO: Funcionando API Realm MongoDB
this.realmSedeService.guardandoSedeRealm(this.sede)
                                                .subscribe(resp => {

                                                  console.log('Aqui: ',resp);


                                                });

*/

}


// ==========================================================================
//             +++++++++++ ACTUALIZAR REGISTRO EMPRESA: PUT ++++++++++++++
// ==========================================================================
actualizarEmpresa(event: FormGroup) {

  this.forma = event;

  if (this.forma.controls.selectArl.value._id !== 'Default') {
    this.contratante = this.forma.controls.selectArl.value;
  }

  if (this.forma.controls.selectArl.value._id === 'Default') {
    this.contratante = null;
  }

  this.empresa.razon = this.forma.controls.name.value;
  this.empresa.telefono = this.forma.controls.cell.value;
  this.empresa.correo = this.forma.controls.email.value;
  this.empresa.ciudad = this.forma.controls.city.value;
  this.empresa.nit = this.forma.controls.nit.value;
  this.empresa.contacto = this.forma.controls.contacto.value;
  this.empresa.contratante = this.contratante;

  this.empresa.ordenes = null;
  this.empresa.especialistas = null;
  this.empresa.eventos = null;
  this.empresa.soportes = null;
  this.empresa.archivos = null;


  this.empresaService.obtenerEmpresaByName(this.empresa.razon.toString())
                      .subscribe((resp: any) => {
                          // console.log(resp.empresa.contratante);
                          if (resp.empresa.contratante){

                              if (this.contratante._id.toString() === resp.empresa.contratante.toString()) {

                                                  this.empresaService.actualizarEmpresa(this.empresa)
                                                                   .subscribe(res => {
                                                                    this.cargarEmpresas();
                                                                    this.cerraModal();
                                                                    Swal.fire({
                                                                      title: 'Datos Empresa Actualizados',
                                                                      text: res.nombre,
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
                              if (this.contratante._id.toString() !==   resp.empresa.contratante.toString()) {

                                                this.empresaService.actualizarEmpresa(this.empresa)
                                                                    .subscribe(res => {

                                                                     if (this.contratante) { // codigo para crear la Empresa en la ARL
                                                                      this.contratante.empresas = res;
                                                                      this.contratanteService.ingresarDatasIntoArl(this.contratante, 'Empresa')
                                                                                              .subscribe();

                                                                     }

                                                                     Swal.fire({
                                                                      title: 'Datos Empresa Actualizados',
                                                                      text: res.nombre,
                                                                      icon: 'success',
                                                                      confirmButtonText: 'Cerrar',
                                                                      scrollbarPadding: false,
                                                                      allowOutsideClick: false
                                                                    });

                                                                     this.cargarEmpresas();
                                                                     this.cerraModal();
                                                                     return;


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

                          if (!resp.empresa.contratante){
                            this.empresaService.actualizarEmpresa(this.empresa)
                                                .subscribe(res => {

                                                 if (this.contratante) { // codigo para crear la Empresa en la ARL
                                                   this.contratante.empresas = res;
                                                   this.contratante.asesores = null;
                                                   this.contratante.ordenes = null;
                                                   this.contratanteService.actualizarArl(this.contratante)
                                                                          .subscribe();

                                                 }

                                                 Swal.fire({
                                                  title: 'Datos Empresa Actualizados',
                                                  text: res.nombre,
                                                  icon: 'success',
                                                  confirmButtonText: 'Cerrar',
                                                  scrollbarPadding: false,
                                                  allowOutsideClick: false
                                                });

                                                 this.cargarEmpresas();
                                                 this.cerraModal();
                                                 return;

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
//             +++++++++++ ACTUALIZAR REGISTRO SEDE: PUT ++++++++++++++
// ==========================================================================
actualizarSede(event: FormGroup) {

  this.forma = event;

  if (this.forma.controls.selectEmpresa.value._id !== 'Default') {

    this.empresa = this.forma.controls.selectEmpresa.value;
  }

  if (this.forma.controls.selectEmpresa.value._id === 'Default') {
    this.empresa = null;
  }

  this.sede.nombre = this.forma.controls.name.value;
  this.sede.telefono = this.forma.controls.cell.value;
  this.sede.correo = this.forma.controls.email.value;
  this.sede.ciudad = this.forma.controls.city.value;
  this.sede.direccion = this.forma.controls.adress.value;
  this.sede.contacto = this.forma.controls.contacto.value;
  this.sede.empresa = this.empresa;

  this.hide = 'hide'; // cierra el modal



  this.sedeService.obtenerSedeByName(this.sede.nombre.toString())
                  .subscribe((resp: any) => {
                        // console.log(resp);
                        if (resp.sede.empresa) {

                             if (this.empresa._id.toString() === resp.sede.empresa._id.toString()) {

                              this.sedeService.actualizarSede(this.sede)
                                              .subscribe(res => {
                                                this.cargarEmpresas();
                                                this.cerraModal();

                                                Swal.fire({
                                                  title: 'Datos Sede Actualizados',
                                                  text: res.nombre,
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
                             if (this.empresa._id.toString() !==   resp.sede.empresa._id.toString()) {

                              this.sedeService.actualizarSede(this.sede)
                                              .subscribe(res => {
                                                if (this.empresa) { // codigo para crear la Sede en la Empresa
                                                  this.empresa.sedes = res;
                                                  this.empresa.ordenes = null;
                                                  this.empresaService.ingresarSedeOrdenIntoEmpresa(this.empresa)
                                                                     .subscribe(result => this.cargarEmpresas());

                                                }

                                                Swal.fire({
                                                  title: 'Datos Sede Actualizados',
                                                  text: res.nombre,
                                                  icon: 'success',
                                                  confirmButtonText: 'Cerrar',
                                                  scrollbarPadding: false,
                                                  allowOutsideClick: false
                                                });


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
                        if (!resp.sede.empresa) {

                          this.sedeService.actualizarSede(this.sede)
                                              .subscribe(res => {
                                                if (this.empresa) { // codigo para crear la Sede en la Empresa
                                                  this.empresa.sedes = res;
                                                  this.empresa.ordenes = null;
                                                  this.empresaService.ingresarSedeOrdenIntoEmpresa(this.empresa)
                                                                     .subscribe(result => this.cargarEmpresas());

                                                }

                                                Swal.fire({
                                                  title: 'Datos Sede Actualizados',
                                                  text: res.nombre,
                                                  icon: 'success',
                                                  confirmButtonText: 'Cerrar',
                                                  scrollbarPadding: false,
                                                  allowOutsideClick: false
                                                });


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
//             +++++++++++ ELIMINAR REGISTRO EMPRESA: DELETE ++++++++++++++
// ==========================================================================
eliminarRegistroEmpresa(index: Empresa) {

  // console.log(index);
  this.empresa = null;
  this.sede = null;
  this.nombre = null;

  // validacion correcta Eliminar Registro
  Swal.fire({
              title: '¿Esta seguro?',
              text: 'Desea eliminar a ' + index.razon,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, Eliminar',
              scrollbarPadding: false,
              allowOutsideClick: false
            }).then((result) => {
              if (result.value) {

                            this.empresaService.borrarEmpresa(index._id)
                                                    .subscribe(resp => {

                                                      this.cargarEmpresas();

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
//             +++++++++++ ELIMINAR REGISTRO SEDE: DELETE ++++++++++++++
// ==========================================================================
eliminarRegistroSede(index: Sede) {

  // console.log(index);
  this.empresa = null;
  this.sede = null;
  this.nombre = null;

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

                            this.sedeService.borrarSede(index._id)
                                                    .subscribe(resp => {
                                                      this.cargarEmpresas();

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
this.cargarEmpresas();

}


// =================================================================
//                 Codigo para el MODAL
// =================================================================
// metodo para cerrar el modal
cerraModal() {

this.hide = 'hide';
this.empresa = null;
this.sede = null;
this.nombre = null;

}

// Metodo para Mostrar el modal
mostrarModal() {

this.hide = '';


}








  // ====================================================================================

  // =======================================================
  //              BUSCADOR EMPRESA
  // =======================================================
  buscarEmpresa(termino: string) {


    if (termino.length === 1 && termino === ' ') {
      this.totalRegistros = this.totalRegistrosTemp;
      return this.empresas = this.empresasTemp;
    }

    if (termino.length <= 0) {
      this.totalRegistros = this.totalRegistrosTemp;
      return this.empresas = this.empresasTemp;
    }


    if (termino.length >= 1  && termino !== ' ') {


        this.empresaService.buscarEmpresa(termino)
                         .subscribe(resp => {
                           // console.log(resp);
                           this.cargando = false;
                           this.totalRegistros = resp.length;

                           if (resp.length === 0) {
                            this.message = 'No hay Registros';
                            this.flag = true;
                            return;
                          }

                           if (resp.length > 0){
                           this.empresas = resp;
                           this.flag = false;
                           // console.log(resp);
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


// Metodo usado para cambiar Focus
clearInput(){

      this.inputTxt.nativeElement.value = '';
 }






} // END class
