import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { OrdenService } from 'src/app/services/orden/orden.service';
import { SoportesService } from 'src/app/services/soportes/soportes.service';
import { UploadService } from 'src/app/services/upload/upload.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Soportes } from 'src/app/models/soportes.model';
import { Orden } from 'src/app/models/orden.model';
import { Evento } from 'src/app/models/evento.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styles: [
  ]
})
export class InformesComponent implements OnInit {

  // variable
  forma: FormGroup;
  usuario: Usuario;
  orden: Orden;
  soporte: Soportes;
  regresar: string = '';
  imgArray: any[] = [];
  docArray: any[] = [];
  input: string = '';
  tipo: string = '';
  ROLE: string = '';

  preIndex: number[] = [];

  flagEventos: boolean = false;
  flagSoportes: boolean = false; // cargando Soporte
  flagIndex: boolean = false;
  flagFallida: boolean = false; // Evento Soporte Visita Fallida
  flagArchivos: boolean = false;
  flagInforme: boolean = false;
  flagAlert: boolean = false;

  totalEject: number = 0; // Referencia Horas Totales Ejecutadas en la Orden
  totalActividad: number = 0; // Referencia Horas Totales Actividades realizadas Especialistas
  totalInforme: number = 0; // Referencia Horas Totales por Tiempo Informe

  archivoSubir: File;
  archivoName: string = '';
  archivoFecha: Date;

  estadoInforme: string = '';

  coutnCompletos: number = 0;

   // Select Element
   listaEstadoInforme: string[] = [
    'Completo',
    'Incompleto'
  ];


  // ---------------------- Constructor ------------------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private usuarioService: UsuarioService,
              private soportesService: SoportesService,
              private ordenesService: OrdenService,
              private uploadService: UploadService) { }

  ngOnInit(): void {


    this.usuario = this.usuarioService.usuario;
    this.ROLE = this.usuario.role;

    this.rutaParametros();
    this.crearFormulario();

  }

  // ------------------------------------------------
    // *******Metodo para transformar el Object en un Arreglo ***********
crearArray(anotacionesObj: object) {

  const anotaciones: any[] = [];

  if ( anotacionesObj === null ) { return []; } // condicion si el objeto recibido no tiene informacion

  Object.keys( anotacionesObj ).forEach( key => {

                  // en este punto solo se tienen los datos de cada objeto sin las claves
                  const anotacion = anotacionesObj[key];
                  anotaciones.push(anotacion);

  });

  return anotaciones;
}

   // --------------------------------------------------
// Metodo para Cargar la orden
rutaParametros() {

this.preIndex = [];

this.totalEject = 0;
this.totalActividad = 0;
this.totalInforme = 0;
this.flagAlert = false;


  this.route.params.subscribe(parametros => {
                          // console.log(parametros);

                          if (!parametros.page) {
                            return;
                          }

                          this.regresar = parametros.page;

                          this.ordenesService.obtenerOrdenByID(parametros.id.toString())
                                            .subscribe((resp: any) => {

                                              // console.log(resp);

                                              if (resp) {
                                                this.orden = resp;
                                              }

                                              if (resp.eventos.length > 0) {
                                                this.flagEventos = true; // ver los eventos
                                              }

                                              if (resp.soportes.length > 0) { // codigo para contar los soportes Completos

                                                this.coutnCompletos = 0;

                                                for (const item of resp.soportes) {

                                                  if (item.estado === 'Completo') {
                                                    this.coutnCompletos = this.coutnCompletos + 1;
                                                  }
                                                  if (item.fallida) {
                                                    this.coutnCompletos = this.coutnCompletos + 1;
                                                  }
                                                  if (!item.fallida && item.archivos.length === 0) {
                                                    this.coutnCompletos = this.coutnCompletos + 1;
                                                  }

                                                  // codigo para ajustar las Horas y tiempos de la Orden ** no guarda en la base de datos solo Justa tiempos en los soportes
                                                  this.totalEject = this.totalEject + (item.horas_usadas + item.tiempo_informe); // horas totales de la orden
                                                  this.totalActividad = this.totalActividad + item.horas_usadas; // horas de la Actividad
                                                  this.totalInforme = this.totalInforme + item.tiempo_informe;

                                                }

                                               // asigna los valores de Tiempos
                                                this.orden.horas_ejecutadas = this.totalEject;
                                                this.orden.horas_actividad = this.totalActividad;
                                                this.orden.tiempo_informe = this.totalInforme;

                                              }

                                                  // Validacion cuando las horas Ejecutadas > Act Programada
                                                  if (this.totalEject > parseInt(this.orden.act_programadas, 10)){
                                                    this.flagAlert = true; // Muestra una Alerta
                                                   }



                                              // validacion para cambiar estado Interno Tecnica de la Orden a - Pendiente Directora Tecnica
                                              if (this.coutnCompletos === resp.soportes.length && resp.activo === '2' && resp.estado === 'Pendiente Informe') {


                                                this.orden.obs_internas = null;
                                                this.orden.anotaciones = null;
                                                this.orden.horas_programadas = null;
                                                this.orden.sedes = null;
                                                this.orden.especialistas = null;
                                                this.orden.soportes = null;
                                                this.orden.eventos = null;
                                                this.orden.archivos = null;

                                                this.orden.activo = '3'; // Estado Interno Tecnica - Pendiente Dir. Técnica
                                                this.ordenesService.actualizarOrden(this.orden)
                                                                   .subscribe(respOrden => {},
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


             });



}



// -----------------------------------------------------------------------------------------------
// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    horas_usadas:     0,
    tiempo_informe:   0,
    // tiempo_administrativo:   0
    });

}
  // ------------------------------------------------------------------------
// Metodo para cargar los reportes
cargarSoporte(evento: Evento) {

  this.imgArray = [];
  this.docArray = [];
  this.soporte = null;
  this.flagInforme = false;

  this.soportesService.obtenerSoportesByName(evento._id.toString())
                        .subscribe((resp: any) => {

                          // console.log(resp);

                          if (resp.soportes) {
                            this.soporte = resp.soportes;


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

                                if (item.file_ext === 'jpg' || item.file_ext === 'png') {

                                  this.imgArray.push({ // filtra imagenes
                                    _id: item._id,
                                    file_name: item.file_name,
                                    path: item.path
                                  });
                                } else {

                                  this.docArray.push({ // filtra documentos
                                    _id: item._id,
                                    file_name: item.file_name,
                                    file_ext: item.file_ext,
                                    file_date: item.file_date,
                                    file_time: this.setTime(item.file_date),
                                    path: item.path
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



// cambia el formato de la hora
setTime(data: Date) {


  // console.log(data);
  let hora = new Date(data).getHours();
  const minutos = new Date(data).getMinutes();

    // AM
  if (hora < 10 && minutos < 10) {
    return `0${hora}:0${minutos} am`;
  }
  if (hora < 10 && minutos >= 10) {
    return `0${hora}:${minutos} am`;
  }
  if (hora === 10 && minutos < 10) {
    return `${hora}:0${minutos} am`;
  }
  if (hora === 10 && minutos >= 10) {
    return `${hora}:${minutos} am`;
   }
  if (hora === 11 && minutos < 10) {
    return `${hora}:0${minutos} am`;
   }
  if (hora === 11 && minutos >= 10) {
    return `${hora}:${minutos} am`;
   }
     // NOON
  if (hora === 12 && minutos < 10) {
    return `${hora}:0${minutos} pm`;
   }
  if (hora === 12 && minutos >= 10) {
    return `${hora}:${minutos} pm`;
   }

  if (hora > 12) { // PM
       hora = hora - 12;
       if (hora < 10 && minutos < 10) {
        return `0${hora}:0${minutos} pm`;
        }
       if (hora < 10 && minutos >= 10) {
        return `0${hora}:${minutos} pm`;
        }
       if (hora === 10 && minutos < 10) {
          return `${hora}:0${minutos} pm`;
        }
       if (hora === 10 && minutos >= 10) {
          return `${hora}:${minutos} pm`;
         }
       if (hora === 11 && minutos < 10) {
        return `${hora}:0${minutos} pm`;
        }
       if (hora === 11 && minutos >= 10) {
        return `${hora}:${minutos} pm`;
        }

  }
}




// -----------Metodo para ajustar los tiempos del Soporte--------------------------
ajustarTiempos() {


  // Operaciones
  this.soporte.horas_usadas = this.forma.controls.horas_usadas.value || this.soporte.horas_usadas; // Valor ajustado por la Dir Tecnica **/ Pendiente confirmar
  this.soporte.tiempo_informe = this.forma.controls.tiempo_informe.value || this.soporte.tiempo_informe;
  // this.soporte.tiempo_administrativo = this.forma.controls.tiempo_administrativo.value || this.soporte.tiempo_administrativo;
  this.soporte.anotaciones = null;


  this.soportesService.actualizarSoportes(this.soporte)
                      .subscribe((resp: Soportes) => {

                        // console.log(resp);

                          this.rutaParametros();
                          this.crearFormulario();
                        // this.getDatosSoporte(resp._id.toString());
                        // this.forma.reset();


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

 // -------------------------------------------------------
  // metodo para actualizar los datos del Soporte
  getDatosSoporte(id: string) {

    this.soportesService.obtenerSoportesByID(id)
                        .subscribe((resp: any) => {

                          // console.log(resp);

                          if (resp.soportes) {
                            this.soporte = resp;
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

 // --------------------------------------
  // Metodo  para cambiar el estado del Informe (Completo / Incompleto)
  setEstadoInforme() {

    this.soporte.estado = this.estadoInforme;
    this.soporte.anotaciones = null;

    this.soportesService.actualizarSoportes(this.soporte)
                      .subscribe(resp => {

                        this.flagInforme = false;
                        this.estadoInforme = '';

                        this.rutaParametros();

                        Swal.fire({
                          title: 'Informe Actualizado',
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


  // --------------------------------------
  // Metodo  para cambiar el estado de la Orden - Informe Revisado
  // HIJO: CARD-ORDEN
  cambiarEstado(event: string) {

    // console.log(event);

    this.orden.obs_internas = null;
    this.orden.anotaciones = null;
    this.orden.sedes = null;
    this.orden.especialistas = null;
    this.orden.soportes = null;
    this.orden.eventos = null;
    this.orden.archivos = null;
    this.orden.horas_programadas = null;

    this.orden.estado = event;
    this.orden.activo = '1'; // regresa al estado Original



    this.ordenesService.actualizarOrden(this.orden)
                     .subscribe((resp: any) => {

                      this.rutaParametros();

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
    title: 'Registrando Archivo',
    icon: 'info',
    scrollbarPadding: false,
    allowOutsideClick: false
  });
 Swal.showLoading();

 this.tipo = 'Especialista'; // Referencia del Archivo Upload


 // este servicio devuelve una promesa
 this.uploadService.subirArchivoSoportes(this.archivoSubir,
                                   this.tipo,
                                   this.soporte._id.toString(),
                                   this.soporte.especialista._id.toString())
                    .then((resp: any) => {

                          this.archivoSubir = null; // reset Archivo
                          this.preIndex = []; // reset Detalles del Soporte
                          this.soporte = resp.soportes;


                          Swal.fire({
                          title: 'Datos Soporte Actualizados',
                          icon: 'success',
                          confirmButtonText: 'Cerrar',
                          scrollbarPadding: false,
                          allowOutsideClick: false
                        });

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
// +++++++ METODO PARA ACTUALIZAR LAS -ANOTACIONES ubicacion del Informe en el SERVER ++++++++++++
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

// Metodo para actualizar Anotaciones de la ORDEN
guardarAnotObs(orden: Orden) {

  this.ordenesService.actualizarOrden(orden)
                    .subscribe((resp: any) => {

                     this.rutaParametros();

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
    activo: '1', // mensaje del Dir Tecnica
    usuario: 'Dirección Técnica'
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







// =============================================================================
//                 DETALLES DEL SOPORTE: USUARIOS ADMIN - USER
// =============================================================================
verDetallesSoportes(evento: Evento, i: number) { // el item es un evento

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


  // this.forma.controls.horas_usadas.setValue(0);
  this.forma.controls.tiempo_informe.setValue(0);
  // this.forma.controls.tiempo_administrativo.setValue(0);


  this.flagSoportes = false;
  this.cargarSoporte(evento);
  this.verDetalles(i);




}


// ======================Metodos para ver y ocultar los detalles=================================

// metodo para ver los detalles de la Orden
verDetalles(i: number) {

 // console.log('Abre - ', i);


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


}


// Metodo para ocultar los detalles
ocultarDetalles(i: number, flag?: boolean) {

  this.flagIndex = flag; // Flag si se cierra por el boton

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


}

} // END class
