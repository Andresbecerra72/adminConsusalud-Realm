import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Soportes } from 'src/app/models/soportes.model';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SoportesService {


   // Variables para validar si el usuario esta logeado
   usuario: Usuario;
   token: string;



 constructor(private http: HttpClient) {

   this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario

   console.log('Constructor - Servicio Soportes');

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
//             +++++++++++ MOSTRAR Soportes CON PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Soportes con paginacion
obtenerSoportes( pagina: number = 0) {

  const url = URL_SERVICIOS + '/soportes?pagina=' + pagina;
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR Soporte Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Soportes
obtenerSoportesTodas() {

  const url = URL_SERVICIOS + '/soportes/all';
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR Soportes por NOMBRE: GET by NOMBRE ++++++++++++++
// ==========================================================================
// metodo para mostrar una Soportes por nombre
obtenerSoportesByName(nombre: string) {

  const url = URL_SERVICIOS + '/soportes/' + nombre;
  return this.http.get( url );


}

// ==========================================================================
//             +++++++++++ MOSTRAR Soportes por ID: GET by ID ++++++++++++++
// ==========================================================================
// metodo para mostrar una Soportes por ID
obtenerSoportesByID(id: string) {

  const url = URL_SERVICIOS + '/soportes/ident/' + id;
  return this.http.get( url )
                .pipe(
                  map((resp: any) => {
                    return resp.soportes;
                  })
                  );


}




// ==========================================================================
//             +++++++++++ CREAR Soportes: POST ++++++++++++++
// ==========================================================================
// Servicio Crear  Soportes en la tabla Soportess
guardandoSoportes(soportes: Soportes){

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/soportes';
  url += '?token=' + this.token;

  return this.http.post( url, soportes)
                  .pipe(
                  map( (resp: any) => {

                    // console.log(resp);
                    return resp;
                  })
                  );


}



// ==========================================================================
//             +++++++++++ ACTUALIZAR Soportes: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarSoportes(soportes: Soportes){

  let url = URL_SERVICIOS + '/soportes/' + soportes._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, soportes)
                  .pipe(
                    map( (resp: any) => {
                      return resp.soportes;

                    })

                  );

}



// ==========================================================================
//             +++++++++++ BORRAR Soportes: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro Soportes en la Tabla Soportes
borrarSoportes(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/soportes/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('Soporte Eliminado', 'Se elimino correctamente', 'success');
                    })
                    );
}




} // END class
