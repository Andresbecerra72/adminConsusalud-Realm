import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';
import { Contratante } from '../../models/contratante.model';

@Injectable({
  providedIn: 'root'
})
export class ContratanteService {

    // Variables para validar si el usuario esta logeado
    usuario: Usuario;
    token: string;

    contratanteArray: Contratante[] = [];

  constructor(private http: HttpClient) {

    this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario

    console.log('Constructor - Servicio Contratantes');

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
//             +++++++++++ CREAR ARL: POST ++++++++++++++
// ==========================================================================
// Servicio Crear  ARL en la tabla Contratantes
guardandoArl( contratante: Contratante){

  contratante.usuario = this.usuario; // le asigna el usuario al registro

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/contratante';
  url += '?token=' + this.token;

  return this.http.post( url, contratante)
                  .pipe(
                  map( (resp: any) => {

                    // console.log(resp);
                    return resp;
                  })
                  );


}



// ==========================================================================
//             +++++++++++ MOSTRAR ARL CON PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las ARLs con paginacion
obtenerArls( pagina: number = 0) {

  const url = URL_SERVICIOS + '/contratante?pagina=' + pagina;
  return this.http.get( url );


}

// ==========================================================================
//             +++++++++++ MOSTRAR ARL Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las ARLs con paginacion
obtenerArlsTodas() {

  const url = URL_SERVICIOS + '/contratante/all';
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR ARL por NOMBRE: GET by NOMBRE ++++++++++++++
// ==========================================================================
// metodo para mostrar una ARL por nombre
obtenerArlByName(nombre: string) {

  const url = URL_SERVICIOS + '/contratante/' + nombre;
  return this.http.get( url );


}



// ==========================================================================
//             +++++++++++ ACTUALIZAR ARL: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarArl(contratante: Contratante){

  // console.log(contratante);

  let url = URL_SERVICIOS + '/contratante/' + contratante._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, contratante)
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);
                      return resp;

                    })

                  );

}

// ==========================================================================
//       +++++++++++ REGISTRAR NUEVA EMPRESAR y ASESOR EN LA ARL: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
ingresarDatasIntoArl(contratante: Contratante, data: string){

  let url = URL_SERVICIOS + '/contratante/update/' + data + '/' + contratante._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, contratante)
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);
                      return true;

                    })

                  );

}



// ==========================================================================
//             +++++++++++ BORRAR ARL: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro ARL en la Tabla Contratante
borrarArl(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/contratante/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('ARL Eliminada', 'Se elimino correctamente', 'success');
                    })
                    );
}







} // END class
