import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { OrdenService } from 'src/app/services/orden/orden.service';
import { TarifaService } from 'src/app/services/tarifa/tarifa.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';

import { Orden } from 'src/app/models/orden.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Evento } from 'src/app/models/evento.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-estados-ordenes',
  templateUrl: './estados-ordenes.component.html',
  styles: [
  ]
})
export class EstadosOrdenesComponent implements OnInit {

  @ViewChild('input') inputTxt: ElementRef<any>;


   // Select Element - Estados
   listaEstados: string[] = [
                            'Seleccionar Estado',
                            'Pendiente Programar',
                            'En Ejecución',
                            'Finalizada',
                            'Pre - Factura',
                            'Facturada',
                            'Pendiente Cancelar',
                            'Cancelada - Programada',
                            'Reprogramar',
                            'En Devolución',
                            'Pendiente Informe',
                            'Informe Revisado',
                            'Facturada Pendiente Programar',
                            'Archivo'
                          ];

  // variables
  orden: Orden;
  usuario: Usuario;
  ordenes: Orden[] = [];
  ordenesArray: Orden[] = [];
  ordenesArrayByDate: Orden[] = [];
  ordenesArrayByProg: Orden[] = [];

  flagAlert: boolean = false;
  flagLoading: boolean = false;
  flagObs: boolean = false;
  flagBtn: boolean = true;
  flagBtnFilter: boolean = false;
  CardOrdenFlag: boolean = false;
  OrdenFlag: boolean = false;

  estado: string = 'Seleccionar Estado';
  message: string = '';
  pagina: number = 0;
  totalRegistros: number = 0;
  nombre: string = '';
  ROLE: string = '';

   // fecha
   year: string = '';
   month: string = '';
  fechaNow: string = '';

  totalPreFactura: number = 0; // valor total de la prefactura

  constructor(public ordenService: OrdenService,
              public tarifaService: TarifaService,
              public eventosService: EventosService,
              public usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.fechaActual();
    this.getTotalPreFactura(); // llama el metodo para obtener el valor total de la prefactura

    this.usuario = this.usuarioService.usuario;
    this.ROLE = this.usuario.role;

  }


  // --------------------Metodos---------------------------
  fechaActual() { // metodo para capturar la fecha actual y armar la expresion regular
    const now = new Date();
    const mes = now.getMonth() + 1; // mes + 1
    this.year = now.getFullYear().toString();
    this.month = mes.toString();
    const str = now.toISOString();
    const strDate = str.split('T');
    this.fechaNow = strDate[0];
  }

  // --------------------------------------------------------------------------
  // *******Metodo para calcular el total de la Prefactura por MES ***********
  // --------------------------------------------------------------------------
getTotalPreFactura() {


  let total_PreFactura = 0;


  this.ordenService.obtenerOrdenesTodas()
                        .subscribe((resp: any) => {
                          // console.log(resp);


                          if (resp.orden) {

                            for (const item of resp.orden) {

                              this.ordenesArray.push(item);

                            }

                            const preFacturaArray = [];

                            for (const item of this.ordenesArray) {
                              if (item.estado === 'Pre - Factura' && item.valida) { // Obtiene solo Ordenes Pre-Factura con flag Valida
                                preFacturaArray.push(item);
                              }
                            }

                            for (const item of preFacturaArray) {


                              if (item.year === this.year.toString()) {

                                if (item.month === this.month) { // solo obtiene el total del mes actual

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }

                              }

                            }

                            // console.log(total_PreFactura);

                           this.totalPreFactura = total_PreFactura;

                          }
                        });




}

// ==========================================================================
//     +++++++++++ METODO PARA VER LOS DATOS DE LA ORDEN ++++++++++++++
// ==========================================================================
// Metodo para desplegar la informacion de la orden - vienen desde el HIJO - TABLE-ORDEN
  verDataOrden(event) {

    this.orden = null;

    switch (event[0]) {

            case 'Ver Orden':

              // console.log(event);

              this.orden = event[1]; // asigna la orden
              this.OrdenFlag = true;

              break;
            case 'Observaciones':

              // console.log(event);
              this.flagObs = false;

              this.orden = event[1]; // asigna la orden
              this.CardOrdenFlag = true;

              if (event[1].obs_internas.length > 0) {
                  this.flagObs = true; // ver las observaciones de programacion
                }

              break;
            case 'Anotaciones':

              // console.log(event);
              this.orden = event[1]; // asigna la orden
              this.actualizarOrdenData(event[1]); // envia la Orden

              break;
            case 'Radicado': // cambia estado 'Pre - Factura'

            // console.log(event);
            this.orden = event[1]; // asigna la orden
            this.actualizarOrdenData(event[1]); // envia la Orden
            this.cambioEstadoEvento(event[2]); // llama el metodo para cambiar el estado de los evento de la Orden

              break;
            case 'Facturacion':

              // console.log(event);
              this.orden = event[1]; // asigna la orden
              this.actualizarOrdenData(event[1]); // envia la Orden

              break;
            case 'Estado':

              // console.log(event);
              this.orden = event[1]; // asigna la orden
              this.actualizarOrdenEstado(event[1]);


              break;
            case 'Re-Calcular':

              // console.log(event);
              this.orden = event[1]; // asigna la orden
              this.reCalcularValor(event[1]);

              break;
            default:
             return;
    }


  }





// ==========================================================================
// +++++++++ METODO PARA RE CALCULAR EL VALOR TOTAL DE LA ORDEN ++++++++++++
// ==========================================================================
// HIJO: TABLE-ORDEN : Estado: Pre - Factura
// metodo para ajustar el valor Total de la Orden cuando las Horas ejecutadas son diferentes de las Horas Programadas
reCalcularValor(orden: Orden) {


  this.tarifaService.obtenerTarifaCosto(orden.actividad_programa)
                      .subscribe((resp: any) => {

                          if (resp) {

                            const currency = resp;
                            // tslint:disable-next-line: quotemark
                            const costo = Number(currency.replace(/[^0-9\.]+/g, ""));
                            const total = costo * orden.horas_ejecutadas;
                            orden.valor_total = total.toString(); // asigna el valor Total de la Orden

                            this.actualizarOrdenData(orden);


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
// +++++++++++ METODO PARA CAMBIAR EL ESTADO DE LA ORDEN ++++++++++++
// ==========================================================================
// recibe informacion desde el hijo Card-Orden para cambiar el estado - Pendiente Cancelar / ReProgramar /En Ejecución
// HIJO : CARD-ORDEN
// HIJO : ORDEN COMPONENT
  cambiarEstado(event: string, element: string) {

    switch (element) {

      case 'Card-Orden':

      this.orden.estado = event;
      this.CardOrdenFlag = false;

      break;
      case 'Orden-Component':

      this.orden.estado = event;
      this.OrdenFlag = false;

      break;
      default:
       return;
  }

    this.orden.obs_internas = null;
    this.orden.anotaciones = null;
    this.orden.sedes = null;
    this.orden.especialistas = null;
    this.orden.soportes = null;
    this.orden.eventos = null;
    this.orden.archivos = null;
    this.orden.horas_programadas = null;



    this.actualizarOrdenEstado(this.orden); // llama el metodo



  }

// ---------------------------------------------------------------------
//               Metodo para actualizar la ORDEN
// ---------------------------------------------------------------------
actualizarOrdenEstado(orden: Orden) {

    this.ordenService.actualizarOrden(orden)
                      .subscribe((resp: any) => {

                       this.CardOrdenFlag = false;
                       this.flagAlert = false; // ****flag
                       this.buscarOrdenEstado('', this.estado);

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




// ======================================================================================
// +++++++++++ METODO PARA ACTUALIZAR LAS OBSERVACIONES DE PROGRAMACION ++++++++++++
// ======================================================================================
// Hijo : CARD ORDEN : Estado - Pendiente Programar
actualizarOrdenObs(event: string) { // recibe informacion desde el hijo CARD ORDEN

   this.CardOrdenFlag = false;

   this.orden.obs_internas = null;

   const fechaActual = new Date();

   this.orden.obs_internas = {fecha: fechaActual, reporte: event, usuario: this.usuario.nombre.toString() } ;

   this.orden.anotaciones = null;
   this.orden.sedes = null;
   this.orden.especialistas = null;
   this.orden.soportes = null;
   this.orden.eventos = null;
   this.orden.archivos = null;
   this.orden.horas_programadas = null;


   this.ordenService.actualizarOrden(this.orden)
                     .subscribe((resp: any) => {

                      this.orden = resp;
                      this.cargarOrdenesByEstado();
                      this.CardOrdenFlag = true;
                      this.flagObs = true;


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

// ==========================================================================
// +++++++++++ METODO PARA ACTUALIZAR ANOTACIONES DE LA ORDEN ++++++++++++
// ==========================================================================
// metodo para actualizar las anotaciones de la orden desde TABLE-ORDEN
// Hijo : TABLE-ORDEN : Estado - Finalizada / Pre Facturada
// metodo para registrar el numero de radicado en la orden desde TABLE-ORDEN
// Hijo : TABLE-ORDEN : Estado - Finalizada
// metodo para registrar el numero de Facturacion en la orden desde TABLE-ORDEN
// Hijo : TABLE-ORDEN : Estado - Pre Factura
actualizarOrdenData(orden: Orden) {


  this.ordenService.actualizarOrden(orden)
                    .subscribe(resp => {

                      // console.log(resp);
                      this.orden = resp;
                      this.cargarOrdenesByEstado();

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






// ==========================================================================
//             +++++++++++ METODO BUSCAR ORDEN ++++++++++++++
// ==========================================================================
   // Metodo para buscar una Orden y filtrar por estado
   buscarOrdenEstado( termino: string, estado?: string) {


    this.flagAlert = false;
    this.pagina = 0; // reset variable Pagina

    if (termino.length === 1 && termino === ' ') {
      return;
    }

    if (termino.length <= 0) {
      if (estado === 'Seleccionar Estado') {
        return;
      }

      this.flagLoading = true;
      this.cargarOrdenesByEstado();
      return;

    }


    // Buscador general y select de estados

    if (termino.length >= 1 && termino !== ' ' && estado !== 'Seleccionar Estado' ) {

      this.ordenes = [];
      this.buscarByTermino( termino, true );
      return;

     }


     // Buscador general
    if (termino.length >= 1) {
      this.buscarByTermino( termino, false);
    }



  }


// ==========================================================================
//   +++++++++++ METODO PARA BUSCAR ORDENES POR TERMINO++++++++++++++
// ==========================================================================
  buscarByTermino( termino: string, flagEstado: boolean ) {

    this.flagLoading = true;
    this.flagBtn = false;

    this.ordenes = [];
    this.totalRegistros = 0;

    this.ordenService.buscarOrden(termino)
                     .subscribe(resp => {
                       // console.log(resp);
                       if (resp.length === 0) {
                        this.message = 'No hay Registros';
                        this.flagAlert = true;
                      }

                       if (resp.length > 0){ // si existen datos

                        this.nombre = flagEstado ? this.estado : 'Todas';

                        if(flagEstado) { // busqueda por termino y  por estado

                          const ordenesArrayResp = resp
                          this.ordenes = ordenesArrayResp.filter(ordenes => ordenes.estado === this.estado);
                          this.totalRegistros = this.ordenes.length;

                        }else { // busqueda general

                          this.totalRegistros = resp.length;
                          this.ordenes = resp;

                        }

                       // this.flag = true; ****flag
                       this.flagAlert = false;
                       this.flagLoading = false;
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



// ==========================================================================
//   +++++++++++ METODO PARA CARGAR LAS ORDENES POR ESTADO++++++++++++++
// ==========================================================================
  cargarOrdenesByEstado() {

    this.ordenes = [];


    if ( this.estado === 'Pendiente Programar' && this.ordenesArrayByDate.length === 0 && this.ordenesArrayByProg.length === 0 ){
      this.cargarOrdenesTodas(); // llama el metodo para cargar todas las ordenes Pendiente Programar
    }

    // habilita los botones del Filtro Ordenes Pendientes Programar
    this.flagBtnFilter = this.estado === 'Pendiente Programar' ? true : false;


    this.ordenService.obtenerOrdenesConsulta( this.pagina, this.estado)
                       .subscribe((resp: any) => {

                         // console.log('Ordenes: ', resp);

                         if (!resp.orden) {
                            this.message = resp.message;
                            this.flagAlert = true;
                          }

                         if (resp.orden){

                           const ordenesTemp: Orden[] = [];

                           for (const item of resp.orden) {

                             if (item.activo !== 'x') { // solo ordenes activas

                               ordenesTemp.push(item);

                             }

                           }

                           this.totalRegistros = resp.total;
                           this.ordenes = ordenesTemp; // resp.orden;
                           this.nombre = this.estado;
                           this.flagBtn = true;
                           this.flagAlert = false;
                           this.flagLoading = false;
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


// =======================================================================================
//   +++++++++++ METODO PARA CARGAR TODAS LAS ORDENES PENDIENTE PROGRAMAR ++++++++++++++
// =======================================================================================
  cargarOrdenesTodas() {


    this.ordenesArrayByDate = [];
    this.ordenesArrayByProg = [];


    this.ordenService.obtenerOrdenesTodas()
                     .subscribe( (resp: any) => {

                          // console.log(resp);


                          if (resp.orden){
                             // codigo para Ordenes pendiente programar NUEVAS

                          const regex = new RegExp(`${this.fechaNow}`); // se crea la expresion regular

                          for (const item of resp.orden ) {

                            // verifica que la fecha created_at coincida con la fecha de Hoy
                            const matches = regex.exec(`${item.created_at}`);


                            if (item.estado === 'Pendiente Programar' && item.horas_programadas === 0 && item.activo !== '0'  && matches) {
                              this.ordenesArrayByDate.push(item); // Array de Ordenes Pendiente Programar Nuevas Fecha Actual
                            }
                            if (item.estado === 'Pendiente Programar' && item.horas_programadas === 0 && item.activo !== '0'  ) {
                              this.ordenesArrayByProg.push(item); // Array de Ordenes Pendiente Programar
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




// ========================================================================================
// +++++++++++ METODO PARA MOSTRAR ORDENES NUEVAS PENDIENTES DE PROGRAMAR ++++++++++++++
// ========================================================================================
   // Metodo usado para cambiar banderolas
   ordenesPendientes(filtro: string){


    this.ordenes = [];

    if (filtro === 'Por Fecha' && this.ordenesArrayByDate.length > 0) {

      this.totalRegistros = this.ordenesArrayByDate.length;
      this.flagBtn = false;
      this.flagAlert = false;
      this.ordenes = this.ordenesArrayByDate;




    }else if (filtro === 'Por Programar' && this.ordenesArrayByProg.length > 0) {

      this.totalRegistros = this.ordenesArrayByProg.length;
      this.flagBtn = false;
      this.flagAlert = false;
      this.ordenes = this.ordenesArrayByProg;



    } else {

        this.message = 'No hay Registros';
        this.flagAlert = true;
        this.CardOrdenFlag = false;

    }



  }



  // ==========================================================================
//             +++++++++++ METODO PARA CAMBIAR FLAGS ++++++++++++++
// ==========================================================================
   // Metodo usado para cambiar banderolas
   cambiarFlags(tag: string){

    this.flagAlert = false;
    this.ordenes = [];

    if (tag === 'Select') {
      this.CardOrdenFlag = false;
      this.OrdenFlag = false;
      this.inputTxt.nativeElement.value = '';
    }
    if (tag === 'Input') {
      this.CardOrdenFlag = false;
      this.OrdenFlag = false;
      this.estado = this.listaEstados[0];

    }

  }



  // =====================Metodos para cambiar la Pagina===========================================
 // Metodo para cambiar la paginacion
 cambiarPagina( valor: number) {

 // console.log(valor);

 this.CardOrdenFlag = false;
 this.OrdenFlag = false;
 this.flagLoading = true;


 const pagina = this.pagina + valor;

 if ( pagina >= this.totalRegistros ) {
   return;
 }

 if ( pagina < 0 ) {
   return;
 }

 // codigo si las validaciones estan correctas
 this.pagina += valor;
 this.cargarOrdenesByEstado();

 }


// --------------------------------------------------------------------------
//             Metodo para cambiar el estado del EVENTO
// --------------------------------------------------------------------------
// Este metodo cambia el estado del evento cuando se radica la Orden (Pre - Factura)
// en esta accion se cambia el estado del evento automaticamente para evitar que en la Tabla de
// ordenes gestion de especialista continue saliendo la Orden/Evento
cambioEstadoEvento(eventos: Evento[]) {

  // console.log(eventos);

  for (const item of eventos) {

    // item.estado = 'Evento Terminado'; // cambia el estado del evento cuando la orden esta en 'Pre - Factura'
    item.activo = 'X'; // cambia el valor activo del evento

    this.eventosService.actualizarEvento(item)
                        .subscribe(resp => {
                          // console.log(resp);
                        });

  }


}


}// END class



// *********** CODIGO NO USADO ****************************************

 /*
                                if (item.month === '1') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '2') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '3') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '4') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '5') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '6') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '7') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '8') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '9') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '10') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '11') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }
                                if (item.month === '12') {

                                  total_PreFactura = total_PreFactura + parseInt(item.valor_total, 10);

                                }

                                */
