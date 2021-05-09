import { Component, OnInit } from '@angular/core';

import { SidebarService } from 'src/app/services/shared/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})

export class SidebarComponent implements OnInit {

   // Variables para validar si el usuario esta logeado
   usuario: Usuario;

  constructor( public sidebarService: SidebarService,
               public usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.usuario = this.usuarioService.usuario;

  }




} // END class
