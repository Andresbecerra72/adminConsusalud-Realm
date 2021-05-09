import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from 'src/app/config/config';

import { Especialista } from 'src/app/models/especialista.model';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  // variables
  public arrayPathsSoportes: any[] = [];
  public arrayPathsArchivos: any[] = [];

  constructor(private http: HttpClient) {

    console.log('Constructor - Servicio Upload');
    this.imagenesPathSoportes().subscribe(); // codigo para almacenar la imagenes de los Soportes
    this.imagenesPathArchivos().subscribe(); // codigo para almacenar la imagenes de los Arcivos
   }


// ==========================================================================
//        COPIAR IMAGEN DE USUARIO EN DIRECTORIO DEL ESPECIALISTA: PUT
// ==========================================================================
// metodo copiar el archivo imagen del usuario y asignarlo al especialista - en BD
moverArchivoImg(tipo: string, especialista: Especialista) {


  const url = URL_SERVICIOS + '/upload/movefile/' + tipo + '/' + especialista._id;

  return this.http.put(url, especialista)
                  .pipe(
                    map( (resp: any) => {

                      // console.log(resp);

                      return resp;

                    })

                  );


}


// ==========================================================================
//               SUBIR ARCHIVO SOPORTE: PUT
// ==========================================================================
// metodo para subir Archivos
subirArchivoSoportes(archivo: File, tipo: string, IDsoporte: string, id: string) {

  return new Promise( (resolve, reject) => { // el servicio retorna una promesa

    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append( 'soporte', archivo, archivo.name);


    xhr.onreadystatechange = () => { // funcion para verificar algun cambio

      if (xhr.readyState === 4) {
            if (xhr.status === 200) {

              console.log('Soporte Guardado en Server');
              resolve( JSON.parse(xhr.response) ); // respuesta del backend

            }else {
              console.log( 'Fallo la carga del archivo' );
              reject( JSON.parse(xhr.response) );

            }
         }
    };

  // si todo es valido
    const url = URL_SERVICIOS + '/upload/upfile/' + tipo + '/' + IDsoporte + '/' + id;

    xhr.open('PUT', url, true);
    xhr.send( formData );

  });

}

// ==========================================================================
//               SUBIR ARCHIVO IMAGEN: PUT
// ==========================================================================
// metodo para subir Archivos
subirArchivo(archivo: File, tipo: string, id: string) {

  return new Promise( (resolve, reject) => { // el servicio retorna una promesa

    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append( 'imagen', archivo, archivo.name);


    xhr.onreadystatechange = () => { // funcion para verificar algun cambio

      if (xhr.readyState === 4) {
            if (xhr.status === 200) {

              console.log('Imagen Subida en Server');
              resolve( JSON.parse(xhr.response) ); // respuesta del backend

            }else {
              console.log( 'Fallo la carga del archivo' );
              reject( JSON.parse(xhr.response) );

            }
         }
    };

  // si todo es valido
    const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;

    xhr.open('PUT', url, true);
    xhr.send( formData );




  });

}
// ==========================================================================
//               SUBIR ARCHIVO SELFIE: PUT
// ==========================================================================
// metodo para subir Archivos
subirSelfie(archivo: File, tipo: string, id: string) {

  return new Promise( (resolve, reject) => { // el servicio retorna una promesa

    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append( 'selfie', archivo, archivo.name);


    xhr.onreadystatechange = () => { // funcion para verificar algun cambio

      if (xhr.readyState === 4) {
            if (xhr.status === 200) {

              console.log('Selfie Subida en Server');
              resolve( JSON.parse(xhr.response) ); // respuesta del backend

            }else {
              console.log( 'Fallo la carga de la Imagen Selfie' );
              reject( JSON.parse(xhr.response) );

            }
         }
    };

  // si todo es valido
    const url = URL_SERVICIOS + '/upload/selfie/' + tipo + '/' + id;

    xhr.open('PUT', url, true);
    xhr.send( formData );




  });

}



// -----------------------------------------------------------------------------
//             Imagenes Services                                                 *****SOLO PARA GOOGEL CLOUDS
// -----------------------------------------------------------------------------
// este metodo carga en un array los Path de las imagenes de los soportes - Selfie
imagenesPathSoportes() {


  if (this.arrayPathsSoportes.length > 0) {

    // console.log('Desde Cache');
    return of(this.arrayPathsSoportes);

  }else {

    // console.log('Desde Server');
    const url = URL_SERVICIOS + '/soportes/all';

    return this.http.get( url )
                  .pipe(
                    tap(
                      (resp: any) => {

                        if (resp.soportes) {

                          if (resp.soportes.length > 0) {

                            for (const item of resp.soportes) {

                             if (item.path) {
                              this.arrayPathsSoportes.push({
                                _id: item._id,
                                path: item.path
                              });
                             }

                            }
                          }

                        }


                      }
                    )
                   );


  }





}

imagenesPathArchivos() {


  if (this.arrayPathsArchivos.length > 0) {

    // console.log('Desde Cache');
    return of(this.arrayPathsArchivos);

  }else {

    // console.log('Desde Server');
    const url = URL_SERVICIOS + '/archivos/all';

    // validar las extenciones de imagen
    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    return this.http.get( url )
                  .pipe(
                    tap(
                      (resp: any) => {

                        if (resp.archivos) {

                          if (resp.archivos.length > 0) {

                            for (const item of resp.archivos) {

                            if (extensionesValidas.indexOf(item.file_ext) >= 0) { // condicion para validar el tipo de extension

                                 this.arrayPathsArchivos.push({ // almacena solo imagenes
                                   _id: item._id,
                                   path: item.path
                                 });

                            }

                           }
                         }

                        }
                      }
                    )
                   );


  }





}



} // END class
