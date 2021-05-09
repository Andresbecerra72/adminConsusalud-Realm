import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { OrdenService } from 'src/app/services/orden/orden.service';

import { Orden } from 'src/app/models/orden.model';

@Component({
  selector: 'app-gestor-orden',
  templateUrl: './gestor-orden.component.html',
  styles: [
  ]
})
export class GestorOrdenComponent implements OnInit {

  // variables
  regresar: string;
  orden: Orden;

  // ----------------constructor-------------------------------------
  constructor(public route: ActivatedRoute,
              public ordenService: OrdenService) { }

  ngOnInit(): void {
    this.rutaParametros();
  }

  // --------------------Metodos---------------------------------
// metodo para obtener la informacion desde la URL
rutaParametros() {


  this.route.params.subscribe(parametros => {
    // console.log(parametros);
    this.regresar = parametros.page;

    if (parametros.id) {

      this.ordenService.obtenerOrdenByID(parametros.id.toString())
                          .subscribe((resp: Orden) => {

                          // console.log(resp);

                           if (resp) {

                            this.orden = resp;

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


// ---------------------------------
// Este metodo recibe los datos del form-orden component
editarOrden(event: FormGroup) {

// console.log('Event: ', event);

const razon = event.value.empresa;
const actividad = event.value.actividad; // actividad
const asesor = event.value.nombre_asesor;

this.orden.obs_internas = null;
this.orden.anotaciones = null;
this.orden.horas_programadas = null;
this.orden.sedes = null;
this.orden.especialistas = null;
this.orden.soportes = null;
this.orden.eventos = null;
this.orden.archivos = null;

this.orden.nit = event.value.nit;
this.orden.razon = razon.toUpperCase();
this.orden.cronograma = event.value.cronograma;
this.orden.secuencia = event.value.secuencia;
this.orden.actividad_programa = event.value.selectTarifa.codigo; // Codigo Tarifa
this.orden.unidad = event.value.selectUnidad;
this.orden.descripcion = actividad.toUpperCase();
this.orden.act_programadas = event.value.act_programadas;
this.orden.act_ejecutadas = event.value.act_ejecutadas;
this.orden.act_reprogramadas = event.value.act_reprogramadas;
this.orden.act_canceladas = event.value.act_canceladas;
this.orden.tipo_servicio = event.value.selectTipo.index;
this.orden.fecha_programada = event.value.fecha;
this.orden.valor_transporte = event.value.valor_transporte;
this.orden.valor_alojamiento = event.value.valor_alojamiento;
this.orden.valor_alimentacion = event.value.valor_alimentacion;
this.orden.valor_tiempo_muerto = event.value.valor_tiempo_muerto;
this.orden.valor_material_complementario = event.value.valor_material_complementario;
this.orden.nombre_asesor = asesor.toUpperCase();
this.orden.observaciones = event.value.observaciones;
this.orden.num_pol = event.value.num_pol;
this.orden.ubicacion_actividad = event.value.direccion;
this.orden.horas_ejecutadas = event.value.horas_ejecutadas;
this.orden.horas_actividad = event.value.horas_actividad;
this.orden.tiempo_informe = event.value.tiempo_informe;
this.orden.tiempo_administrativo = event.value.tiempo_administrativo;
this.orden.valida = event.value.valida;
this.orden.valor_total = event.value.valor_total;
this.orden.estado = event.value.selectEstados;
this.orden.activo = event.value.activo;


this.ordenService.actualizarOrden(this.orden)
                  .subscribe((resp: Orden) => {

                    // console.log(resp);

                     if (resp) {

                      this.orden = resp;

                     }

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






} // END class
