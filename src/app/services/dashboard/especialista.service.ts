import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { URL_SERVICIOS } from 'src/app/config/config';

import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';



@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  // Variables para validar si el usuario esta logeado
  usuario: Usuario;
  token: string;

 constructor(private http: HttpClient) {

   this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario

   console.log('Constructor - Servicio Especialista');

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
//             +++++++++++ CREAR ESPECIALISTA: POST ++++++++++++++
// ==========================================================================
// Servicio Crear Especialista
  guardandoEspecialista(especialista: Especialista) {

    especialista.usuario = this.usuario; // le asigna el usuario al registro

  // la url la toma del archivo de configuracion
    let url = URL_SERVICIOS + '/especialista';
    url += '?token=' + this.token;

    return this.http.post( url, especialista)
                    .pipe(
                    map( (resp: any) => {

                      // console.log(resp);
                      return resp;
                    })
                    );

  }


// ==========================================================================
//             +++++++++++ MOSTRAR ESPECIALISTA Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Especialista
obtenerEspecialistaTodas() {

  const url = URL_SERVICIOS + '/especialista/all';
  return this.http.get( url );


}


// ==========================================================================
//  +++++++++++ MOSTRAR ESPECIALISTA por NOMBRE: GET by NOMBRE ++++++++++++++ se envian mas Datos porque la consulta no esta funcionando
// ==========================================================================
// metodo para mostrar una ESPECIALISTA por nombre
obtenerEspecialistaByName(especialista: Especialista) {

  const nombre = especialista.nombre.toString();

  const url = URL_SERVICIOS + '/especialista/' + nombre;
  return this.http.get( url );


}
// ==========================================================================
//  +++++++++++ MOSTRAR ESPECIALISTA por NOMBRE: GET by NOMBRE ++++++++++++++ se envian mas Datos porque la consulta no esta funcionando
// ==========================================================================
// metodo para mostrar una ESPECIALISTA por nombre
buscarEspecialistaByEmail(correo: string) {

  const url = URL_SERVICIOS + '/especialista/getemail/' + correo;
  return this.http.get( url );


}


// ==========================================================================
//      +++++++++++ MOSTRAR ESPECIALISTA por ID: GET by ID ++++++++++++++
// ==========================================================================
// metodo para mostrar una ESPECIALISTA por ID
obtenerEspecialistaByID(id: string) {

  const url = URL_SERVICIOS + '/especialista/ident/' + id;
  return this.http.get( url );

}



// ==========================================================================
//      +++++++++++ BUSCAR ESPECIALISTAS: GET BY Termino ++++++++++++++
// ==========================================================================
// metodo para buscar los Especialistas por coleccion - Tabla
buscarEspecialista( termino: string ) {

  const characters = /[&\/\\#,+()$~%.'":*?<>{}]/g;

  // valida si el valor del input es vacio y evita caracteres Especiales
  if (termino.match(characters)) {

    return of([]); // envia la respuesta como una promesa

  } else {

    const url = URL_SERVICIOS + '/busqueda/coleccion/especialistas/' + termino;

    return this.http.get( url )
                  .pipe(
                    map( (resp: any) => resp.especialistas)
                  );


  }







}

// ==========================================================================
// +++++++++ BUSCAR ESPECIALISTAS: GET BY Especialidad y Ciudad +++++++++++
// ==========================================================================
// metodo para buscar los Especialistas por coleccion - Tabla
getEspecialista(ciudad?: string, profesion?: string, fecha?: string ) {

  // console.log(ciudad, profesion);

  const url = URL_SERVICIOS + '/especialista/get/' + ciudad + '/' + profesion;
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ ACTUALIZAR Especialista: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarEspecialista(especialista: Especialista){

  let url = URL_SERVICIOS + '/especialista/' + especialista._id;
  url += '?token=' + this.token;

  return this.http.put(url, especialista)
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);


                      return resp.especialista;

                    })

                  );

}



// ==========================================================================
//             +++++++++++ BORRAR Especialista: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro Especialista en la Tabla Especialista
borrarEspecialista(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/especialista/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('Especilistas Eliminado', 'Se elimino correctamente', 'success');
                    })
                    );
}






}// END class
