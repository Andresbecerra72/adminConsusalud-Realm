import { Injectable, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/colors/default.css',
    tema: 'default'
  };

  constructor( @Inject(DOCUMENT) private document: Document ) {

    this.cargarAjustes();
   }


  // metodos
guardarAjustes(){
  localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
}

cargarAjustes(){

  if ( localStorage.getItem('ajustes')){

    this.ajustes = JSON.parse(localStorage.getItem('ajustes'));

    this.aplicarTema(this.ajustes.tema); // aplica el tema seleccionado "Ajustes"

  }else{
    this.aplicarTema(this.ajustes.tema); // aplica el tema seleccionado "Ajustes"

  }


}

aplicarTema(theme: string){

  const url = `assets/colors/${theme}.css`;
  this.document.getElementById('tema').setAttribute('href', url ); // identifica el Elemento HTML


  this.ajustes.tema = theme;
  this.ajustes.temaUrl = url;

  this.guardarAjustes(); // guarda los ajustes en el localstorage

}

// Metodo para cargar los ajustes de color de Sidebar - Header
// cuando esta seleccionado por 'default'
cargarDefault() {
      const headerElement: any = this.document.getElementById('header');
      const sidebarElement: any = this.document.getElementById('sidebar');

      if ( localStorage.getItem('ajustes')){

        this.ajustes = JSON.parse(localStorage.getItem('ajustes'));

        if ( this.ajustes.tema === 'default' && this.ajustes.headerColor) {

          headerElement.setAttribute('class', this.ajustes.headerColor);

        }
        if ( this.ajustes.tema === 'default' && this.ajustes.sidebarColor) {

          sidebarElement.setAttribute('class', this.ajustes.sidebarColor);

        }
        if ( this.ajustes.tema === 'default' && !this.ajustes.headerColor && !this.ajustes.sidebarColor) {

          headerElement.setAttribute('class', 'app-header header-shadow');
          sidebarElement.setAttribute('class', 'app-sidebar sidebar-shadow');

          }

      }

      return;


}






}// END Class

// interface se declara fuera de la clase
interface Ajustes {
  temaUrl: string;
  tema: string;
  headerColor?: string;
  sidebarColor?: string;
}
