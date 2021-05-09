import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Profesion } from 'src/app/models/profesion';

@Component({
  selector: 'app-cards-group',
  templateUrl: './cards-group.component.html',
  styles: [
  ]
})
export class CardsGroupComponent implements OnInit {

  @Input() items: any[] = [];
  @Input() flag: boolean = false;
  @Input() nombre: string = '';

  @Output() DataItem: EventEmitter<any> = new EventEmitter();

  // variables
  usuario: Usuario;
  profesion: Profesion;
  ROLE: string = '';
  colorArray: string[] = [];

    // ---------------------- Constructor -----------------------------------------------------------
  constructor( private usuarioService: UsuarioService) { }

  ngOnInit(): void {
   // console.log(this.items);
   this.usuario = this.usuarioService.usuario;
   this.ROLE = this.usuario.role;

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



  editarRegistro(item: any) {

    // console.log(item);
    this.DataItem.emit(item);

  }

} // END class
