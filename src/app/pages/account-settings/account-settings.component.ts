import { Component, OnInit, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { SettingsService } from '../../services/settings/settings.service';





@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  // variables
  flag: boolean = true;
  ajustes: string = '';

  constructor( @Inject(DOCUMENT) private document: Document,
               public ajustesService: SettingsService ) {

   }

  ngOnInit(): void {

    this.colocarCheck();

  }




  // ========== Metodo para cambiar el color del tema GENERAL===================
  cambiarColor(theme: string, link: any){

  if (theme !== 'default') {

    this.flag = false;

    }
  if (theme === 'default') {

      this.flag = true;

    }


  // console.log(link);
  this.aplicarCheck(link);
  this.ajustesService.aplicarTema(theme); // codigo para guardar los ajustes en el localStorage


  }

  // metodo para cambiar de posicion del icono check
  aplicarCheck(link: any){

    const selectores: any = this.document.getElementsByClassName('selector'); // selecciona la clase del elemento HTML

    for (const ref of selectores){ // recorre la lista de clases en el elemento HTML
      ref.classList.remove('working'); // remueve la calse 'working' que es la clase css que pone el icono check
    }

    link.classList.add('working'); // coloca la clase workin (icono check) en la clase que viene como parametro


  }

// metodo para calocar el check cuando se carga la pagina
colocarCheck(){

  const selectores: any = this.document.getElementsByClassName('selector'); // selecciona la clase del elemento HTML

  const tema = this.ajustesService.ajustes.tema; // carga el tema 'default'

  if (tema !== 'default') {

    this.flag = false;

    }
  if (tema === 'default') {

    this.flag = true;

  }

  for (const ref of selectores){ // recorre la lista de clases en el elemento HTML

    if (ref.getAttribute('data-theme') === tema) { // valida cual elemento HTML tiene el tema defaul

      ref.classList.add('working'); // le asigna la clase 'working' que es la clase css que pone el icono check al elemento HTML

      break;
    }

  }



}

// =============== Metodos para cambiar el color HEADER - SIDEBAR =====================================

// metodo para resestablecer el color del Header y del Sidebar
setDefault(component: string) {

  if (component === 'header'){

    const headerElement: any = this.document.getElementById('header');
    headerElement.setAttribute('class', 'app-header header-shadow');

    const selector: any = this.document.getElementsByClassName('color-sw-h'); // selecciona la clase del elemento HTML

    for (const ref of selector){ // recorre la lista de clases en el elemento HTML
      ref.classList.remove('active'); // remueve la calse
    }

    this.ajustesService.ajustes.headerColor = 'app-header header-shadow';

}

  if (component === 'sidebar'){


  const sidebarElement: any = this.document.getElementById('sidebar');
  sidebarElement.setAttribute('class', 'app-sidebar sidebar-shadow');

  const selector: any = this.document.getElementsByClassName('color-sw-s'); // selecciona la clase del elemento HTML

  for (const ref of selector){ // recorre la lista de clases en el elemento HTML
      ref.classList.remove('active'); // remueve la calse
    }

  this.ajustesService.ajustes.sidebarColor = 'app-sidebar sidebar-shadow';

}

  this.ajustesService.guardarAjustes();


}




// Metodo para cambiar color del Header
setHeaderColor(color: string, link: any){


 const swColor: any =  this.document.getElementsByClassName('color-sw-h');

 for (const ref of swColor){ // recorre la lista de clases en el elemento HTML
  ref.classList.remove('active'); // remueve la calse
}

 const headerElement: any = this.document.getElementById('header');
 headerElement.setAttribute('class', 'app-header header-shadow ' + color);

 link.classList.add('active');

 this.ajustesService.ajustes.headerColor = 'app-header header-shadow ' + color;

 this.ajustesService.guardarAjustes();

}

// Metodo para cambiar color del Sidebar
setSidebarColor(color: string, link: any){


  const swColor: any =  this.document.getElementsByClassName('color-sw-s');

  for (const ref of swColor){ // recorre la lista de clases en el elemento HTML
   ref.classList.remove('active'); // remueve la calse
 }

  const sidebarElement: any = this.document.getElementById('sidebar');
  sidebarElement.setAttribute('class', 'app-sidebar sidebar-shadow ' + color);

  link.classList.add('active');

  this.ajustesService.ajustes.sidebarColor = 'app-sidebar sidebar-shadow ' + color;

  this.ajustesService.guardarAjustes();

 }







} // END class
