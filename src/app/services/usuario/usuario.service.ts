import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { URL_SERVICIOS } from 'src/app/config/config';

import { UploadService } from 'src/app/services/upload/upload.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Variables para validar si el usuario esta logeado
  usuario: Usuario;
  especialista: Especialista;
  token: string;

  constructor( private http: HttpClient,
               private router: Router,
               private uploadService: UploadService) {

    this.cargarStorage(); // llama el metodo para inicializar las variables token y usuario


    console.log('Constructor - Servicio Usuarios');

  }

// validaciones del Guard -loginGuard
  estaLogueado(){

    return (this.token.length > 5) ? true : false;

  }

// metodo para cargar las variables token y usuario
  cargarStorage(){

    if (localStorage.getItem('token')) { // si el token existe en el localStorage
        this.token = localStorage.getItem('token');
        this.usuario = JSON.parse(localStorage.getItem('usuario'));

        return;

    }else { // si el localstorage esta vacio se inicializan con los siguientes datos
      this.token = '';
      this.usuario = null;
    }

    return;

  }



// ==========================================================================
//             +++++++++++ AUTENTICACION NORMAL ++++++++++++++
// ==========================================================================

// Servicio LOGIN Normal
login( usuario: Usuario, recordar: boolean = false){

      // validacion para checkBox Recuerdame
      if (recordar) {

        localStorage.setItem('email', usuario.correo);

      }else{

        localStorage.removeItem('email');

      }


         // la url la toma del archivo de configuracion
      const url = URL_SERVICIOS + '/login';

      return this.http.post(url, usuario)
                         .pipe(
                          map( (resp: any) => {

                            // console.log(resp);
                            if (resp.usuario) {

                              this.guardarLocalStorage(resp.id, resp.token, resp.usuario, true); // llama el metodo guardarLocalStorage
                              return true;

                            }else {
                              this.logOut();
                              Swal.fire({
                                html: `<div class="alert alert-success" role="alert">${resp.message}</div>`,
                                icon: 'info',
                                scrollbarPadding: false,
                                allowOutsideClick: false
                              });
                              return false;
                            }


                          })
                          );


}

// ==========================================================================
//             +++++++++++ AUTENTICACION CON GOOGLE ++++++++++++++
// ==========================================================================
// Servicio LOGIN Google
loginGoogle( token: string ){

   // la url la toma del archivo de configuracion
   const url = URL_SERVICIOS + '/login/google';

   return this.http.post(url, {token})
                   .pipe(
                    map( (resp: any) => {

                      this.guardarLocalStorage(resp.id, resp.token, resp.usuario, true); // llama el metodo guardarLocalStorage

                      return true;
                    })
                    );



}



// Metodo para guardear informacion del Login en LocalStorage
guardarLocalStorage(id: string, token: string, usuario: Usuario, flag: boolean){

  localStorage.setItem('id', id );
  localStorage.setItem('token', token );
  localStorage.setItem('usuario', JSON.stringify(usuario) );

  this.usuario = usuario;
  this.token = token;

  if (flag){
    this.getEspecialista(this.usuario); // Asigna Especialista al Usuario
    return;
  }

}



// metodo para salir de la aplicacion
logOut(){
  // reset a las variables
  this.token = '';
  this.usuario = null;
  // eliminar datos del localStorage
  localStorage.removeItem('id');
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  // redirecccion al Login
  this.router.navigate(['/login']);
}


// Metodo para cambiar el Password
recoverPassword(usuario: Usuario) {

    // la url la toma del archivo de configuracion
    const url = URL_SERVICIOS + '/login/' + usuario.correo;

    return this.http.put(url, usuario)
                    .pipe(
                      map((resp: any) => {
                        // console.log(resp);
                        return true;
                      })
                      );

}


// ==========================================================================
//             +++++++++++ CREAR USUARIO: POST ++++++++++++++
// ==========================================================================
// Servicio Crear Usuario - register
crearUsuario( usuario: Usuario){

  // la url la toma del archivo de configuracion
  const url = URL_SERVICIOS + '/usuario';

  return this.http.post( url, usuario)
                  .pipe(
                  map( (resp: any) => {

                    Swal.fire({
                      title: 'Registro Aceptado',
                      text: resp.usuario.correo,
                      icon: 'success',
                      confirmButtonText: 'Cerrar',
                      scrollbarPadding: false,
                      allowOutsideClick: false
                    });

                    return resp;

                  })
                  );


}


// ==========================================================================
//             +++++++++++ ASIGNAR ESPECIALISTA - USUARIO: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el usuario
asignarEspecialistaUsuario(usuario: Usuario){

 // console.log(usuario);

  let url = URL_SERVICIOS + '/usuario/' + usuario._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, usuario)
                  .pipe(
                    map( (resp: any) => {

                        return resp;

                    })

                  );

}


// ==========================================================================
//             +++++++++++ ACTUALIZAR USUARIO: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar el usuario
actualizarUsuario(usuario: Usuario){

  let url = URL_SERVICIOS + '/usuario/' + usuario._id;
  url += '?token=' + this.token;
 // console.log(url);


  return this.http.put(url, usuario)
                  .pipe(
                    map( (resp: any) => {

                      if ( usuario._id === this.usuario._id) {

                        const usuarioDB: Usuario = resp.usuario; // actializa el modelo Usuario con los datos actulaizados en la BD
                        this.guardarLocalStorage(usuarioDB._id, this.token, usuarioDB, false);

                      }


                      Swal.fire({
                        title: 'Usuario Actualizado',
                        text: resp.usuario.correo,
                        icon: 'success',
                        confirmButtonText: 'Cerrar',
                        scrollbarPadding: false,
                        allowOutsideClick: false
                      });

                      return true;

                    })

                  );

}

// ==========================================================================
//             +++++++++++ ACTUALIZAR IMAGEN USUARIO: PUT ++++++++++++++
// ==========================================================================
// metodo para actualizar la imagen del usuario
cambiarImagen( archivo: File, id: string) {

  // llama el servicio de UploadServices que devuelve una Promesa
  this.uploadService.subirArchivo(archivo, 'usuarios', id)
                     .then( (resp: any) => { // si el servcio guarda la imagen
                        // console.log(resp);
                        this.usuario.img = resp.usuario.img;
                        this.guardarLocalStorage(id, this.token, this.usuario, false);

                        // cambia la foto del especialista si tiene relacion con el usuario
                        if (resp.usuario.especialista) {
                          this.subirImgEspecialista(archivo, resp.usuario.especialista);
                        }

                        Swal.fire({
                          title: 'Imagen Actualizada',
                          text: resp.usuario.correo,
                          icon: 'success',
                          confirmButtonText: 'Cerrar',
                          scrollbarPadding: false,
                          allowOutsideClick: false
                        });

                     })
                     .catch(resp => { // si falla guardando la imagen
                      console.log(resp);

                     });

}


// ----------Metodo para subir la imagen del especialista relacionado con el usuario -------------------------
subirImgEspecialista(archivo: File, id: string) {

  this.uploadService.subirArchivo(archivo, 'especialistas', id)
                    .then(res => { // si el servcio guarda la imagen
                      // console.log(res);
                      })
                    .catch(err => { // si falla guardando la imagen
                      console.log(err);
                      });

}



// ==========================================================================
//             +++++++++++ MOSTRAR USUARIO con Paginacion: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar los usuarios
obtenerUsuarios( pagina: number = 0) {

  const url = URL_SERVICIOS + '/usuario?pagina=' + pagina;
  return this.http.get( url );


}
// ==========================================================================
//             +++++++++++ MOSTRAR USUARIO con Paginacion: GET ++++++++++++++
// ==========================================================================
// metodo para mostrar los usuarios
obtenerUsuariosTodas() {

  const url = URL_SERVICIOS + '/usuario/all';
  return this.http.get( url );


}


// ==========================================================================
//      +++++++++++ MOSTRAR USUARIO por ID: GET by ID ++++++++++++++
// ==========================================================================
// metodo para mostrar una USUARIO por ID
obtenerUsuarioByID(id: string) {

  const url = URL_SERVICIOS + '/usuario/ident/' + id;
  return this.http.get( url )
                .pipe(
                  map((resp: any) => {
                    return resp.usuario;
                  })
                  );


}

// ==========================================================================
//      +++++++++++ MOSTRAR USUARIO por Documento: GET by Documento ++++++++++++++
// ==========================================================================
// metodo para mostrar una USUARIO por ID
obtenerUsuarioByDoc(documento: string) {

  const url = URL_SERVICIOS + '/usuario/getdoc/' + documento;
  return this.http.get( url )
                .pipe(
                  map((resp: any) => {
                    return resp.usuario;
                  })
                  );


}



// ==========================================================================
//             +++++++++++ BUSCAR USUARIOS: GET BY Termino ++++++++++++++
// ==========================================================================
// metodo para buscar los usuarios por coleccion - Tabla
buscarUsuario( termino: string ) {


  const characters = /[&\/\\#,+()$~%.'":*?<>{}]/g;

  // valida si el valor del input es vacio y evita caracteres Especiales
  if (termino.match(characters)) {

    return of([]); // envia la respuesta como una promesa

  } else {

  const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

  return this.http.get( url )
                  .pipe(
                    map( (resp: any) => resp.usuarios)
                  );
  }


}



// ==========================================================================
//             +++++++++++ ELIMINAR USUARIO: DELETE BY ID ++++++++++++++
// ==========================================================================
// metodo para eliminar usuario por coleccion - Tabla
eliminarUsuario( id: string ) {

  let url = URL_SERVICIOS + '/usuario/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url );


}

// ------------------------------------------------------------------------------------------------------

// ==========================================================================
//       SERVICIO PARA ASIGNAR EL USUARIO LOGEADO AL ESPECIALISTA
// ==========================================================================
  getEspecialista(usuario: Usuario){

    this.buscarEspecialistaByEmail(usuario.correo.toString())
         .subscribe((resp: any) => {

           if (resp.especialista) {

            this.especialista = resp.especialista;

            usuario.especialista = this.especialista;
            usuario.role = 'ESPEC_ROLE';

            this.asignarEspecialistaUsuario(usuario)
                              .subscribe(resUsuario => {
                                // console.log('Usuario - ', resUsuario);

                                if (resUsuario.usuario) {

                                  this.usuario = resUsuario.usuario;

                                  this.especialista.usuario_asignado = this.usuario;
                                  this.especialista.anotaciones = null;
                                  this.especialista.horas_asignadas = null;
                                  // relacion
                                  this.especialista.profesiones = null;
                                  this.especialista.ordenes = null;
                                  this.especialista.soportes = null;
                                  this.especialista.eventos = null;

                                  this.actualizarEspecialista(this.especialista)
                                                          .subscribe(resEspecialista => {
                                                            // console.log('Especialista - ', resEspecialista);
                                                            return;

                                                          });
                                }else {

                                  return;

                                }

                              }, err => {
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

           if (!resp.especialista) {

            // console.log('Aqui - Return');
            return;

          }

         });

}



// -----------------------------------------------------------------------------------------------------
// -------------- REALACION DEL USUARIO CON EL ESPECIALISTA
// -----------------------------------------------------------------------------------------------------
// metodo para mostrar una ESPECIALISTA por nombre
buscarEspecialistaByEmail(correo: string) {

  const url = URL_SERVICIOS + '/especialista/getemail/' + correo;
  return this.http.get( url );


}

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


} // END class
