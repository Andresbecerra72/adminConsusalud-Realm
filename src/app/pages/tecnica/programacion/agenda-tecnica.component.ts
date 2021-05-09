import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { EventosService } from 'src/app/services/eventos/eventos.service';

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



@Component({
  selector: 'app-agenda-tecnica',
  templateUrl: './agenda-tecnica.component.html',
  styles: [
  ]
})
export class AgendaTecnicaComponent implements OnInit {

   // Elementos
   @ViewChild('input') inputTxt: ElementRef<any>;

  // variables
  eventoArray: any[] = [];

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  refresh = new Subject<void>();

  // -------------Constructor-------------------------------------------

  constructor(public eventoService: EventosService) { }

  ngOnInit(): void {

    this.cargarEventos();


  }



  // ----------------metodos----------------------------------------
// ================================= Eventos del Calendario =====================================================
// ------------------ Metodo para cargar los eventos ------------------------
cargarEventos() {

  this.events = [];
  this.eventoArray = [];

  this.eventoService.obtenerEventoTodas()
                    .subscribe((resp: any) => {

                      // console.log(resp.evento);

                      if (resp.evento) {

                          for (const item of resp.evento) {

                            // console.log(item);

                            const inicio = new Date(item.start);
                            const termino = new Date(item.end);

                            const nombreEmpresa = item.orden ? item.orden.razon : 'Bloqueo';
                            const flagEvent = item.orden ? true : false;


                            // validacion para almacenar solo eventos validos
                            if ((flagEvent || item.estado === 'Bloqueo') && item.activo !== 'X') { // evento.activo = 1 nuevo, = 0 con gestion, = X evento de Orden Pre-Facturada

                              // Eventos de Referencia
                            this.eventoArray.push({
                              title: `${item.title.toString()} <small class="text-warning"> ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                              color: item.color,
                              start: inicio,
                              end: termino,
                              nombre: item.nombre.toString(),
                              especialidad: item.especialidad,
                              estado: item.estado,
                              correo: item.correo,
                              telefono: item.telefono,
                              ciudad: item.ciudad,
                              fecha: item.fecha,
                              hora_inicio: item.hora_inicio,
                              hora_termino: item.hora_termino,
                              img: item.especialista.img, // imagen especialista
                              orden: item.orden, // referencia si el evento tiene Orden
                              obs_servicio: item.obs_servicio,
                               _id: item._id
                              });

                            // Eventos de Calendario
                            this.events = [
                              ...this.events,
                              {
                                title: `${item.title.toString()} <small class="text-warning"> ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                                start: inicio,
                                end: termino,
                                color: {primary: item.color, secondary: item.color},
                                draggable: flagEvent,
                                resizable: {
                                  beforeStart: flagEvent,
                                  afterEnd: flagEvent,
                                }

                              },

                            ];

                            }

                          }
                          // console.log(this.events);
                          // console.log(this.eventoArray);

                    }

                      // this.viewDataHeader(this.viewDate);
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
  // console.log('Aqui TECN_ROLE - changeDay');

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
    // console.log('Aqui TECN_ROLE - dayClicked');

  }





// =================================================================
//                 BUSCADOR DE EVENTOS
// =================================================================
buscarEventos( titulo: string ) {


  if (titulo.length === 1 && titulo === ' ') {
    return;
  }

  if (titulo.length <= 0) {

    this.cargarEventos();

    return;

  }

  if (titulo.length >= 1) {



    this.eventoService.buscarEventosByTitle(titulo)
                        .subscribe( (resp: any) => {

                          // console.log(resp);

                          if (resp.eventstitle.length > 0) {

                          this.events = []; // limpia los eventos del calendario
                          this.eventoArray = [];



                          for (const item of resp.eventstitle) {

                            // console.log(item);

                            const inicio = new Date(item.start);
                            const termino = new Date(item.end);

                            const nombreEmpresa = item.orden ? item.orden.razon : 'Bloqueo';
                            const flagEvent = item.orden ? true : false;

                            // validacion para almacenar solo eventos validos
                            if (flagEvent || item.estado === 'Bloqueo') {

                              // Eventos de Referencia
                            this.eventoArray.push({
                              title: `${item.title.toString()} <small class="text-warning"> ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                              color: item.color,
                              start: inicio,
                              end: termino,
                              nombre: item.nombre.toString(),
                              especialidad: item.especialidad,
                              estado: item.estado,
                              correo: item.correo,
                              telefono: item.telefono,
                              ciudad: item.ciudad,
                              fecha: item.fecha,
                              hora_inicio: item.hora_inicio,
                              hora_termino: item.hora_termino,
                              img: item.especialista.img, // imagen especialista
                              orden: item.orden, // referencia si el evento tiene Orden
                              obs_servicio: item.obs_servicio,
                               _id: item._id
                              });

                            // Eventos de Calendario
                            this.events = [
                              ...this.events,
                              {
                                title: `${item.title.toString()} <small class="text-warning"> ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                                start: inicio,
                                end: termino,
                                color: {primary: item.color, secondary: item.color},
                                draggable: flagEvent,
                                resizable: {
                                  beforeStart: flagEvent,
                                  afterEnd: flagEvent,
                                }
                              },

                            ];

                            }

                          }
                          // console.log(this.events);
                          // console.log(this.eventoArray);

                        }else {
                          // cuando no vienen datos en la respuesta
                         this.events = []; // limpia los eventos del calendario
                         this.eventoArray = [];
                        }

                        });

  }


}

// limpiar el Input del Buscador
clearInput() {

  this.inputTxt.nativeElement.value = '';

}

} //END class
