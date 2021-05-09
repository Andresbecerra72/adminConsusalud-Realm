import { Component, OnInit, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { Orden } from 'src/app/models/orden.model';
import { Empresa } from '../../../models/empresa.model';

import { OrdenService } from 'src/app/services/orden/orden.service';
import { TarifaService } from 'src/app/services/tarifa/tarifa.service';
import { EmpresaService } from 'src/app/services/dashboard/empresa.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevas-ordenes',
  templateUrl: './nuevas-ordenes.component.html',
  styles: [
  ]
})
export class NuevasOrdenesComponent implements OnInit {


  // variables
  ordenes: Orden[] = [];
  orden: Orden;
  hide: string = 'hide';
  flag: boolean = false;
  message: string = 'Cargando Base de Datos';
  pagina: number = 0;
  totalRegistros: number = 0;
  total: number = 0;


  costo: number = 0;
  tarifaValor: number[] = [];


  constructor( public ordenService: OrdenService,
               public tarifaService: TarifaService,
               public empresaService: EmpresaService,
               @Inject(DOCUMENT) private document: Document) { }

ngOnInit(): void {

this.cargarOrdenes();



}



  // Metodo para cargar las ordenes NUEVAS
  cargarOrdenes() {

   this.ordenService.obtenerOrdenesConsulta( this.pagina, 'nuevas')
                      .subscribe((resp: any) => {
                        if (!resp.orden) {
                          this.message = resp.message;
                          this.flag = false;
                        }
                        if (resp.orden){
                          this.totalRegistros = resp.total;
                          this.ordenes = resp.orden;
                          this.flag = true;
                          // console.log(resp);
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

   // =====================Metodos para Calcular la TARIFA===========================================
// Metodo para Calcular la Tarifa
// Hijo : TABLE-ORDEN
calcularTarifa(event: any[]) {


  this.total = 0; // referencia Tarifa

  const cantidad = Number(event[1]);

  this.orden = event[3];  // por el Array viene la orden
  this.orden.obs_internas = null;
  this.orden.anotaciones = null;
  this.orden.sedes = null;
  this.orden.especialistas = null;
  this.orden.soportes = null;
  this.orden.eventos = null;
  this.orden.archivos = null;
  this.orden.horas_programadas = null;



  this.tarifaService.obtenerTarifaCosto(event[0])
                    .subscribe((resp: any) => {

                        if (resp) {

                          const currency = resp;
                          // tslint:disable-next-line: quotemark
                          this.costo = Number(currency.replace(/[^0-9\.]+/g, ""));
                          this.total = this.costo * cantidad;
                          this.tarifaValor[event[2]] = this.total;


                          this.orden.valor_total = this.total.toString(); // registra el valor Total de la Orden

                          this.ordenService.actualizarOrden(this.orden)
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


// =====================Metodos para CAMBIAR ESTADO===========================================
// Metodo para cambiar Estado de la Orden
validarOrden(event: Orden) {

  this.orden = event;

  this.orden.estado = 'Pendiente Programar';
  this.orden.obs_internas = null;
  this.orden.anotaciones = null;
  this.orden.sedes = null;
  this.orden.especialistas = null;
  this.orden.soportes = null;
  this.orden.eventos = null;
  this.orden.archivos = null;
  this.orden.horas_programadas = null;


  // codigo para registrar la Empresa en la Orden
  this.empresaService.obtenerEmpresaByName(this.orden.razon.toString())
                    .subscribe((resp: any) => {
                      // console.log(resp);

                      this.orden.empresa = resp.empresa; // Asigna la empresa

                      this.ordenService.actualizarOrden(this.orden)
                                        .subscribe((resOrden: any) => {

                                          // console.log(resOrden);


                                          Swal.fire({
                                            title: 'Orden Actualizada',
                                            text: resOrden.cronograma,
                                            icon: 'success',
                                            confirmButtonText: 'Cerrar',
                                            scrollbarPadding: false,
                                            allowOutsideClick: false
                                          });

                                          if (resOrden) {
                                            this.cargarOrdenes();
                                            this.tarifaValor = [];
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




   // =====================Metodos para cambiar la Pagina===========================================
// Metodo para cambiar la paginacion
cambiarPagina( valor: number) {

  // console.log(valor);

  this.tarifaValor = [];


  const pagina = this.pagina + valor;

  if ( pagina >= this.totalRegistros ) {
    return;
  }

  if ( pagina < 0 ) {
    return;
  }

  // codigo si las validaciones estan correctas
  this.pagina += valor;
  this.cargarOrdenes();

}





}// END class
