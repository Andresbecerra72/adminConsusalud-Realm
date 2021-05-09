import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  // variables
 usuario: Usuario;
 imagenSubir: File;
 imagenTemp: string; // variable para pre-view

 // --------------------- Constructor ---------------------------------------------

 constructor( public usuarioService: UsuarioService) {
   this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
  }




  // ------------------------------------------------------------------
  // metodo para guardar la informacion del Usuario
  guardar(usuario: Usuario){

    // console.log(usuario);

    this.usuario.nombre = usuario.nombre;
    this.usuario.documento = usuario.documento;
    this.usuario.telefono = usuario.telefono;
    this.usuario.ciudad = usuario.ciudad;
    this.usuario.direccion = usuario.direccion;

    this.usuarioService.actualizarUsuario( this.usuario )
                        .subscribe(resp => {},
                           err => {
                             console.log('HTTP Error', err.error);
                             Swal.fire({
                              title: '¡Error!',
                              text: JSON.stringify(err.error.message),
                              icon: 'error',
                              confirmButtonText: 'Cerrar',
                              scrollbarPadding: false,
                              allowOutsideClick: false
                            });
                          });


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
        confirmButtonText: 'Cerrar'
      });

      this.imagenSubir = null;
      return;

     }

     // codigo si todo OK
     this.imagenSubir = archivo;

     // codigo para previsualizar la imagen - preView
     const reader = new FileReader();
     const urlImagenTemp = reader.readAsDataURL( archivo);

     reader.onloadend = () => this.imagenTemp = reader.result.toString();

  }

  // metodo del Boton Actualizar Imagen
  actualizarImagen() {

    // llama el servcio desde usuarioService
    this.usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id);


  }

}
