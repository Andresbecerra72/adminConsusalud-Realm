import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { OrdenService } from 'src/app/services/orden/orden.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Evento } from 'src/app/models/evento.model';
import { Orden } from 'src/app/models/orden.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styles: [
  ]
})
export class HistorialComponent implements OnInit {

  // variables
  usuario: Usuario;
  especialista: Especialista;
  evento: Evento;
  orden: Orden;

  // ERROR: string = '';

  bloqueosArray: Evento[] = [];
  eventosArray: Evento[] = [];
  ordenesArray: Orden[] = [];

  programacionCard: boolean = false;


  // -----------------------------Constructor-----------------------------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              public usuarioService: UsuarioService ,
              public especialistaService: EspecialistaService,
              public ordenService: OrdenService) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;

    this.cargarEspecialista(this.usuario);
  }


  // -------------------------------------------------------------------------
  // metodo para cargar el especialista
  cargarEspecialista(usuario: Usuario) {


        this.especialistaService.obtenerEspecialistaByID(usuario.especialista.toString())
                                .subscribe((resp: any) => {

                                  // console.log(resp);


                                  const eventosArreglo = []; // Referencia - Arreglo de eventos

                                  if (resp.especialista) {
                                    this.especialista = resp.especialista;

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

                                      for (const item of resp.especialista.ordenes ) {

                                        this.ordenesArray.push(item); // Asigna las ordenes del Especialista

                                        if ( eventosArreglo[i].orden === item._id ) {
                                          this.eventosArray.push(eventosArreglo[i]);
                                        }

                                        i += 1;

                                        // Encuentra los eventos con Ordenes Validas
                                        // const foundID = eventosArreglo.find(element => element.orden === item._id);
                                        // if (foundID) {
                                        //   this.eventosArray.push(foundID);
                                        // }

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


    // Codigo para Obtener la orden con los daots del evento *** CODIGO NO USADO ***
    // this.ordenService.obtenerOrdenByID(item.orden.toString())
    //                   .subscribe(resp => {
    //                     // console.log(resp);
    //                     if (resp) {
    //                       this.orden = resp;
    //                     }

    //                   }, err => {
    //                     // console.log(err.error);
    //                     this.ERROR = err.error.errors.message;

    //                   });



  }


} // END class
