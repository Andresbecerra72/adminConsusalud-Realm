import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../services/settings/settings.service';

// esta linea sirve para llamar funciones js que estan fuera de Angular
declare function init_plugins(): any; // codigo para llamar script main.js

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor( public ajustesService: SettingsService) {
    init_plugins(); // carga la funcion del main.js
   }

  ngOnInit(): void {

    // LLama los ajustes cuando estan en 'default'
    this.ajustesService.cargarDefault();


  }

}
