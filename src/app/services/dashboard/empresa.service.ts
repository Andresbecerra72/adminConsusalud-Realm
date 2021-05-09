import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { ContratanteService } from './contratante.service';
import { URL_SERVICIOS } from 'src/app/config/config';

import { Usuario } from 'src/app/models/usuario.model';
import { Empresa } from 'src/app/models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

   // Variables para validar si el usuario esta logeado
   usuario: Usuario;
   token: string;

   empresaArray: Empresa[] = [];

 constructor(private http: HttpClient,
             private contratanteService: ContratanteService) {

   this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario

   console.log('Constructor - Servicio Empresas');

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
//             +++++++++++ MOSTRAR Empresa CON PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Empresas con paginacion
obtenerEmpresas( pagina: number = 0) {

  const url = URL_SERVICIOS + '/empresa?pagina=' + pagina;
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR EMPRESA Sin PAGINACION: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar las Empresas con paginacion
obtenerEmpresasTodas() {

  const url = URL_SERVICIOS + '/empresa/all';
  return this.http.get( url );


}


// ==========================================================================
//             +++++++++++ MOSTRAR EMPRESA por NOMBRE: GET by NOMBRE ++++++++++++++
// ==========================================================================
// metodo para mostrar una EMPRESA por nombre
obtenerEmpresaByName(nombre: string) {

  const url = URL_SERVICIOS + '/empresa/' + nombre;
  return this.http.get( url );


}

// ==========================================================================
//      +++++++++++ MOSTRAR EMPRESA por ID: GET by ID ++++++++++++++
// ==========================================================================
// metodo para mostrar una EMPRESA por ID
obtenerEmpresaByID(id: string) {

  const url = URL_SERVICIOS + '/empresa/ident/' + id;
  return this.http.get( url );

}




// ==========================================================================
//             +++++++++++ CREAR Empresa: POST ++++++++++++++
// ==========================================================================
// Servicio Crear  Empresa en la tabla empresas
guardandoEmpresa(empresa: Empresa){

  empresa.usuario = this.usuario; // le asigna el usuario al registro

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/empresa';
  url += '?token=' + this.token;

  return this.http.post( url, empresa)
                  .pipe(
                  map( (resp: any) => {

                    return resp;
                  })
                  );


}



// ==========================================================================
//             +++++++++++ ACTUALIZAR Empresa: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el registro
actualizarEmpresa(empresa: Empresa){

  // console.log(empresa);

  let url = URL_SERVICIOS + '/empresa/' + empresa._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, empresa)
                  .pipe(
                    map( (resp: any) => {

                      return resp.empresa;

                    })

                  );

}


// ======================================================================================
// ++++++++ REGISTRAR NUEVA SEDE y Actualiza la Orden  EN LA EMPRESA: PUT ++++++++++++++
// =====================================================================================
// metodo para actualizar el registro
ingresarSedeOrdenIntoEmpresa(empresa: Empresa){

  let url = URL_SERVICIOS + '/empresa/update/' + empresa._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, empresa)
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);
                      return true;

                    })

                  );

}





// ==========================================================================
//             +++++++++++ BUSCAR EMPRESAS: GET BY Termino ++++++++++++++
// ==========================================================================
// metodo para buscar las Empresas por coleccion - Tabla
buscarEmpresa( termino: string ) {

  const characters = /[&\/\\#,+()$~%.'":*?<>{}]/g;

  // valida si el valor del input es vacio y evita caracteres Especiales
  if (termino.match(characters)) {

    return of([]); // envia la respuesta como una promesa

  } else {

    const url = URL_SERVICIOS + '/busqueda/coleccion/empresas/' + termino;

    return this.http.get( url )
                  .pipe(
                    map( (resp: any) => resp.empresas)
                  );

  }

}



// ==========================================================================
//             +++++++++++ BORRAR Empresa: DELETE by ID ++++++++++++++
// ==========================================================================
// Servicio eliminar registro Empresa en la Tabla empresa
borrarEmpresa(id: string) {

  // la url la toma del archivo de configuracion
  let url = URL_SERVICIOS + '/empresa/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
                  .pipe(
                    map( (resp: any) => {
                      Swal.fire('Empresa Eliminada', 'Se elimino correctamente', 'success');
                    })
                    );
}




} // END class
