import { Component, OnInit } from '@angular/core';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { OrdenService } from 'src/app/services/orden/orden.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Orden } from 'src/app/models/orden.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-pending-ordenes',
  templateUrl: './pending-ordenes.component.html',
  styles: [
  ]
})
export class PendingOrdenesComponent implements OnInit {
// variables
flag: boolean = false;
message: string = 'Cargando Base de Datos';

usuario: Usuario;
especialista: Especialista;

ordenes: Orden[] = [];
ordenesArray: Orden[] = [];
count: number = 0;

totalRegistros: number = 0;
pagina: number = 0;

// ------------------ Constructor------------------------------------------------
constructor(public ordenService: OrdenService,
            public usuarioService: UsuarioService,
            public especialistaService: EspecialistaService) { }


ngOnInit(): void {

  this.usuario = this.usuarioService.usuario;

  if (this.usuario.especialista) {
    this.getEspecialista(this.usuario);
  }



            }


// ---------------------------------------------------------------------------
// metodo para cargar el Especialista
getEspecialista(usuario: Usuario) {

this.especialistaService.obtenerEspecialistaByID(usuario.especialista.toString())
                        .subscribe((resp: any) => {

                          if (resp.especialista) {

                            this.especialista = resp.especialista;

                           // console.log(this.especialista);

                           this.cargarOrdenesInicial(); // carga las ordenes Pendiente Informe


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


cargarOrdenesInicial() {

  this.ordenes = [];
  this.ordenesArray = [];
  this.count = 0;

  this.ordenService.obtenerOrdenesConsulta(0, 'Pendiente Informe')
                    .subscribe((resp: any) => {

                      if (resp.total > 0) {

                        const n = resp.total / 10; // total de registros / 10 para calcular el numero de paginas
                        const pages = Math.trunc(n); // funcion que devuelve la parte entera

                        // console.log(Math.trunc(pages));

                        for (let i = 0; i <= pages; i++) { // ciclo por numero de paginas

                        this.cargarOrdenesPendInforme({ page: (i * 10), especialista: this.especialista })

                        }

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





// =====================Metodos para cargar Ordenes Pendiente Informe con Revisor===========================================
cargarOrdenesPendInforme({ page, especialista }: { page: number; especialista: Especialista; }) {


  this.ordenService.obtenerOrdenesConsulta(page, 'Pendiente Informe') // para la consulta recibe el numero de paginas y el especialista (revisor)
                    .subscribe((resp: any) => {
                      // console.log(resp);

                      if (resp.orden) {

                        for (const item of resp.orden) {
                          if (item.revisor) {

                            if (item.revisor._id === especialista._id) {

                              // console.log(item);
                              this.ordenesArray.push(item);
                               this.count += 1;
                               if (this.count <= 10) {
                                 this.ordenes.push(item);
                               }
                            }
                          }

                        }



                        this.totalRegistros = this.ordenesArray.length;



                        if (this.totalRegistros === 0) {
                          this.message = 'No hay Registros';
                          this.flag = false;
                          this.ordenes = []; // ** Pendiente Verificar funcionamiento con datos mayores a 10 **

                        } else {
                          this.flag = true;
                        }


                      } else { // no hay registros
                        this.message = resp.message;
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



// =====================Metodos para cambiar la Pagina===========================================
// Metodo para cambiar la paginacion
cambiarPagina( valor: number) {

// console.log(valor);

this.count = 0;

const pagina = this.pagina + valor;

if ( pagina >= this.totalRegistros ) {
  return;
}

if ( pagina < 0 ) {
  return;
}

// codigo si las validaciones estan correctas
this.pagina += valor;


this.ordenes = [];

for (let i = this.pagina; i < this.ordenesArray.length; i++) {
    this.count += 1;
    if (this.count <= 10) {
      this.ordenes.push(this.ordenesArray[i]);
    }

}


// this.getEspecialista(this.usuario);

}


} // END class
