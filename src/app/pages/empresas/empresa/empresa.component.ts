import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { EmpresaService } from 'src/app/services/dashboard/empresa.service';

import { Empresa } from 'src/app/models/empresa.model';
import { Sede } from 'src/app/models/sede.model';
import { Orden } from 'src/app/models/orden.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styles: [
  ]
})
export class EmpresaComponent implements OnInit {

  // variables
  forma: FormGroup;
  empresa: Empresa;
  sede: Sede;
  orden: Orden;
  regresar: string;

  sedesArray: Sede[] = [];
  ordenesArray: Orden[] = [];



  formHide: boolean = false;



  // --------------------Constructor------------------------------
  constructor(@Inject(DOCUMENT) private document: Document,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public empresaService: EmpresaService) { }

  ngOnInit(): void {

    this.rutaParametros();
    this.crearFormulario();

  }



// ------------------------------------------------------------------
// metodo para obtener la informacion desde la URL
rutaParametros() {

  this.route.params.subscribe(parametros => {
    // console.log(parametros);
    this.regresar = parametros.page;

    if (parametros.id) {
      this.empresaService.obtenerEmpresaByID(parametros.id.toString())
                              .subscribe((resp: any) => {

                                // console.log(resp);
                                if (resp.empresa) {
                                      this.empresa = resp.empresa;
                                      if (resp.empresa.sedes.length > 0 ){

                                        for (const item of resp.empresa.sedes ) {
                                          this.sedesArray.push(item);
                                        }
                                      }
                                      if (resp.empresa.ordenes.length > 0 ){

                                        for (const item of resp.empresa.ordenes ) {
                                          this.ordenesArray.push(item);
                                        }
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

  });

}

   // ----------------------
 // metodos para hacer las validaciones del Input Sincronas

 get selectOrdenesNoValido() {
  return this.forma.get('selectOrden').invalid && this.forma.get('selectOrden').touched;
}


// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    selectOrden:  ['', Validators.required]

    });

}


// ===========================================================
//          ENVIAR DATA DEL FORMULARIO
// ===========================================================
crearSoporte() {


  if (this.forma.invalid) { // condicion para saber si el formulario es valido

    // codigo para obtener los controles Input del formulario
    return  Object.values( this.forma.controls ).forEach( control => {
      control.markAsTouched(); // marca el input como tocado por el usuario
    });
  }

  // muestra la informacion cuando el formulario es valido
  console.log(this.forma.value);



}



  // -------------------------------------------------------------------
  viewDetailsSedes(item: any, i: string) {

    this.sede = item;

    const selector: any = this.document.getElementsByClassName('list-group-item'); // selecciona la clase del elemento HTML

    for (const ref of selector){ // recorre la lista de clases en el elemento HTML
      ref.classList.remove('list-group-item-info'); // remueve la clase
    }

    const itemList: any = this.document.getElementById(`sede-${i}`);
    itemList.classList.add('list-group-item-info');



  }
  // -------------------------------------------------------------------
  viewDetailsOrdenes(item: any, i: string) {

    this.orden = item;

    const selector: any = this.document.getElementsByClassName('list-group-item'); // selecciona la clase del elemento HTML

    for (const ref of selector){ // recorre la lista de clases en el elemento HTML
      ref.classList.remove('list-group-item-info'); // remueve la calse
    }

    const itemList: any = this.document.getElementById(`orden-${i}`);
    itemList.classList.add('list-group-item-info');



  }




} // END class
