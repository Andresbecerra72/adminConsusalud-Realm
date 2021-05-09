import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { DOCUMENT, CurrencyPipe } from '@angular/common';
import { FormGroup, FormBuilder  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { URL_SERVICIOS } from 'src/app/config/config';

import { OrdenService } from 'src/app/services/orden/orden.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { SoportesService } from 'src/app/services/soportes/soportes.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { EmpresaService } from 'src/app/services/dashboard/empresa.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Orden } from 'src/app/models/orden.model';
import { Evento } from 'src/app/models/evento.model';
import { Soportes } from 'src/app/models/soportes.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Especialista } from 'src/app/models/especialista.model';




@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styles: [
  ]
})
export class OrdenComponent implements OnInit {

  @Input() orden: Orden;
  @Input() nombre: string;
  @Input() flagFrom: boolean = false; // Manejo Soportes desde el PADRE: ESTADOS

  @Output() cambioEstado: EventEmitter<string> = new EventEmitter();

  // variables
  forma: FormGroup;
  usuario: Usuario;
  empresa: Empresa;
  soporte: Soportes;
  evento: Evento;
  especialistas: Especialista[] = [];
  eventosArray: any[] = [];
  imgArray: any[] = [];
  docArray: any[] = [];

  listaSelectEmpresa = [];
  listaSelectEmpresaArray = [];

  regresar: string = '';
  flagObs: boolean = false;
  flagEventos: boolean = false;
  flagSoportes: boolean = false; // cargando Soporte
  flagFallida: boolean = false; // Evento Soporte Visita Fallida
  flagIndex: boolean = false;
  flagObservacion: boolean = false; // visita fallida
  flagArchivos: boolean = false;
  flagEspec: boolean = false;
  flagAlert: boolean = false; // Alerta de Cat horas ejecutadas Mayor a las Horas de la Orden
  preIndex: number[] = [];


  tipo: string = '';
  ROLE: string = '';
  input: string = '';
  inputSelfie: string = '';
  count: number = 0; // Referencia Horas

  totalEject: number = 0; // Referencia Horas Totales Ejecutadas en la Orden
  totalActividad: number = 0; // Referencia Horas Totales Actividades realizadas Especialistas
  totalInforme: number = 0; // Referencia Horas Totales por Tiempo Informe

  archivoSubir: File;
  archivoName: string = '';
  archivoFecha: Date;

  soportesArray: Soportes[] = []; // almacena los soportes
  soportesFailArray: Soportes[] = []; // almacena los soportes Temporal

  fechaActual: string = '';


// -----------------------Constructor----------------------------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              private fb: FormBuilder,
              private router: Router,
              public route: ActivatedRoute,
              private usuarioService: UsuarioService,
              public ordenesService: OrdenService,
              public empresaService: EmpresaService,
              public eventoService: EventosService,
              public soportesService: SoportesService,
              private currencyPipe: CurrencyPipe,
              public uploadService: UploadService) { }

  ngOnInit(): void {

    this.fechaActual = new Date().toDateString();

    // console.log(this.fechaActual);


    this.usuario = this.usuarioService.usuario;

    if(this.usuario.flag && this.usuario.flag_ordenes) { // condicion para verificar permisos

      this.ROLE = 'USER_ROLE'

    }else {

      this.ROLE = this.usuario.role;
    }

    this.crearFormulario();

    this.cargarEmpresas(); // Opciones del Select - Tarifas

    this.rutaParametros(); // carga los parametros desde el URL

    this.cargarSoportesArray(); // carga el Arreglo con los Soportes

    // console.log(this.orden);



  }

// ---------------------------------------------------------------
//           ------Cuando Selfie FALLA-------------------
// ---------------------------------------------------------------
// metodo para cargar los soportes - solucionar falla por Conexion en la carga de la selfie y el soporte
cargarSoportesArray() {

  this.soportesArray = [];

  this.soportesService.obtenerSoportesTodas()
                      .subscribe((resp: any) =>{

                        if (resp.soportes) {

                          for (const item of resp.soportes) {
                            this.soportesArray.push(item);
                          }

                          // console.log(this.soportesArray);
                        }

                      });

}


// Metodo que recibe el evento desde el componenete HTML y filtra los soportes Fallidos (Selfie)
getSoporteFail(evento: Evento) {


     // Filtra el arreglo de soportes por el id del Evento
    if (evento.activo === "1") { // evento.activo = 1 no gestionado

      const foundSoporte = this.soportesArray.find(soporte => soporte.nombre === evento._id);

      if(foundSoporte.img_llegada) { // condicion del soporte con Selfie
        return true;
      }else {
        return false;
      }

    } else {

      return false;

    }

}

// metodo para solucionar Soporte FAllIDO
setSoporteFine(evento: Evento) {

   //  console.log(evento);
   const foundSoporte: Soportes = this.soportesArray.find(soporte => soporte.nombre === evento._id);

   // Orden
   this.orden.obs_internas = null;
   this.orden.anotaciones = null;
   this.orden.sedes = null;
   this.orden.especialistas = null;
   this.orden.eventos = null;
   this.orden.archivos = null;
   this.orden.horas_programadas = null;
   this.orden.soportes = foundSoporte;

   // Evento
   evento.soporte = foundSoporte;
   evento.activo = '0'; // Flag para el conteo de horas de cada Orden


   this.ordenesService.actualizarOrden(this.orden)
                        .subscribe(() => {
                          // this.orden = orden;
                          this.eventoService.actualizarEvento(evento)
                                            .subscribe(() => {
                                              this.rutaParametros();
                                            });
                        });



}


// --------------------------------------------------
// Metodo para Cargar los parametros del URL
rutaParametros() {

  if (this.nombre === 'En Ejecución') { // *** acceso al Orden Component desde la tabla estados ****

    this.flagObs = false;
    this.cargarOrden(this.orden._id.toString());



        }else { // *** acceso al Orden Component desde la URL ****


              this.route.params.subscribe(parametros => {
                // console.log(parametros);

                if (!parametros.page) {
                  return;
                }

                if (parametros.page === 'EspecialistaNew' || parametros.page === 'EspecialistaEnd') {

                  this.tipo = 'Especialista'; // Referencia del Archivo Upload

                  this.regresar = parametros.page === 'EspecialistaNew' ? 'newordenes' : 'endordenes';

                  this.evento = null;

                  this.ROLE = 'ESPEC_ROLE'; // cambia el role del profesional cuando ingresa por la tabla de gestion *** Pruebas

                  this.eventoService.obtenerEventoById(parametros.id.toString())
                                    .subscribe((resp: any) => {

                                      if (resp.evento) {
                                        this.evento = resp.evento;
                                        // console.log(resp.evento.orden);

                                        if (resp.evento.soporte) { // condicion para identificar soporte Visita Fallida
                                          if (resp.evento.soporte.fallida) {
                                            this.flagFallida = true;
                                          }
                                        }

                                        if (resp.evento.orden) { // condicion si el Evento no tiene Orden
                                          this.cargarOrden(resp.evento.orden._id.toString());
                                          this.cargarSoporte(this.evento);
                                        }else {
                                          this.evento = null; // si la orden fue Eliminada
                                          this.flagEspec = true;
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


                if (parametros.page !== 'EspecialistaNew' && parametros.page !== 'EspecialistaEnd') {
                  this.regresar = parametros.page;
                  this.cargarOrden(parametros.id.toString());

                }

             });


        }


}



// ----------------------------------------------------------
// Metodo para Obtener la Orden
cargarOrden(id: string) {

      this.count = 0;
      this.totalEject = 0;
      this.totalActividad = 0;
      this.totalInforme = 0;

      this.ordenesService.obtenerOrdenByID(id)
                          .subscribe((resp: any) => {
                             // console.log(resp);

                              if (resp) {

                                this.orden = resp; // Orden

                                this.eventosArray = resp.eventos; // referencia para mostrar/ocultar soportes

                                // console.log(this.eventosArray);


                                this.especialistas = resp.especialistas;

                                if (resp.obs_internas.length > 0 && this.nombre !== 'En Ejecución') {
                                  this.flagObs = true; // ver las observaciones de programacion
                                }

                                if (resp.eventos.length > 0) {
                                  this.flagEventos = true; // ver los eventos
                                  // this.getSoporteByEventos(); // metodo para Obtener los eventos desde los soportes
                                }


                                if (resp.soportes.length > 0) {
                                  for (const item of resp.soportes) {

                                    // console.log(item);

                                    this.totalEject = this.totalEject + (item.horas_usadas + item.tiempo_informe); // horas totales de la orden
                                    this.totalActividad = this.totalActividad + item.horas_usadas; // horas de la Actividad
                                    this.totalInforme = this.totalInforme + item.tiempo_informe;

                                    if (item.activo === '0') { // soporte reportado 0 / soporte activo 1
                                        this.count = this.count + (item.horas_usadas + item.tiempo_informe);
                                      }

                                  }

                                }

                                this.totalEject = this.totalEject + this.orden.tiempo_administrativo; // ajusta horas total Horas Ejecutadas de la Orden


                                if (this.orden.estado === 'Pre - Factura') { // condicion para actualizar las horas en Prefactura

                                       console.log('Pre - Factura', this.totalEject);

                                      this.orden.obs_internas = null;
                                      this.orden.anotaciones = null;
                                      this.orden.horas_programadas = null;
                                      this.orden.sedes = null;
                                      this.orden.especialistas = null;
                                      this.orden.soportes = null;
                                      this.orden.eventos = null;
                                      this.orden.archivos = null;

                                      this.orden.horas_ejecutadas = this.totalEject;

                                      this.ordenesService.actualizarOrden(this.orden)
                                                         .subscribe(orden => {

                                                          this.orden = orden;

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




                                // Actualiza el estado cuando se cumplen las Horas Orden Tipo C / A
                                // tslint:disable-next-line: max-line-length
                                if ((this.count >= parseInt(this.orden.act_programadas, 10)) && this.orden.estado === 'En Ejecución' && (this.orden.tipo_servicio === 'C' || this.orden.tipo_servicio === 'A') ) {


                                      // console.log('Aqui');

                                      this.orden.obs_internas = null;
                                      this.orden.anotaciones = null;
                                      this.orden.horas_programadas = null;
                                      this.orden.sedes = null;
                                      this.orden.especialistas = null;
                                      this.orden.soportes = null;
                                      this.orden.eventos = null;
                                      this.orden.archivos = null;

                                      this.orden.horas_ejecutadas = this.totalEject;

                                      this.orden.estado = 'Finalizada'; // Cambio Estado
                                      this.ordenesService.actualizarOrden(this.orden)
                                                         .subscribe(orden => {

                                                          this.orden = orden;

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

                                // Validacion cuando las horas Ejecutadas > Act Programada
                                if (this.totalEject > parseInt(this.orden.act_programadas, 10)){
                                  this.flagAlert = true; // Muestra una Alerta
                                 }


                              // Actualiza las Horas Totales Ejecutadas de la Orden Tipo T / E
                              // tslint:disable-next-line: max-line-length
                                if (this.totalEject <= parseInt(this.orden.act_programadas, 10) && (this.orden.tipo_servicio === 'CT' || this.orden.tipo_servicio === 'T' || this.orden.tipo_servicio === 'E' ) ) {

                                    this.orden.obs_internas = null;
                                    this.orden.anotaciones = null;
                                    this.orden.horas_programadas = null;
                                    this.orden.sedes = null;
                                    this.orden.especialistas = null;
                                    this.orden.soportes = null;
                                    this.orden.eventos = null;
                                    this.orden.archivos = null;

                                    this.orden.horas_ejecutadas = this.totalEject;
                                    this.orden.horas_actividad = this.totalActividad;
                                    this.orden.tiempo_informe = this.totalInforme;

                                    this.ordenesService.actualizarOrden(this.orden)
                                                       .subscribe(orden => {
                                                         this.ordenesService.obtenerOrdenByID(orden._id)
                                                                             .subscribe(resOrden => {

                                                                               this.orden = resOrden;

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

                                // codigo para Obtener la Empresa
                                this.empresaService.obtenerEmpresaByName(resp.razon.toString()) // Empresa
                                                    .subscribe((resEmpresa: any) => this.empresa = resEmpresa.empresa);


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

// ------------------------------------------------------------------------
// Metodo para cargar los reportes
cargarSoporte(evento: Evento) {

  // ********** Url para resolver la descarga de los Archivos *** SOLO DIRECTORIOS DEL SERVIDOR ***********
  // const url = URL_SERVICIOS + '/upload/getfile';

  this.imgArray = [];
  this.docArray = [];
  this.soporte = null;

  this.soportesService.obtenerSoportesByName(evento._id.toString())
                        .subscribe((resp: any) => {

                          // console.log(resp);

                          if (resp.soportes) {
                            this.soporte = resp.soportes;


                            if (resp.soportes.activo === '0') {
                              this.cargarFormulario(); // llena el formulario
                            }

                            if (resp.soportes.fallida) {
                              this.flagFallida = true;
                            }



                            if (resp.soportes.archivos.length === 0) { // Soporte sin archivos
                              this.flagSoportes = false;
                            }
                            if (resp.soportes.img_llegada) { // Soporte Selfie
                              this.flagArchivos = true;
                            }


                            if (resp.soportes.archivos.length > 0) { // Soporte con Archivos

                              this.flagSoportes = true;

                              for (const item of resp.soportes.archivos) {

                             if (item.file_ext === 'jpg' || item.file_ext === 'png' || item.file_ext === 'JPG' || item.file_ext === 'PNG') {

                                  this.imgArray.push({ // filtra imagenes
                                    _id: item._id,
                                    file_name: item.file_name,
                                    // path: `${item._id}` // ***** Descarga de Archivos PARA ARCHIVOS EN DIRECTORIOS DEL SERVIDOR
                                    path: item.path // *************** Descarga de Archivos PARA GOOGEL CLOUDS
                                  });
                                } else {

                                  this.docArray.push({ // filtra documentos
                                    _id: item._id,
                                    file_name: item.file_name,
                                    file_ext: item.file_ext,
                                    file_date: item.file_date,
                                    // path: `${url}/${item._id}` // ***** Descarga de Archivos PARA ARCHIVOS EN DIRECTORIOS DEL SERVIDOR
                                    path: item.path // *************** Descarga de Archivos PARA GOOGEL CLOUDS
                                  });
                                }
                              }




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

// ------------------------

cargarFormulario() {

  this.forma.controls.horas_usadas.setValue(this.soporte.horas_usadas);
  this.forma.controls.asistentes.setValue(this.soporte.asistentes);
  this.forma.controls.tiempo_informe.setValue(this.soporte.tiempo_informe);
  this.forma.controls.valor_transporte.setValue(this.soporte.valor_transporte);
  this.forma.controls.valor_insumos.setValue(this.soporte.valor_insumos);
  this.forma.controls.observacion.setValue(this.soporte.observacion);


}

// ===========================================================================
//                   Metodo para leer el ARCHIVO
// ===========================================================================

 // metodo para cambiar IMAGEN
 seleccionArchivo(ev) {

  this.archivoSubir = null;

  const archivo = ev.target.files[0];

  if (!archivo) {
    Swal.fire({
      title: '¡Error!',
      text: 'Falta seleccionar el Archivo',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      scrollbarPadding: false,
      allowOutsideClick: false
    });
    this.archivoSubir = null;
    return;
   }


    // codigo si todo OK
  this.archivoSubir = archivo;
  this.archivoName = archivo.name; // Asigna el nombre del Archivo
  if (archivo.lastModified) {
     this.archivoFecha = new Date(archivo.lastModified);
   } else if (archivo.lastModifiedDate) {
   this.archivoFecha = new Date(archivo.lastModifiedDate.toString()); // Asigna la fecha del Archivo
   } else {
     this.archivoFecha = new Date(); // Asigna la fecha del Archivo
   }

}


// -------------------------------------------------------------------------
// Metodo para subir la Archivo a BD
subirArchivo() {

 if (!this.archivoSubir) {
    return;
   }

 this.input = '';

 Swal.fire({
    title: 'Enviando Archivo',
    icon: 'info',
    scrollbarPadding: false,
    allowOutsideClick: false
  });
 Swal.showLoading();

 // Orden
 this.orden.obs_internas = null;
 this.orden.anotaciones = null;
 this.orden.horas_programadas = null;
 this.orden.sedes = null;
 this.orden.especialistas = null;
 this.orden.eventos = null;
 this.orden.soportes = null;
 this.orden.archivos = null;



 // Empresa
 this.empresa.ordenes = null;
 this.empresa.especialistas = null;
 this.empresa.eventos = null;
 this.empresa.soportes = null;


 // este servicio devuelve una promesa
 this.uploadService.subirArchivoSoportes(this.archivoSubir,
                                   this.tipo,
                                   this.soporte._id.toString(),
                                   this.soporte.especialista._id.toString())
                    .then((resp: any) => {

                      this.soporte = resp.soporte;
                      this.soporte.anotaciones = null;
                      this.soporte.fecha = new Date();

                      this.soportesService.actualizarSoportes(this.soporte)
                                          .subscribe(resSoportes => {

                                            // console.log(resSoportes);

                                            if (resSoportes) {

                                              this.archivoSubir = null; // reset Archivo

                                              this.orden.archivos = resSoportes.archivos; // ****
                                              this.ordenesService.actualizarOrden(this.orden)
                                                                  .subscribe(orden => this.orden = orden);

                                              this.empresa.archivos = resSoportes.archivos; // ***
                                              this.empresaService.actualizarEmpresa(this.empresa)
                                                                  .subscribe(empresa => this.empresa = empresa);


                                              this.rutaParametros();

                                            }


                                            Swal.fire({
                                              title: 'Datos Soporte Actualizados',
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
                                            }
                                          );


                    })
                    .catch( err => {
                      console.log('Error en la carga del Archivo');

                      Swal.fire({
                        title: 'Error',
                        text: 'Intentelo más Tarde',
                        icon: 'error',
                        scrollbarPadding: false,
                        allowOutsideClick: false
                      });


                    });


 }

// ---------------------------------------------------------------------------------
// Metodo para Subir Imagen de LLegada - SELFIE
// ---------------------------------------------------------------------------------
subirSelfie() {

  // console.log(this.archivoSubir);

  if (!this.archivoSubir) {
    return;
   }


  if (this.archivoSubir.type.indexOf('image') < 0) { // valida el tipo de archivo

    Swal.fire({
      title: '¡Error!',
      text: 'El Archivo seleccionado no es una Imagen',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      scrollbarPadding: false,
      allowOutsideClick: false
    });

    this.archivoSubir = null;
    this.inputSelfie = '';
    return;

   }

  this.inputSelfie = '';

  Swal.fire({
    title: 'Enviando Imagen',
    icon: 'info',
    scrollbarPadding: false,
    allowOutsideClick: false
  });
  Swal.showLoading();


    // Orden
  this.orden.obs_internas = null;
  this.orden.anotaciones = null;
  this.orden.horas_programadas = null;
  this.orden.sedes = null;
  this.orden.especialistas = null;
  this.orden.eventos = null;
  this.orden.archivos = null;


  // Empresa
  this.empresa.ordenes = null;
  this.empresa.especialistas = null;
  this.empresa.eventos = null;
  this.empresa.archivos = null;


  // Evento
  this.evento.activo = '0'; // Flag para el conteo de horas de cada Orden * evento gestionado
  this.evento.estado = 'NA'; // gestionado sin problema
  this.evento.cronograma = this.orden.cronograma;
  this.evento.secuencia = this.orden.secuencia;


   // este servicio devuelve una promesa
  this.uploadService.subirSelfie(this.archivoSubir,
                                            'soporte',
                                            this.soporte._id.toString())
                                          .then((resp: any) => {

                                            // console.log(resp);

                                            if (resp.soporte) {

                                              this.flagArchivos = true;
                                              this.archivoSubir = null; // reset Archivo

                                              this.evento.soporte = resp.soporte;
                                              this.orden.soportes = resp.soporte;
                                              this.empresa.soportes = resp.soporte;

                                              setTimeout(() => { // **** Time Delay ********
                                              this.ordenesService.actualizarOrden(this.orden)
                                                                  .subscribe(orden => this.orden = orden);
                                                        }, 60);

                                              setTimeout(() => { // **** Time Delay ********
                                              this.empresaService.actualizarEmpresa(this.empresa)
                                                                  .subscribe(empresa => this.empresa = empresa);
                                                        }, 120);

                                              setTimeout(() => { // **** Time Delay ********
                                              this.eventoService.actualizarEvento(this.evento)
                                                                .subscribe(evento => {

                                                                  if (evento) {
                                                                    this.evento = evento;

                                                                    Swal.fire({
                                                                            title: 'Selfie Enviada',
                                                                            icon: 'success',
                                                                            confirmButtonText: 'Cerrar',
                                                                            scrollbarPadding: false,
                                                                            allowOutsideClick: false
                                                                          });
                                                                    this.rutaParametros();

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
                                                      }, 180);

                                            }



                                          })
                                          .catch( err => {
                                          console.log('Error en la carga del Archivo');

                                          Swal.fire({
                                          title: 'Error',
                                          text: 'Intentelo más Tarde',
                                          icon: 'error',
                                          scrollbarPadding: false,
                                          allowOutsideClick: false
                                          });


                                          });




}




// ====================================================================================================
// +++++++ METODO PARA ACTUALIZAR LAS OBSERVACIONES INTERNAS (Programacion) -ANOTACIONES ++++++++++++
// ====================================================================================================
actualizarOrdenAnots(event: string) { // recibe informacion desde el hijo CARD-ORDEN

  this.orden.anotaciones = null;

  const fechaActual = new Date();

  this.orden.anotaciones = {fecha: fechaActual, reporte: event, usuario: this.usuario.nombre.toString() } ;

  this.orden.obs_internas = null;
  this.orden.sedes = null;
  this.orden.especialistas = null;
  this.orden.soportes = null;
  this.orden.eventos = null;
  this.orden.archivos = null;
  this.orden.horas_programadas = null;


  this.guardarAnotObs(this.orden); // llama el metodo


}



actualizarOrdenObsProgramacion(event: string) { // recibe informacion desde el hijo CARD-ORDEN


  if (this.regresar !== '' && this.ROLE === 'USER_ROLE') {

        this.orden.obs_internas = null;

        const fechaActual = new Date();

        this.orden.obs_internas = {fecha: fechaActual, reporte: event, usuario: this.usuario.nombre.toString() } ;

        this.orden.anotaciones = null;
        this.orden.sedes = null;
        this.orden.especialistas = null;
        this.orden.soportes = null;
        this.orden.eventos = null;
        this.orden.archivos = null;
        this.orden.horas_programadas = null;

        this.guardarAnotObs(this.orden); // llama el metodo

  }else {

    return;

  }



}


// Metodo para actualizar Anotaciones Y Observaciones de la ORDEN
guardarAnotObs(orden: Orden) {

  this.ordenesService.actualizarOrden(orden)
                    .subscribe((resp: any) => {

                     this.orden = resp;
                     this.cargarOrden(this.orden._id.toString());

                     Swal.fire({
                       title: 'Orden Actualizada',
                       text: resp.cronograma,
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
//             +++++++++++ METODO PARA CAMBIAR ESTADO ++++++++++++++
// ==========================================================================
// Metodo usado para cambiar el estado de la Orden
// HIJO : CARD-ORDEN
// PADRES : Estados - En Ejecucion
 cambiarEstado(estado: string) {
  // console.log(estado);

   if (this.regresar !== '' && this.ROLE === 'USER_ROLE') {
     this.cambiarEstadoGeneral(estado);
   }


   this.cambioEstado.emit(estado);


 }


 // --- Metodo para cambiar el estado de la Orden cuando ya esta Facturada: ADMIN_ROLE
 cambiarEstadoGeneral(estado: string) {
   // console.log(estado);

   this.orden.horas_programadas = null;
   this.orden.obs_internas = null;
   this.orden.anotaciones = null;
   this.orden.sedes = null;
   this.orden.especialistas = null;
   this.orden.soportes = null;
   this.orden.eventos = null;
   this.orden.archivos = null;

   this.orden.estado = estado;

   this.actualizarOrden(this.orden);



 }



// ------------------------------------------------------------------
// Metodo para Actualizar la Orden y carga la ruta parametros
// ------------------------------------------------------------------
 actualizarOrden( orden: Orden) {

  return this.ordenesService.actualizarOrden(orden)
                            .subscribe(resp => {

                              this.rutaParametros();

                              const titulo = resp.activo === 'x' ? 'Orden Eliminada' : 'Orden Actualizada';

                              Swal.fire({
                                title: titulo,
                                text: resp.cronograma,
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


 // ================================================================================
//     Metodo para ajustar el  tiempo Horas Ejecutadas de la Orden Tipo T / E
// ================================================================================
ajustarTiempos(tiempo: number ) {

  // console.log(tiempo);

  if (this.totalEject < parseInt(this.orden.act_programadas, 10)) {

    this.orden.horas_programadas = null;
    this.orden.obs_internas = null;
    this.orden.anotaciones = null;
    this.orden.sedes = null;
    this.orden.especialistas = null;
    this.orden.soportes = null;
    this.orden.eventos = null;
    this.orden.archivos = null;

    this.orden.horas_ejecutadas = this.orden.horas_ejecutadas + tiempo;

    this.orden.tiempo_administrativo = tiempo;

    this.ordenesService.actualizarOrden(this.orden)
                        .subscribe(resp => {

                          this.rutaParametros();

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


 // -----------------------------------------------------------------
 // metodo para deshabilitar Inpust cuando Visita Fallida es seleccionado
 disableInput() {

  if (this.forma.controls.fallida.value) {
    this.forma.controls.horas_usadas.disable();
    this.forma.controls.horas_usadas.setValue(0);
    this.forma.controls.asistentes.disable();
    this.forma.controls.asistentes.setValue(0);
    this.forma.controls.tiempo_informe.disable();
    this.forma.controls.tiempo_informe.setValue(0);

    return;
  }

  if (!this.forma.controls.fallida.value) {
    this.forma.controls.horas_usadas.enable();
    this.forma.controls.horas_usadas.setValue(0);
    this.forma.controls.asistentes.enable();
    this.forma.controls.asistentes.setValue(0);
    this.forma.controls.tiempo_informe.enable();
    this.forma.controls.tiempo_informe.setValue(0);

    return;
  }



 }

 // -----------------------------------------------------------------
 // metodo para el formulario del Especialista ** SOPORTE
 enviarDatosActividad() {

  // condicion cuando no se ingresa valor de Horas Ejecutadas
  if (!this.forma.controls.horas_usadas.value || this.forma.controls.horas_usadas.value === 0) {

    Swal.fire({
      html: '<div class="alert alert-warning" role="alert">Falta ingresar Horas Ejecutadas</div>',
      icon: 'info',
      scrollbarPadding: false,
      allowOutsideClick: false
    });

    return;

  }



  this.soporte.horas_usadas = this.forma.controls.horas_usadas.value;
  this.soporte.asistentes = this.forma.controls.asistentes.value;
  this.soporte.tiempo_informe = this.forma.controls.tiempo_informe.value;
  this.soporte.valor_transporte = this.forma.controls.valor_transporte.value;
  this.soporte.valor_insumos = this.forma.controls.valor_insumos.value;
  this.soporte.observacion = this.forma.controls.observacion.value;
  this.soporte.fecha = new Date();
  this.soporte.anotaciones = null;

  this.soporte.activo = '0'; // Flag para el conteo de horas de cada Orden


// OPCION: cuando la visita es fallida
  if (this.forma.controls.fallida.value) {

    if (!this.forma.controls.observacion.value) { // Ingrese Observacion
      this.flagObservacion = true;
      return;
    }

    this.soporte.fallida = this.forma.controls.fallida.value;


    this.orden.horas_programadas = this.evento.horas_programadas * -1; // envia un numero negativo
    this.orden.obs_internas = null;
    this.orden.anotaciones = null;
    this.orden.sedes = null;
    this.orden.especialistas = null;
    this.orden.soportes = this.soporte; // ** verificar
    this.orden.eventos = null;
    this.orden.archivos = null;

    this.ordenesService.actualizarOrden(this.orden)
                        .subscribe();



    this.soportesService.actualizarSoportes(this.soporte)
                        .subscribe((resp: any) => {

                          this.forma.reset();
                          this.forma.controls.horas_usadas.setValue(resp.horas_usadas);
                          this.forma.controls.asistentes.setValue(resp.asistentes);
                          this.forma.controls.tiempo_informe.setValue(resp.tiempo_informe);
                          this.forma.controls.valor_transporte.setValue(resp.valor_transporte);
                          this.forma.controls.valor_insumos.setValue(resp.valor_insumos);
                          this.forma.controls.observacion.setValue(resp.observacion);

                          // this.rutaParametros();

                          Swal.fire({
                            title: 'Reporte Enviado',
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




// OPCION: cuando se ejecutan menos Horas en la Actividad
  if (this.evento.horas_asignadas > (this.forma.controls.horas_usadas.value + this.forma.controls.tiempo_informe.value) ) {

    Swal.fire({
      text:  '¿Ejecutó menos horas?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Continuar!',
      scrollbarPadding: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {

        let cantidadHoras = 0; // variable para cambiar el dato de horas programadas

        cantidadHoras = (this.forma.controls.horas_usadas.value + this.forma.controls.tiempo_informe.value) - this.evento.horas_programadas;
        this.orden.horas_programadas = cantidadHoras; // envia un numero negativo
        this.orden.obs_internas = null;
        this.orden.anotaciones = null;
        this.orden.sedes = null;
        this.orden.especialistas = null;
        this.orden.soportes = null;
        this.orden.eventos = null;
        this.orden.archivos = null;

        this.ordenesService.actualizarOrden(this.orden)
                            .subscribe();

        this.soportesService.actualizarSoportes(this.soporte)
                            .subscribe((resp: any) => {

                              this.forma.reset();
                              this.forma.controls.horas_usadas.setValue(resp.horas_usadas);
                              this.forma.controls.asistentes.setValue(resp.asistentes);
                              this.forma.controls.tiempo_informe.setValue(resp.tiempo_informe);
                              this.forma.controls.valor_transporte.setValue(resp.valor_transporte);
                              this.forma.controls.valor_insumos.setValue(resp.valor_insumos);
                              this.forma.controls.observacion.setValue(resp.observacion);

                              // this.rutaParametros();

                              Swal.fire({
                                title: 'Reporte Enviado',
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
    });


    return;

  }

  // OPCION:
  // reporte cuando todo es OK
  this.soportesService.actualizarSoportes(this.soporte)
                      .subscribe((resp: any) => {

                        // console.log(resp);

                        this.forma.reset();
                        this.forma.controls.horas_usadas.setValue(resp.horas_usadas);
                        this.forma.controls.asistentes.setValue(resp.asistentes);
                        this.forma.controls.tiempo_informe.setValue(resp.tiempo_informe);
                        this.forma.controls.valor_transporte.setValue(resp.valor_transporte);
                        this.forma.controls.valor_insumos.setValue(resp.valor_insumos);
                        this.forma.controls.observacion.setValue(resp.observacion);

                        // this.rutaParametros();

                        Swal.fire({
                          title: 'Reporte Enviado',
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






// -----------------------------------------------------------------------------------------------
// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    horas_usadas:     0,
    asistentes:      '0',
    tiempo_informe:   0,
    valor_transporte: '',
    valor_insumos:    '',
    observacion:      '',
    fallida:          false

    });

}

// ------- Metodo para cambiar el valor del Input Tafica a Currency -----------------
// Currency Transforme
transformTransporte() {

  const tranporte = this.currencyPipe.transform(this.forma.controls.valor_transporte.value, '$');
  this.forma.controls.valor_transporte.setValue(tranporte);

}

transformInsumos() {

  const insumos = this.currencyPipe.transform(this.forma.controls.valor_insumos.value, '$');
  this.forma.controls.valor_insumos.setValue(insumos);

}

  // ==========================================================================
//             +++++++++++ METODO PARA CAMBIAR FLAGS ++++++++++++++
// ==========================================================================
   // Metodo usado para cambiar banderolas
   cambiarFlags(tag: string){


    if (tag === 'Transporte') {
      this.forma.controls.valor_transporte.setValue('$00.00');
    }

    if (tag === 'Insumos') {
      this.forma.controls.valor_insumos.setValue('$00.00');
    }

  }


// =============================================================================
//                 DETALLES DEL SOPORTE: USUARIOS ADMIN - USER
// =============================================================================
verDetallesSoportes(evento: Evento, i: number) { // el item es un evento

  if (this.flagFrom) {
  this.preIndex = []; // Manejo detalles Soportes desde la Tabla como PADRE: ESTADOS
  }

  this.preIndex.push(i);

// condicion cuando seleccionan el mismo Item(Soportes) y fue cerrado por el boton X
  if (this.preIndex.length > 1 && this.flagIndex) {
    if (this.preIndex[0] === this.preIndex[1] ) {
      this.preIndex = [];
      this.flagIndex = false;
    }
  }
// condicion cuando seleccionan el mismo Item(Soportes) y fue cerrado por el boton Soportes
  if (this.preIndex.length > 1 && !this.flagIndex) {
    if (this.preIndex[0] === this.preIndex[1]) {
      this.preIndex.shift();
      return;
    }

  }

  if (this.preIndex.length > 1) { // Abre un detalle y cierra el anterior
    this.ocultarDetalles(this.preIndex.shift());
  }


  this.flagSoportes = false;
  this.cargarSoporte(evento);
  this.verDetalles(i);




}



// =================================================================================
//     Metodo para activar nuevamente la gestion del profesional
// =================================================================================
// permite que el profesional vuelva a ver el Boton de Getinar Orden en las ordenes NUevas

activarGestion(evento: Evento) {

  // console.log(evento);

  evento.estado = "Re-Gestion"; // estado para activar nuevamente la gestion de la Orden

  this.eventoService.actualizarEvento(evento)
                    .subscribe();
                    // .subscribe(() => {
                    //   this.rutaParametros();
                    // });

}




// =======================================================================================================
//                        EDITAR ORDEN POR MEDIO DE SWEETALERT 2
// =======================================================================================================
async editarOrden() {


  // Codigo Usado para identificar el Index con el nombre de la empresa
  const isIndexNumber = (element: string) => element === this.orden.razon;


  const { value: formValues = [] } = await Swal.fire<string[]>({
    input: 'select', // usado para mostrar el Select para seleccionar una empresa
    inputOptions: this.listaSelectEmpresa,
    inputPlaceholder: 'Seleccionar Empresa',
    inputValue: `${this.listaSelectEmpresa.findIndex(isIndexNumber)}`, // findIndex: retorna un numero, para ubicar el Select
    html: `
    <h3>Editar Orden</h3>
    <hr class="mb-2">

    <div class="form-row">

    <div class="col-md-4 mb-3">
        <label>Nombre Empresa</label>
        <input type="text" class="form-control" id="empresa" value="${this.orden.razon}" tabindex="-1" disabled>
    </div>

    <div class="col-md-4 mb-3">
        <label>Cronograma</label>
        <input type="text" class="form-control" id="cronograma" value="${this.orden.cronograma}" tabindex="-1" required>
    </div>
    <div class="col-md-4 mb-3">
        <label>Secuencia</label>
        <input type="text" class="form-control" id="secuencia" value="${this.orden.secuencia}" tabindex="-1" required>
    </div>

    </div>

    <div class="form-row">
    <div class="col-md-3 mb-3">
        <label>Act Programadas</label>
        <input type="number" class="form-control" id="act_programadas" value="${this.orden.act_programadas}" tabindex="-1" required>
    </div>

    <div class="col-md-3 mb-3">
        <label>Act Ejecutadas</label>
        <input type="number" class="form-control" id="act_ejecutadas" value="${this.orden.act_ejecutadas}" tabindex="-1" required>
    </div>
    <div class="col-md-3 mb-3">
        <label>Act Canceladas</label>
        <input type="number" class="form-control" id="act_canceladas" value="${this.orden.act_canceladas}" tabindex="-1" required>
    </div>
    <div class="col-md-3 mb-3">
        <label>Act Reprogramadas</label>
        <input type="number" class="form-control" id="act_reprogramadas" value="${this.orden.act_reprogramadas}" tabindex="-1" required>
    </div>


    </div>



    `,
    width: 1000,
    showCancelButton: true,
    confirmButtonText:
    '<i class="fa fa-save"></i> Actualizar',
    cancelButtonText:
    'Cancelar',
    scrollbarPadding: false,
    allowOutsideClick: false,


    preConfirm: () => {

     return [ // retorna los valores de cada Input

        Swal.getInput().value, // valor del Select (seleccionar empresa)
       (document.getElementById('cronograma') as HTMLInputElement).value,
       (document.getElementById('secuencia') as HTMLInputElement).value,
       (document.getElementById('act_programadas') as HTMLInputElement).value,
       (document.getElementById('act_ejecutadas') as HTMLInputElement).value,
       (document.getElementById('act_canceladas') as HTMLInputElement).value,
       (document.getElementById('act_reprogramadas') as HTMLInputElement).value,

      ];

  }
});




  if (formValues.length > 0) {


     const inputVacio = formValues.find(item => item === '') === '' ? true : false;

     if (inputVacio) {
      Swal.fire({
        html: `
        <div class="alert alert-warning" role="alert">
        <strong>¡Error! </strong>Falta Ingresar Datos
        </div>
        `,
        icon: 'error',
        scrollbarPadding: false,
        allowOutsideClick: false
      });
      return;
     }


     const orden = {
      ...this.orden,
      nit: this.listaSelectEmpresaArray[formValues[0]].nit,
      razon: this.listaSelectEmpresa[formValues[0]], // nombre de la Empresa
      cronograma: formValues[1],
      secuencia: formValues[2],
      act_programadas: formValues[3],
      act_ejecutadas: formValues[4],
      act_canceladas: formValues[5],
      act_reprogramadas: formValues[6],
      empresa: this.listaSelectEmpresaArray[formValues[0]]._id,
      horas_programadas: null,
      obs_internas: null,
      anotaciones: null,
      sedes: null,
      especialistas: null,
      soportes: null,
      eventos: null,
      archivos: null,

    };



     this.actualizarOrden(orden); // llama el metodo


     // actualiza la empresa solo si cambian la seleccion en el select
     if (this.orden.razon !== orden.razon) {

      this.empresaService.obtenerEmpresaByID(this.listaSelectEmpresaArray[formValues[0]]._id)
      .subscribe((resp: any) => {
       // console.log(resp);

       if (resp.empresa) {
         this.empresa = resp.empresa;
         this.empresa.ordenes = orden;
         this.empresa.sedes = null;
         this.empresaService.ingresarSedeOrdenIntoEmpresa(this.empresa)
                               .subscribe();
       }

      });

     }


}


}



// -------------- Metodo para Cargar Las Empresas en el Select SWEETALERT--------------------
cargarEmpresas() {

  if (this.tipo === 'Particulares') {
    return;
  }

  this.empresaService.obtenerEmpresasTodas()
                      .subscribe(
                        (resp: any) => {

                          // console.log(resp);

                          if (resp.total > 0) {

                            for (const item of resp.empresa) {
                              this.listaSelectEmpresaArray.push({
                                                      razon: item.razon,
                                                      nit: item.nit,
                                                      _id: item._id
                                                     });
                           }

                            if (resp.total === 0) {
                            this.listaSelectEmpresaArray.push({
                              razon: resp.message,
                              nit: 'NA',
                               _id: 'Default'});
                          }
                         }
                          // tranformado el Objeto en una lista de nombres de empresa
                          this.listaSelectEmpresa = this.crearArray(this.listaSelectEmpresaArray);

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



 // *******Metodo para transformar el Object en un Arreglo ***********
crearArray( ObjArray: object) {

  const arreglo: any[] = [];

  if ( ObjArray === null ) { return []; } // condicion si el objeto recibido no tiene informacion

  Object.keys( ObjArray ).forEach( key => {

                  // en este punto solo se tienen los datos de cada objeto sin las claves
                  const item = ObjArray[key];
                  arreglo.push(item.razon);

  });

  return arreglo;
}

   // ------------------------------------------------
    // *******Metodo para transformar el Object en un Arreglo ***********
    crearArrayAnotacion(anotacionesObj: object) {

      const anotaciones: any[] = [];

      if ( anotacionesObj === null ) { return []; } // condicion si el objeto recibido no tiene informacion

      Object.keys( anotacionesObj ).forEach( key => {

                      // en este punto solo se tienen los datos de cada objeto sin las claves
                      const anotacion = anotacionesObj[key];
                      // console.log(anotacion);
                      anotaciones.push(anotacion);

      });

      return anotaciones;
    }

// -----------------------------------------------------------------------
// Elimina la Orden: Modifica el campo ACTIVO = x

ArchivarOrden() {


  const orden = {
    ...this.orden,
    estado: 'Archivo', // Orden en estado Archivo
    horas_programadas: null,
    obs_internas: null,
    anotaciones: null,
    sedes: null,
    especialistas: null,
    soportes: null,
    eventos: null,
    archivos: null,

  };


  // validacion correcta Eliminar Registro
  Swal.fire({
    title: '¿Esta seguro?',
    text: 'Desea Archivar a ' + orden.cronograma,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Archivar',
    scrollbarPadding: false,
    allowOutsideClick: false
  }).then((result) => {
        if (result.value) {

          this.actualizarOrden(orden);

                        }
});

}
// -----------------------------------------------------------------------
// Elimina la Orden: Modifica el campo ACTIVO = x

eliminarOrden() {


  const orden = {
    ...this.orden,
    activo: 'x', // Orden eliminada
    horas_programadas: null,
    obs_internas: null,
    anotaciones: null,
    sedes: null,
    especialistas: null,
    soportes: null,
    eventos: null,
    archivos: null,

  };


  // validacion correcta Eliminar Registro
  Swal.fire({
    title: '¿Esta seguro?',
    text: 'Desea eliminar a ' + orden.cronograma,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar',
    scrollbarPadding: false,
    allowOutsideClick: false
  }).then((result) => {
        if (result.value) {

          this.actualizarOrden(orden);
          this.router.navigateByUrl(`/${this.regresar}`);

                        }
});

}



// ======================Metodos para ver y ocultar los detalles=================================

// metodo para ver los detalles de la Orden
verDetalles(i: number) {

  // console.log('Abre - ', i);


  for (let n = 0; n < this.eventosArray.length; n++) {

   if (i === n) {

     const selectores: any = this.document.getElementById(`soporte-${n}`);
     selectores.classList.remove('hide');
     break;

   }

 }


 }


 // Metodo para ocultar los detalles
 ocultarDetalles(i: number, flag?: boolean) {

   this.flagIndex = flag; // Flag si se cierra por el boton


   for (let n = 0; n < this.eventosArray.length; n++) {

     if (i === n) {

       const selectores: any = this.document.getElementById(`soporte-${n}`);
       selectores.classList.add('hide');
       break;

     }

   }



 }


// ==========================================================================================
//             +++++++++++ METODO PARA ENVIAR LAS OBSERVACIONES/ANOTACIONES DEL SOPORTE ++++++++++++++
// ==========================================================================================
// Metodo usado para enviar las anotaciones
enviarText(text: string) {

  if (!text) {
    Swal.fire('', '<div class="alert alert-warning" role="alert">Ingrese la Novedad del Soporte</div>', 'error');
    return;
  }

  this.soporte.anotaciones = {
    fecha: new Date(),
    reporte: text,
    flag: true,
    activo: '2', // mensaje del Especialista
    usuario: this.usuario.nombre + '' + this.usuario.apellido
  }

// console.log(this.soporte);

 this.soportesService.actualizarSoportes(this.soporte)
                       .subscribe((resp: any) => {

                        this.rutaParametros();

                        Swal.fire({
                          title: 'Soporte Actualizado',
                          text: resp.cronograma,
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




} // END class






// *********************CODIGO NO USADO*****************************************

// codigo para Mostrar hasta 10 detalles de Soportes

/*

  if (i === 0) {

    const selectores: any = this.document.getElementById('soporte-0');
    selectores.classList.remove('hide');
    // selectores.classList.add('show');
    // console.log('Abre - ', selectores);
  }
  if (i === 1) {

    const selectores: any = this.document.getElementById('soporte-1');
    selectores.classList.remove('hide');

  }
  if (i === 2) {
    const selectores: any = this.document.getElementById('soporte-2');
    selectores.classList.remove('hide');

  }
  if (i === 3) {
    const selectores: any = this.document.getElementById('soporte-3');
    selectores.classList.remove('hide');

  }
  if (i === 4) {
    const selectores: any = this.document.getElementById('soporte-4');
    selectores.classList.remove('hide');

  }
  if (i === 5) {
    const selectores: any = this.document.getElementById('soporte-5');
    selectores.classList.remove('hide');

  }
  if (i === 6) {
    const selectores: any = this.document.getElementById('soporte-6');
    selectores.classList.remove('hide');

  }
  if (i === 7) {
    const selectores: any = this.document.getElementById('soporte-7');
    selectores.classList.remove('hide');

  }
  if (i === 8) {
    const selectores: any = this.document.getElementById('soporte-8');
    selectores.classList.remove('hide');

  }
  if (i === 9) {
    const selectores: any = this.document.getElementById('soporte-9');
    selectores.classList.remove('hide');

  }
*/

// *********************CODIGO NO USADO*****************************************

// codigo para Ocultar hasta 10 detalles de Soportes

 /*

  if (i === 0) {
    const selectores: any = this.document.getElementById('soporte-0');
    selectores.classList.add('hide');
    // console.log('Cierra -', selectores);
  }
  if (i === 1) {
    const selectores: any = this.document.getElementById('soporte-1');
    selectores.classList.add('hide');

  }
  if (i === 2) {
    const selectores: any = this.document.getElementById('soporte-2');
    selectores.classList.add('hide');

  }
  if (i === 3) {
    const selectores: any = this.document.getElementById('soporte-3');
    selectores.classList.add('hide');

  }
  if (i === 4) {
    const selectores: any = this.document.getElementById('soporte-4');
    selectores.classList.add('hide');

  }
  if (i === 5) {
    const selectores: any = this.document.getElementById('soporte-5');
    selectores.classList.add('hide');

  }
  if (i === 6) {
    const selectores: any = this.document.getElementById('soporte-6');
    selectores.classList.add('hide');

  }
  if (i === 7) {
    const selectores: any = this.document.getElementById('soporte-7');
    selectores.classList.add('hide');

  }
  if (i === 8) {
    const selectores: any = this.document.getElementById('soporte-8');
    selectores.classList.add('hide');

  }
  if (i === 9) {
    const selectores: any = this.document.getElementById('soporte-9');
    selectores.classList.add('hide');

  }
*/
