import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';

import { URL_SERVICIOS } from 'src/app/config/config';

import { ContratanteService } from 'src/app/services/dashboard/contratante.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { OrdenService } from 'src/app/services/orden/orden.service';
import { EmpresaService } from 'src/app/services/dashboard/empresa.service';
import { SoportesService } from 'src/app/services/soportes/soportes.service';
import { DownloadService } from 'src/app/services/download/download.service';

import { Orden } from 'src/app/models/orden.model';
import { Soportes } from 'src/app/models/soportes.model';


 // *****  CODIGO PARA SERVIDOR CON DIRECTORIOS ************************
const url = URL_SERVICIOS + '/download/getfile'; // Url para resolver la descarga de los Archivos


@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styles: [
  ]
})
export class DatosComponent implements OnInit {

  // variables
  totalArl: number = 0;
  totalEmpresas: number = 0;
  totalEspecialistas: number = 0;
  totalOrdenes: number = 0;

  orden: Orden;
  ordenes: Orden[] = [];
  soportes: Soportes[] = [];
  totalFallidas: number = 0;
  flagSoportes: boolean = false;
  pagina: number = 0;
  listaSelectOrdenes = [];
  flagSelect: boolean = true;



  // Ordenes
  OrdenNuevas: number = 0;
  OrdenCanceladas: number = 0;
  OrdenReprogramadas: number = 0;
  OrdenEjecutadas: number = 0;

  // Estados
  EstadoPendProgramar: number = 0;
  EstadoEjecucion: number = 0;
  EstadoPendInforme: number = 0;
  EstadoInfoRevisado: number = 0;
  EstadoFinalizado: number = 0;
  EstadoPreFactura: number = 0;
  EstadoFacturadas: number = 0;
  EstadoDevolucion: number = 0;
  EstadoPendCancelar: number = 0;
  EstadoReprogramar: number = 0;
  EstadoCanceladaProgramada: number = 0;
  EstadoFacturadaPendProgramar: number = 0;
  EstadoArchivo: number = 0;

  fileCsv: string = '';
  fileName: string = '';
  flagSpin: boolean = true;



  // --------------- Constructor -------------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              public contratanteService: ContratanteService,
              public especilistaService: EspecialistaService,
              public empresaService: EmpresaService,
              public ordenesServices: OrdenService,
              public soportesServices: SoportesService,
              public downloadServices: DownloadService) { }

  ngOnInit(): void {

    this.cargarDatos();
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


// ----------------------- Devuelve la relacion del Soporte con la Orden-------------------------------------------------------------
crearArraySoporteOrden( soportesObj: any) {

  const soportes: Soportes[] = [];

  if ( soportesObj === null ) { return []; } // condicion si el objeto recibido no tiene informacion

  Object.keys( soportesObj ).forEach( key => {

                  // en este punto solo se tienen los datos de cada objeto sin las claves
                  const soporte = soportesObj[key];

                  // Filtra Soportes de la orden con los soportes Array
                  const foundID = this.soportes.find(element => element._id === soporte);

                  if (foundID) {
                    soportes.push(foundID);
                  }

  });

  // console.log(soportes);
  return soportes;
}

// ------------------------Devuelve los datos de la Orden Nueva -------------------------------------------------------------------------
// este metodo la orden asignada
getOrdenNuevaAsignada(item: string) {

   let datosOrden: string = 'Guardar';

   // Filtra las Ordenes de la Lista de Ordenes
   const foundID = this.listaSelectOrdenes.find(element => element._id === item);

   if (foundID) {
      datosOrden = `${foundID.cronograma} - ${foundID.secuencia}`;
   }
   return datosOrden;

}


// ==================================================================
//                 Metodo para Cargar Datos
// ==================================================================
  cargarDatos() {

    this.contratanteService.obtenerArlsTodas()
                            .subscribe((resp: any) => this.totalArl = resp.total);

    this.especilistaService.obtenerEspecialistaTodas()
                            .subscribe((resp: any) => this.totalEspecialistas = resp.total);

    this.empresaService.obtenerEmpresasTodas()
                            .subscribe((resp: any) => this.totalEmpresas = resp.total);

    this.ordenesServices.obtenerOrdenesTodas()
                            .subscribe((resp: any) => {
                              this.totalOrdenes = resp.total;
                              if (resp.orden) {
                                this.listaSelectOrdenes = resp.orden;
                              }
                            });
// Ordenes --------------------------------------
    this.ordenesServices.obtenerOrdenesConsulta(0, 'nuevas')
                            .subscribe((resp: any) => this.OrdenNuevas = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'canceladas')
                            .subscribe((resp: any) => this.OrdenCanceladas = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'ejecutadas')
                            .subscribe((resp: any) => this.OrdenEjecutadas = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'reprogramadas')
                            .subscribe((resp: any) => this.OrdenReprogramadas = resp.total);
// Estados -------------------
    this.ordenesServices.obtenerOrdenesConsulta(0, 'Pendiente Programar')
                            .subscribe((resp: any) => this.EstadoPendProgramar = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'En Ejecución')
                            .subscribe((resp: any) => this.EstadoEjecucion = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Finalizada')
                            .subscribe((resp: any) => this.EstadoFinalizado = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Pre - Factura')
                            .subscribe((resp: any) => this.EstadoPreFactura = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Facturada')
                            .subscribe((resp: any) => this.EstadoFacturadas = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Pendiente Cancelar')
                            .subscribe((resp: any) => this.EstadoPendCancelar = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Reprogramar')
                            .subscribe((resp: any) => this.EstadoReprogramar = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'En Devolución')
                            .subscribe((resp: any) => this.EstadoDevolucion = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Pendiente Informe')
                            .subscribe((resp: any) => this.EstadoPendInforme = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Informe Revisado')
                            .subscribe((resp: any) => this.EstadoInfoRevisado = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Cancelada - Programada')
                            .subscribe((resp: any) => this.EstadoCanceladaProgramada = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Facturada Pendiente Programar')
                            .subscribe((resp: any) => this.EstadoFacturadaPendProgramar = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Archivo')
                            .subscribe((resp: any) => this.EstadoArchivo = resp.total);

    // Soportes - Visitas Fallidas
    this.ordenes = [];
    this.soportes = [];
    this.totalFallidas = 0;
    this.soportesServices.obtenerSoportesTodas()
                        .subscribe((resp: any) => {
                          // console.log(resp);

                          if (resp.soportes) {
                            for (const item of resp.soportes) {
                              if (item.fallida && item.orden) {
                                this.ordenes.push(item.orden);
                                this.soportes.push(item);
                                this.totalFallidas += 1;
                              }

                            }

                          }

                         // console.log(this.ordenes);


                        });


  }



// ===============================Metodo para Actualizar la Orden======================================================
// se actualiza la relacion con una nueva Orden
actualizarOrden(orden: any) {


  Swal.fire({
    title: 'Actualizando Orden',
    icon: 'info',
    scrollbarPadding: false,
    allowOutsideClick: false
  });
  Swal.showLoading();



  for (const item of orden.soportes) {
    // Filtra Soportes de la orden con los soportes Array
       const foundID = this.soportes.find(element => element._id === item);

       if (foundID) {

            foundID.nuevaorden = orden.nuevaorden;
            foundID.anotaciones = null;

            // console.log(foundID);

            this.soportesServices.actualizarSoportes(foundID)
                                  .subscribe(resp => {
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

  }


  this.orden = orden;

  this.orden.obs_internas = null;
  this.orden.anotaciones = null;
  this.orden.horas_programadas = null;
  this.orden.sedes = null;
  this.orden.especialistas = null;
  this.orden.soportes = null;
  this.orden.eventos = null;
  this.orden.archivos = null;




  this.ordenesServices.actualizarOrden(this.orden)
                      .subscribe( resp => {

                        Swal.fire(
                          'Orden Actualizada',
                          'No ' + this.orden.cronograma + ' Actualizada correctamente',
                          'success'
                        );


                        // console.log(resp);
                        this.cargarOrdenes();

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

// ============= Cargar Ordenes ==============================
cargarOrdenes() {

   this.ordenes = [];
   this.soportes = [];
   this.totalFallidas = 0;

   // Soportes - Visitas Fallidas
   this.soportesServices.obtenerSoportesTodas()
                       .subscribe((resp: any) => {
                         // console.log(resp);

                         if (resp.soportes) {
                           this.flagSoportes = true;
                           for (const item of resp.soportes) {
                             if (item.fallida) {
                               this.ordenes.push(item.orden);
                               this.soportes.push(item);
                               this.totalFallidas += 1;
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



// ============= Metodo para descargar los Archivos de la BD ==============================
downloadFile(collection: string) {

  this.flagSpin = false;
  this.fileName = '';



  this.downloadServices.downloadFile(collection)
                        .subscribe(
                          (resp: any) => {
                            // console.log('Observer got a next value: ' + resp);


                            if (resp.ok) {
                              this.flagSpin = resp.ok;
                              this.fileCsv = `${resp.url}`; // *****  CODIGO PARA GOOGLE CLOUDS ************************
                              // this.fileCsv = `${url}/${resp.url}`; // *****  CODIGO PARA SERVIDOR CON DIRECTORIOS **********************
                              this.fileName = resp.file;
                              // console.log(this.fileCsv);

                            }


                        },
                         // err => console.log('Observer got an error: ' + err.error),
                          err => {
                             console.log('HTTP Error', err.error);
                             Swal.fire({
                              title: '¡Error!',
                              text: JSON.stringify(err.error.message),
                              icon: 'error',
                              confirmButtonText: 'Cerrar',
                              scrollbarPadding: false,
                              allowOutsideClick: false
                            });
                          }
                         // () => console.log('Observer got a complete notification')
                         );

}



   // =====================Metodos para cambiar la Pagina===========================================
// Metodo para cambiar la paginacion
cambiarPagina( valor: number) {

  // console.log(valor);


  const pagina = this.pagina + valor;

  if ( pagina >= this.totalFallidas ) {
    return;
  }

  if ( pagina < 0 ) {
    return;
  }

  // codigo si las validaciones estan correctas
  this.pagina += valor;
  // this.cargarOrdenes();

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
