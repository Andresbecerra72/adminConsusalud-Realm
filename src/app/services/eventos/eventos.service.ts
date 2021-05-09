import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import Swal from 'sweetalert2';

import { URL_SERVICIOS } from 'src/app/config/config';

import { Usuario } from 'src/app/models/usuario.model';
import { Evento } from 'src/app/models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventosService {


  // Variables para validar si el usuario esta logeado
  usuario: Usuario;
  token: string;

 constructor(private http: HttpClient) {
   this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario
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
//             +++++++++++ CREAR EVENTO: POST ++++++++++++++
// ==========================================================================
// Servicio Crear Evento
  guardandoEvento(evento: Evento) {

    evento.usuario = this.usuario; // le asigna el usuario al registro

  // la url la toma del archivo de configuracion
    let url = URL_SERVICIOS + '/evento';
    url += '?token=' + this.token;

    return this.http.post( url, evento)
                    .pipe(
                    map( (resp: any) => {

                      // console.log(resp);
                      return resp;
                    })
                    );

  }


// ==========================================================================
//             +++++++++++ MOSTRAR EVENTO Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Evento
obtenerEventoTodas() {

  const url = URL_SERVICIOS + '/evento/all';
  return this.http.get( url );


}
// ==========================================================================
//             +++++++++++ MOSTRAR EVENTO Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar los eventos de un mes de 15 a 15
obtenerEventoByMonth() {

  const url = URL_SERVICIOS + '/evento/month';
  return this.http.get( url );


}

// ==========================================================================
//  +++++++++++ MOSTRAR EVENTO por NOMBRE: GET by NOMBRE ++++++++++++++
// ==========================================================================
// metodo para mostrar una EVENTO por nombre
obtenerEventoByName(title: string) {

  const url = URL_SERVICIOS + '/evento/' + title;
  return this.http.get( url );


}
// ==========================================================================
//  +++++++++++ MOSTRAR EVENTO por ID: GET by ID ++++++++++++++
// ==========================================================================
// metodo para mostrar una EVENTO por nombre
obtenerEventoById(id: string) {

  const url = URL_SERVICIOS + '/evento/ident/' + id;
  return this.http.get( url );


}

// ==========================================================================
//      +++++++++++ BUSCAR EVENTOS: GET BY Termino ++++++++++++++
// ==========================================================================
// metodo para buscar los Eventos por coleccion - Tabla
buscarEventos( year: string, month: string ) {

  const url = URL_SERVICIOS + '/evento/get/' + year + '/' + month;

  return this.http.get( url );



}


// ==========================================================================
//      +++++++++++ BUSCAR EVENTOS: GET BY Fecha ++++++++++++++
// ==========================================================================
// metodo para buscar los Eventos por Fecha
buscarEventosByDate( fecha: string ) {

  const url = URL_SERVICIOS + '/busqueda/coleccion/eventos/' + fecha;

  return this.http.get( url );



}

// ==========================================================================
//      +++++++++++ BUSCAR EVENTOS: GET BY Fecha ++++++++++++++
// ==========================================================================
// metodo para buscar los Eventos por Fecha
buscarEventosByTitle( termino: string ) {

  const characters = /[&\/\\#,+()$~%.'":*?<>{}]/g;
  const result = {
    ok: true,
    eventstitle: []
  };

  // valida si el valor del input es vacio y evita caracteres Especiales
  if (termino.match(characters)) {

    return of(result); // envia la respuesta como una promesa - es un arreglo vacio

  } else {

    const url = URL_SERVICIOS + '/busqueda/coleccion/eventstitle/' + termino;

    return this.http.get( url );

   }


}




// ==========================================================================
//             +++++++++++ ACTUALIZAR Evento: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarEvento(evento: Evento){

  // console.log(evento);

  let url = URL_SERVICIOS + '/evento/' + evento._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, evento)
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);

                      return resp.evento;

                    })

                  );

}


// ==========================================================================
//             +++++++++++ BORRAR Evento: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro Evento en la Tabla Evento
borrarEvento(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/evento/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);

                      Swal.fire('Pragramación Eliminada', 'Se elimino correctamente', 'success');
                    })
                    );
}







} // END class
