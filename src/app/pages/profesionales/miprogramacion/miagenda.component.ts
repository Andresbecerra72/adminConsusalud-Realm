import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DOCUMENT } from '@angular/common';
import { URL_SERVICIOS } from 'src/app/config/config';

import { EventosService } from 'src/app/services/eventos/eventos.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';

import { Evento } from 'src/app/models/evento.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';

import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarEventAction
   } from 'angular-calendar';

import { addDays,
   startOfDay,
   endOfDay,
   subDays,
   endOfMonth,
   isSameDay,
   isSameMonth,
   addHours,
   parse
    } from 'date-fns';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-miagenda',
  templateUrl: './miagenda.component.html',
  styles: [
  ]
})
export class MiagendaComponent implements OnInit {

  // variables
  forma: FormGroup;
  flag: boolean = false;
  hide: string = 'hide'; // variable para ocultar el modal
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  usuario: Usuario;
  especialista: Especialista;

  eventoArray: any[] = [];
  eventosByMonth: any[] = [];
  evento: Evento;

  events: CalendarEvent[] = [];

  activeDayIsOpen = false;

  refresh = new Subject<void>();

  // --------------------- Constructor ------------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              private fb: FormBuilder,
              public especialistaService: EspecialistaService,
              public eventoService: EventosService,
              public usuarioService: UsuarioService) {

      this.crearFormulario(); // llama el metodo para crear el formulario

     }

     ngOnInit(): void {

      this.usuario = this.usuarioService.usuario;

      this.getEspecialista(this.usuario);

      this.cargarEventos();


                }

// ---------------------------------------------------------------------------
// metodo para cargar el Especialista
getEspecialista(usuario: Usuario) {

  this.especialistaService.obtenerEspecialistaByID(usuario.especialista.toString())
                          .subscribe((resp: any) => {

                            this.especialista = resp.especialista;

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


// ----------------------------------------------
//                  FORMULARIO
// ----------------------------------------------
// metodos para hacer las validaciones del Input Sincronas
get fechaNoValido() {
  return this.forma.get('fecha').invalid && this.forma.get('fecha').touched;
}
get inicioNoValido() {
  return this.forma.get('inicio').invalid && this.forma.get('inicio').touched;
}
get terminoNoValido() {
  return this.forma.get('termino').invalid && this.forma.get('termino').touched;
}
get motivoNoValido() {
  return this.forma.get('motivo').invalid && this.forma.get('motivo').touched;
}
// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    fecha:      ['', Validators.required],
    inicio:     ['', Validators.required],
    termino:    ['', Validators.required],
    motivo:     ['', Validators.required]

    });

}

// cambia el formato de la hora
setTime(time: any) {

  // console.log(time);
  if (time.value !== '') {
    let hours = time.split(':')[0];
    const minutes = time.split(':')[1];
    const suffix = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    hours = hours < 10 ? '0' + hours : hours;

    const displayTime = hours + ':' + minutes + ' ' + suffix;

    return displayTime;

  }
}


// -----------Metodo para seleccionar la misma Hora en el Input Time-----------------------
setSameValue() { // Para formulario Bloqueo

  if (!this.forma.controls.inicio.value) {
    return;
  }

  const time = this.forma.controls.inicio.value;

  let hours = time.split(':')[0];
  let hoursInt = parseInt(hours, 10);
  const minutes = time.split(':')[1];

  hoursInt = hoursInt + 1; // Le suma UNA hora

  if (hoursInt === 24) {
    hours = '00';
   }

  if (hoursInt < 24) {
    hours = hoursInt < 10 ? '0' + hoursInt : hoursInt;
   }

  const displayTime = hours + ':' + minutes;

  this.forma.controls.termino.setValue(displayTime);

}



// cierra el formulario de nueva Programacion
cerraProgramacion() {
  this.flag = false;
  this.forma.reset();

}
// -------------Metodo para capturar cambios de mes en el calendario------------------------
viewDataHeader(e: Date) {

  const year = e.getFullYear();
  const month = e.getMonth() + 1;

  this.eventosByMonth = [];

  this.eventoService.buscarEventos(year.toString(), month.toString())
                      .subscribe((resp: any) => {
                        // console.log(resp);

                        if (resp.evento) {

                          for (const item of resp.evento) {

                            // console.log(item);

                            // Solo Obtiene los eventos del Especialista
                            if (this.usuarioService.usuario.especialista === item.especialista._id) {

                                        const inicio = new Date(item.start);
                                        const termino = new Date(item.end);

                                        const nombreEmpresa = item.orden ? item.orden.razon : 'Bloqueo';
                                        const flagEvent = item.orden ? true : false;

                                          // validacion para almacenar solo eventos validos
                                        if (flagEvent || item.estado === 'Bloqueo') {

                                                  // Eventos de Calendario
                                            this.eventosByMonth.push(
                                              {
                                                title: `${item.title.toString()} <small class="text-warning">${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                                                start: inicio,
                                                end: termino,
                                                color: {primary: item.color, secondary: item.color},
                                                draggable: false,
                                                resizable: {
                                                  beforeStart: false,
                                                  afterEnd: false,
                                                },
                                                _id: item._id,
                                                nombre: item.nombre.toString(),
                                                empresa: nombreEmpresa,
                                                horaInicio: item.hora_inicio.toString(),
                                                horaTermino: item.hora_termino.toString(),
                                              },

                                            );

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


// ================================= Eventos del Calendario =====================================================
// ------------------ Metodo para cargar los eventos ------------------------
cargarEventos() {

  this.events = [];
  this.eventoArray = [];
  this.eventosByMonth = [];

  this.eventoService.obtenerEventoTodas()
                    .subscribe((resp: any) => {


                      if (resp.evento) {

                          for (const item of resp.evento) {

                              // Solo Obtiene los eventos del Especialista
                              if (this.usuarioService.usuario.especialista === item.especialista._id){

                                    const inicio = new Date(item.start);
                                    const termino = new Date(item.end);


                                    const nombreEmpresa = item.orden ? item.orden.razon : 'Bloqueo';
                                    const flagEvent = item.orden ? true : false;
                                    const acciones = item.orden ? [] : [
                                      {
                                        label: '<i class="fas fa-fw fa-trash-alt text-danger"></i>',
                                        onClick: ({ event }: { event: CalendarEvent }): void => {
                                          this.events = this.events.filter((iEvent) => iEvent !== event);
                                          // console.log('Event deleted', event);
                                          this.deleteEvent(event); // metodo para eliminar evento en BD

                                        },
                                      },
                                    ];

                                    // validacion para almacenar solo eventos validos
                                    if (flagEvent || item.estado === 'Bloqueo') {

                                         // Eventos de Referencia
                                        this.eventoArray.push({
                                          title: `${item.title.toString()} <small class="text-warning"> ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                                          color: item.color,
                                          start: inicio,
                                          end: termino,
                                          nombre: item.nombre.toString(),
                                          correo: item.correo,
                                          especialidad: item.especialidad,
                                          telefono: item.telefono,
                                          ciudad: item.ciudad,
                                          horas_asignadas: item.horas_asignadas,
                                          img: item.especialista.img, // imagen especialista
                                          fecha: item.fecha,
                                          hora_inicio: item.hora_inicio,
                                          hora_termino: item.hora_termino,
                                          cronograma: item.cronograma,
                                          secuencia: item.secuencia,
                                          horas_programadas: item.horas_programadas,
                                          direccion: item.direccion,
                                          sede_lugar: item.sede_lugar,
                                          contacto: item.contacto,
                                          correo_contacto: item.correo_contacto,
                                          actividad: item.actividad,
                                          tipo_informe: item.tipo_informe,
                                          obs_servicio: item.obs_servicio,
                                          _id: item._id,
                                          estado: item.estado,
                                          orden: item.orden,
                                          empresa: item.empresa,
                                          razon: item.razon

                                          });


                                        // Eventos de Calendario
                                        this.events = [
                                          ...this.events,
                                          {
                                            title: `${item.title.toString()} <small class="text-warning">${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                                            start: inicio,
                                            end: termino,
                                            color: {primary: item.color, secondary: item.color},
                                            draggable: false,
                                            resizable: {
                                              beforeStart: false,
                                              afterEnd: false,
                                            },
                                            actions: acciones
                                          }

                                        ];

                                    }


                              }
                        }
                          // console.log(this.events);
                          // console.log(this.eventoArray);

                    }
                      this.viewDataHeader(this.viewDate);
                      this.refresh.next();

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

// --------------------------------------------------------------------------------------------------------------------

// ================================= EVENTS - CALENDAR ==============================================

// metodo para cambiar el dia
changeDay(date: Date) {
  this.viewDate = date;
  this.view = CalendarView.Day;
  console.log('Aqui ESPEC_ROLE - changeDay');

}


  // metodo para ver el evento del dia seleccionado
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
    console.log('Aqui ESPEC_ROLE - dayClicked');

  }
// ---------------------------------------------------------------------------
//                metodo para ACTUALIZAR EVENT
// ---------------------------------------------------------------------------

handleEvent(event: CalendarEvent): void {

  console.log('Aqui ESPEC_ROLE - handleEvent');
 // console.log(event);

  this.evento = null;

  // Filtra el evento por el Id que corresponde
  const foundID = this.eventoArray.find(element => element.start === event.start);

  // console.log(foundID._id.toString());

  const evento = new Evento(
      foundID.nombre,
      event.color.primary,
      event.start,
      event.end,
      null,
      null,
      null,
      foundID.nombre,
      foundID.correo,
      foundID.especialidad,
      foundID.telefono,
      foundID.ciudad,
      foundID.horas_asignadas,
      foundID.img,
      foundID.fecha,
      foundID.hora_inicio,
      foundID.hora_termino,
      foundID.cronograma,
      foundID.secuencia,
      foundID.horas_programadas,
      foundID.direccion,
      foundID.sede_lugar,
      foundID.contacto,
      foundID.correo_contacto,
      foundID.actividad,
      foundID.tipo_informe,
      foundID.obs_servicio,
      foundID.razon,
      null,
      null,
      foundID.orden,
      foundID.empresa,
      null,
      null,
      null,
      foundID.estado
    );





  this.mostrarModal(evento);

}


// ---------------------------------------------------------------------------
//           metodo para ADD EVENT - desde el formulario Programacion
// ---------------------------------------------------------------------------
addEvent(): void {

   // console.log(this.forma.value);

   if (this.forma.invalid) { // condicion para saber si el formulario es valido
     // codigo para obtener los controles Input del formulario
     return  Object.values( this.forma.controls ).forEach( control => {
       control.markAsTouched(); // marca el input como tocado por el usuario
     });
   }


   Swal.fire({
     title: 'Enviando Bloqueo',
     icon: 'info',
     scrollbarPadding: false,
     allowOutsideClick: false
   });
   Swal.showLoading();



   this.flag = false;

    // Estableciendo el titulo del Evento
   const tituloEvento = `${ this.especialista.nombre } B-${new Date().getMilliseconds()}`;

   const start =  `${this.forma.controls.fecha.value}T${this.forma.controls.inicio.value}`;
   const end =  `${this.forma.controls.fecha.value}T${this.forma.controls.termino.value}`;

   const inicio = new Date(start.toString());
   const termino = new Date(end);

   const fecha = new Date(start);
   const year = fecha.getFullYear();
   const month = fecha.getMonth() + 1;


   this.evento = new Evento(
         tituloEvento,
          '#000000',
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
          null, // horas_asignadas
          null,
          fecha.toDateString(), // Fecha del Evento
          this.setTime(this.forma.controls.inicio.value), // hora inicio
          this.setTime(this.forma.controls.termino.value), // hora termino
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          this.forma.controls.motivo.value, // Observaciones del Servicio - Motivo del Bloqueo
          null,
          null,
          null,
          null,
          null,
          null,
          this.especialista,
          null, // soporte
          'Bloqueo', // Estado
          null,
          year.toString(),
          month.toString()



     );

   // console.log('Evento - ', this.evento);

   this.eventoService.guardandoEvento(this.evento)
                         .subscribe((resp: any) => {

                          // console.log('Evento - ', resp);

                           if (resp.evento) {
                            this.especialista.eventos = resp.evento;
                            this.especialista.horas_asignadas = null;
                            this.especialista.ordenes = null;
                            this.especialista.soportes = null;
                            this.especialista.anotaciones = null;
                            this.especialista.profesiones = null;
                            this.especialistaService.actualizarEspecialista(this.especialista)
                                               .subscribe(resEspecilista => {

                                                 // console.log('Especialista - ', resEspecilista);
                                                 this.cargarEventos();
                                                 this.cerraProgramacion();
                                                 Swal.fire('Bloque Registrado', 'Por favor Verificar Agenda', 'success');

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

 // ---------------------------------------------------------------------------
//                metodo para DELETE EVENT
// ---------------------------------------------------------------------------
deleteEvent(eventToDelete: any) {

  let eventoID = '';

  if (eventToDelete._id) {
    eventoID = eventToDelete._id.toString();
  }
  if (!eventToDelete._id) {
   // Filtra el evento por el Id que corresponde
  const foundID = this.eventoArray.find(element => element.start === eventToDelete.start);
  eventoID = foundID._id.toString();
  }

  // console.log(eventoID);


  this.eventoService.obtenerEventoById(eventoID) // TODO: eliminar evento en la orden y el especialista
                    .subscribe((resp: any) => {
                      // console.log(resp);
                      if (resp.evento) {

                           // validacion correcta Eliminar Registro
                            Swal.fire({
                              title: '¿Esta seguro?',
                              text: 'Desea eliminar a ' + resp.evento.title,
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: '#d33',
                              confirmButtonText: 'Si, Eliminar',
                              scrollbarPadding: false,
                              allowOutsideClick: false
                            }).then((result) => {
                                if (result.value) {

                                            this.eventoService.borrarEvento(resp.evento._id.toString())
                                                                    .subscribe(res => {

                                                                      this.cargarEventos();
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
                                                }
                                if (!result.value) {
                                  this.cargarEventos();
                                  this.cerraModal();
                                }

                          });



                      }

                    });



}



// =================================================================
//                 Codigo para el MODAL
// =================================================================
// metodo para cerrar el modal
cerraModal() {

  this.hide = 'hide';
  this.evento = null;

 }



 // Metodo para Mostrar el modal
mostrarModal(evento: Evento) {

  // this.hide = '';

  let url = URL_SERVICIOS + '/img'; // resuelve la imagen del modal
  url += '/usuarios/' + this.usuarioService.usuario.img;

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const fecha = new Date(evento.fecha);

  if (evento.estado !== 'Bloqueo') {
    Swal.fire({
      html: `
      <h5 class="modal-title">Detalles Programacion - ${fecha.toLocaleDateString('es', options)}</h5>
      <div class="modal-body w-100 p-1">
      <div class="row m-1">
      <div class="col-12  bg-secondary">
          <p class="text-white">${evento.razon}</p>
      </div>
     </div>
     <div class="row text-left m-1">

     <div class="col-12 col-lg-6 rounded mr-2">

         <div class="row">

             <div class="col-12">
                 <div class="d-lg-flex">
                     <p class="text-secondary text-nowrap mr-3"> Cronograma: ${evento.cronograma}</p>
                     <p class="text-secondary text-nowrap"> Secuencia: ${evento.secuencia}</p>
                 </div>
             </div>
             <div class="col-12">
                 <div class="d-lg-flex">
                     <p class="text-secondary mr-3"> HRS Actividad: ${evento.orden.act_programadas}</p>
                     <p class="text-secondary mr-3"> HRS Asignadas: ${evento.horas_asignadas}</p>
                     <p class="text-secondary">Tipo: ${evento.orden.tipo_servicio}</p>


                 </div>
             </div>

             <div class="col-12">
                 <p class="text-secondary">Descripción:</p>
                 <p class="text-secondary">${evento.orden.descripcion}</p>
                 <p class="text-secondary">Informe: ${evento.tipo_informe}</p>
                 <p class="text-secondary">Actividad: ${evento.actividad}</p>

             </div>

         </div>
     </div>

     <div class="col-12 col-lg-5 rounded">

         <div class="row">
             <div class="col-12">
                 <p class="text-secondary">Sede: ${evento.sede_lugar}</p>
             </div>
             <div class="col-12">
                 <p class="text-secondary">Direccion: ${evento.direccion}</p>
             </div>
             <div class="col-12">
                 <p class="text-secondary">Hora Inicio: ${evento.hora_inicio}</p>
             </div>
             <div class="col-12">
                 <p class="text-secondary">Hora Termino: ${evento.hora_termino}</p>
             </div>

         </div>

     </div>

 </div>
 <div class="row text-left m-1">
     <div class="col-12">
         <p class="text-secondary m-0">Observaciones:</p>
         <p class="text-secondary">${evento.obs_servicio}</p>
     </div>
 </div>
 </div>


      `,
      width: 1000,
      showConfirmButton: false,
      scrollbarPadding: false

    });
  }


  if (evento.estado === 'Bloqueo') {

    Swal.fire({
      html: `
      <h5 class="modal-title">Detalles Bloqueo <strong>${fecha.toLocaleDateString('es', options)}</strong></h5>
      <div class="row">
      <div class="col-8">
          <div class="d-flex mt-3">
              <h6 class="mr-3">Desde: ${evento.hora_inicio}</h6>
              <h6>Hasta: ${evento.hora_termino}</h6>
          </div>
          <h6>Motivo: ${evento.obs_servicio}</h6>
      </div>
      <div class="col-4">
      <img width="100" src="${url}"  class="img-fluid rounded-circle">
      </div>

  </div>
      `,
      showConfirmButton: false,
      scrollbarPadding: false


    });



  }



}


// ---------------------------------------------------------------------------------
// -----------------CARGAR EVENTOS EN EL ESPECIALISTA--------------------------------
// ---------------------------------------------------------------------------------
// Metodo para solucionar novedad en la programacion cuando no queda asignado el evento al especialista
  async eventoByEspecialista() {




    Swal.fire({
      title: 'Actualizando Programación',
      icon: 'info',
      scrollbarPadding: false,
      allowOutsideClick: false
    });
    Swal.showLoading();



    const eventosEspecialista: any = this.especialista.eventos;

    const eventosArreglo = [];

    let count = 0;


    // codigo para cargar los arreglos Eventos y Ordenes de espacialistas
   for (const item of eventosEspecialista ) {
    eventosArreglo.push(item);   // eventos del especialista
   }

   // comparando los eventos del calendario con los del especialista
   for (const item of this.eventoArray) {

    let foundIDEvento = null;

     foundIDEvento = eventosArreglo.find(element => element._id ===  item._id);

     if(!foundIDEvento) {

      this.especialista.soportes = null;
      this.especialista.profesiones = null;
      this.especialista.anotaciones = null;
      this.especialista.eventos = item; // si el evento no esta en el especialista
      this.especialista.ordenes = item.orden; // si el evento no esta en el especialista
      this.especialista.horas_asignadas = item.horas_asignadas;

     await this.especialistaService.actualizarEspecialista(this.especialista)
                                .subscribe();

      count = count + 1;

    }else {
      count = count + 1;

    }


    if (count === this.eventoArray.length) {

      Swal.fire('Programación Cargada', 'Por favor Verificar Ordenes Nuevas', 'success');


    }

   }










}


} // END class







// ***************** CODIGO NO USADO *********************************************
/*
// Codigo en handleEvent
 this.eventoService.obtenerEventoById(foundID._id.toString())
                    .subscribe((resp: any) => {

                      // console.log(resp);


                      if (resp.evento) {
                            this.evento = resp.evento;

                            if (resp.evento.especialista.usuario_asignado) {

                              this.usuarioService.obtenerUsuarioByID(resp.evento.especialista.usuario_asignado)
                                                  .subscribe((resUsuario: any) => {

                                                    this.usuario = resUsuario; // ver Imagen del usuario asignado

                                                  });

                            }

                          }

                    });
*/
