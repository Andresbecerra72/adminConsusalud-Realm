import { Component, OnInit } from '@angular/core';

import { OrdenService } from 'src/app/services/orden/orden.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Evento } from 'src/app/models/evento.model';
import { Orden } from 'src/app/models/orden.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-end-ordenes',
  templateUrl: './end-ordenes.component.html',
  styles: [
  ]
})
export class EndOrdenesComponent implements OnInit {

 // variables
 flag: boolean = false;
 message: string = 'Cargando Base de Datos';

 usuario: Usuario;
 especialista: Especialista;

 eventos: Evento[] = [];
 eventosTemp: Evento[] = []; // referencia para ordenar por fecha
 eventosArray: Evento[] = [];
// ordenesArray: Orden[] = []; // Almacena las Ordenes Validas en BD

 count: number = 0;

 totalRegistros: number = 0;
 pagina: number = 0;

 // ------------------ Constructor------------------------------------------------
 constructor(public ordenService: OrdenService,
             public usuarioService: UsuarioService,
             public especialistaService: EspecialistaService) { }


 ngOnInit(): void {

   this.usuario = this.usuarioService.usuario;

   if (this.usuario.especialista) {
    this.getEspecialista(this.usuario);
  }


             }


// ---------------------------------------------------------------------------
// metodo para cargar el Especialista
getEspecialista(usuario: Usuario) {

 this.count = 0;
 this.eventos = [];
 this.eventosArray = [];


 this.especialistaService.obtenerEspecialistaByID(usuario.especialista.toString())
                         .subscribe((resp: any) => {

                           // console.log(resp);

                           const eventosArreglo = []; // Referencia - Arreglo de eventos

                           const array1 = [];
                           const array2 = [];
                           let arrayTotal = [];

                           if (resp.especialista) { // si el Especialista Existe

                             this.especialista = resp.especialista;

                             // Eventos del Especialistas
                             if (resp.especialista.eventos.length > 0 ){

                               for (const item of resp.especialista.eventos) {

                                  if ( item.estado !== 'Bloqueo' ) {

                                    eventosArreglo.push(item);
                                    array1.push(item.orden); // --- Eventos.orden

                                  }

                             }
                            }
                             // Ordenes del Especialista
                             if (resp.especialista.ordenes.length > 0 ){

                              for (const item of resp.especialista.ordenes ) {

                                if ( item.activo === '1' ) { // Ordenes Activas

                                  // this.ordenesArray.push(item); // Asigna las ordenes del Especialista
                                  array2.push(item._id); // Ordenes._id

                                }

                              }


                          }



                             // -------------PROVISIONAL----------------


                             if (eventosArreglo.length > 0) {

                              for (const item of eventosArreglo) {

                                if (item.activo === '0') { // Eventos con gestion

                                  this.eventosArray.push(item);
                                  this.count += 1;

                                  if (this.count <= 10) {
                                    this.eventosTemp.push(item);
                                  }

                                }

                               }


                                     // codigo para ordenar los eventos por fecha reciente
                                     this.eventos = this.eventosTemp.sort((a, b) => {
                                      const dateA = Date.parse(a.start.toString());
                                      const dateB = Date.parse(b.start.toString());
                                      return dateA - dateB;
                                  });


                             }





                             // -----------------------------

                                // console.log(array1);
                              // console.log(array2);

                               // Ordenes del Especilista - condicion para almacenar solo eventos con Ordenes Validas en BD
                          /*    if(array1.length > 0 && array2.length > 0) { // condicion si los Arrays tienen datos

                                // --- LLAMA LA FUNCION DE PRUEBAS PARA VERIFICAR IGUALDADES
                                  if(array1.length > array2.length){ // condicion que defiene el orden de comparacion
                                    arrayTotal = this.obtenerDatosIguales(array1, array2);
                                  }else if(array2.length > array1.length) {
                                    arrayTotal = this.obtenerDatosIguales(array2, array1);
                                  }else{
                                    arrayTotal = this.obtenerDatosIguales(array1, array2);
                                  }

                                  // console.log(arrayTotal);

                                  let i = 0;

                                  for (const item of arrayTotal) {

                                      // Encuentra los eventos con Ordenes Validas y  evento activo 0 es una orden finalizada
                                    if ( eventosArreglo[i].orden === item && eventosArreglo[i].activo === '0' ) { // compara secuencialmente el ID Orden con la orden del Evento

                                      this.eventosArray.push(eventosArreglo[i]);
                                      this.count += 1;

                                      if (this.count <= 10) {
                                        this.eventosTemp.push(eventosArreglo[i]);
                                      }

                                    }

                                    i += 1;

                                  }

                                     // codigo para ordenar los eventos por fecha reciente
                                 this.eventos = this.eventosTemp.sort((a, b) => {
                                  const dateA = Date.parse(a.start.toString());
                                  const dateB = Date.parse(b.start.toString());
                                  return dateA - dateB;
                              });



                             }

                             */




                             // console.log(this.eventosArray);


                             this.totalRegistros = this.eventosArray.length;

                             if (this.totalRegistros === 0) {
                              this. message = 'No hay Resgistros';
                              this.flag = false;
                              this.eventos = null;

                            } else {
                              this.flag = true;
                            }

                           } else { // no hay registros
                             this.message = resp.message;
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



// --- CODIGO DE PRUEBA PARA ARREGLOS DIFERENTES -- **************

obtenerDatosIguales(array1, array2) {

  // var array1= [1,2,3,4,5,23,35,6];
  // var array2= [2,4];

  const arreglo = [];


   for(var i in array1)
   {
    //console.log(i+"----> for 1")
     for(var j in array1)
     {
      // console.log(j+"---> for 2")
       if(array1[i]==array2[j]){
         // console.log(array2[j]) // impreme los Datos (ID Ordenes) iguales -- Eventos.Orden VS Orden._id
           arreglo.push(array2[j]);

       }
     }
   }

   return arreglo;

 }

  // ------------------------------------------------




// =====================Metodos para cambiar la Pagina===========================================
// Metodo para cambiar la paginacion
cambiarPagina( valor: number) {

 // console.log(valor);

 this.count = 0;

 const pagina = this.pagina + valor;

 if ( pagina >= this.totalRegistros ) {
   return;
 }

 if ( pagina < 0 ) {
   return;
 }

 // codigo si las validaciones estan correctas
 this.pagina += valor;

 // console.log(this.pagina);

 this.eventos = [];

 for (let i = this.pagina; i < this.eventosArray.length; i++) {
  this.count += 1;
  if (this.count <= 10) {
    this.eventos.push(this.eventosArray[i]);
  }

}

 // this.getEspecialista(this.usuario);

}



} // END class

// **************codigo NO USADO**************
// Encuentra los eventos con Ordenes Validas
// const foundID = eventosArreglo.find(element => element.orden === item._id);
// if (foundID) {
//   this.eventosArray.push(foundID); // Se asignas las Ordenes finalizadas
//   this.count += 1;
//   if (this.count <= 10) {
//     this.eventos.push(foundID);
//   }
// }


// ****************codigo modificado ENERO 2021***************
/*
      // Ordenes del Especilista - condicion para almacenar solo eventos con Ordenes Validas en BD
                             if (resp.especialista.ordenes.length > 0 && eventosArreglo.length > 0 ){

                                let i = 0;

                                for (const item of resp.especialista.ordenes ) {

                                  this.ordenesArray.push(item); // Asigna las ordenes del Especialista

                                  // Encuentra los eventos con Ordenes Validas y  evento activo 0 es una orden finalizada
                                  if ( eventosArreglo[i].orden === item._id && eventosArreglo[i].activo === '0' ) {

                                    this.eventosArray.push(eventosArreglo[i]);
                                    this.count += 1;
                                    if (this.count <= 10) {
                                      this.eventosTemp.push(eventosArreglo[i]);
                                    }

                                  }

                                  i += 1;


                                }


                                    // codigo para ordenar los eventos por fecha reciente
                                this.eventos = this.eventosTemp.sort((a, b) => {
                                      const dateA = Date.parse(a.start.toString());
                                      const dateB = Date.parse(b.start.toString());
                                      return dateA - dateB;
                                  });


                            }
*/
