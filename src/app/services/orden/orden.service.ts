import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from 'src/app/models/usuario.model';
import { Orden } from '../../models/orden.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  // Variables para validar si el usuario esta logeado
  usuario: Usuario;
  token: string;




  constructor(private http: HttpClient) {
    this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario
    // this.cargarOrdenesAll().subscribe();
    console.log('Constructor - Servicio Ordenes');
   }


   // metodo para cargar las variables token y usuario
  cargarStorage(){

    if (localStorage.getItem('token')) { // si el token existe en el localStorage
        this.token = localStorage.getItem('token');
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }else { // si el localstorage esta vacio se inicializan con los siguientes datos
      this.token = '';
      this.usuario = null;
    }

    return;

  }



// ==========================================================================
//             +++++++++++ MOSTRAR ORDENES TODAS sin Paginacion: GET ++++++++++++++
// ==========================================================================
// Servicio Crear  ordenes en la tabla Ordenes
obtenerOrdenesTodas() {

  // la url la toma del archivo de configuracion
  const url = URL_SERVICIOS + '/orden/all';

  return this.http.get( url );


}
// ==========================================================================
//    +++++++++++ GESTOR BD - MOSTRAR ORDENES TODAS sin Paginacion: GET ++++++++++++++
// ==========================================================================
// trae todas las ordenes **SIN FILTROS
obtenerOrdenesTodasGestor() {

  // la url la toma del archivo de configuracion
  const url = URL_SERVICIOS + '/orden/gestor';

  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR ORDENES CON PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar los Ordenes con paginacion
obtenerOrdenes( pagina: number = 0) {

  const url = URL_SERVICIOS + '/orden?pagina=' + pagina;
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR ORDENES CON PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar los Ordenes con paginacion
// == NUEVAS == CANCELADAS == EJECUTADAS == REPROGRAMADAS
obtenerOrdenesConsulta( pagina: number = 0, consulta: string) {

  const url = URL_SERVICIOS + '/orden/get/' +  consulta  + '?pagina=' + pagina;
  return this.http.get( url );


}

// ==========================================================================
//      +++++++++++ MOSTRAR ORDEN por ID: GET by ID ++++++++++++++
// ==========================================================================
// metodo para mostrar una ORDEN por ID
obtenerOrdenByID(id: string) {

  const url = URL_SERVICIOS + '/orden/ident/' + id;
  return this.http.get( url )
                .pipe(
                  map((resp: any) => {
                    return resp.orden;
                  })
                  );


}





// ==========================================================================
//             +++++++++++ CREAR ORDENES: POST ++++++++++++++
// ==========================================================================
// Servicio Crear  ordenes en la tabla Ordenes
guardandoOrdenes( orden: Orden){


  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/orden';
  url += '?token=' + this.token;

  return this.http.post( url, orden)
                  .pipe(
                  map( (resp: any) => {

                    // console.log(resp);
                    return resp;
                  })
                  );


}





// ==========================================================================
//             +++++++++++ ACTUALIZAR ORDEN: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar la Orden
actualizarOrden(orden: Orden){

  let url = URL_SERVICIOS + '/orden/' + orden._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, orden)
                  .pipe(
                    map( (resp: any) => {

                      return resp.orden;

                    })

                  );

}


// ==========================================================================
//             +++++++++++ MOSTRAR ORDEN: GET by ID ++++++++++++++
// ==========================================================================
// Servicio Crear  ordenes en la tabla Ordenes
obtenerOrden(id: string) {

  // la url la toma del archivo de configuracion
  const url = URL_SERVICIOS + '/orden' + id;

  return this.http.get( url )
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);
                      return resp.orden;

                    })
                    );

}




// ==========================================================================
//             +++++++++++ BUSCAR ORDENES: GET BY Termino ++++++++++++++
// ==========================================================================
// metodo para buscar ordenes por Razon - Cronograma
buscarOrden( termino: string ) {


  const characters = /[&\/\\#,+()$~%.'":*?<>{}]/g;

  // valida si el valor del input es vacio y evita caracteres Especiales
  if (termino.match(characters)) {

    return of([]); // envia la respuesta como una promesa

  } else {

    const url = URL_SERVICIOS + '/busqueda/coleccion/ordenes/' + termino;

    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.ordenes)
                    );

   }

}
// ==========================================================================
//             +++++++++++ BUSCAR ORDENES: GET BY Termino ++++++++++++++
// ==========================================================================
// metodo para buscar ordenes por Razon - Cronograma - secuencia - observacion - descripcion - ciudad
buscarOrdenesByChart( termino: string ) {


  const characters = /[&\/\\#,+()$~%.'":*?<>{}]/g;

  // valida si el valor del input es vacio y evita caracteres Especiales
  if (termino.match(characters)) {

    return of([]); // envia la respuesta como una promesa

  } else {

    const url = URL_SERVICIOS + '/busqueda/coleccion/ordenesbychar/' + termino;

    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.ordenesbychar)
                    );

   }

}



// ==========================================================================
//             +++++++++++ BORRAR ORDEN: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio Crear  ordenes en la tabla Ordenes
borrarOrden(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/orden/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('Orden Eliminada', 'Se elimino correctamente', 'success');
                    })
                    );
}
borrarOrdenByGestor(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/orden/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url);
}



}// END Class
