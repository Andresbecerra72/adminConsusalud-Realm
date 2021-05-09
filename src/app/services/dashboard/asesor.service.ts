import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ContratanteService } from './contratante.service';

import { Usuario } from 'src/app/models/usuario.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Asesor } from '../../models/asesor';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AsesorService {

  // Variables para validar si el usuario esta logeado
  usuario: Usuario;
  token: string;



constructor(private http: HttpClient,
            private contratanteService: ContratanteService) {

  this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario

  console.log('Constructor - Servicio Asesor');

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
//             +++++++++++ MOSTRAR Asesores CON PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Asesores con paginacion
obtenerAsesores( pagina: number = 0) {

  const url = URL_SERVICIOS + '/asesor?pagina=' + pagina;
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR AESORES Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Asesores
obtenerAsesoresTodas() {

  const url = URL_SERVICIOS + '/asesor/all';
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR ASESOR por NOMBRE: GET by NOMBRE ++++++++++++++
// ==========================================================================
// metodo para mostrar una ASESOR por nombre
obtenerAsesorByName(nombre: string) {

  const url = URL_SERVICIOS + '/asesor/' + nombre;
  return this.http.get( url );


}





// ==========================================================================
//             +++++++++++ CREAR Asesor: POST ++++++++++++++
// ==========================================================================
// Servicio Crear  Asesor en la tabla Asesors
guardandoAsesor(asesor: Asesor){

  asesor.usuario = this.usuario; // le asigna el usuario al registro

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/asesor';
  url += '?token=' + this.token;

  return this.http.post( url, asesor)
                  .pipe(
                  map((resp: any) => {

                    // console.log(resp);

                    return resp;
                  })
                  );


}


// ==========================================================================
//             +++++++++++ ACTUALIZAR Asesor: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarAsesor(asesor: Asesor){

  let url = URL_SERVICIOS + '/asesor/' + asesor._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, asesor)
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);

                      return resp.asesor;

                    })

                  );

}



// ==========================================================================
//             +++++++++++ BORRAR Asesor: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro Asesor en la Tabla Asesor
borrarAsesor(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/asesor/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('Asesor Eliminado', 'Se elimino correctamente', 'success');
                    })
                    );
}








}// END class
