import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { OrdenService } from 'src/app/services/orden/orden.service';
import { EmpresaService } from 'src/app/services/dashboard/empresa.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { ConfiguresService } from 'src/app/services/dashboard/configures.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { SoportesService } from 'src/app/services/soportes/soportes.service';

import { Orden } from 'src/app/models/orden.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Sede } from 'src/app/models/sede.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Evento } from 'src/app/models/evento.model';
import { Soportes } from 'src/app/models/soportes.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesionales',
  templateUrl: './profesionales.component.html',
  styles: [
  ]
})
export class ProfesionalesComponent implements OnInit {

  @ViewChild('input') inputTxt: ElementRef<any>;
  @ViewChild('fecha') fechaPicker: ElementRef<any>;

  // Select Element - Ciudad
   listaCiudad: string[] = [
      'Ciudad'
    ];

   // Select Element - Especialidad - Buscador
  listaSelectProfesion = [
    'Seleccionar Especialidad'
  ];
   // Select Element - Sedes - Formulario
  listaselectSede = [
    {nombre: 'Seleccionar Sede', _id: 'Default'}
  ];

// variables
forma: FormGroup;
hide: string = 'hide'; // variable para ocultar el modal
flag: boolean = false;
flagBtn: boolean = false;

evento: Evento;
orden: Orden;
empresa: Empresa;
sede: Sede;
especialista: Especialista;
soportes: Soportes;

especialistas: Especialista[] = [];
sedes: Sede[] = [];
arrayUno: any[] = []; // array con especialistas
arrayDos: any[] = []; // array con eventos

profesion: string = this.listaSelectProfesion[0].toString();
ciudad: string = 'Ciudad';
regresar: string;
horasDisponibles: number = 0;

message: string = 'Cargando Base de Datos';


// ---------------------- Constructor -----------------------------------

  constructor( @Inject(DOCUMENT) private document: Document,
               private fb: FormBuilder,
               public route: ActivatedRoute,
               public ordenesService: OrdenService,
               public empresasService: EmpresaService,
               public eventosService: EventosService,
               public especialistaService: EspecialistaService,
               public configuresService: ConfiguresService,
               public soportesService: SoportesService) { }



  ngOnInit(): void {

    this.rutaParametros(); // carga los parametros desde el URL


    this.cargarProfesion(); // Opciones del Select - Profesion

    this.cargarCiudades(); // Opciones del Select - Ciudades

    // this.cargarEspecialistas(); // cargar todos los especialistas

    this.crearFormulario();

  }


// --------------------------------------------------
// Promesa para obtener especialistas
// --------------------------------------------------
getPromesa() {

   // promesa usada para cargar todos los especialistas
   return new Promise( (resolve, reject) => {

    this.especialistaService.obtenerEspecialistaTodas() // Llena el Array Uno
                            .subscribe((resp: any) => {
                              // console.log(resp);

                              if (resp.especialista.length > 0) {
                                this.arrayUno = resp.especialista;
                                resolve(this.arrayUno) // si promesa OK
                              }else {
                                reject(resp.message)
                              }

                            });

  });


}



// Metodo para Cargar Las Ciudades
rutaParametros() {

  this.route.params.subscribe(parametros => {
    // console.log(parametros);

    if (!parametros.page) {
      this.flagBtn = false;
      return;
    }

    if (parametros.page) {
      this.regresar = parametros.page;
      this.flagBtn = true;
    }

    if (parametros.id) {
      this.ordenesService.obtenerOrdenByID(parametros.id.toString())
                              .subscribe((resp: any) => {
                                 // console.log(resp);
                                 if (resp) {

                                    this.orden = resp; // Orden

                                    this.horasDisponibles =  parseInt(this.orden.act_programadas, 10);

                                    if (this.orden.horas_programadas) {
                                      this.horasDisponibles = this.horasDisponibles - this.orden.horas_programadas;
                                    }

                                    this.empresasService.obtenerEmpresaByName(resp.razon.toString())
                                                        .subscribe((resEmpresa: any) => {
                                                          // console.log(resEmpresa.empresa);

                                                          this.empresa = resEmpresa.empresa; // Empresa

                                                          if (resEmpresa.empresa.sedes.length > 0) {

                                                            this.sedes = resEmpresa.empresa.sedes;

                                                            for (const item of resEmpresa.empresa.sedes) {
                                                              this.listaselectSede.push({nombre: item.nombre, _id: item._id});
                                                               }

                                                           }

                                                          if (resEmpresa.empresa.sedes.length === 0) {
                                                            this.listaselectSede.push({nombre: 'No Hay Registros', _id: 'Default'});
                                                          }




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

  });




}


// --------------------------------------------------
// Metodo para Cargar Las Ciudades
cargarCiudades() {

  this.configuresService.obtenerCiudadTodas()
                        .subscribe((resp: any) => {

                          // console.log(resp);

                          if (resp.total > 0) {

                            for (const item of resp.ciudad) {
                              this.listaCiudad.push(item.nombre);
                               }

                           }

                          if (resp.total === 0) {
                            this.listaCiudad.push(resp.message);
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
// Metodo para Cargar Las Profesiones

cargarProfesion() {

  this.configuresService.obtenerProfesionTodas()
                        .subscribe((resp: any) => {

                          // console.log(resp);

                          if (resp.total > 0) {

                            for (const item of resp.profesion) {
                              this.listaSelectProfesion.push(item.nombre);
                               }

                           }

                          if (resp.total === 0) {
                            this.listaSelectProfesion.push(resp.message);
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
// Metodo para Cargar Los Especialistas
cargarEspecialistas() {

  this.especialistaService.obtenerEspecialistaTodas()
                          .subscribe((resp: any) => {

                              // console.log(resp);

                              if (!resp.especialista) {
                                this.message = resp.message;
                              }
                              if (resp.especialista) {
                                this.especialistas = resp.especialista;
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
//       +++++++++++ BUSCAR ESPECIALISTAS: GET ++++++++++++++
// ==========================================================================
  buscarEspecialista(termino?: string, ciudad?: string, profesion?: string, fecha?: string) {

    let buscador: string = null;
    this.flag = true;
    this.message = 'Cargando Base de Datos';

   // console.log(termino, ciudad, profesion, fecha);


    if (termino.length <= 0) {
      buscador = null;
    }

    if (termino.length === 1 && termino === ' ') {
      buscador = null;
    }

    if (ciudad && ciudad !== 'Ciudad') {
      buscador = 'Ciudad';

    }

    if (profesion && profesion !== 'Seleccionar Especialidad') {
       buscador = 'Profesion';

    }

    if (ciudad && ciudad !== 'Ciudad'){
        if (profesion && profesion !== 'Seleccionar Especialidad') {
        buscador = 'GetEspecialista';

       }
    }

    if (fecha) {
      buscador = 'Fecha';

    }

    if (termino.length > 0 && termino !== ' ') {
      buscador = 'Termino';

    }




    // Switch para buscar por entradas
    switch (buscador) {



            case 'Termino':

              // console.log('Aqui 1');

              // codigo para buscar rapidamente por Termino
              this.especialistaService.buscarEspecialista(termino)
                                .subscribe((resp: any) => {
                                  // console.log(resp);

                                  if (resp.length >= 1) {
                                  this.especialistas = resp;
                                  this.ciudad = 'Ciudad';
                                  this.profesion = this.listaSelectProfesion[0].toString();
                                  this.flag = false;
                                  }
                                  if (resp.length === 0) {
                                    this.flag = true;
                                    this.message = 'No hay Registros';
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

              break;
            case 'Ciudad':

              // console.log('Aqui 2');

              this.especialistaService.buscarEspecialista(ciudad)
                                      .subscribe((resp: any) => {
                                        // console.log(resp);
                                        if (resp.length === 0) {
                                          this.flag = true;
                                          this.message = 'No hay Registros';
                                        }
                                        if (resp.length >= 1) {
                                          this.especialistas = resp;
                                          this.variablesReset();
                                        }


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

              break;

            case 'Profesion':

              // console.log('Aqui 3');

              this.especialistaService.buscarEspecialista(profesion)
                                      .subscribe((resp: any) => {
                                        // console.log(resp);
                                        if (resp.length === 0) {
                                          this.flag = true;
                                          this.message = 'No hay Registros';
                                        }
                                        if (resp.length >= 1) {
                                          this.especialistas = resp;
                                          this.variablesReset();
                                        }
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

              break;

            case 'GetEspecialista':

              // console.log('Aqui 4');

              this.especialistaService.getEspecialista(ciudad, profesion)
                                      .subscribe((resp: any) => {
                                        // console.log(resp);

                                        if (resp.especialista.length === 0) {
                                          this.flag = true;
                                          this.message = 'No hay Registros';
                                          return;
                                        }

                                        if (resp.especialista.length >= 1) {
                                          this.especialistas = resp.especialista;
                                          this.variablesReset();
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

              break;

              case 'Fecha':

                // console.log('Aqui 5');

                this.especialistas = [];
                // this.arrayUno = []; // array de especialistas
                this.arrayDos = []; // array de eventos

                // Ajustando la fecha con hora Local
                const fechaString = new Date(`${fecha}T05:00:00Z`).toDateString();

                // obtiene una promesa para buscar los especilistas por fecha
                this.getPromesa().then( (resp: any) => {
                              // console.log('Aqui');
                              this.eventosService.buscarEventosByDate(fechaString) // Llena el Array Dos
                                                  .subscribe((resp: any) => {
                                                    // console.log(resp);

                                                    if (resp.eventos.length > 0) {

                                                      for (const item of resp.eventos) {
                                                          this.arrayDos.push(item.especialista);
                                                      }

                                                      this.getEspecialistasByDates(); // llama el metodo que compara los arrays


                                                    }

                                                  });

                          }).catch(err => { // si falla guardando el archivo
                            // console.log(err);
                            this.flag = true;
                            this.message = err;
                          });




                break;

            default:
                this.message = 'No hay Registros';
                break;



    }


  }

// --------------------------------------------------------------------
// metodo para llenar el array especilistas con la busqueda por fechas
// --------------------------------------------------------------------
getEspecialistasByDates() {


    // console.log(this.arrayUno);
    // console.log(this.arrayDos);

   if (this.arrayDos.length === 0) { // condicion si Array Dos vacio
     this.especialistas = this.arrayUno;
     return;
   }

   this.arrayUno.forEach((e1) => this.arrayDos.forEach((e2) => { // Compara los Arreglos
     if (e1._id !== e2._id) {

             if (this.especialistas.length === 0) {
               this.especialistas.push(e1);
             }

             if (this.especialistas.length >= 1) {

                 for (var i = 0; i < this.especialistas.length; i++) {
                     if (this.especialistas[i]._id.toString() === e1._id.toString()) {
                         this.especialistas.splice(i, 1); // remueve el registro
                     }
                 }
                 this.especialistas.push(e1);
             }

     }

   }));



  // console.log('Final - ', this.especialistas);
   this.variablesReset();

}



  // Reset Variables
variablesReset() {

  this.ciudad = 'Ciudad';
  this.profesion = this.listaSelectProfesion[0].toString();
  this.inputTxt.nativeElement.value = ''; // reset Input
  this.flag = false;

}

// ==========================================================================
//      ++++++++ Metodo recibe Especialista desde el CARD GROUP +++++++
// ==========================================================================
dataFromCard(event: Especialista) {

  // console.log(event);
  this.especialista = event;
  this.mostrarModal();

}




// ------------------------------- FORMULARIO ---------------------------------------------------------

    // ----------------------
 // metodos para hacer las validaciones del Input Sincronas

 get hoursNoValido() {
  return this.forma.get('hours').invalid && this.forma.get('hours').touched;
}

get sedeNoValido() {
  return this.forma.get('sede').invalid && this.forma.get('sede').touched;
}
get adressNoValido() {
  return this.forma.get('adress').invalid && this.forma.get('adress').touched;
}

get startDateNoValido() {
  return this.forma.get('start').invalid && this.forma.get('start').touched;
}




// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    hours:    [0, [Validators.required, Validators.minLength(1)]],
    start:  ['', Validators.required],
    end: '',
    sede:  ['', Validators.required],
    adress:  ['', Validators.required],
    contacto: '',
    email:   ['', [Validators.pattern('[A-Za-z0-9._%+-]{2,}@[a-zA-Z0-9]{3,}([.]{1}[a-zA-Z0-9]{2,}|[.]{1}[a-zA-Z0-9]{2,}[.]{1}[a-zA-Z0-9]{2,})')]],
    actividad:    '',
    informe: '',
    obsInternas: '',
    selectSede: this.listaselectSede[0]
    });

}

// ===========================================================
//     +++++ DATA DEL FORMULARIO Y PROGRAMAR EVENTO +++++
// ===========================================================
programar() {


  if (this.forma.invalid) { // condicion para saber si el formulario es valido

    // console.log('No Valido', this.forma);

    if (this.forma.controls.email.invalid) { // valida el correo ingresado
      Swal.fire({
        html: `<div class="alert alert-warning" role="alert">Error Ingresando el Correo</div>`,
        icon: 'error',
        scrollbarPadding: false,
        allowOutsideClick: false
      });

    }



    // codigo para obtener los controles Input del formulario
    return  Object.values( this.forma.controls ).forEach( control => {
      control.markAsTouched(); // marca el input como tocado por el usuario
    });
  }


  // Actualizar Orden
  // this.orden.estado = 'En Ejecución'; // *************NO CAMBIA ESTADO****************
  this.orden.horas_programadas =  this.forma.controls.hours.value || 1;
  this.orden.empresa =  this.empresa;
  if (this.forma.controls.selectSede.value._id !== 'Default') {
    this.orden.sedes =   this.forma.controls.selectSede.value;
  }
  if (this.forma.controls.selectSede.value._id === 'Default') {
    this.orden.sedes =  null;
  }

  // actualizar Especialista
  this.especialista.horas_asignadas = this.forma.controls.hours.value || 1;

  // Estableciendo el titulo del Evento
  const tituloEvento = `${ this.especialista.nombre } - ${new Date().getMilliseconds()}`;
  const inicio = new Date(this.forma.controls.start.value);
  const termino = new Date(this.forma.controls.end.value);
  const color = this.especialista.profesiones[0].color.primary;
  const fecha = new Date(this.forma.controls.start.value);
  const year = fecha.getFullYear();
  const month = fecha.getMonth() + 1;

  this.evento = new Evento(
          tituloEvento,
          color,
          inicio,
          termino,
          {beforeStart: true, afterEnd: true},
          true,
          null, // acciones del evento
          this.especialista.nombre,
          this.especialista.correo,
          this.especialista.especialidad,
          this.especialista.telefono,
          this.especialista.ciudad,
          this.forma.controls.hours.value || 1,
          this.especialista.img,
          fecha.toDateString(), // Fecha del Evento
          this.setTime(this.forma.controls.start.value), // hora inicio
          this.setTime(this.forma.controls.end.value), // hora termino
          this.orden.cronograma,
          this.orden.secuencia,
          this.forma.controls.hours.value || 1,
          this.forma.controls.adress.value,
          this.forma.controls.sede.value,
          this.forma.controls.contacto.value,
          this.forma.controls.email.value,
          this.forma.controls.actividad.value,
          this.forma.controls.informe.value,
          this.forma.controls.obsInternas.value,
          this.empresa.razon,
          null, // id
          null, // Usuario
          this.orden,
          this.empresa,
          this.forma.controls.selectSede.value,
          this.especialista,
          null, // soporte
          'NA', // estado
          null,
          year.toString(),
          month.toString()

    );

  // Crea el Soporte
  this.soportes = new Soportes(
      null,
      this.especialista.nombre,
      this.empresa.razon,
      this.forma.controls.sede.value,
      this.orden.cronograma,
      this.orden.secuencia,
      this.orden.tipo_servicio,
      this.forma.controls.actividad.value,
      this.forma.controls.informe.value,
      this.forma.controls.hours.value || 1,
      0, // horas Usadas
      null, // Cantidad Asistentes
      0, // tiempo Informe
      0, // tiempo Administrativo
      0, // tiempo Validado por Dir Técnica
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      this.especialista.ciudad,
      null,
      null,
      null,
      null, // anotaciones
      null,
      this.especialista,
      this.orden,
      this.empresa

  );


// guardar en Base de datos
  this.eventosService.guardandoEvento(this.evento)
                        .subscribe((resp: any) => {

                          // console.log('Evento - ', resp);

                          this.cerraModal();
                          this.forma.controls.start.reset();
                          this.forma.controls.end.reset();
                          this.forma.controls.hours.setValue(0);

                          if (resp.evento) {

                              this.orden.eventos = resp.evento;
                              this.orden.especialistas =  this.especialista;
                              this.orden.soportes = null;
                              this.orden.obs_internas =  null;
                              this.orden.anotaciones =  null;
                              this.orden.archivos = null;


                              this.ordenesService.actualizarOrden(this.orden)
                                                 .subscribe(resOrden => {

                                                   // console.log('Orden - ', resOrden);

                                                   if (resOrden) {

                                                        this.orden = resOrden; // Orden
                                                        this.horasDisponibles =  parseInt(this.orden.act_programadas, 10);

                                                        if (this.orden.horas_programadas) {
                                                          this.horasDisponibles = this.horasDisponibles - this.orden.horas_programadas;
                                                        }

                                                        this.especialista.eventos = resp.evento;
                                                        this.especialista.ordenes = resOrden;
                                                        this.especialista.soportes = null;
                                                        this.especialista.anotaciones = null;
                                                        this.especialista.profesiones = null;

                                                        this.especialistaService.actualizarEspecialista(this.especialista)
                                                                           .subscribe(resEspecilista => {

                                                                            console.log(resEspecilista);


                                                                            if (resEspecilista) {


                                                                              Swal.fire({
                                                                                title: 'Especialista Programado',
                                                                                text: 'Por favor Verificar Agenda',
                                                                                icon: 'success',
                                                                                confirmButtonText: 'Cerrar',
                                                                                scrollbarPadding: false,
                                                                                allowOutsideClick: false
                                                                              });

                                                                            // this.empresa.especialistas = resEspecilista;
                                                                            // this.empresa.eventos = resp.evento;
                                                                            // this.empresa.ordenes = null;
                                                                            // this.empresa.soportes = null;
                                                                            // this.empresa.archivos = null;
                                                                            // this.empresasService.actualizarEmpresa(this.empresa)
                                                                            //                     .subscribe();

                                                                            }



                                                                            // console.log('Especialista - ', resEspecilista);
                                                                            this.cargarEspecialistas(); // flag para cargar especialistas
                                                                            this.variablesReset();
                                                                            this.buscarEspecialista('');
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

                                                                          });

                                                   }


                                                 });

                              this.soportes.nombre = resp.evento._id.toString(); // Se asigna el ID del evento como NOMBRE
                              this.soportes.evento =  resp.evento;
                              this.soportesService.guardandoSoportes(this.soportes) // codigo para crear el Soporte ** No lo relaciona
                                                  .subscribe();


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

// ----------------Metodo para cambiar la Hora --------------------

setTime(data: Date){ // retorna el formato de la hora

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




// ===========================================================
//                    SELECT DE SEDES
// ===========================================================
seleccionSede() {

 // console.log(this.forma.controls.selectSede.value);

 if (this.forma.controls.selectSede.value._id === 'Default') {
   this.forma.controls.sede.reset();
   this.forma.controls.adress.reset();
   this.forma.controls.contacto.reset();
   this.forma.controls.email.reset();
   return;
 }

 // console.log(this.sedes);
 const resultado = this.sedes.find( resp => resp._id === this.forma.controls.selectSede.value._id );
 // console.log('Seleccion -', resultado);

 this.forma.controls.sede.setValue(resultado.nombre);
 this.forma.controls.adress.setValue(resultado.direccion);
 this.forma.controls.contacto.setValue(resultado.contacto);
 this.forma.controls.email.setValue(resultado.correo);

}




    // ==========================================================================
//             +++++++++++ METODO PARA CAMBIAR FLAGS ++++++++++++++
// ==========================================================================
   // Metodo usado para cambiar banderolas
   cambiarFlags(){

    this.inputTxt.nativeElement.value = '';
    this.fechaPicker.nativeElement.value = '';


  }
   // Metodo usado para cambiar banderolas
   cambiarFlagsOnDates(){

    this.ciudad = 'Ciudad';
    this.profesion = this.listaSelectProfesion[0].toString();
    this.inputTxt.nativeElement.value = '';
    // this.fechaPicker.nativeElement.value = '';



  }





// =================================================================
//                 Codigo para el MODAL
// =================================================================
// metodo para cerrar el modal
cerraModal() {

  this.hide = 'hide';
  this.crearFormulario();

 }

 // Metodo para Mostrar el modal
mostrarModal() {

  this.hide = '';


}




} // END class
