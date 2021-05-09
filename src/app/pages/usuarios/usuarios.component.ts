import { Component, OnInit } from '@angular/core';


import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  // variables
  usuarios: Usuario[] = [];
  especialista: Especialista;
  pagina: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  flagBtn: boolean = true;

  // --------------------- Constructor ---------------------------------------------------------

  constructor( public usuarioService: UsuarioService,
               public especialistaService: EspecialistaService,
               public modalUploadService: ModalUploadService) { }

  ngOnInit(): void {
    this.cargarUsuarios();

    // codigo para escuchar cambios en el modalUpload
    this.modalUploadService.notificacion
                           .subscribe( (resp: any) => this.cargarUsuarios());

  }

// Metodos para cargar la tabla de Usuarios
cargarUsuarios() {

  this.cargando = true;
  this.flagBtn = true;

  this.usuarioService.obtenerUsuarios( this.pagina )
                      .subscribe( (resp: any) => {
                        // console.log(resp);
                        this.totalRegistros = resp.total;
                        this.usuarios = resp.usuarios;

                        this.cargando = false;

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

// Metodo para cambiar la paginacion
cambiarPagina( valor: number) {


  const pagina = this.pagina + valor;

  if ( pagina >= this.totalRegistros ) {
    return;
  }

  if ( pagina < 0 ) {
    return;
  }

  // codigo si las validaciones estan correctas
  this.pagina += valor;
  this.cargarUsuarios();

}


// Metodo Buscar Usuario
buscarUsuario(termino: string) {

  // console.log(termino);

  if (termino.length <= 0) {
    this.cargarUsuarios();
    return;
  }

  this.flagBtn = false;
  this.cargando = true;
  this.totalRegistros = 0;

  this.usuarioService.buscarUsuario( termino )
                      .subscribe( (usuarios: Usuario[]) => {
                        this.usuarios = usuarios;

                        this.totalRegistros = usuarios.length;

                        this.cargando = false;


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



// Metodo para eliminar el usuario
borrarUsuario( usuario: Usuario ) {

  // console.log(usuario);

  if ( usuario._id === this.usuarioService.usuario._id) { // valida no se puede eliminar el mismo usuario

    Swal.fire({
      title: 'Aviso',
      text: 'No se puede eliminar',
      icon: 'warning',
      confirmButtonText: 'Cerrar',
      scrollbarPadding: false,
      allowOutsideClick: false
    });

    return;

  }

  // validacion correcta Eliminar Usuario
  Swal.fire({
    title: '¿Esta seguro?',
    text: 'Desea eliminar a ' + usuario.nombre,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar',
    scrollbarPadding: false,
    allowOutsideClick: false
  }).then((result) => {
    if (result.value) {

      if (usuario.especialista) {

        this.especialistaService.obtenerEspecialistaByID(usuario.especialista._id.toString())
                                .subscribe((resp: any) => {

                                  if (resp.especialista) {
                                      this.especialista = resp.especialista;
                                      this.especialista.usuario_asignado = null;
                                      this.especialista.anotaciones = null;
                                      this.especialista.horas_asignadas = null;
                                      // relacion
                                      this.especialista.profesiones = null;
                                      this.especialista.ordenes = null;
                                      this.especialista.soportes = null;
                                      this.especialista.eventos = null;

                                      this.especialistaService.actualizarEspecialista(this.especialista)
                                                              .subscribe(resEspecialista => {
                                                                // console.log(resEspecialista);

                                                              });

                                  }


                                });

      }


      this.usuarioService.eliminarUsuario(usuario._id)
                         .subscribe( resp => {
                          Swal.fire(
                            '¡Eliminado!',
                            'El Usuario fue eliminado',
                            'success'
                          );

                          this.cargarUsuarios();

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
  });

}



// Metodo para Guardar cambios en el ROLE
guardarUsuario(usuario: Usuario) {

  this.usuarioService.actualizarUsuario( usuario )
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

// Metodo para cambiar la imagen del Usuario
mostrarModal( id: string) {

  this.modalUploadService.mostrarModal('usuarios', id);


}


}// END class
