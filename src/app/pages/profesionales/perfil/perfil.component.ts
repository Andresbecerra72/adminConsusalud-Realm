import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { OrdenService } from 'src/app/services/orden/orden.service';

import { Especialista } from 'src/app/models/especialista.model';
import { Orden } from 'src/app/models/orden.model';
import { Evento } from 'src/app/models/evento.model';
import { Usuario } from 'src/app/models/usuario.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  // variables
  forma: FormGroup;
  usuario: Usuario;
  especialista: Especialista;
  orden: Orden;
  evento: Evento;

  bloqueosArray: Evento[] = [];
  eventosArray: Evento[] = [];
  eventosArrayTemp: Evento[] = [];
  ordenesArray: Orden[] = [];

  stars: string;
  anotacionesCard: boolean = false;
  programacionCard: boolean = false;
  regresar: string;

 // ERROR: string = '';

  listaCalificacion = [
    'Seleccionar Calificación',
    'Excelente',
    'Bueno',
    'Aceptable',
    'Regular',
    'No Recomendado'
  ];


  // ------------------------ Constructor ----------------------------------------

  constructor(@Inject(DOCUMENT) private document: Document,
              private fb: FormBuilder,
              public especialistaService: EspecialistaService,
              public ordenService: OrdenService,
              public route: ActivatedRoute) {

                this.rutaParametros();

                this.crearFormulario(); // llama el metodo para crear el formulario

               }

  ngOnInit(): void {
  }



// ------------------------------------------------------------------
// metodo para obtener la informacion desde la URL
rutaParametros() {

  this.route.params.subscribe(parametros => {
    // console.log(parametros);
    this.regresar = parametros.page;

    if (parametros.id) {
      this.especialistaService.obtenerEspecialistaByID(parametros.id.toString())
                              .subscribe((resp: any) => {

                                // console.log(resp);

                                const eventosArreglo = []; // Referencia - Arreglo de eventos

                                if (resp.especialista) {
                                      this.especialista = resp.especialista;
                                      this.stars = this.especialista.calificacion;
                                      if (resp.especialista.anotaciones.length > 0){
                                        this.anotacionesCard = true;
                                      }
                                      // Eventos del Especialistas
                                      if (resp.especialista.eventos.length > 0 ){
                                        this.programacionCard = true;

                                        for (const item of resp.especialista.eventos ) {

                                          if (item.estado === 'Bloqueo') {
                                            this.bloqueosArray.push(item);
                                          }
                                          if (item.estado !== 'Bloqueo') {
                                            eventosArreglo.push(item);
                                          }

                                        }
                                      }

                                      // Ordenes del Especilista - condicion para almacenar solo eventos con Ordenes Validas en BD
                                      if (resp.especialista.ordenes.length > 0 && eventosArreglo.length > 0 ){

                                        let i = 0;

                                        for ( const item of resp.especialista.ordenes ) {

                                            this.ordenesArray.push(item); // Asigna las ordenes del Especialista

                                            // Encuentra los eventos con Ordenes Validas

                                            if ( eventosArreglo[i].orden === item._id ) {
                                                this.eventosArrayTemp.push(eventosArreglo[i]); // se asigna temporalmente
                                              }

                                            i += 1;

                                          }

                                      }

                                       // codigo para ordenar los eventos por fecha reciente
                                      this.eventosArray = this.eventosArrayTemp.sort((a, b) => {
                                          const dateA = Date.parse(a.start.toString());
                                          const dateB = Date.parse(b.start.toString());
                                          return dateA - dateB;
                                      });


                                      // console.log(eventosArreglo);

                                     // console.log(this.bloqueosArray);
                                     // console.log(this.eventosArray);

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
// -------------------------------------------------------------------------
  // metodo para cargar el especialista
  cargarEspecialista() {

    this.route.params.subscribe(parametros => {
      // console.log(parametros);

      if (parametros.id) {
        this.especialistaService.obtenerEspecialistaByID(parametros.id.toString())
                                .subscribe((resp: any) => {

                                  // console.log(resp);
                                  if (resp.especialista) {
                                    this.especialista = resp.especialista;
                                    this.stars = this.especialista.calificacion;
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


// *******Metodo para transformar el Object en un Arreglo ***********
crearArray( anotacionesObj: object) {

  const anotaciones: any[] = [];

  if ( anotacionesObj === null ) { return []; } // condicion si el objeto recibido no tiene informacion

  Object.keys( anotacionesObj ).forEach( key => {

                  // en este punto solo se tienen los datos de cada objeto sin las claves
                  const anotacion = anotacionesObj[key];
                  anotaciones.push(anotacion);

  });

  return anotaciones;
}


// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    anotaciones: '',
    selectCalificacion: this.listaCalificacion[0]
    });

}


  enviarData() {

    this.orden = null; // reset de los detalles de la programacion

    if (this.forma.controls.selectCalificacion.value !== 'Seleccionar Calificación') {
      // console.log(this.forma.controls.selectCalificacion.value);
      this.especialista.calificacion = this.forma.controls.selectCalificacion.value;
      this.forma.controls.selectCalificacion.setValue(this.listaCalificacion[0]);
    }

    this.especialista.anotaciones = null; // reset de las anotaciones

    if (this.forma.controls.anotaciones.value) {
      // console.log(this.forma.controls.anotaciones.value);
      const obs = this.forma.controls.anotaciones.value;
      this.forma.controls.anotaciones.reset();

      const fechaActual = new Date();
      this.usuario = JSON.parse(localStorage.getItem('usuario'));

      this.especialista.anotaciones = {fecha: fechaActual, reporte: obs, usuario: this.usuario.nombre.toString() } ;

      this.anotacionesCard = true;
    }

    this.especialista.horas_asignadas = null;
    this.especialista.profesiones = null;
    this.especialista.ordenes = null;
    this.especialista.soportes = null;
    this.especialista.eventos = null;

    // console.log(this.especialista);

    this.especialistaService.actualizarEspecialista(this.especialista)
                            .subscribe((resp: any) => {

                              // console.log(resp);
                              this.cargarEspecialista();
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


  // -------------------------------------------------------------------
  viewDetails(item: any, i: string) {

    this.evento = item;
   // this.ERROR = null;
    this.orden = null;

    const selector: any = this.document.getElementsByClassName('list-group-item'); // selecciona la clase del elemento HTML

    for (const ref of selector){ // recorre la lista de clases en el elemento HTML
      ref.classList.remove('list-group-item-info'); // remueve la calse
    }

    const itemList: any = this.document.getElementById(i);
    itemList.classList.add('list-group-item-info');

    // Asigna la Informacion de la Orden
    this.orden = this.ordenesArray.find(element => element._id.toString() === item.orden.toString());

    // Codigo para Obtener la orden con los daots del evento *** CODIGO NO USADOS ****
    // this.ordenService.obtenerOrdenByID(item.orden.toString())
    //                   .subscribe(resp => {
    //                    // console.log(resp);

    //                    if (resp) {
    //                      this.orden = resp;
    //                    }

    //                   }, err => {
    //                     // console.log(err.error);
    //                     this.ERROR = err.error.errors.message;

    //                   });



  }

} // END class
