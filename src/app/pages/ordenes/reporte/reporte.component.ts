import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

import { OrdenService } from 'src/app/services/orden/orden.service';

import { Orden } from 'src/app/models/orden.model';
import { Evento } from 'src/app/models/evento.model';



@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html'
})
export class ReporteComponent implements OnInit {


  // variables
  forma: FormGroup;
  orden: Orden;
  evento: Evento;
  report: any;
  ordenesArray: Orden[] = [];
  eventosArray: Evento[] = [];

  flag: boolean = false;

  listaSelectOrden = [];
  listaSelectEvento = [];

  // ---------------------------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              private fb: FormBuilder,
              public ordenService: OrdenService) {

                this.crearFormulario(); // llama el metodo para crear el formulario

              }

  ngOnInit(): void {

    this.cargarOrdenes(); // llama el metodo para cargar las ordes

  }



// ----------metodos-----------------------------------
// metodo para cargar todas las Ordenes
cargarOrdenes() {


  this.ordenService.obtenerOrdenesTodas()
  .subscribe( (resp: any) => {

      // console.log(resp);

          // codigo para Ordenes pendiente programar
       if (resp.total > 0) {

                 for (const item of resp.orden ) {

                   if (item.estado === 'Pendiente Programar' && item.activo !== '0' && item.horas_programadas > 0) {
                     this.ordenesArray.push(item); // Array de Ordenes Pendiente Programar
                     this.listaSelectOrden.push({
                      cronograma: item.cronograma,
                      secuencia: item.secuencia,
                      razon: item.razon,
                       _id: item._id
                     });
                   }

                 }

             }
       if (resp.total === 0) {
              this.listaSelectOrden.push({nombre: resp.message, _id: 'Default'});
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



  // ------------------------------------------------------------------
  //     Metodo para Obtener la informacion de las Orden
  // -----------------------------------------------------------------
  getOrden() {

     // codigo para validar los datos de los Selects
     Object.values( this.forma.controls ).forEach( control => {
      if (control.value._id  === 'Default') {
        return control.setErrors({invalid: true});
      }
    });

     if (this.forma.invalid) { // condicion para saber si el formulario es valido
      // codigo para obtener los controles Input del formulario
      return  Object.values( this.forma.controls ).forEach( control => {
        control.markAsTouched(); // marca el input como tocado por el usuario
      });
    }


    // si todo OK


     // Filtra ordenes
     const foundEventoID: any = this.eventosArray.find(element => element._id === this.forma.controls.selectEvento.value._id);
     this.evento = foundEventoID;

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

     // console.log(foundEventoID);

     this.flag = false;
     this.crearFormulario();


    }




  // ------------------------------------------------------------------
  //     Metodo para Obtener la informacion del Evento
  // -----------------------------------------------------------------
  getEvento() {

     // codigo para validar los datos de los Selects
    Object.values( this.forma.controls ).forEach( control => {
      if (control.value._id  === 'Default') {
        return control.setErrors({invalid: true});
      }
    });

    this.flag = true;

     // codigo si todo OK

    this.listaSelectEvento = [];
    this.eventosArray = [];

     // Filtra ordenes
    const foundOrdenID: any = this.ordenesArray.find(element => element._id === this.forma.controls.selectOrden.value._id);
    this.orden = foundOrdenID;

    for (const item of foundOrdenID.eventos ) {

        this.eventosArray.push(item);
        this.listaSelectEvento.push({
         fecha: item.fecha,
         nombre: item.nombre,
          _id: item._id
        });
      }

    // console.log(foundOrdenID);


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






  // ------------------------------- FORMULARIO ---------------------------------------------------------

    // ----------------------
 // metodos para hacer las validaciones del Input Sincronas

get ordenNoValido() {
  return this.forma.get('selectOrden').invalid && this.forma.get('selectOrden').touched;
}
get eventoNoValido() {
  return this.forma.get('selectEvento').invalid && this.forma.get('selectEvento').touched;
}



// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
      // es importante asociar los controles Input
      selectOrden: ['', Validators.required],
      selectEvento: ['', Validators.required]

      });

}



}// END class
