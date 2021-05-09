import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { BuscadorService } from 'src/app/services/buscador/buscador.service';

import { Especialista } from 'src/app/models/especialista.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Orden } from 'src/app/models/orden.model';

@Component({
  selector: 'app-buscador-global',
  templateUrl: './buscador-global.component.html',
  styles: [
  ]
})
export class BuscadorGlobalComponent implements OnInit {


  // variables
  public ruta: string;
  public especialistas: Especialista[] = [];
  public empresas: Empresa[] = [];
  public ordenes: Orden[] = [];

  public flagEspecialista: boolean = false;
  public flagEmpresa: boolean = false;
  public flagOrdenes: boolean = false;

  // ----------Constructor-----------------
  constructor(private activatedRoute: ActivatedRoute,
              private buscadorService: BuscadorService) { }

  ngOnInit(): void {

     // recibiendo los datos por el URL
  this.activatedRoute.params // des-estructura el parametro Termino desde le url
                  .subscribe( ({ termino }) =>  {
                    this.busquedaGlobal(termino);
                    this.ruta = `/buscador/${termino}`; // ruta de regreso al buscador
                  });


  }

  // -----------------------Metodos------------------------------
// metodo para consultar toda la BD
busquedaGlobal( termino: string ) {

  this.buscadorService.busquedaGlobal( termino )
                        .subscribe( (resp: any) => {
                          // console.log(resp);

                          this.especialistas = resp.especialistas;
                          this.empresas = resp.empresas;
                          this.ordenes = resp.ordenes;
                          // muestra el loading
                          this.flagEspecialista = this.especialistas.length === 0 ? true : false;
                          this.flagEmpresa = this.empresas.length === 0 ? true : false;
                          this.flagOrdenes = this.ordenes.length === 0 ? true : false;

                        });

  }



} // END class
