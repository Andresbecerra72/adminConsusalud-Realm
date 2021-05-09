import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { URL_SERVICIOS, GOOGLE_URL } from 'src/app/config/config';

import { UploadService } from 'src/app/services/upload/upload.service';



@Pipe({
  name: 'imagen' // ******** Cambiar el PIPE con Deploy en GOOGLE
})

/***
 *
 * con Deploy en Google cloud se mofifica el uso del Pipe para gestionar la vista de las Imagenes
 *
 */



// ================================================================================================================
//                                              PIPE -Original
// ================================================================================================================
/*  // Remove for flight ****

      export class ImagenPipe implements PipeTransform {

        constructor(private sanitizer: DomSanitizer) {}

        transform(img: string, tipo: string = 'usuario'): any {

          let url = URL_SERVICIOS + '/img';

          if (!img) {
            //  return url + '/usuarios/xxxx';
            return this.sanitizer.bypassSecurityTrustResourceUrl(url + '/usuarios/xxxx');
          }

          if (img.indexOf('https') >= 0) { // si la imagen es de Google
            return img;
          }

          switch (tipo){

                case 'usuario':
                    url += '/usuarios/' + img;
                    break;
                case 'especialista':
                  url += '/especialistas/' + img;
                  break;
                case 'empresa':
                  url += '/empresas/' + img;
                  break;
                  case 'soporte':
                    url += '/soporte/' + img + '?' + Math.random() * 100000000000000000000; // codigo para actualiar la imagen dinamicamente
                    break;
                  case 'archivo':
                    url += '/archivo/' + img;
                    break;
                default:
                  console.log('Tipo de imagen Invalido');
                  url += '/usuarios/xxxx';

          }



          return this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }

      } // END class

  */ // Remove for flight ****





// ================================================================================================================
//                                          PIPE - GOOGLE DEPLOY
// ================================================================================================================


export class ImagenPipe implements PipeTransform {

  // variables
  imgSoportesArray: any[] = [];
  imgArchivosArray: any[] = [];

  // ----------------Constructor------------------------------------
  constructor(private sanitizer: DomSanitizer,
              private uploadService: UploadService) {

                  // almacena los datos de los Paths Image de los soportes
                  this.imgSoportesArray = this.uploadService.arrayPathsSoportes;
                  this.imgArchivosArray = this.uploadService.arrayPathsArchivos;
                  // console.log('Pipe-Imagen');


              }

// ------------------Transform---------------------------------------------------
  transform(img: string, tipo: string = 'usuario'): any {

    let urlServer = URL_SERVICIOS + '/img'; // Server
    let url = GOOGLE_URL + '/uploads';

    // ------------------------------------------------

    // valida el tipo de imagen que ingresa al PIPE
    if (!img || img === 'xxxx') { // para el modal de carga de imagenes
     //  return url + '/usuarios/xxxx';
      return this.sanitizer.bypassSecurityTrustResourceUrl(urlServer + '/usuarios/xxxx');
    }

    // si la imagen es de Google
    if (img.indexOf('https') >= 0) { // coincidencia = 0
      return img;
    }

    if (tipo === 'soporte' && img.indexOf('https') === -1 ) { // No coincidencia = -1

      url = this.cargarPathsImg(tipo, img); // Los Paths ya estan cargados por el servicio en UploadService
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);

    }

    if (tipo === 'archivo' && img.indexOf('https') === -1 ) { // No coincidencia = -1

      url = this.cargarPathsImg(tipo, img); // Los Paths ya estan cargados por el servicio en UploadService
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);

    }




    switch (tipo){

          case 'usuario':
             url += '/usuarios/' + img;
             break;
          case 'especialista':
            url += '/especialistas/' + img;
            break;
          case 'empresa':
            url += '/empresas/' + img;
            break;
         default:
            console.log('Tipo de imagen Invalido');
            url = urlServer += '/usuarios/xxxx';

    }



    return this.sanitizer.bypassSecurityTrustResourceUrl(url);


  }

// --------------------------------------------------------
// metodo para cargar el Path de la Selfie Soportes / Archivo imagen
  cargarPathsImg(tipo: string, img: string) {

   if (tipo === 'soporte'){
    const foundID = this.imgSoportesArray.find(element => element._id === img);
    if (!foundID) {
      return  URL_SERVICIOS + '/img/usuarios/xxxx';
    }
    return foundID.path;

   }

   if (tipo === 'archivo'){
    const foundID = this.imgArchivosArray.find(element => element._id === img);
    if (!foundID) {
      return  URL_SERVICIOS + '/img/usuarios/xxxx';
    }
    return foundID.path;
   }

  }


} // END class


