import { Component, OnInit, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { OrdenService } from 'src/app/services/orden/orden.service';
import { Orden } from 'src/app/models/orden.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-canceladas-ordenes',
  templateUrl: './canceladas-ordenes.component.html',
  styles: [
  ]
})
export class CanceladasOrdenesComponent implements OnInit {

  // variables
  ordenes: Orden[] = [];
  hide: string = 'hide';
  flag: boolean = false;
  message: string = 'Cargando Base de Datos';
  pagina: number = 0;
  totalRegistros: number = 0;




  constructor( public ordenService: OrdenService,
               @Inject(DOCUMENT) private document: Document) { }

ngOnInit(): void {

this.cargarOrdenes();



}



  // Metodo para cargar las ordenes NUEVAS
  cargarOrdenes() {

   this.ordenService.obtenerOrdenesConsulta( this.pagina, 'canceladas')
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


 // =====================Metodos para cambiar la Pagina===========================================
// Metodo para cambiar la paginacion
cambiarPagina( valor: number) {

// console.log(valor);




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




} // END class
