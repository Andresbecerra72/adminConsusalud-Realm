import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

import { GOOGLE_URL, URL_SERVICIOS } from 'src/app/config/config';

import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { ConfiguresService } from 'src/app/services/dashboard/configures.service';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UploadService } from 'src/app/services/upload/upload.service';

import { Especialista } from 'src/app/models/especialista.model';
import { Profesion } from 'src/app/models/profesion';
import { Ciudad } from 'src/app/models/ciudad';
import { Usuario } from 'src/app/models/usuario.model';




@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styles: [
  ]
})
export class EspecialistasComponent implements OnInit {

  // Elementos
  @ViewChild('input') inputTxt: ElementRef<any>;

  // variables
  forma: FormGroup;
  flag: boolean = false;
  flagUsuario: boolean = true;
  flagBuscador: boolean = false;
  message: string = 'Cargando Base de Datos';
  especialistas: Especialista[] = [];
  especialista: Especialista;
  profesion: Profesion;
  ciudad: Ciudad;
  usuario: Usuario;
  selectUsuario: any = '';
  listaSelectUsuario = [];
  imagenUrl: string = '';

  hide: string = 'hide'; // variable para ocultar el modal
  formHide: boolean = false;

  colorArray: string[] = [];

  archivoName: string = '';
  archivoFecha: string = '';
  dataHojas: string[] = [];
  totalceldas: number = 0;
  contador: number = 0;
  dataArray: string[] = [];
  sheetName: string;
  messageAlert: string;
  info: string = 'hide'; // mensaje Info
  alert: string = 'hide'; // mensaje Alert

  // ---------------------- Constructor -----------------------------------------------------------

  constructor(public especialistaService: EspecialistaService,
              public configuresService: ConfiguresService,
              public modalUploadService: ModalUploadService,
              public usuarioService: UsuarioService,
              public uploadService: UploadService) { }

  ngOnInit(): void {

    this.cargarEspecialistas();

    this.cargarUsuarios(); // Select - Usuarios

     // codigo para escuchar cambios en el modalUpload - CAMBIAR IMG
    this.modalUploadService.notificacion
                            .subscribe( (resp: any) => this.cargarEspecialistas());


  }



// *******Metodo para transformar el Object en un Arreglo ***********
crearArray( profesionesObj: object, especialidad: string) {

  const profesiones: any[] = [];
  this.colorArray = [];

  if ( profesionesObj === null ) { return []; } // condicion si el objeto recibido no tiene informacion

  Object.keys( profesionesObj ).forEach( key => {

                  // en este punto solo se tienen los datos de cada objeto sin las claves
                  const profesion: Profesion = profesionesObj[key];

                  if (profesion.nombre === especialidad ) {

                    if (profesion.color){
                      this.colorArray.push(profesion.color.primary);
                    }

                    profesiones.push(profesion.nombre);
                  }



  });

  // console.log(this.colorArray);

  return profesiones;


}

// --------------------------------------------------------------------------
// -------------- Metodo para Cargar Las Usuarios - Select --------------------
cargarUsuarios() {

  this.usuarioService.obtenerUsuariosTodas()
                          .subscribe((resp: any) => {

                           // console.log(resp);

                           if (resp.total > 0) {

                             for (const item of resp.usuario) {
                               this.listaSelectUsuario.push({
                                                           nombre: item.nombre,
                                                           apellido: item.apellido,
                                                           correo: item.correo,
                                                           img: item.img,
                                                            _id: item._id});
                            }

                             if (resp.total === 0) {
                             this.listaSelectUsuario.push({
                                                         nombre: resp.message,
                                                         apellido: null,
                                                         correo: null,
                                                          _id: 'Default'});
                           }
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


 // -----------------------------------------------------------



  // Metodo para cargar los Especialistas
  cargarEspecialistas() {

     this.especialistaService.obtenerEspecialistaTodas()
                             .subscribe((resp: any) => {

                              if (!resp.especialista) {
                                this.message = resp.message;
                                this.flag = false;
                              }

                              if (resp.especialista) {
                                this.especialistas = resp.especialista;
                                this.flag = true;
                                this.flagBuscador = true;
                              }


                              // console.log(this.especialistas);


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


// --------------------------------------------------------
// Selecciona la accion del Boton del Componente CARD
// --------------------------------------------------------
editarEspecialista(especialista: Especialista) {

  // console.log(especialista);
  this.flagUsuario = true;
  this.especialista = especialista;

  this.mostrarModal();




}




// ==========================================================================
//         +++++++++++ GUARDAR REGISTRO ESPECIALISTA: POST ++++++++++++++
// ==========================================================================
   // Metodo para registrar
   registrarEspecialista(event: FormGroup) {
    this.forma = event;

    if (this.forma.controls.selectProfesion.value._id !== 'Default') {

      this.profesion = this.forma.controls.selectProfesion.value;
    }

    if (this.forma.controls.selectProfesion.value._id === 'Default') {
      // this.empresa = null;
      Swal.fire('', 'Falta Seleccionar la Profesión', 'error');
      return;
    }


    if (!this.forma.controls.email.value) {
      Swal.fire('', 'Ingrese el Correo', 'error');
      return;
    }




    Swal.fire({
      title: 'Espere',
      text: 'Guardando Información',
      icon: 'info',
      scrollbarPadding: false,
      allowOutsideClick: false
    });
    Swal.showLoading();

    const nombre = this.forma.controls.name.value;

    this.especialista = new Especialista(

      this.capitalLetter(nombre), // nombre primera letra en mayuscula
      this.forma.controls.email.value,
      this.forma.controls.cell.value,
      this.forma.controls.city.value,
      this.forma.controls.adress.value,
      null,
      null,
      this.profesion.nombre, // Especialidad
      null,
      null,
      null,
      null,
      null,
      this.forma.controls.licencia.value, // Licencia
      this.forma.controls.vigencia.value, // Vigencia
      null,
      null,
      null,
      null,
      this.profesion


 );


    this.especialistaService.guardandoEspecialista(this.especialista)
                            .subscribe(
                              res => {

                                 if (this.profesion) {
                                      this.configuresService.obtenerProfesionByName(this.profesion.nombre.toString())
                                                             .subscribe((resProfesion: any) => {
                                                               if (resProfesion.profesion) {
                                                                 this.profesion = resProfesion.profesion;
                                                                 this.profesion.especialistas = res.especialista;
                                                                  // actualiza las Profesiones
                                                                 this.configuresService.actualizarProfesion(this.profesion)
                                                                                    .subscribe();

                                                               }

                                                             });


                                    }


                                 this.cargarEspecialistas();

                                // console.log('HTTP response', res);
                                 Swal.fire({
                                  title: 'Registro Aceptado',
                                  icon: 'success',
                                  confirmButtonText: 'Cerrar',
                                  scrollbarPadding: false,
                                  allowOutsideClick: false
                                });
                                 this.formHide = false;
                                 this.forma.reset();
                                },
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
                                 this.forma.reset();
                                },
                              // () => console.log('HTTP request completed.')
                            );





  }



// ==========================================================================
//          +++++++++++ ACTUALIZAR ESPECIALISTA: PUT ++++++++++++++
// ==========================================================================
  actualizarEspecialista(event: FormGroup) {

    if (!event) { // Asigna Relacion Usuario - Especialista


      this.usuarioService.obtenerUsuarioByID(this.selectUsuario._id.toString())
                          .subscribe(resp => {
                            // console.log(resp);

                            if (resp) {
                              this.usuario = resp;
                              this.usuario.role = 'ESPEC_ROLE';
                              this.usuario.especialista = this.especialista;
                              this.usuarioService.asignarEspecialistaUsuario(this.usuario)
                                                  .subscribe(resUsuario => {
                                                    // console.log(resUsuario);

                                                  });

                            }

                          });

      this.especialista.usuario_asignado = this.selectUsuario;
      this.profesion = null;
      this.especialista.profesiones = this.profesion;

       // Codigo para cambiar la imagen del Especialista por la imagen del Usuario
      this.uploadService.moverArchivoImg('especialistas', this.especialista)
                         .subscribe(resUpload => {
                           // console.log(resUpload);
                         });

    }

    if (event) { // Actualiza el Especialista

        this.forma = event;

        if (this.forma.controls.selectProfesion.value._id !== 'Default') {
          this.profesion = this.forma.controls.selectProfesion.value;
          this.especialista.profesiones = this.profesion;
          this.especialista.especialidad = this.profesion.nombre;
        }

        if (this.forma.controls.selectProfesion.value._id === 'Default') {
          this.profesion = null;
          this.especialista.profesiones = this.profesion;
        }



        this.especialista.nombre = this.forma.controls.name.value;
        this.especialista.telefono = this.forma.controls.cell.value;
        this.especialista.correo = this.forma.controls.email.value;
        this.especialista.ciudad = this.forma.controls.city.value;
        this.especialista.direccion = this.forma.controls.adress.value;
        this.especialista.licencia = this.forma.controls.licencia.value; // Licencia
        this.especialista.vigencia = this.forma.controls.vigencia.value; // Vigencia


    }


    this.especialista.anotaciones = null;
    this.especialista.horas_asignadas = null;
    // relacion
    this.especialista.ordenes = null;
    this.especialista.soportes = null;
    this.especialista.eventos = null;

    this.especialistaService.actualizarEspecialista(this.especialista) // Actualiza el especialista BD
                              .subscribe(resp => {

                                this.cerraModal();
                                this.cargarEspecialistas();

                                Swal.fire({
                                  title: 'Datos especialista Actualizados',
                                  text: resp.nombre,
                                  icon: 'success',
                                  confirmButtonText: 'Cerrar',
                                  scrollbarPadding: false,
                                  allowOutsideClick: false
                                });


                                if (this.profesion) {
                                  this.configuresService.obtenerProfesionByName(this.profesion.nombre.toString())
                                                         .subscribe((resProfesion: any) => {
                                                           if (resProfesion.profesion) {
                                                             this.profesion = resProfesion.profesion;
                                                             this.profesion.especialistas = resp;
                                                              // actualiza las Profesiones
                                                             this.configuresService.actualizarProfesion(this.profesion)
                                                                                .subscribe();

                                                           }

                                                         });


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


// ==========================================================================
//          +++++++++++ ELIMINAR REGISTRO ESPECIALISTA: DELETE ++++++++++++++
// ==========================================================================
  eliminarEspecialista(especialista: Especialista) {

    // console.log(especialista);



   // validacion correcta Eliminar Registro
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Desea eliminar a ' + especialista.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      scrollbarPadding: false,
      allowOutsideClick: false
    }).then((result) => {
        if (result.value) {

                    if (especialista.usuario_asignado) {

                          this.usuarioService.obtenerUsuarioByID(especialista.usuario_asignado._id.toString())
                                              .subscribe(resp => {
                                                this.usuario = resp;
                                                this.usuario.especialista = null;
                                                this.usuario.role = 'USER_ROLE';
                                                this.usuarioService.asignarEspecialistaUsuario(this.usuario)
                                                                    .subscribe(resUsuario => {
                                                                      // console.log(resUsuario);
                                                                    });

                                              });



                        }

                    this.especialistaService.borrarEspecialista(especialista._id.toString())
                                            .subscribe(resp => {
                                              this.cargarEspecialistas();
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

// ==========================================================================
//          +++++++++++ ASIGNAR UN USUARIO AL ESPECIALISTA ++++++++++++++
// ==========================================================================
// Metodo cuando click sobre el correo del especialista
  asignarUsuario(especialista: Especialista) {

    this.especialista = especialista;
    this.flagUsuario = false;
    this.mostrarModal();

  }



// metodo para mostrar la imagen del usuario
  setImagen(){


  // ************* CODIGO USADO PARA SERVIDOR CON DIRECTORIOS *********
/*
  const url = URL_SERVICIOS + '/img/usuarios/';
  this.imagenUrl = url + this.selectUsuario.img;
*/

  // ************** CODIGO USADO CON GOOGLE CLOUD **********

  const url = GOOGLE_URL + '/uploads/usuarios/';

  if (this.selectUsuario.img) {
    this.imagenUrl = url + this.selectUsuario.img;
    return;
  }

  this.imagenUrl = URL_SERVICIOS + '/img/usuarios/xxxx';


  }



// ==========================================================================
//      +++++++++++ REMOVER EL USUARIO DEL ESPECIALISTA ++++++++++++++
// ==========================================================================
  // Metodo para remover el usario asignado al especialista
  removerUsuario(usuario: Usuario ) {

 // console.log(usuario);
  usuario.especialista = null;
  usuario.role = 'USER_ROLE';
  this.usuarioService.asignarEspecialistaUsuario(usuario)
                      .subscribe(resp => {
                        // console.log(resp);
                      });


  this.especialista.profesiones = null;
  this.especialista.usuario_asignado = null;
  this.especialista.anotaciones = null;
  this.especialista.horas_asignadas = null;
  // relacion
  this.especialista.ordenes = null;
  this.especialista.soportes = null;
  this.especialista.eventos = null;

  this.especialistaService.actualizarEspecialista(this.especialista)
                         .subscribe(resp => {
                           // console.log(resp);
                           this.cerraModal();
                           this.cargarEspecialistas();

                           Swal.fire({
                             title: 'Datos especialista Actualizados',
                             text: resp.nombre,
                             icon: 'success',
                             confirmButtonText: 'Cerrar',
                             scrollbarPadding: false,
                             allowOutsideClick: false
                           });

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

// ==========================================================================
//      +++++++++++ CAMBIAR IMAGEN DEL ESPECIALISTA ++++++++++++++
// ==========================================================================
  // Metodo para cambiar la imagen del especialista
mostrarModalImg( id: string) {

  this.modalUploadService.mostrarModal('especialistas', id);

}


// =================================================================================================================================
// ==========================================================================
//             +++++++++++ LEER ARCHIVO EXCEL++++++++++++++
// ==========================================================================
onFileChange(ev) {

  // console.log(select);

   // se inicializan las variables
  this.info = 'hide';
  this.alert = 'hide';
  this.dataArray = [];
  this.dataHojas = [];
  this.totalceldas = 0;
  let workBook = null;
  let jsonData = null;
  const reader = new FileReader();
  const file = ev.target.files[0];

// ===============Valida si no selecciona Archivo=====================
  if (!file) {
    Swal.fire('', 'Falta Seleccionar el Archivo');
    return;
   }
// ===============Valida si el Archivo no es Excel=====================

  // console.log(file); // datos del archivo


  const nombreCortado = file.name.split('.'); // divide el nombre del archivo para extraer el tipo de extension
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]; // solo toma la extension del archivo

  // validar las extenciones del Archivo
  const extensionesValidas = ['xlsx', 'xls', 'csv'];

  // condicion para validar el tipo de extension del Archivo
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    Swal.fire('ERROR Archivo no valido', ' Seleccione un archivo de Excel', 'error');
    return;
  }


  this.archivoName = file.name; // Asigna el nombre del Archivo

  if (file.lastModified) {
      this.archivoFecha = new Date(file.lastModified).toString();
    } else if (file.lastModifiedDate) {
    this.archivoFecha = file.lastModifiedDate.toString(); // Asigna la fecha del Archivo
    } else {
      this.archivoFecha = new Date().toString(); // Asigna la fecha del Archivo
    }


// ==========Codigo si el Archivo es Valido===============

  reader.onload = (event) => {
    const data = reader.result;
    workBook = XLSX.read(data, { type: 'binary' });
    jsonData = workBook.SheetNames.reduce((initial, name) => {
      const sheet = workBook.Sheets[name];
      initial[name] = XLSX.utils.sheet_to_json(sheet);

      this.sheetName = name;

      // valida solo las hojas con datos
      if ( initial[name].length > 0 ) {
        this.dataArray.push(initial[name]); // guarda solo hojas con datos en el Arreglo 'dataArray'
        this.totalceldas += initial[name].length;
      }

      this.dataHojas.push(name);

      return initial;
    }, {});

    const hojas = this.dataHojas.join(' / ');
    // condicion para mostrar hojas y celdas DATA
    if (this.totalceldas > 0 ) {
        this.messageAlert = `El libro contiene la Hoja (${hojas}) y (${this.totalceldas}) Registros Totales`;
        this.info = '';
    }else{
        this.messageAlert = `El libro contiene la ${this.dataHojas} y ${this.totalceldas} Registros`;
        this.alert = '';
     }




    // console.log(this.dataArray); // ver datos del excel
    //  return; // *** PRUEBAS

  };

  reader.readAsBinaryString(file);
}


// ==========================================================================
//             +++++++++++ EXTRAER DATA Y ALMACENAR en DB ++++++++++++++
// ==========================================================================
extraerData(data: string[]) {

  return new Promise( (resolve, reject) => { // el servicio retorna una promesa

  if ( data.length === 0) {
    return;
   }

  // console.log(data);

  Object.keys(data).forEach(key => {
    // console.log(key);


    data[key].forEach((celda: any) => {
     // console.log(celda);


       const city = celda['CIUDAD']; // Ciudad Primera letra mayuscula
       const nombre = celda['NOMBRE']; // Nombre Primera letra mayuscula
       const mayuscula = celda['PROFESION']; // Profesion en Mayuscula
       let licencia = null;
       let vigencia = null;

       if (celda['LICENCIA'] && celda['FECHA'] ) {

        licencia = celda['LICENCIA']; // Licencia
        vigencia = this.ExcelDateToJSDate(celda['FECHA']); // Vigencia

       }


       this.especialista = new Especialista(
        this.capitalLetter(nombre),
        celda['CORREO'],
        celda['CEL'],
        this.capitalLetter(city),
        celda['DIRECCION'],
        celda['CEDULA'],
        null, // apellido
        mayuscula.toUpperCase(), // Especialidad Todo Mayuscula - Dato Temp
        null,
        null,
        null,
        null,
        null,
        licencia,
        vigencia

      );


       this.especialistaService.obtenerEspecialistaByName(this.especialista)
                              .subscribe((resp: any) => {

                               // console.log(resp);


                                if (resp.especialista) {


                                  this.configuresService.obtenerProfesionByName(resp.especialista.especialidad)
                                                        .subscribe((resProfesion: any) => {


                                                          if (!resProfesion.profesion) {
                                                            this.especialista = resp.especialista;
                                                            this.especialista.anotaciones = null;
                                                            this.especialista.horas_asignadas = null;
                                                            this.especialista.profesiones = null;
                                                            this.especialista.ordenes = null;
                                                            this.especialista.soportes = null;
                                                            this.especialista.eventos = null;

                                                            // console.log(this.especialista);

                                                            this.especialistaService.actualizarEspecialista(this.especialista)
                                                                                        .subscribe(res => {
                                                                                          // console.log('Especialista', res);
                                                                                        });

                                                          }


                                                          if (resProfesion.profesion) {

                                                            this.profesion = resProfesion.profesion;

                                                            // console.log(resProfesion.profesion.especialistas.length);

                                                            if (resProfesion.profesion.especialistas.length === 0) {
                                                              this.profesion.especialistas =  resp.especialista;
                                                            }

                                                            if (resProfesion.profesion.especialistas.length >= 1) {

                                                              for (const item of resProfesion.profesion.especialistas ) {

                                                                if (item._id.toString() !== resp.especialista._id.toString()){
                                                                  this.profesion.especialistas =  resp.especialista;
                                                                  break;
                                                                }
                                                                if (item._id.toString() === resp.especialista._id.toString()){
                                                                  this.profesion.especialistas = null;
                                                                  break;
                                                                }


                                                              }

                                                            }
                                                            this.configuresService.actualizarProfesion(this.profesion)
                                                                                  .subscribe(res => {
                                                                                   // console.log('Profesion ', res);
                                                                                  },
                                                                                  err => {
                                                                                    //     console.log('HTTP Error', err.error);
                                                                                     return;

                                                                                      },
                                                                                 // () => console.log('HTTP request completed.')
                                                                                  );

                                                            this.especialista = resp.especialista;
                                                            this.especialista.anotaciones = null;
                                                            this.especialista.horas_asignadas = null;
                                                            this.especialista.ordenes = null;
                                                            this.especialista.soportes = null;
                                                            this.especialista.eventos = null;

                                                            this.especialista.especialidad = this.profesion.nombre;

                                                            if (resp.especialista.profesiones.length === 0) {
                                                              this.especialista.profesiones = {
                                                                nombre: this.profesion.nombre,
                                                                 _id: this.profesion._id
                                                                };

                                                            }

                                                            if (resp.especialista.profesiones.length >= 1) {

                                                              for (const item of resp.especialista.profesiones ) {

                                                                if (item._id !== this.profesion._id){
                                                                  this.especialista.profesiones = {
                                                                    nombre: this.profesion.nombre,
                                                                     _id: this.profesion._id
                                                                    };
                                                                  break;
                                                                }
                                                                if (item._id === this.profesion._id){
                                                                  this.especialista.profesiones = null;
                                                                  break;
                                                                }


                                                              }

                                                            }

                                                            // console.log(this.especialista);

                                                            this.especialistaService.actualizarEspecialista(this.especialista)
                                                                                        .subscribe(res => {
                                                                                         // console.log('Especialista', res);
                                                                                        });


                                                          }

                                                        });






                                }

                                this.contador += 1;
                                if (this.totalceldas === this.contador){
                                        this.cargarEspecialistas();
                                        resolve('ok'); // resuelve la promesa
                                        }


                              },
                              err => reject(err) // reject la promesa
                              );




     }); // For


  }); // For


});


}




// ===================================================================================
//               Metodo para cargar el archivo a la Based de Datos
// ===================================================================================
// metodo para subir los datos de archivo excel a la DB
cargarData() {

  // console.log(this.fuenteArl);
 // return; // *** PRUEBAS


  if (this.archivoName !== 'Listado de personal Consusalud 2020.xlsx'){  // condicion solo para Archivos de BOLIVAR
    Swal.fire('', 'El archivo "' + this.archivoName + '" No es Valido');
    return;
  }

  Swal.fire({
    title: '¿Esta Seguro?',
    text: 'Desea subir el Archivo "' + this.archivoName + '"',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Subir',
    scrollbarPadding: false,
    allowOutsideClick: false
  }).then((result) => {
          if (result.value) {
              Swal.fire({
                text: 'Guardando Información',
                icon: 'info',
                scrollbarPadding: false,
                allowOutsideClick: false
              });
              Swal.showLoading();

              this.registrarNewData(this.dataArray); // Crea los Especilistas y las Profesiones

              setTimeout(() => { // **** Time Delay ********

                    this.extraerData(this.dataArray) // la variable dataArray tiene toda la informacion del archivo Excel
                          .then( (resp: any) => {
                              // inicializando las variables

                              console.log(resp);

                              this.totalceldas = 0;
                              this.contador = 0;
                              this.info = 'hide';

                              Swal.fire(
                              'Guardado',
                              'El Archivo fue Almacenado',
                              'success'
                            );

                          })
                          .catch(resp => { // si falla guardando el archivo
                           console.log(resp);
                           Swal.fire(
                            '!Error!',
                            'Elimine la BD y Cargue el Archivo Nuevamente',
                            'error'
                          );

                           });


                    }, 4000);  // **** Time Delay 4 Seg ********


          }
  });


}


// ===================================================================================
//            Metodo para crear los Nuevos ESPECILISTAS y las PROFESIONES
// ===================================================================================
registrarNewData(data: string[]) {

  if ( data.length === 0) {
    return;
   }


  Object.keys(data).forEach(key => {
    // console.log(key);


    data[key].forEach((celda: any) => {
     // console.log(celda);


     const city = celda['CIUDAD']; // Ciudad Primera letra mayuscula
     const nombre = celda['NOMBRE']; // Nombre Primera letra mayuscula
     const mayuscula = celda['PROFESION']; // Profesion en Mayuscula
     let licencia = null;
     let vigencia = null;

     if (celda['LICENCIA'] && celda['FECHA'] ) {

      licencia = celda['LICENCIA']; // Licencia
      vigencia = this.ExcelDateToJSDate(celda['FECHA']); // Vigencia

     }


     this.especialista = new Especialista(
      this.capitalLetter(nombre),
      celda['CORREO'],
      celda['CEL'],
      this.capitalLetter(city),
      celda['DIRECCION'],
      celda['CEDULA'],
      null,  // apellido
      mayuscula.toUpperCase(), // Especialidad Todo Mayuscula - Dato Temp
      null,
      null,
      null,
      null,
      null,
      licencia,
      vigencia
    );

     const color = this.makeRandomColor();


     this.profesion = new Profesion(
      mayuscula.toUpperCase(), // Todo Mayuscula
      {primary: color, secondary: color}
    );

     this.ciudad = new Ciudad(
      this.capitalLetter(city)
    );

     this.especialistaService.guardandoEspecialista(this.especialista)
                             .subscribe((resp: any) => {
                                // console.log(resp);
                              },
                              err => {
                               //     console.log('HTTP Error', err.error);
                                return;

                                 },
                            // () => console.log('HTTP request completed.')
                              );



     this.configuresService.crearProfesion(this.profesion)
                          .subscribe((resp: any) => {
                            // console.log(resp);
                          },
                          err => {
                            //     console.log('HTTP Error', err.error);
                            return;

                             },
                        // () => console.log('HTTP request completed.')
                          );


     this.configuresService.crearCiudad(this.ciudad)
                          .subscribe((resp: any) => {
                            // console.log(resp);
                          },
                          err => {
                            //     console.log('HTTP Error', err.error);
                            return;

                             },
                        // () => console.log('HTTP request completed.')
                          );




     }); // For


  }); // For




}

// ----------------- Color Aleatorio -----------------------------
makeRandomColor(){
  let c = '';
  while (c.length < 6) {
    c += (Math.random()).toString(16).substr(-6).substr(-1);
  }
  return '#' + c;
}
// -----------------------------------------------------------------
//                Metodo para Cambiar las letras
// -----------------------------------------------------------------
// Metodo para eliminar tildes y solo primera letra en Mayuscula
capitalLetter(str: any) {


  if (!str) {
    return 'NA';
  }




  str = str.trim();

  const normalize = (() => {
    // tslint:disable-next-line: one-variable-per-declaration
    const from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
        to   = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
        mapping = {};

    for (let i = 0; i < from.length; i++ ) {
      mapping[ from.charAt( i ) ] = to.charAt( i );
    }

    return ( strg ) => {
        const ret = [];
        for ( let i = 0; i < strg.length; i++ ) {
            const c = strg.charAt( i );
            if ( mapping.hasOwnProperty( strg.charAt( i ) ) ) {
                ret.push( mapping[ c ] );
            }
            else {
                ret.push( c );
            }
        }
        return ret.join( '' );
    };

  })();


  str = normalize(str).toLowerCase(); // elimina las tildes y deja todo en Minuscula
  str = str.split(' ');

  for (let i = 0; i < str.length; i++) { // elimina espacios
    if ( str[i] === '' ) {
     // console.log('aqui');
      str.splice(i, 1); // remueve el registro
    }

  }

  for (let i = 0; i < str.length; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1); // Primera letra en Mayuscula
  }

  return str.join(' ');
}


// ==========================================================================
//             +++++++++++ CAMBIANDO EL FORMATO DE LA FECHA ++++++++++++++
// ==========================================================================
// Metodo para cambiar el formato de la fecha
// xlSerialToJsDate(xlSerial){
//   return new Date(-2209075200000 + (xlSerial - (xlSerial < 61 ? 0 : 1)) * 86400000).toString();
// }

ExcelDateToJSDate(serial) {

  if (typeof serial === 'string') {
    return serial;
  }

  const utcdays  = Math.floor(serial - 25569);
  const utcvalue = utcdays * 86400;
  const dateinfo = new Date(utcvalue * 1000);

  const fractionalday = serial - Math.floor(serial) + 0.0000001;

  let totalseconds = Math.floor(86400 * fractionalday);

  const seconds = totalseconds % 60;

  totalseconds -= seconds;

  const hours = Math.floor(totalseconds / (60 * 60));
  const minutes = Math.floor(totalseconds / 60) % 60;

  // FULL Date Format return **Original
  // return new Date(dateinfo.getFullYear(), dateinfo.getMonth(), dateinfo.getDate(), hours, minutes, seconds);


  const year = dateinfo.getFullYear().toString();
  let month = dateinfo.getMonth().toString();
  if (month === '0'){
    month = 'ene';
  }
  if (month === '1'){
    month = 'feb';
  }
  if (month === '2'){
    month = 'mar';
  }
  if (month === '3'){
    month = 'abr';
  }
  if (month === '4'){
    month = 'may';
  }
  if (month === '5'){
    month = 'jun';
  }
  if (month === '6'){
    month = 'jul';
  }
  if (month === '7'){
    month = 'ago';
  }
  if (month === '8'){
    month = 'sep';
  }
  if (month === '9'){
    month = 'oct';
  }
  if (month === '10'){
    month = 'nov';
  }
  if (month === '11'){
    month = 'dic';
  }
  let day = dateinfo.getDate() + 1;
  if (day === 32) {
    day = 31;
  }


  // Fecha corta
  const dateShort = `${day}-${month}-${year}`;
  return dateShort;


}



// ==================================================================================================================================


// =================================================================
//                 Codigo para el MODAL
// =================================================================
// metodo para cerrar el modal
cerraModal() {

  this.hide = 'hide';
  this.especialista = null;
  this.selectUsuario = '';
  this.imagenUrl = '';


  }

  // Metodo para Mostrar el modal
  mostrarModal() {

  this.hide = '';


  }


  // ====================================================================================

  // =======================================================
  //              BUSCADOR ESPECIALISTA
  // =======================================================
  buscarEspecialista(termino: string) {


    this.flag = false;

    if (termino.length === 1 && termino === ' ') {
      return;
    }

    if (termino.length <= 0) {
      this.cargarEspecialistas();
      return;

    }

    if (termino.length >= 1) {


        this.especialistaService.buscarEspecialista(termino)
                         .subscribe(resp => {
                           // console.log(resp);
                           if (resp.length === 0) {
                            this.message = 'No hay Registros';
                            this.flag = false;
                          }

                           if (resp.length > 0){
                           this.especialistas = resp;
                           this.flag = true;
                           // console.log(resp);
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



  }


// Metodo usado para cambiar Focus
clearInput(){

      this.inputTxt.nativeElement.value = '';
 }





} // END class

