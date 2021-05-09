import { Component, OnInit } from '@angular/core';

import { UploadService } from 'src/app/services/upload/upload.service';
import { ModalUploadService } from './modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
  ]
})
export class ModalUploadComponent implements OnInit {

  // variables

  imagenSubir: File;
  imagenTemp: string; // variable para pre-view
  input: string = '';


  constructor( public uploadService: UploadService,
               public modalUploadService: ModalUploadService) { }

  ngOnInit(): void {
  }


   // metodo para cambiar IMAGEN
   seleccionImagen( archivo: File ){
   // console.log(archivo);

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) { // valida el tipo de archivo

     Swal.fire({
       title: '¡Error!',
       text: 'El Archivo seleccionado no es una Imagen',
       icon: 'error',
       confirmButtonText: 'Cerrar',
       scrollbarPadding: false,
       allowOutsideClick: false
     });

     this.imagenSubir = null;
     return;

    }

    // codigo si todo OK
    this.imagenSubir = archivo;

    // codigo para previsualizar la imagen - preView
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result.toString();

 }


 // Metodo para subir la imagen a BD
 subirImagen() {

  const fileTemp = this.imagenSubir;
  this.input = '';

  this.uploadService.subirArchivo(this.imagenSubir,
                                   this.modalUploadService.tipo,
                                   this.modalUploadService.id) // este servicio devuelve una promesa
                    .then((resp: any) => {

                      // notificando
                      this.modalUploadService.notificacion.emit( resp );
                      // ocultando el modal
                      this.cerraModal();

                      if (resp.usuario) {
                        if (resp.usuario.especialista) { // cambia la foto del especialista si tiene relacion con el usuario

                          this.uploadService.subirArchivo(fileTemp, 'especialistas', resp.usuario.especialista)
                            .then(res => { // si falla guardando la imagen
                              // console.log(res);
                             })
                            .catch(err => { // si falla guardando la imagen
                              console.log(err);
                             });

                        }
                      }


                    })
                    .catch( err => {

                      console.log('Error en la carga del Archivo', err);

                    });


 }


 // metodo para cerrar el modal y resetiar las variables
 cerraModal() {

  this.imagenTemp = null;
  this.imagenSubir = null;

  this.modalUploadService.ocultarModal();

 }

}
