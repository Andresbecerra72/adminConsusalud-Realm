import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

import { Usuario } from 'src/app/models/usuario.model';
import { Profesion } from 'src/app/models/profesion';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Ciudad } from 'src/app/models/ciudad';

@Injectable({
  providedIn: 'root'
})
export class ConfiguresService {

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
//             +++++++++++ CREAR PROFESION: POST ++++++++++++++
// ==========================================================================
// Servicio Crear Profesion
  crearProfesion(profesion: Profesion) {

    profesion.usuario = this.usuario; // le asigna el usuario al registro

  // la url la toma del archivo de configuracion
    let url = URL_SERVICIOS + '/profesion';
    url += '?token=' + this.token;

    return this.http.post( url, profesion )
                    .pipe(
                    map( (resp: any) => {

                      // console.log(resp);
                      return resp;
                    })
                    );

  }


// ==========================================================================
//          +++++++++++ CREAR CIUDAD: POST ++++++++++++++
// ==========================================================================
// Servicio Crear Ciudad
  crearCiudad(ciudad: Ciudad) {

    ciudad.usuario = this.usuario; // le asigna el usuario al registro

  // la url la toma del archivo de configuracion
    let url = URL_SERVICIOS + '/ciudad';
    url += '?token=' + this.token;

    return this.http.post( url, ciudad )
                    .pipe(
                    map( (resp: any) => {

                      // console.log(resp);
                      return resp;
                    })
                    );

  }


// ==========================================================================
//             +++++++++++ MOSTRAR PROFESION Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Profesion
obtenerProfesionTodas() {

  const url = URL_SERVICIOS + '/profesion/all';
  return this.http.get( url );


}
// ==========================================================================
//      +++++++++++ MOSTRAR CIUDAD Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Ciudad
obtenerCiudadTodas() {

  const url = URL_SERVICIOS + '/ciudad/all';
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR PROFESION por NOMBRE: GET by NOMBRE ++++++++++++++
// ==========================================================================
// metodo para mostrar una PROFESION por nombre
obtenerProfesionByName(nombre: string) {

  const url = URL_SERVICIOS + '/profesion/' + nombre;
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR CIUDAD por NOMBRE: GET by NOMBRE ++++++++++++++
// ==========================================================================
// metodo para mostrar una CIUDAD por nombre
obtenerCiudadByName(nombre: string) {

  const url = URL_SERVICIOS + '/ciudad/' + nombre;
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ ACTUALIZAR Profesion: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarProfesion(profesion: Profesion){

  // console.log(profesion);

  let url = URL_SERVICIOS + '/profesion/' + profesion._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, profesion)
                  .pipe(
                    map( (resp: any) => {

                      return true;

                    })

                  );

}

// ==========================================================================
//             +++++++++++ ACTUALIZAR Ciudad: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarCiudad(ciudad: Ciudad){

  // console.log(ciudad);

  let url = URL_SERVICIOS + '/ciudad/' + ciudad._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, ciudad)
                  .pipe(
                    map( (resp: any) => {

                      return true;

                    })

                  );

}


// ==========================================================================
//             +++++++++++ BORRAR Profesion: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro Profesion en la Tabla Profesion
borrarProfesion(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/profesion/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('Profesion Eliminada', 'Se elimino correctamente', 'success');
                    })
                    );
}

// ==========================================================================
//             +++++++++++ BORRAR Ciudad: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro Ciudad en la Tabla Ciudad
borrarCiudad(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/ciudad/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('Ciudad Eliminada', 'Se elimino correctamente', 'success');
                    })
                    );
}

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
eliminarCollection(collection: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/dropped/' + collection;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);
                      return resp;

                    })
                    );



}


}// END class
