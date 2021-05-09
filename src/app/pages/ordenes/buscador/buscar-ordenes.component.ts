import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { OrdenService } from 'src/app/services/orden/orden.service';
import { Orden } from 'src/app/models/orden.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-ordenes',
  templateUrl: './buscar-ordenes.component.html',
  styles: [
  ]
})
export class BuscarOrdenesComponent implements OnInit {

   // Elementos
   @ViewChild('input') inputTxt: ElementRef<any>;

  // variables
  ordenes: Orden[] = [];
  hide: string = 'hide';
  flag: boolean = false;
  message: string = '';
  pagina: number = 0;
  totalRegistros: number = 0;




  constructor(@Inject(DOCUMENT) private document: Document,
              public ordenService: OrdenService) { }

  ngOnInit(): void {

    this.cargarOrdenes();


  }

  // Metodo para cargar las ordenes
  cargarOrdenes() {

    this.ordenes = [];

    this.ordenService.obtenerOrdenes( this.pagina )
                      .subscribe((resp: any) => {

                        if (resp.total === 0) {
                          this.message = resp.message;
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




   // Metodo para buscar una Orden
   buscarOrden( termino: string ) {

    this.flag = false;

    if (termino.length === 1 && termino === ' ') {
      return;
    }

    if (termino.length <= 0) {
      this.cargarOrdenes();
      return;

    }

    if (termino.length >= 1) {

        // metodo para buscar ordenes por Razon - Cronograma - secuencia - observacion - descripcion - ciudad
        this.ordenService.buscarOrdenesByChart(termino)
                         .subscribe((resp: any) => {
                           // console.log(resp);
                           if (resp.length === 0) {
                              this.ordenes = resp;
                              this.message = 'No hay Registros';
                              this.flag = false;
                          }

                           if (resp.length > 0){
                             this.totalRegistros = resp.length;
                             this.ordenes = resp;
                             this.flag = true;
                             this.message = '';
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


  }




// limpiar el Input del Buscador
clearInput() {

  this.inputTxt.nativeElement.value = '';

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


  // ======================Metodos para ver y ocultar los detalles=================================

// metodo para ver los detalles de la Orden
  verDetalles(i: number) {

    // console.log(i);


    if (i === 0) {
      const selectores: any = this.document.getElementById('0');
      selectores.classList.remove('hide');
      // selectores.classList.add('show');
      // console.log(selectores);
    }
    if (i === 1) {
      const selectores: any = this.document.getElementById('1');
      selectores.classList.remove('hide');

    }
    if (i === 2) {
      const selectores: any = this.document.getElementById('2');
      selectores.classList.remove('hide');

    }
    if (i === 3) {
      const selectores: any = this.document.getElementById('3');
      selectores.classList.remove('hide');

    }
    if (i === 4) {
      const selectores: any = this.document.getElementById('4');
      selectores.classList.remove('hide');

    }
    if (i === 5) {
      const selectores: any = this.document.getElementById('5');
      selectores.classList.remove('hide');

    }
    if (i === 6) {
      const selectores: any = this.document.getElementById('6');
      selectores.classList.remove('hide');

    }
    if (i === 7) {
      const selectores: any = this.document.getElementById('7');
      selectores.classList.remove('hide');

    }
    if (i === 8) {
      const selectores: any = this.document.getElementById('8');
      selectores.classList.remove('hide');

    }
    if (i === 9) {
      const selectores: any = this.document.getElementById('9');
      selectores.classList.remove('hide');

    }


  }


  // Metodo para ocultar los detalles
  ocultarDetalles(i: number) {

    if (i === 0) {
      const selectores: any = this.document.getElementById('0');
      selectores.classList.add('hide');
      // console.log(selectores);
    }
    if (i === 1) {
      const selectores: any = this.document.getElementById('1');
      selectores.classList.add('hide');

    }
    if (i === 2) {
      const selectores: any = this.document.getElementById('2');
      selectores.classList.add('hide');

    }
    if (i === 3) {
      const selectores: any = this.document.getElementById('3');
      selectores.classList.add('hide');

    }
    if (i === 4) {
      const selectores: any = this.document.getElementById('4');
      selectores.classList.add('hide');

    }
    if (i === 5) {
      const selectores: any = this.document.getElementById('5');
      selectores.classList.add('hide');

    }
    if (i === 6) {
      const selectores: any = this.document.getElementById('6');
      selectores.classList.add('hide');

    }
    if (i === 7) {
      const selectores: any = this.document.getElementById('7');
      selectores.classList.add('hide');

    }
    if (i === 8) {
      const selectores: any = this.document.getElementById('8');
      selectores.classList.add('hide');

    }
    if (i === 9) {
      const selectores: any = this.document.getElementById('9');
      selectores.classList.add('hide');

    }


  }




}// END class
