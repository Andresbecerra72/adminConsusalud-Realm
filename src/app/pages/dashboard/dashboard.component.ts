import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';


import { SoportesService } from 'src/app/services/soportes/soportes.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Soportes } from 'src/app/models/soportes.model';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

 // variables
 usuario: Usuario;
 ROLE: string = '';

 soporte: Soportes;
 soporteArray: any[] = [];

  // ----------------constructor-------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              private usuarioService: UsuarioService,
              private soportesService: SoportesService) { }

  ngOnInit(): void {

    this.usuario = this.usuarioService.usuario;
    this.ROLE = this.usuario.role;

    if(this.ROLE === 'ESPEC_ROLE') {

      this.cargarSoportes();

    }



  }




   // ------------------------------------------------
    // *******Metodo para transformar el Object en un Arreglo ***********
crearArray(anotacionesObj: object) {

  const anotaciones: any[] = [];

  if ( anotacionesObj === null ) { return []; } // condicion si el objeto recibido no tiene informacion

  Object.keys( anotacionesObj ).forEach( key => {

                  // en este punto solo se tienen los datos de cada objeto sin las claves
                  const anotacion = anotacionesObj[key];
                  // console.log(anotacion);
                  anotaciones.push(anotacion);

  });

  return anotaciones;
}

   // --------------------------------------------------

  // --------Metodos---------------------------------
  // metodo para cargar los soportes del Usuario Especialista
cargarSoportes() {

  this.soporteArray = [];


  this.soportesService.obtenerSoportesTodas()
                      .subscribe( (resp: any) => {
                        // console.log(resp);

                        if (resp.soportes.length > 0) {

                         for (const item of resp.soportes) {

                            if (item.estado === 'Incompleto' && item.anotaciones && (item.especialista._id === this.usuario.especialista._id || item.especialista._id === this.usuario.especialista)) {

                             this.soporteArray.push(item);

                            }

                          }

                          // console.log(this.soporteArray);


                        }

                      });

}


  // -------------------------------------------------------------------
  // metodo para ver los mensajes de los Soportes con Novedades
  viewDetails(item: any, i: string) {

    this.soporte = item;

    // console.log(this.soporte);

    const selector: any = this.document.getElementsByClassName('list-group-item'); // selecciona la clase del elemento HTML

    for (const ref of selector){ // recorre la lista de clases en el elemento HTML
      ref.classList.remove('list-group-item-info'); // remueve la calse
    }

    const itemList: any = this.document.getElementById(i);
    itemList.classList.add('list-group-item-info');

  }



} // END class
