import { Component, OnInit } from '@angular/core';

import { Empresa } from 'src/app/models/empresa.model';

import { EmpresaService } from 'src/app/services/dashboard/empresa.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-empresas',
  templateUrl: './buscar-empresas.component.html',
  styles: [
  ]
})
export class BuscarEmpresasComponent implements OnInit {

  // variables
  empresas: Empresa[] = [];
  flag: boolean = false;
  message: string = 'Cargando Base de Datos';
  pagina: number = 0;
  totalRegistros: number = 0;

  // -------------------------Constructor-----------------------------------
  constructor(public empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
    }

    // Metodo para cargar las empresas
    cargarEmpresas() {

    this.empresas = [];

    this.empresaService.obtenerEmpresas( this.pagina )
                      .subscribe((resp: any) => {

                        if (!resp.empresa) {
                          this.message = resp.message;
                          this.flag = false;
                        }

                        if (resp.empresa){
                          this.totalRegistros = resp.total;
                          this.empresas = resp.empresa;
                          this.flag = true;
                          // console.log(resp);
                        }


                      }, err => {
                           console.log('HTTP Error', err.error);
                           Swal.fire({
                            title: '¡Error!',
                            text: JSON.stringify(err.error.message),
                            icon: 'error',
                            confirmButtonText: 'Cerrar',
                            scrollbarPadding: false,
                            allowOutsideClick: false
                          });
                        });

  }



   // Metodo para buscar una Empresa
   buscarEmpresa( termino: string) {

    this.flag = false;

    if (termino.length === 1 && termino === ' ') {
      return;
    }

    if (termino.length <= 0) {
      this.cargarEmpresas();
      return;

    }

    if (termino.length >= 1) {


        this.empresaService.buscarEmpresa(termino)
                         .subscribe(resp => {
                           // console.log(resp);
                           if (resp.length === 0) {
                            this.message = 'No hay Registros';
                            this.flag = false;
                          }

                           if (resp.length > 0){
                           this.totalRegistros = resp.length;
                           this.empresas = resp;
                           this.flag = true;
                           // console.log(resp);
                         }

                         }, err => {
                             console.log('HTTP Error', err.error);
                             Swal.fire({
                              title: '¡Error!',
                              text: JSON.stringify(err.error.message),
                              icon: 'error',
                              confirmButtonText: 'Cerrar',
                              scrollbarPadding: false,
                              allowOutsideClick: false
                            });
                          });

    }


  }


   // =====================Metodos para cambiar la Pagina===========================================
// Metodo para cambiar la paginacion
cambiarPagina( valor: number) {

  // console.log(valor);


  const pagina = this.pagina + valor;

  if ( pagina >= this.totalRegistros ) {
    return;
  }

  if ( pagina < 0 ) {
    return;
  }

  // codigo si las validaciones estan correctas
  this.pagina += valor;
  this.cargarEmpresas();

}

} // END class
