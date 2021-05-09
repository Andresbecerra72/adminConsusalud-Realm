import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  // Elementos
  @ViewChild('txtTermino') inputTxt: ElementRef<any>;

  // variables
  usuario: Usuario;
  showMenu: boolean = false;


  // ---------------Constructor-------------------------------------
  constructor(public usuarioService: UsuarioService,
              private router: Router) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;

  }

  // -------------Metodo------------------------

  // -------------------------------------------
  //          Busqueda GLOBAL
  // -------------------------------------------
  busquedaGlobal( termino: string ) {

    const characters = /[&\/\\#,+()$~%.'":*?<>{}]/g;

    // valida si el valor del input es vacio y evita caracteres Especiales
    if ( termino.length === 0 || termino.match(characters)) {
      return;
    }

    // si todo OK
    // console.log(termino);
    this.router.navigateByUrl(`/buscador/${ termino }`); // realiza la navegacion



  }


     // Metodo usado para cambiar Focus
 clearInput(){

      this.inputTxt.nativeElement.value = '';
 }


} // END class
