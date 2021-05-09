import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  // variables
  public tipo: string;
  public id: string;

  public hide: string = 'hide'; // variable para ocultar el modal

  public notificacion = new EventEmitter<any>(); // variable para indicar que se esta usando el modal

  constructor() { }


// Metodo para Ocultar el modal
ocultarModal() {

  this.hide = 'hide';
  this.tipo = null;
  this.id = null;


  }
// Metodo para Mostrar el modal
mostrarModal( tipo: string, id: string) {

  this.hide = '';
  this.tipo = tipo;
  this.id = id;



}


}
