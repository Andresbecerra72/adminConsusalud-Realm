import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from 'src/app/models/usuario.model';
import { Tarifa } from 'src/app/models/tarifa.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {

   // Variables para validar si el usuario esta logeado
   usuario: Usuario;
   token: string;

   totalRegistros: number = 0;

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
//             +++++++++++ MOSTRAR Tarifas Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Tarifas
obtenerTarifaTodas() {

  const url = URL_SERVICIOS + '/tarifa/all';
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ CREAR TARIFAS: POST ++++++++++++++
// ==========================================================================
// Servicio Crear  ordenes en la tabla Ordenes
guardandoTarifas( tarifa: Tarifa ) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/tarifa';
  url += '?token=' + this.token;

  return this.http.post( url, tarifa)
                  .pipe(
                  map( (resp: any) => {

                    // console.log(resp);
                    return true;
                  })
                  );

}



// ==========================================================================
//             +++++++++++ MOSTRAR TARIFA: GET by CODIGO ++++++++++++++
// ==========================================================================
// Servicio para mostrar orden por codigo
obtenerTarifaCosto(codigo: string) {

  // la url la toma del archivo de configuracion
  const url = URL_SERVICIOS + '/tarifa/' + codigo;

  return this.http.get( url )
                  .pipe(
                    map( (resp: any) => {

                       // console.log(resp);
                       return resp.codigo.costo;

                    })
                    );

}





} // END class
