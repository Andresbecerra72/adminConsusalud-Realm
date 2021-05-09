import { Component, OnInit } from '@angular/core';

import { Router, ActivationEnd } from '@angular/router';

import { filter, map } from 'rxjs/operators';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnInit {

  // variables
  titulo: string;

  constructor(private router: Router,
              private title: Title) {

   this.getDataRoute().subscribe( data => {
       // console.log(data);
        this.titulo = data.titulo;
        this.title.setTitle(this.titulo); // coloca el titulo en el TAB del Buscador

    });
   }

  ngOnInit(): void {
  }

  // metodo para obtener el titulo de la ruta, el events es un Observable
  getDataRoute(){

   return this.router.events.pipe(
      filter( evento => evento instanceof ActivationEnd), // filtra el Observable del events
      filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null), // filtra el observable solo el firstChild vacio
      map( (evento: ActivationEnd) => evento.snapshot.data ) // extrae el valor data, este trae el numbre del titulo de la ruta
    );


  }

}
