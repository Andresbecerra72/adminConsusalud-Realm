import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { OrdenService } from 'src/app/services/orden/orden.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Orden } from 'src/app/models/orden.model';

@Component({
  selector: 'app-unir-ordenes',
  templateUrl: './unir-ordenes.component.html',
  styles: [
  ]
})
export class UnirOrdenesComponent implements OnInit {


  // variables
  forma: FormGroup;
  orden: Orden;

  listaSelectOrdenOriginal: Orden[] = [];
  listaselectOrdenManual: Orden[] = [];

  flag: boolean = false;


    // ---------constructor----------------------------------
    constructor(private fb: FormBuilder,
      public usuarioService: UsuarioService,
      public ordenService: OrdenService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarOrdenesTodas();
  }

   // ---------metodos----------------------------------


  // validaciones del Formulario de Programacion
  get ordenOriginalNoValido() {
    return this.forma.get('selectOrdenOriginal').invalid && this.forma.get('selectOrdenOriginal').touched;
  }
  get ordenManualNoValido() {
    return this.forma.get('selectOrdenManual').invalid && this.forma.get('selectOrdenManual').touched;
  }

// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    selectOrdenOriginal: ['', Validators.required],
    selectOrdenManual: ['', Validators.required]

    });


  }


  // ----------------------------------------------------
// metodo para obtener todas las Ordens
// ----------------------------------------------------
cargarOrdenesTodas() {

  this.ordenService.obtenerOrdenesTodas()
                      .subscribe((resp: any) => {
                        // console.log(resp);

                        if (resp.total > 0) {

                          for (const item of resp.orden) {

                            if (item.activo !== 'x' && item.estado !== 'Archivo') { // solo ordenes Activas

                                 if (item.nombre_asesor !== 'Orden Manual') {

                                    this.listaSelectOrdenOriginal.push(item);
                                      }

                                 if (item.nombre_asesor === 'Orden Manual') {

                                    this.listaselectOrdenManual.push(item);

                                   }

                              }

                            }

                            this.flag = true;

                         }

                        if (resp.total === 0) {

                          this.flag = false;

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


  // metodo para obtener la orden Original
  async unirOrdenes() {

    if (this.forma.invalid) { // condicion si el formulario es Invalido
      return;
   }


   // si todo OK

   this.orden = this.forma.controls.selectOrdenOriginal.value; // asigna la Orden Original

  //  this.orden.obs_internas = null;
  //  this.orden.anotaciones = null;
  //  this.orden.sedes = null;
  //  this.orden.especialistas = null;
  //  this.orden.soportes = null;
  //  this.orden.eventos = null;
  //  this.orden.archivos = null;
  //  this.orden.horas_programadas = null;


   // datos de la Orden Manual
   const countEspecialistas = this.forma.controls.selectOrdenManual.value.especialistas;
   const countEventos = this.forma.controls.selectOrdenManual.value.eventos;
   const countSoportes = this.forma.controls.selectOrdenManual.value.soportes;
   const countArchivos = this.forma.controls.selectOrdenManual.value.archivos;
   // horas
   const counthoras_programadas = this.forma.controls.selectOrdenManual.value.horas_programadas;
   const counthoras_ejecutadas = this.forma.controls.selectOrdenManual.value.horas_ejecutadas;
   const counthoras_actividad = this.forma.controls.selectOrdenManual.value.horas_actividad;
   const counttiempo_informe = this.forma.controls.selectOrdenManual.value.tiempo_informe;
   const counttiempo_administrativo = this.forma.controls.selectOrdenManual.value.tiempo_administrativo;

   // console.log(this.forma.controls.selectOrdenOriginal.value);
   // console.log(this.forma.controls.selectOrdenManual.value);



    // actualiza los Especialistas
    for (const item of countEspecialistas) {

      console.log(" Especialista: ", item);

       this.orden.obs_internas = null;
       this.orden.anotaciones = null;
       this.orden.sedes = null;
       this.orden.soportes = null;
       this.orden.eventos = null;
       this.orden.archivos = null;
       this.orden.horas_programadas = null;

      this.orden.especialistas = item;
    await this.actualizarOrden(this.orden);

                         }
   // actualiza los Eventos
   for (const item of countEventos) {

      this.orden.obs_internas = null;
      this.orden.anotaciones = null;
      this.orden.sedes = null;
      this.orden.especialistas = null;
      this.orden.soportes = null;
      this.orden.archivos = null;
      this.orden.horas_programadas = null;

    this.orden.eventos = item;
    await this.actualizarOrden(this.orden);

                       }
   // actualiza los Soportes
   for (const item of countSoportes) {

      this.orden.obs_internas = null;
      this.orden.anotaciones = null;
      this.orden.sedes = null;
      this.orden.especialistas = null;
      this.orden.eventos = null;
      this.orden.archivos = null;
      this.orden.horas_programadas = null;

    this.orden.soportes = item;
    await this.actualizarOrden(this.orden);

                       }
   // actualiza los Archivos
   for (const item of countArchivos) {

      this.orden.obs_internas = null;
      this.orden.anotaciones = null;
      this.orden.sedes = null;
      this.orden.especialistas = null;
      this.orden.soportes = null;
      this.orden.eventos = null;
      this.orden.horas_programadas = null;

    this.orden.archivos = item;
    await this.actualizarOrden(this.orden);

                       }


    // Actualizando las HORAS
    if (counthoras_programadas > 0) {

      this.orden.obs_internas = null;
      this.orden.anotaciones = null;
      this.orden.sedes = null;
      this.orden.especialistas = null;
      this.orden.soportes = null;
      this.orden.eventos = null;
      this.orden.archivos = null;
      this.orden.horas_programadas = counthoras_programadas; // las suma en el Backend

      await this.actualizarOrden(this.orden);

    }



    if (counthoras_ejecutadas > 0) {

      this.orden.obs_internas = null;
      this.orden.anotaciones = null;
      this.orden.sedes = null;
      this.orden.especialistas = null;
      this.orden.soportes = null;
      this.orden.eventos = null;
      this.orden.archivos = null;
      this.orden.horas_programadas = null;

      this.orden.horas_ejecutadas = this.orden.horas_ejecutadas + counthoras_ejecutadas;

      await this.actualizarOrden(this.orden);

    }
    if (counthoras_actividad > 0) {

      this.orden.obs_internas = null;
      this.orden.anotaciones = null;
      this.orden.sedes = null;
      this.orden.especialistas = null;
      this.orden.soportes = null;
      this.orden.eventos = null;
      this.orden.archivos = null;
      this.orden.horas_programadas = null;

      this.orden.horas_actividad = this.orden.horas_actividad + counthoras_actividad;

      await this.actualizarOrden(this.orden);

    }
    if (counttiempo_informe > 0) {

      this.orden.obs_internas = null;
      this.orden.anotaciones = null;
      this.orden.sedes = null;
      this.orden.especialistas = null;
      this.orden.soportes = null;
      this.orden.eventos = null;
      this.orden.archivos = null;
      this.orden.horas_programadas = null;

      this.orden.tiempo_informe = this.orden.tiempo_informe + counttiempo_informe;

      await this.actualizarOrden(this.orden);

    }
    if (counttiempo_administrativo > 0) {

      this.orden.obs_internas = null;
      this.orden.anotaciones = null;
      this.orden.sedes = null;
      this.orden.especialistas = null;
      this.orden.soportes = null;
      this.orden.eventos = null;
      this.orden.archivos = null;
      this.orden.horas_programadas = null;

      this.orden.tiempo_administrativo = this.orden.tiempo_administrativo + counttiempo_administrativo;

      await this.actualizarOrden(this.orden);

    }


    // eliminar ordenManual activo = "x"
   this.eliminarOrdenManual(this.forma.controls.selectOrdenManual.value);

  }



  // metodo para actualizar la Orden ORIGINAL
  actualizarOrden(orden: Orden){

    this. ordenService.actualizarOrden(orden)
                      .subscribe( resp => {
                          // console.log(resp);


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


  // metodo para Eliminar la Orden MANUAL
  eliminarOrdenManual(orden: Orden){

    orden.obs_internas = null;
    orden.anotaciones = null;
    orden.sedes = null;
    orden.especialistas = null;
    orden.soportes = null;
    orden.eventos = null;
    orden.archivos = null;
    orden.horas_programadas = null;

    orden.activo = 'x'; // eliminar Orden

    this. ordenService.actualizarOrden(orden)
                      .subscribe( resp => {
                          // console.log(resp);

                          this.flag = false;
                          this.cargarOrdenesTodas();

                          Swal.fire(
                            'Ordenes Unificadas',
                            'No ' + this.orden.cronograma + ' Actualizada correctamente',
                            'success'
                          );


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


/*
 Swal.fire(
            'Orden Actualizada',
            'No ' + this.orden.cronograma + ' Actualizada correctamente',
            'success'
          );

*/
