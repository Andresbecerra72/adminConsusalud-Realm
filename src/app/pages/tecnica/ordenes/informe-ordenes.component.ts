import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

import { OrdenService } from 'src/app/services/orden/orden.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Usuario } from 'src/app//models/usuario.model';
import { Orden } from 'src/app/models/orden.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-ordenes',
  templateUrl: './informe-ordenes.component.html',
  styles: [
  ]
})
export class InformeOrdenesComponent implements OnInit {

  @ViewChild('input') inputTxt: ElementRef<any>;

  // variables
  forma: FormGroup;
  usuario: Usuario;
  orden: Orden;
  ordenes: Orden[] = [];
  totalRegistros: number = 0;
  pagina: number = 0;
  filtro: string =  'Pendiente Informe';
  busqueda: string =  '';

  ROLE: string = '';

  flag: boolean = false;
  message: string = 'Cargando Base de Datos';

   // Select Element
   listaSelectEspecialista = [];


  // -------------------- Constructor ------------------------------------

  constructor(@Inject(DOCUMENT) private document: Document,
              private fb: FormBuilder,
              public ordenService: OrdenService,
              public especialistaService: EspecialistaService,
              public usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.usuario = this.usuarioService.usuario;
    this.ROLE = this.usuario.role;

    this.crearFormulario();

    this.cargarOrdenes();

    this.cargarEspecialistas();

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


  // ==========================================================================
//             +++++++++++ METODO PARA CARGAR LAS ORDENES ++++++++++++++
// ==========================================================================
cargarOrdenes() {

  this.ordenes = [];
  this.totalRegistros = 0;

  this.ordenService.obtenerOrdenesConsulta( this.pagina, this.filtro)
                     .subscribe((resp: any) => {


                       if (!resp.orden) {
                          this.message = resp.message;
                          this.flag = false;
                        }

                       if (resp.orden){
                         this.totalRegistros = resp.total;
                         this.ordenes = resp.orden;
                         this.flag = true;
                         this.busqueda = this.filtro;
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
                                  title: '¡Error!',
                                  text: JSON.stringify(err.error.message),
                                  icon: 'error',
                                  confirmButtonText: 'Cerrar',
                                  scrollbarPadding: false,
                                  allowOutsideClick: false
                                });
                              });


}

// ==========================================================================
//             +++++++++++ METODO BUSCAR ORDEN ++++++++++++++
// ==========================================================================
   // Metodo para buscar una Orden y filtrar por estado
   buscarOrdenEstado( termino: string, filtro?: string) {


    this.flag = false;


    // Buscar por Seleccion Radio btn

    if (filtro !== 'Pendiente Informe') {

        // console.log('Aqui 2');

        this.busqueda = filtro;
        this.pagina = 0;
        this.cargarOrdenes();
        return;
    }

    // Buscar por termino
    if (termino.length === 1 && termino === ' ') {
      // console.log('Aqui 3');
      return;
    }

    if (termino.length <= 0) {
      // console.log('Aqui 4');

      this.pagina = 0;
      this.filtro = 'Pendiente Informe';

      this.cargarOrdenes();
      return;

    }

    if (termino.length >= 1) {

      // console.log('Aqui 1');


      this.busqueda = termino;

      this.ordenService.buscarOrden(termino)
                       .subscribe(resp => {
                         // console.log(resp);
                         if (resp.length === 0) {
                          this.message = 'No hay Registros';
                          this.flag = false;
                        }

                         if (resp.length > 0){
                         this.totalRegistros = resp.length;
                         this.ordenes = resp;
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




  }


    // ==========================================================================
//             +++++++++++ METODO PARA CAMBIAR FLAGS ++++++++++++++
// ==========================================================================
   // Metodo usado para cambiar banderolas
   cambiarFlags(){

    this.flag = false;
    this.ordenes = [];
    this.inputTxt.nativeElement.value = '';
    this.filtro = 'Pendiente Informe';


  }


// =====================Metodos para Asignar Especialista ===========================================

asignarEspecialista(orden: Orden) {

  this.orden = orden;
  this.orden.horas_programadas = null;
  this.orden.obs_internas = null;
  this.orden.anotaciones = null;
  this.orden.sedes = null;
  this.orden.especialistas = null;
  this.orden.soportes = null;
  this.orden.eventos = null;
  this.orden.archivos = null;

  this.orden.revisor = this.forma.controls.selectEspecialista.value;
  this.orden.activo = '2'; // Estado Interno Tecnica - Parcialmente Revisado

 // console.log(this.forma.value);
 // console.log(orden);

  this.ordenService.actualizarOrden(this.orden)
                    .subscribe(resp => {
                      // console.log('Orden - ', resp);

                      this.cargarOrdenes();

                      Swal.fire({
                        title: 'Profesional Asignado',
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


  // ========================================= Fomulario =====================================================================

// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    selectEspecialista: ''
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



} // END class
