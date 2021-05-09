import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

import { EventosService } from 'src/app/services/eventos/eventos.service';
import { OrdenService } from 'src/app/services/orden/orden.service';

import { Orden } from 'src/app/models/orden.model';
import { Evento } from 'src/app/models/evento.model';

@Component({
  selector: 'app-acta',
  templateUrl: './acta.component.html',
  styles: [
  ]
})
export class ActaComponent implements OnInit {


  // variables
  regresar: string;
  evento: Evento;
  orden: Orden;

  report: any;

  flagAlert: boolean = false;



  // -------------------------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              public route: ActivatedRoute,
              public eventosService: EventosService,
              public ordenesService: OrdenService) { }

  ngOnInit(): void {

    this.rutaParametros(); // carga los parametros desde el URL

  }

  // ---------------metodos----------------------------
  rutaParametros() {


  this.route.params.subscribe(parametros => {
    // console.log(parametros);

    if (!parametros.page) {
      return;
    }

    if (parametros.page) {
      this.regresar = parametros.page;
    }

    if (parametros.id) {

      this.eventosService.obtenerEventoById(parametros.id.toString())
                            .subscribe((resp: any) => {

                              // console.log(resp);
                              if (resp.evento) {

                                 this.evento = resp.evento;
                                 this.orden = resp.evento.orden;
                                 this.flagAlert = false;

                              }
                              if (!resp.evento) {

                                this.flagAlert = true;

                              }

                              // se asignana los valores del ACTA
                              this.report = {
                                          fecha: this.evento.fecha,
                                          tipo_servicio: this.orden.tipo_servicio,
                                          cronograma: this.evento.cronograma,
                                          secuencia: this.evento.secuencia,
                                          razon: this.evento.razon,
                                          direccion: this.evento.direccion.toUpperCase(),
                                          nit: this.orden.nit,
                                          num_pol: this.orden.num_pol,
                                          correo: this.evento.correo,
                                          nombre_asesor: this.orden.nombre_asesor,
                                          nombre: this.evento.nombre.toUpperCase(),
                                          especialidad: this.evento.especialidad,
                                          descripcion: this.orden.descripcion.toUpperCase(),
                                          actividad: this.evento.actividad.toUpperCase()
                                        };




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

// ---------------------------------------------
  //     Metodo para Obtener el Archivo de PDF
  // ---------------------------------------------
  getPDF() {

    const content = this.document.getElementById('report_format');

    const doc = new jsPDF('p', 'pt', 'A3', true);
    // const doc = new jsPDF({
    //   orientation: 'p',
    //    unit: 'mm',
    //    format: [420, 594],
    //    compress: true
    //  });


    doc.html(content, {
      callback:  (archivo) => {
        archivo.save('Acta Bolivar');
      },
      margin: [0, 0, 0, 0],
      x: 0,
      y: 0
   });


  }

} // END class
