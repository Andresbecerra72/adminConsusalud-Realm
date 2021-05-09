import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { URL_SERVICIOS } from 'src/app/config/config';

import { Usuario } from 'src/app/models/usuario.model';
import { Cuenta } from 'src/app/models/cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {


   // Variables para validar si el usuario esta logeado
   usuario: Usuario;
   token: string;



 constructor(private http: HttpClient) {

   this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario

   console.log('Constructor - Servicio Cuentas');

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
//             +++++++++++ MOSTRAR CUENTA CON PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las cuenta con paginacion
obtenerCuenta( pagina: number = 0) {

  const url = URL_SERVICIOS + '/cuenta?pagina=' + pagina;
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR CUENTA Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las cuenta
obtenerCuentaTodas() {

  const url = URL_SERVICIOS + '/cuenta/all';
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR CUENTA por NOMBRE: GET by NOMBRE ++++++++++++++
// ==========================================================================
// metodo para mostrar una cuenta por nombre
obtenerCuentaByName(nombre: string) {

  const url = URL_SERVICIOS + '/cuenta/' + nombre;
  return this.http.get( url );


}

// ==========================================================================
//             +++++++++++ MOSTRAR CUENTA por ID: GET by ID ++++++++++++++
// ==========================================================================
// metodo para mostrar una cuenta por ID
obtenerCuentaByID(id: string) {

  const url = URL_SERVICIOS + '/cuenta/ident/' + id;
  return this.http.get( url )
                .pipe(
                  map((resp: any) => {
                    return resp.cuenta;
                  })
                  );


}




// ==========================================================================
//             +++++++++++ CREAR CUENTA: POST ++++++++++++++
// ==========================================================================
// Servicio Crear  cuenta en la tabla cuentas
guardandoCuenta(cuenta: Cuenta){

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/cuenta';
  url += '?token=' + this.token;

  return this.http.post( url, cuenta)
                  .pipe(
                  map( (resp: any) => {

                    // console.log(resp);
                    return resp;
                  })
                  );


}



// ==========================================================================
//             +++++++++++ ACTUALIZAR CUENTA: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarCuenta(cuenta: Cuenta){

  let url = URL_SERVICIOS + '/cuenta/' + cuenta._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, cuenta)
                  .pipe(
                    map( (resp: any) => {
                      return resp.cuenta;

                    })

                  );

}



// ==========================================================================
//             +++++++++++ BORRAR CUENTA: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro cuenta en la Tabla cuenta
borrarCuenta(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/cuenta/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('Cuenta Eliminada', 'Se elimino correctamente', 'success');
                    })
                    );
}


} // END class
