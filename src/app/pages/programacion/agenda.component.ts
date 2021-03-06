import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { EmpresaService } from 'src/app/services/dashboard/empresa.service';
import { SedeService } from 'src/app/services/dashboard/sede.service';
import { OrdenService } from 'src/app/services/orden/orden.service';
import { SoportesService } from 'src/app/services/soportes/soportes.service';

import { Evento } from 'src/app/models/evento.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Sede } from 'src/app/models/sede.model';
import { Orden } from 'src/app/models/orden.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Soportes } from 'src/app/models/soportes.model';


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
  selector: 'app-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agenda.component.html',
  styles: [
    `
      .drag-active {
        position: relative;
        z-index: 1;
        pointer-events: none;
      }
      .drag-over {
        background-color: #eee;
      }
    `,
  ]
})
export class AgendaComponent implements OnInit {

   // Elementos
   @ViewChild('input') inputTxt: ElementRef<any>;

  // variables
  forma: FormGroup;
  formaEvent: FormGroup;
  flag: boolean = false;
  flagArrow: boolean = true;
  flagSelect: boolean = false;
  hide: string = 'hide'; // variable para ocultar el modal
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  flagBtnReset: boolean = false; // para el BTN reset eventos

  listaSelectEspecialista = [];
  listaSelectEmpresa = [];
  listaSelectOrden = [];
  listaSelectSede = [];


  usuario: Usuario;
  especialista: Especialista;
  empresa: Empresa;
  sede: Sede;
  orden: Orden;
  soportes: Soportes;

  eventoArray_init: any[] = []; // carga los eventos iniciales By Month
  eventoArray_all: any[] = []; // carga todos los eventos
  eventosByMonth: any[] = [];
  evento: Evento;

  events: CalendarEvent[] = [];

  activeDayIsOpen = false;

  refresh = new Subject<void>();

// --------------------- Constructor ------------------------------
  constructor(private fb: FormBuilder,
              private fbEvent: FormBuilder,
              public usuarioService: UsuarioService,
              public especialistaService: EspecialistaService,
              public empresasService: EmpresaService,
              public sedeService: SedeService,
              public ordenService: OrdenService,
              public eventoService: EventosService,
              public soportesService: SoportesService) {


                this.cargarAllEventosFromBD(); // *** carga todos los eventos de la BD

                this.crearFormulario(); // llama el metodo para crear el formulario

               }

  ngOnInit(): void {

    this.cargarEventosInit(); // carga los eventos Iniciales

    this.cargarEmpresas(); // Opciones del Select - Empresas

    this.cargarEspecialistas(); // Opciones del Select - Especialistas

              }



// ----------Metodos---------------------------
// ================================= Eventos almacenado en variable =====================================================
// ------------------ Metodo para cargar los eventos en el array ------------------------
cargarAllEventosFromBD() {


  this.eventoArray_all = [];

  this.eventoService.obtenerEventoTodas() // ** llama todos los eventos de BD
                    .subscribe((resp: any) => {

                      // console.log(resp.evento);
                      if (resp.evento) {

                          for (const item of resp.evento) {
                            // console.log(item);
                            this.eventoArray_all.push(item);  // Eventos de Referencia
                            }

                          }
                      // codicion para cargar todos los eventos Automaticamente
                      if (this.eventoArray_all.length > 0) {

                        this.cargarEventosByArray();

                      }

                    }, err => {
                         console.log('HTTP Error', err.error);
                         Swal.fire({
                          title: '??Error!',
                          text: JSON.stringify(err.error.message),
                          icon: 'error',
                          confirmButtonText: 'Cerrar',
                          scrollbarPadding: false,
                          allowOutsideClick: false
                        });
                      });
}


// ================================= Eventos del Calendario =====================================================
// ------------------ Metodo para cargar los eventos INICIALES BY MONTH ------------------------
cargarEventosInit() {


  this.events = [];
  this.eventoArray_init = [];

  Swal.fire({
    text: 'Cargando Programaci??n..',
    icon: 'success',
    scrollbarPadding: false,
    allowOutsideClick: false
  });
  Swal.showLoading();


  if (this.eventoArray_all.length > 0) {

    this.cargarEventosByArray();

    Swal.close();

    return;

  }else {


  this.eventoService.obtenerEventoByMonth() // ** llama los eventos del MES
                    .subscribe((resp: any) => {

                      // console.log(resp.evento);

                      this.events = [];
                      this.eventoArray_init = [];

                      Swal.close();

                      if (resp.evento) {

                          for (const item of resp.evento) {

                            // console.log(item);

                            const inicio = new Date(item.start);
                            const termino = new Date(item.end);

                            const nombreEmpresa = item.orden ? item.razon : 'Bloqueo';
                            const flagEvent = item.orden ? true : false;
                            const identOrden = item.cronograma ? `(${item.cronograma} SEC ${item.secuencia})`  : ''; // muestra el cronograma - secuencia
                            const acciones = item.orden ? [
                                                            {
                                                              label: '<i class="fas fa-fw fa-trash-alt text-danger"></i>',
                                                              onClick: ({ event }: { event: CalendarEvent }): void => {
                                                                this.events = this.events.filter((iEvent) => iEvent !== event);
                                                                // console.log('Event deleted', event);
                                                                this.deleteEvent(event); // metodo para eliminar evento en BD

                                                              },
                                                            },
                                                          ] : [];

                            // validacion para almacenar solo eventos validos
                            if ((flagEvent || item.estado === 'Bloqueo') && item.activo !== 'X') { // evento.activo = 1 nuevo, = 0 con gestion, = X evento de Orden Pre-Facturada

                              // Eventos de Referencia
                            this.eventoArray_init.push({
                              title: `${item.title.toString()} <small class="text-warning">${identOrden} ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
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
                                title: `${item.title.toString()} <small class="text-warning">${identOrden} ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                                start: inicio,
                                end: termino,
                                color: {primary: item.color, secondary: item.color},
                                draggable: flagEvent,
                                resizable: {
                                  beforeStart: flagEvent,
                                  afterEnd: flagEvent,
                                },
                                actions: acciones,
                              },

                            ];

                            }

                          }
                          // console.log(this.events);
                          // console.log(this.eventoArray_init);

                    }

                      this.viewDataHeader(this.viewDate);
                      this.refresh.next();

                    }, err => {
                         console.log('HTTP Error', err.error);
                         Swal.fire({
                          title: '??Error!',
                          text: JSON.stringify(err.error.message),
                          icon: 'error',
                          confirmButtonText: 'Cerrar',
                          scrollbarPadding: false,
                          allowOutsideClick: false
                        });
                      });



     }

} // end metodo




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

                            const inicio = new Date(item.start);
                            const termino = new Date(item.end);

                            const nombreEmpresa = item.orden ? item.razon : 'Bloqueo';
                            const flagEvent = item.orden ? true : false;
                            const identOrden = item.cronograma ? `(${item.cronograma} SEC ${item.secuencia})`  : ''; // muestra el cronograma - secuencia

                             // validacion para almacenar solo eventos validos
                            if (flagEvent || item.estado === 'Bloqueo') {

                                   // Eventos de Calendario
                                  this.eventosByMonth.push(
                                    {
                                      title: `${item.title.toString()} <small class="text-warning">${identOrden} ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                                      start: inicio,
                                      end: termino,
                                      color: {primary: item.color, secondary: item.color},
                                      draggable: flagEvent,
                                      resizable: {
                                        beforeStart: flagEvent,
                                        afterEnd: flagEvent,
                                      },
                                      _id: item._id,
                                      nombre: item.nombre.toString(),
                                    },

                                  );

                             }

                          }

                        }

                      }, err => {
                           console.log('HTTP Error', err.error);
                           Swal.fire({
                            title: '??Error!',
                            text: JSON.stringify(err.error.message),
                            icon: 'error',
                            confirmButtonText: 'Cerrar',
                            scrollbarPadding: false,
                            allowOutsideClick: false
                          });
                        });

              }


// --------------------------------------------------------------------------
// -------------- Metodo para Cargar Las Empresas --------------------
cargarEmpresas() {

  this.empresasService.obtenerEmpresasTodas()
                          .subscribe((resp: any) => {

                          // console.log(resp);

                           if (resp.total > 0) {

                             for (const item of resp.empresa) {
                               this.listaSelectEmpresa.push({razon: item.razon, _id: item._id});
                            }

                             if (resp.total === 0) {
                             this.listaSelectEmpresa.push({razon: resp.message, _id: 'Default'});
                           }
                          }

                          }, err => {
                               console.log('HTTP Error', err.error);
                               Swal.fire({
                                title: '??Error!',
                                text: JSON.stringify(err.error.message),
                                icon: 'error',
                                confirmButtonText: 'Cerrar',
                                scrollbarPadding: false,
                                allowOutsideClick: false
                              });
                            });


}

// ---------- Metodo para Cargar Las Especialistas -----------------
cargarEspecialistas() {

  this.especialistaService.obtenerEspecialistaTodas()
                          .subscribe((resp: any) => {

                           // console.log(resp);

                           if (resp.total > 0) {

                             for (const item of resp.especialista) {
                               this.listaSelectEspecialista.push({nombre: item.nombre, _id: item._id});
                                }

                            }

                           if (resp.total === 0) {
                             this.listaSelectEspecialista.push({nombre: resp.message, _id: 'Default'});
                           }

                          }, err => {
                               console.log('HTTP Error', err.error);
                               Swal.fire({
                                title: '??Error!',
                                text: JSON.stringify(err.error.message),
                                icon: 'error',
                                confirmButtonText: 'Cerrar',
                                scrollbarPadding: false,
                                allowOutsideClick: false
                              });
                            });


}

// --------- Metodo para Cargar Las Ordenes cuando selecciona la empresa --------------------
seleccionEmpresa() { // Para formulario Programacion

  // console.log(this.formaEvent.controls.selectEmpresa.value);

  this.listaSelectOrden = [];
  this.listaSelectSede = [];

  if (!this.formaEvent.controls.selectEmpresa.value){
    this.flagSelect = false;
    return;
  }

  this.formaEvent.controls.selectOrden.setValue('');
  this.formaEvent.controls.selectSede.setValue('');


  const empresaNombre = this.formaEvent.controls.selectEmpresa.value.razon;

  this.flagSelect = true;

  this.empresasService.obtenerEmpresaByName(empresaNombre.toString())
                      .subscribe((resp: any) => {

                        // console.log(resp.empresa);

                        if (resp.empresa) {

                              if (resp.empresa.ordenes.length > 0) {
                                for (const item of resp.empresa.ordenes) {
                                  this.listaSelectOrden.push({cronograma: item.cronograma,
                                                              secuencia: item.secuencia,
                                                             _id: item._id});
                                 }

                              }
                              if (resp.empresa.ordenes.length === 0) {
                                this.listaSelectOrden.push({cronograma: 'No hay Registros',
                                                              secuencia: 'NA',
                                                             _id: 'Default'});

                              }

                              if (resp.empresa.sedes.length > 0) {
                                for (const item of resp.empresa.sedes) {
                                  this.listaSelectSede.push({nombre: item.nombre,
                                                             _id: item._id});
                                  }

                              }
                              if (resp.empresa.sedes.length === 0) {
                                this.listaSelectSede.push({nombre: 'No hay Registros',
                                                             _id: 'Default'});

                              }

                        }

                      }, err => {
                           console.log('HTTP Error', err.error);
                           Swal.fire({
                            title: '??Error!',
                            text: JSON.stringify(err.error.message),
                            icon: 'error',
                            confirmButtonText: 'Cerrar',
                            scrollbarPadding: false,
                            allowOutsideClick: false
                          });
                        });


}

// -----------Metodo para seleccionar la misma fecha en el DatePicker-----------------------
setDate() { // Para formulario Programacion

  if (!this.formaEvent.controls.start.value) {
    return;
  }

  const fecha = this.formaEvent.controls.start.value;

  this.formaEvent.controls.end.setValue(fecha.toString());

}




// ================================= EVENTS - CALENDAR ==============================================

// metodo para cambiar el dia
  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
    console.log('Aqui - changeDay');

  }


  // metodo para cambiar las horas
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
    console.log('Aqui - eventTimesChanged');
  }


  // metodos para agregar eventos externos
  eventDropped({
    event,
    newStart,
    newEnd,
    allDay
  }: CalendarEventTimesChangedEvent): void {

    console.log('Aqui - eventDropped');

    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    if (this.view === 'month') {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];

     // Filtra el evento por el Id que corresponde
    const foundID = this.eventoArray_init.find(element => element.title === event.title);

    // Eliminar el evento del Array ALL
    this.eventoArray_all = this.eventoArray_all.filter(e => e._id !== foundID._id);

    const year = event.start.getFullYear();
    const month = event.start.getMonth() + 1;

    this.eventoService.obtenerEventoById(foundID._id.toString())
                      .subscribe((resp: any) => {
                        // console.log(resp);
                        if (resp.evento) {

                          this.evento = resp.evento;
                          this.evento.start = event.start;
                          this.evento.end = event.end;
                          this.evento.fecha = event.start.toDateString();
                          this.evento.hora_inicio = this.setTime(event.start);
                          this.evento.hora_termino = this.setTime(event.end);
                          this.evento.month = month.toString();
                          this.evento.year = year.toString();

                          this.eventoService.actualizarEvento(this.evento)
                                            .subscribe((res: Evento) => {

                                              // ingreso el evento modificado
                                              this.eventoArray_all.push(res);

                                              this.cargarEventosInit();
                                            });


                        }

                      }, err => {
                                 console.log('HTTP Error', err.error);
                                 Swal.fire({
                                  title: '??Error!',
                                  text: JSON.stringify(err.error.message),
                                  icon: 'error',
                                  confirmButtonText: 'Cerrar',
                                  scrollbarPadding: false,
                                  allowOutsideClick: false
                                });
                              });



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
  console.log('Aqui - dayClicked');

}

// ---------------------------------------------------------------------------
//           metodo para ADD EVENT - desde el formulario Programacion
// ---------------------------------------------------------------------------
  addEvent(): void {

   // console.log(this.formaEvent.value);

    // codigo para validar los datos de los Selects
    Object.values( this.formaEvent.controls ).forEach( control => {
      if (control.value._id  === 'Default') {
        return control.setErrors({invalid: true});
      }
    });

    if (this.formaEvent.invalid) { // condicion para saber si el formulario es valido
      // codigo para obtener los controles Input del formulario
      return  Object.values( this.formaEvent.controls ).forEach( control => {
        control.markAsTouched(); // marca el input como tocado por el usuario
      });
    }



    Swal.fire({
      title: 'Registrando Programaci??n',
      icon: 'info',
      scrollbarPadding: false,
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.flag = false;

    const IdOrden = this.formaEvent.controls.selectOrden.value._id;
    const IdEspecialista = this.formaEvent.controls.selectEspecialista.value._id;
    const nameEmpresa = this.formaEvent.controls.selectEmpresa.value.razon;
    const nameSede = this.formaEvent.controls.selectSede.value.nombre;


    this.ordenService.obtenerOrdenByID(IdOrden.toString()) // Orden
                      .subscribe(resp => {
                       // console.log(resp);
                        if (resp) {
                          this.orden = resp;
                        }
                      });

    this.especialistaService.obtenerEspecialistaByID(IdEspecialista.toString()) // Especialista
                      .subscribe((resp: any) => {
                       // console.log(resEspecialista);

                        if (resp.especialista) {
                          this.especialista = resp.especialista;
                        }
                      });

    this.empresasService.obtenerEmpresaByName(nameEmpresa.toString()) // Empresa
                      .subscribe((resp: any) => {
                       // console.log(resp);
                        if (resp.empresa) {
                          this.empresa = resp.empresa;
                        }

                      });

    this.sedeService.obtenerSedeByName(nameSede.toString()) // Sede
                      .subscribe((resp: any) => {
                        // console.log(resp);
                        if (resp.sede) {
                          this.sede = resp.sede;
                        }
                      });


    setTimeout(() => { // **** Time Delay ********

      // Actualiza Orden
      // this.orden.estado = 'En Ejecuci??n'; // *************NO CAMBIA ESTADO****************
      this.orden.horas_programadas =  this.formaEvent.controls.hours.value;
      this.orden.especialistas = this.especialista;
      this.orden.soportes = null;
      this.orden.empresa = this.empresa;
      this.orden.sedes = this.sede;
      this.orden.archivos = null;
      this.orden.obs_internas = null;
      this.orden.anotaciones = null;


      // Actualiza Especialista
      this.especialista.horas_asignadas = this.formaEvent.controls.hours.value;

      // Crea el Evento
        // Estableciendo el titulo del Evento
      const tituloEvento = `${ this.especialista.nombre } - ${new Date().getMilliseconds()}`;
      const inicio = new Date(this.formaEvent.controls.start.value);
      const termino = new Date(this.formaEvent.controls.end.value);
      const color = this.especialista.profesiones[0].color.primary;
      const fecha = new Date(this.formaEvent.controls.start.value);
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
            this.formaEvent.controls.hours.value,
            this.especialista.img,
            fecha.toDateString(), // Fecha del Evento
            this.setTime(this.formaEvent.controls.start.value), // hora inicio
            this.setTime(this.formaEvent.controls.end.value), // hora termino
            this.orden.cronograma,
            this.orden.secuencia,
            this.formaEvent.controls.hours.value,
            this.sede.direccion,
            this.sede.nombre,
            this.sede.contacto,
            this.sede.correo,
            this.formaEvent.controls.actividad.value,
            this.formaEvent.controls.informe.value,
            this.formaEvent.controls.obsInternas.value,
            this.empresa.razon,
            null, // id
            null, // Usuario
            this.orden,
            this.empresa,
            this.formaEvent.controls.selectSede.value,
            this.especialista,
            null, // soporte
            'NA', // Estado
            null,
            year.toString(),
            month.toString()
      );


       // console.log('Evento - ', this.evento);

      // Crea el Soporte
      this.soportes = new Soportes(
        null,
        this.especialista.nombre,
        this.empresa.razon,
        this.formaEvent.controls.selectSede.value,
        this.orden.cronograma,
        this.orden.secuencia,
        this.orden.tipo_servicio,
        this.formaEvent.controls.actividad.value,
        this.formaEvent.controls.informe.value,
        this.formaEvent.controls.hours.value,
        0, // Horas Usadas
        null, // Cantidad Asistentes
        0, // tiempo Informe
        0, // tiempo Administrativo
        0, // tiempo Validado por Dir T??cnica
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

      this.eventoService.guardandoEvento(this.evento)
                          .subscribe((resp: any) => {

                           // console.log('Evento - ', resp);

                            if (resp.evento) {

                                this.eventoArray_all.push(resp.evento); // almacena el evento en la variable

                                this.orden.eventos = resp.evento;

                                this.ordenService.actualizarOrden(this.orden)
                                                   .subscribe(resOrden => {

                                                     // console.log('Orden - ', resOrden);

                                                     if (resOrden) {

                                                          this.especialista.eventos = resp.evento;
                                                          this.especialista.ordenes = resOrden;
                                                          this.especialista.soportes = null;
                                                          this.especialista.anotaciones = null;
                                                          this.especialista.profesiones = null;
                                                          this.especialistaService.actualizarEspecialista(this.especialista)
                                                                             .subscribe(resEspecilista => {

                                                                              if (resEspecilista) {
                                                                                this.empresa.especialistas = resEspecilista;
                                                                                this.empresa.eventos = resp.evento;
                                                                                this.empresa.ordenes = null;
                                                                                this.empresa.soportes = null;
                                                                                this.empresa.archivos = null;
                                                                                this.empresasService.actualizarEmpresa(this.empresa)
                                                                                                    .subscribe();

                                                                                }

                                                                              // console.log('Especialista - ', resEspecilista);
                                                                              this.cargarEventosInit();
                                                                              this.cerraProgramacion();
                                                                             });

                                                     }


                                                   });
                                this.soportes.nombre = resp.evento._id.toString(); // Se asigna el ID delevento como NOMBRE
                                this.soportes.evento = resp.evento;
                                this.soportesService.guardandoSoportes(this.soportes) // codigo para crear el Soporte *** NO REALCIONA
                                                    .subscribe();


                            }

                            Swal.fire('Especilista Programado', 'Por favor Verificar Agenda', 'success');



                          }, err => {
                               console.log('HTTP Error', err.error);
                               Swal.fire({
                                title: '??Error!',
                                text: JSON.stringify(err.error.message),
                                icon: 'error',
                                confirmButtonText: 'Cerrar',
                                scrollbarPadding: false,
                                allowOutsideClick: false
                              });
                            });


    }, 2000);  // **** Time Delay 2 Seg ********

  }


// cierra el formulario de nueva Programacion
  cerraProgramacion() {
    this.flag = false;
    this.flagSelect = false;
    // this.formaEvent.reset();
    this.formaEvent.controls.selectEspecialista.setValue('');
    this.formaEvent.controls.selectEmpresa.setValue('');
    this.formaEvent.controls.selectOrden.setValue('');
    this.formaEvent.controls.hours.setValue(0);
    this.formaEvent.controls.start.reset();
    this.formaEvent.controls.end.reset();
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
    const foundID = this.eventoArray_init.find(element => element.start === eventToDelete.start);
    eventoID = foundID._id.toString();
    }

    // console.log(eventoID);

    // Eliminar el evento del Array ALL
    this.eventoArray_all = this.eventoArray_all.filter(e => e._id !== eventoID);


    this.eventoService.obtenerEventoById(eventoID)
                      .subscribe((resp: any) => {
                        // console.log(resp);
                        if (resp.evento) {

                             // validacion correcta Eliminar Registro
                              Swal.fire({
                                title: '??Esta seguro?',
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

                                                                        this.cargarEventosInit();
                                                                        this.cerraModal();

                                                                      }, err => {
                                                                           console.log('HTTP Error', err.error);
                                                                           Swal.fire({
                                                                            title: '??Error!',
                                                                            text: JSON.stringify(err.error.message),
                                                                            icon: 'error',
                                                                            confirmButtonText: 'Cerrar',
                                                                            scrollbarPadding: false,
                                                                            allowOutsideClick: false
                                                                          });
                                                                        });
                                                  }
                                  if (!result.value) {
                                    this.cargarEventosInit();
                                    this.cerraModal();
                                  }

                            });



                        }

                      });



  }


// ---------------------------------------------------------------------------
//                metodo para ACTUALIZAR EVENT
// ---------------------------------------------------------------------------

handleEvent(event: CalendarEvent): void {

  console.log('Aqui - handleEvent');
 // console.log(event);

  this.flagArrow = true;
  this.evento = null;
  this.usuario = null;

  // Filtra el evento por el Id que corresponde
  const foundID = this.eventoArray_init.find(element => element.start === event.start);

  this.evento = new Evento(
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
    null,
    foundID.img,
    foundID.fecha,
    foundID.hora_inicio,
    foundID.hora_termino,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    foundID.obs_servicio, // motivo del bloqueo
    null,
    null, // id
    null,
    null,
    null,
    null,
    null,
    null,
    foundID.estado
  );



  // console.log(foundID._id.toString());

  this.eventoService.obtenerEventoById(foundID._id.toString())
                    .subscribe((resp: any) => {

                      // console.log(resp);


                      if (resp.evento) {
                            this.evento = resp.evento;
                            // console.log(this.evento);
                            // this.forma.controls.cronograma.setValue(this.evento.cronograma);
                            //  this.forma.controls.secuencia.setValue(this.evento.secuencia);
                            this.forma.controls.hours.setValue(this.evento.horas_asignadas);

                            if (resp.evento.especialista.usuario_asignado) {

                              this.usuarioService.obtenerUsuarioByID(resp.evento.especialista.usuario_asignado)
                                                  .subscribe((resUsuario: any) => {

                                                    this.usuario = resUsuario; // ver Imagen del usuario asignado

                                                  });

                            }

                          }

                    }, err => {
                                 console.log('HTTP Error', err.error);
                                 Swal.fire({
                                  title: '??Error!',
                                  text: JSON.stringify(err.error.message),
                                  icon: 'error',
                                  confirmButtonText: 'Cerrar',
                                  scrollbarPadding: false,
                                  allowOutsideClick: false
                                });
                              });





  this.forma.controls.start.setValue(this.formatoFecha(this.evento.start));
  this.forma.controls.end.setValue(this.formatoFecha(this.evento.end));


 // console.log(this.forma.value);
 // console.log(this.evento);
 // console.log(event);


  this.mostrarModal();

}


// ---------------------------------------------------
// metodo para cambiar el formato de la fecha
formatoFecha(fecha: Date) {

  function pad(num: string | number) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }

  return fecha.getUTCFullYear() +
  '-' + pad(fecha.getMonth() + 1) +
  '-' + pad(fecha.getDate()) +
  'T' + pad(fecha.getHours()) +
  ':' + pad(fecha.getMinutes()) +
  ':' + pad(fecha.getSeconds());

}

// ---------------------------------------------------------------------------
// Metodo para actualizar el EVENTO desde el Modal -----------------------
// ---------------------------------------------------------------------------

actualizarEvento() {

  let cantidadHoras = 0; // variable para cambiar el dato de horas programadas

  if (this.forma.invalid) { // condicion para saber si el formulario es valido

    // codigo para obtener los controles Input del formulario
    return  Object.values( this.forma.controls ).forEach( control => {
      control.markAsTouched(); // marca el input como tocado por el usuario
    });
  }

  this.events = [];
  this.eventoArray_init = [];


  // muestra la informacion cuando el formulario es valido
  // console.log(this.forma.value);

  cantidadHoras = this.forma.controls.hours.value - this.evento.horas_asignadas; // nuevo dato de Horas

  const fecha = new Date(this.forma.controls.start.value);
  const year = fecha.getFullYear();
  const month = fecha.getMonth() + 1;

  const inicio = new Date(this.forma.controls.start.value);
  const termino = new Date(this.forma.controls.end.value);

  // this.evento.cronograma = this.forma.controls.cronograma.value;
  // this.evento.secuencia = this.forma.controls.secuencia.value;
  this.evento.horas_asignadas = this.forma.controls.hours.value;
  this.evento.horas_programadas = this.forma.controls.hours.value;
  this.evento.start = inicio;
  this.evento.end = termino;
  this.evento.fecha = fecha.toDateString();
  this.evento.hora_inicio =  this.setTime(this.forma.controls.start.value); // hora inicio
  this.evento.hora_termino = this.setTime(this.forma.controls.end.value); // hora termino
  this.evento.year = year.toString();
  this.evento.month = month.toString();


  // soporte actualiza cambios de horas
  this.soportesService.obtenerSoportesByName(this.evento._id.toString())
                      .subscribe((resp: any) => {
                        // console.log(resp);
                        if (resp.soportes) {
                          this.soportes = resp.soportes;
                          this.soportes.horas_asignadas = this.forma.controls.hours.value;
                          this.soportes.anotaciones = null;
                          this.soportesService.actualizarSoportes(this.soportes)
                                              .subscribe((resSoporte: any) => this.soportes = resSoporte);
                        }

                      });


   // Eliminar el evento del Array ALL
  this.eventoArray_all = this.eventoArray_all.filter(e => e._id !== this.evento._id);

  this.eventoService.actualizarEvento(this.evento)
                    .subscribe(resp => {

                      // ingresa el evento modificado
                      this.eventoArray_all.push(resp);

                      this.evento = resp;

                     // console.log('Evento -', this.evento);

                      if (resp) {

                        this.ordenService.obtenerOrdenByID(this.evento.orden.toString())
                                          .subscribe(resOrden => {

                                            this.orden = resOrden;
                                            this.orden.horas_programadas =  cantidadHoras;
                                            this.orden.especialistas = null;
                                            this.orden.soportes = null;
                                            this.orden.sedes = null;
                                            this.orden.eventos = null;
                                            this.orden.archivos = null;
                                            this.orden.obs_internas = null;
                                            this.orden.anotaciones = null;

                                            this.ordenService.actualizarOrden(this.orden) // actualiza la Orden
                                                              .subscribe(updateOrden => {

                                                               // console.log('Orden-Updated ', updateOrden);

                                                                if (updateOrden) {

                                                                  // tslint:disable-next-line: max-line-length
                                                                  this.especialistaService.obtenerEspecialistaByID(this.evento.especialista.toString())
                                                                  .subscribe((resEspecialista: any) => {

                                                                    if (resEspecialista.especialista) {

                                                                      this.especialista = resEspecialista.especialista;



                                                                      const eventosArreglo = [];


                                                                      for (const item of resEspecialista.especialista.eventos) {
                                                                        eventosArreglo.push(item);
                                                                      }


                                                                      const foundIDEvento = eventosArreglo.find(element => element._id ===  this.evento._id);


                                                                      if(!foundIDEvento) {
                                                                        this.especialista.eventos = this.evento; // si el evento no esta en el especialista
                                                                        this.especialista.ordenes = updateOrden; // si la Orden no esta en el especialista
                                                                        this.especialista.horas_asignadas = this.evento.horas_asignadas;

                                                                      } else {
                                                                        this.especialista.eventos = null;
                                                                        this.especialista.ordenes = null;
                                                                        this.especialista.horas_asignadas = cantidadHoras;
                                                                      }


                                                                        this.especialista.soportes = null;
                                                                        this.especialista.profesiones = null;
                                                                        this.especialista.anotaciones = null;
                                                                        // this.especialista.eventos = null;
                                                                        // this.especialista.ordenes = null;





                                                                        // tslint:disable-next-line: max-line-length
                                                                        this.especialistaService.actualizarEspecialista(this.especialista) // actualiza el Especialista
                                                                                    .subscribe(udatedEspecialista => {

                                                                          // console.log('Especialista-Updated ', udatedEspecialista);

                                                                                    });


                                                                        }


                                                                  });


                                                                }

                                                              });
                                          });



                      }


                      this.cargarEventosInit();
                      Swal.fire({
                        title: 'Programaci??n Actualizada',
                        text: resp.nombre,
                        icon: 'success',
                        confirmButtonText: 'Cerrar',
                        scrollbarPadding: false,
                        allowOutsideClick: false
                      });

                    }, err => {
                         console.log('HTTP Error', err.error);
                         Swal.fire({
                          title: '??Error!',
                          text: JSON.stringify(err.error.message),
                          icon: 'error',
                          confirmButtonText: 'Cerrar',
                          scrollbarPadding: false,
                          allowOutsideClick: false
                        });
                      });


  this.cerraModal();


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



// ------------------------------- FORMULARIO ---------------------------------------------------------

    // ----------------------
 // metodos para hacer las validaciones del Input Sincronas
get hoursNoValido() {
  return this.forma.get('hours').invalid && this.forma.get('hours').touched;
}
get startNoValido() {
  return this.forma.get('start').invalid && this.forma.get('start').touched;
}
get endNoValido() {
  return this.forma.get('end').invalid && this.forma.get('end').touched;
}

// validaciones del Formulario de Programacion
get especialistaNoValido() {
  return this.formaEvent.get('selectEspecialista').invalid && this.formaEvent.get('selectEspecialista').touched;
}
get empresaNoValido() {
  return this.formaEvent.get('selectEmpresa').invalid && this.formaEvent.get('selectEmpresa').touched;
}
get ordenNoValido() {
  return this.formaEvent.get('selectOrden').invalid && this.formaEvent.get('selectOrden').touched;
}
get sedeNoValido() {
  return this.formaEvent.get('selectSede').invalid && this.formaEvent.get('selectSede').touched;
}
get inicioNoValido() {
  return this.formaEvent.get('start').invalid && this.formaEvent.get('start').touched;
}
get terminoNoValido() {
  return this.formaEvent.get('end').invalid && this.formaEvent.get('end').touched;
}
get horasNoValido() {
  return this.formaEvent.get('hours').invalid && this.formaEvent.get('hours').touched;
}




// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    start:      ['', Validators.required],
    end:        ['', Validators.required],
    hours:      [0, Validators.required],
    // cronograma: ['', Validators.required],
    // secuencia:  ['', Validators.required],

    });

  this.formaEvent = this.fbEvent.group({
      // es importante asociar los controles Input
      start:      ['', Validators.required],
      end:        ['', Validators.required],
      hours:      [0, Validators.required],
      actividad:    '',
      informe:      '',
      obsInternas:  '',
      selectEspecialista: ['', Validators.required],
      selectEmpresa: ['', Validators.required],
      selectOrden: ['', Validators.required],
      selectSede: ['', Validators.required],

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
mostrarModal() {

  this.hide = '';


}



// =================================================================
//                 BUSCADOR DE EVENTOS
// =================================================================
buscarEventos( titulo: string ) {

  // console.log(titulo);



  if (titulo.length === 1 && titulo === ' ') {
    return;
  }

  if (titulo.length <= 0) {

    this.cargarEventosInit();

    return;

  }

  if (titulo.length >= 1 && this.eventoArray_all.length > 0) {

      // filtro de busqueda
      const filter = {
        nombre: titulo
        };

      const arrayBusqueda = this.filterPlainArray(this.eventoArray_all, filter );

      // console.log(arrayBusqueda);


              if (arrayBusqueda.length > 0) {

                            this.events = []; // limpia los eventos del calendario
                            this.eventoArray_init = [];



                            for (const item of arrayBusqueda) {

                              // console.log(item);

                              const inicio = new Date(item.start);
                              const termino = new Date(item.end);

                              const nombreEmpresa = item.orden ? item.razon : 'Bloqueo';
                              const flagEvent = item.orden ? true : false;
                              const acciones = item.orden ? [
                                                              {
                                                                label: '<i class="fas fa-fw fa-trash-alt text-danger"></i>',
                                                                onClick: ({ event }: { event: CalendarEvent }): void => {
                                                                  this.events = this.events.filter((iEvent) => iEvent !== event);
                                                                  // console.log('Event deleted', event);
                                                                  this.deleteEvent(event); // metodo para eliminar evento en BD

                                                                },
                                                              },
                                                            ] : [];

                              // validacion para almacenar solo eventos validos
                              if (flagEvent || item.estado === 'Bloqueo') {

                                // Eventos de Referencia
                              this.eventoArray_init.push({
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
                                  },
                                  actions: acciones,
                                },

                              ];

                              }

                            }
                            // console.log(this.events);
                            // console.log(this.eventoArray_init);

                          }else {
                            // cuando no vienen datos en la respuesta
                           this.events = []; // limpia los eventos del calendario
                           this.eventoArray_init = [];
                          }



  }


}

// limpiar el Input del Buscador
clearInput() {

  this.inputTxt.nativeElement.value = '';

}

// =====================================================================
// Metodo usado para buscar el nombre del especialista en el evento
// =====================================================================
// Compara el Array con los datos del Filter
filterPlainArray(array: any, filters: any) {

  // console.log('Filter: ', filters);

  const filterKeys = Object.keys(filters); // identifica los key

  return array.filter(eachObj => { // filter

    return filterKeys.every(eachKey => {

      // regex del valor de entrada Input
      var regex = new RegExp(filters[eachKey], 'i');

      // console.log(eachObj.nombre.match(regex));

      if (!filters[eachKey].length) {
        return true; // passing an empty filter means that filter is ignored.
      }

      return eachObj.nombre.match(regex); // devuelve el arreglo cuando coincide el regex

      // return filters[eachKey].includes(eachObj[eachKey]); // **original
    });
  });
}




// -----------------------------------------------------------------------
// Metodo para resetear los eventos BTN Programaci??n Sin Gesti??n / Reset
// -----------------------------------------------------------------------
resetProgramacion(termino: string) {

 this.flagBtnReset = !this.flagBtnReset? true : false;

 if(termino === 'SinGestion') {
  this.cargarEventosSinGestion();
  return
 }

 this.cargarEventosInit(); // carga todos los eventos Iniciales

}

//  metodo para cargar todos los eventos que estan sin gestion (evento.activo = 1) eventos nuevos
cargarEventosSinGestion() {

  this.events = [];
  this.eventoArray_init = [];


  if (this.eventoArray_all.length > 0) {

                          for (const item of this.eventoArray_all) {

                            // console.log(item);

                            const inicio = new Date(item.start);
                            const termino = new Date(item.end);

                            const nombreEmpresa = item.orden ? item.razon : 'Bloqueo';
                            const flagEvent = item.orden ? true : false;
                            const acciones = item.orden ? [
                                                            {
                                                              label: '<i class="fas fa-fw fa-trash-alt text-danger"></i>',
                                                              onClick: ({ event }: { event: CalendarEvent }): void => {
                                                                this.events = this.events.filter((iEvent) => iEvent !== event);
                                                                // console.log('Event deleted', event);
                                                                this.deleteEvent(event); // metodo para eliminar evento en BD

                                                              },
                                                            },
                                                          ] : [];

                            // validacion para almacenar solo eventos validos
                            if ((flagEvent || item.estado === 'Bloqueo') && item.activo === '1') { // evento.activo = 1 nuevo, = 0 con gestion, = X evento de Orden Pre-Facturada

                              // Eventos de Referencia
                            this.eventoArray_init.push({
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
                                },
                                actions: acciones,
                              },

                            ];

                            }

                          }
                          // console.log(this.events);
                          // console.log(this.eventoArray_init);

               }


                      this.refresh.next();




}


// ==========================================================================
// Metodo para la gestion de la variable que almacena todos los Eventos BD
// ==========================================================================
cargarEventosByArray() {

  // console.log(this.eventoArray_all);

  this.events = [];
  this.eventoArray_init = [];

  if (this.eventoArray_all.length > 0) {

            for (const item of this.eventoArray_all) {

                      // console.log(item);

                      const inicio = new Date(item.start);
                      const termino = new Date(item.end);

                      const nombreEmpresa = item.orden ? item.razon : 'Bloqueo';
                      const flagEvent = item.orden ? true : false;
                      const identOrden = item.cronograma ? `(${item.cronograma} SEC ${item.secuencia})`  : ''; // muestra el cronograma - secuencia
                      const acciones = item.orden ? [
                                                      {
                                                        label: '<i class="fas fa-fw fa-trash-alt text-danger"></i>',
                                                        onClick: ({ event }: { event: CalendarEvent }): void => {
                                                          this.events = this.events.filter((iEvent) => iEvent !== event);
                                                          // console.log('Event deleted', event);
                                                          this.deleteEvent(event); // metodo para eliminar evento en BD

                                                        },
                                                      },
                                                    ] : [];

                      // validacion para almacenar solo eventos validos
                      if ((flagEvent || item.estado === 'Bloqueo') && item.activo !== 'X') { // evento.activo = 1 nuevo, = 0 con gestion, = X evento de Orden Pre-Facturada

                        // Eventos de Referencia
                      this.eventoArray_init.push({
                        title: `${item.title.toString()} <small class="text-warning">${identOrden} ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
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
                          title: `${item.title.toString()} <small class="text-warning">${identOrden} ${nombreEmpresa} ${item.hora_inicio.toString()} / ${item.hora_termino.toString()}</small>`,
                          start: inicio,
                          end: termino,
                          color: {primary: item.color, secondary: item.color},
                          draggable: flagEvent,
                          resizable: {
                            beforeStart: flagEvent,
                            afterEnd: flagEvent,
                          },
                          actions: acciones,
                        },

                      ];

              }

            }
            // console.log(this.events);
            // console.log(this.eventoArray_init);

}


this.refresh.next();




}



} // END class

