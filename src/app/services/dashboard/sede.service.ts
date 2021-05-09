import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { URL_SERVICIOS } from 'src/app/config/config';
import { EmpresaService } from './empresa.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Sede } from 'src/app/models/sede.model';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class SedeService {

   // Variables para validar si el usuario esta logeado
   usuario: Usuario;
   token: string;

   sedeArray: Sede[] = [];

 constructor(private http: HttpClient,
             private empresaService: EmpresaService) {

   this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario

   console.log('Constructor - Servicio Sedes');

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
//             +++++++++++ MOSTRAR Sedes CON PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Sedess con paginacion
obtenerSedes( pagina: number = 0) {

  const url = URL_SERVICIOS + '/sede?pagina=' + pagina;
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR SEDE Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Sedes
obtenerSedesTodas() {

  const url = URL_SERVICIOS + '/sede/all';
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR SEDE por NOMBRE: GET by NOMBRE ++++++++++++++
// ==========================================================================
// metodo para mostrar una SEDE por nombre
obtenerSedeByName(nombre: string) {

  const url = URL_SERVICIOS + '/sede/' + nombre;
  return this.http.get( url );


}




// ==========================================================================
//             +++++++++++ CREAR Sede: POST ++++++++++++++
// ==========================================================================
// Servicio Crear  Sede en la tabla Sedes
guardandoSede(sede: Sede){

  sede.usuario = this.usuario; // le asigna el usuario al registro

  if (sede.empresa) { // le asigna el contratante
    this.empresaService.obtenerEmpresaByName(sede.empresa.razon)
                            .subscribe( (resp: any) => {
                              // console.log(resp.empresa);
                              sede.empresa = resp.empresa;
                            });
  }


  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/sede';
  url += '?token=' + this.token;

  return this.http.post( url, sede)
                  .pipe(
                  map( (resp: any) => {

                    // console.log(resp);
                    return resp;
                  })
                  );


}



// ==========================================================================
//             +++++++++++ ACTUALIZAR Sede: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarSede(sede: Sede){



  let url = URL_SERVICIOS + '/sede/' + sede._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, sede)
                  .pipe(
                    map( (resp: any) => {

                      return resp.sede;

                    })

                  );

}



// ==========================================================================
//             +++++++++++ BORRAR Sede: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro Sede en la Tabla Sede
borrarSede(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/sede/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('Sede Eliminada', 'Se elimino correctamente', 'success');
                    })
                    );
}


} // END class
