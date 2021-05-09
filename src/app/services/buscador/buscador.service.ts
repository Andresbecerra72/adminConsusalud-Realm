import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {



  // -----------------Constructor-----------------------
  constructor( private http: HttpClient) {
    console.log('Constructor - Servicio Buscador');
   }



  // ------------Metodos--------------------

// ==========================================================================
//               +++++++++++ BUSCADOR GLOBAL ++++++++++++++
// ==========================================================================
busquedaGlobal(termino: string) {

  // la url la toma del archivo de configuracion
  const url = URL_SERVICIOS + '/busqueda/todo/' + termino;

  return this.http.get( url );


}
// ==========================================================================
//               +++++++++++ BUSCADOR GLOBAL ++++++++++++++
// ==========================================================================
busquedaOrdenesByGestor(year: string, cronograma: string, secuencia: string) {

  // la url la toma del archivo de configuracion
  const url = `${URL_SERVICIOS}/busqueda/gestororden/${year}/${cronograma}/${secuencia}`;

  return this.http.get( url );


}



} // END class
