import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ContratanteService } from 'src/app/services/dashboard/contratante.service';
import { EmpresaService } from 'src/app/services/dashboard/empresa.service';
import { ConfiguresService } from 'src/app/services/dashboard/configures.service';

import { Contratante } from 'src/app/models/contratante.model';
import { Asesor } from 'src/app/models/asesor';
import { Empresa } from 'src/app/models/empresa.model';
import { Sede } from 'src/app/models/sede.model';

import Swal from 'sweetalert2';





@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {


  @Input() nombre: string;
  @Input() contratante: Contratante;
  @Input() asesor: Asesor;
  @Input() empresa: Empresa;
  @Input() sede: Sede;
  @Input() especialista: any;

  @Output() DataForma: EventEmitter<FormGroup> = new EventEmitter();




  // variables
  forma: FormGroup;
  flag: boolean = true;
  listaSelectArl = [
    {nombre: 'Opciones', _id: 'Default'}
  ];
  listaSelectEmpresa = [
    {razon: 'Opciones', _id: 'Default'}
  ];
  listaSelectProfesion = [
    {nombre: 'Opciones', _id: 'Default'}
  ];




  constructor(private fb: FormBuilder,
              public contratantesService: ContratanteService,
              public empresasService: EmpresaService,
              public configuresService: ConfiguresService) {

                this.cargarArls(); // Opciones del Select - ARL

                this.cargarEmpresas(); // Opciones del Select - Empresas

                this.cargarProfesion(); // Opciones del Select - Profesion

                this.crearFormulario(); // llama el metodo para crear el formulario

  }

  ngOnInit(): void {

    // codigo para llenar el formulario del modal
    if (this.nombre === 'ARL') {

      if (!this.contratante) {
        return;
      }

      this.forma.reset();
      this.flag = false; // esconde el boton
      this.forma.controls.name.disable();
      this.forma.controls.name.setValue(this.contratante.nombre);
      this.forma.controls.cell.setValue(this.contratante.telefono);
      this.forma.controls.email.setValue(this.contratante.correo);
      this.forma.controls.city.setValue(this.contratante.ciudad);
      this.forma.controls.adress.setValue(this.contratante.direccion);
      this.forma.controls.contract.setValue(this.contratante.contrato);
    }
     // codigo para llenar el formulario del modal
    if (this.nombre === 'Asesor') {

      if (!this.asesor) {
        return;
      }

      this.forma.reset();
      this.flag = false; // esconde el boton
      this.forma.controls.name.disable();
      this.forma.controls.name.setValue(this.asesor.nombre);
      this.forma.controls.cell.setValue(this.asesor.telefono);
      this.forma.controls.email.setValue(this.asesor.correo);
      this.forma.controls.city.setValue(this.asesor.ciudad);

      if (this.asesor.contratante) {
        this.listaSelectArl = [{
          nombre: this.asesor.contratante.nombre,
         _id: this.asesor.contratante._id
        }];

      }

      this.forma.controls.selectArl.setValue(this.listaSelectArl[0]);
    }
     // codigo para llenar el formulario del modal
    if (this.nombre === 'Empresa') {

      if (!this.empresa) {
        return;
      }

      this.forma.reset();
      this.flag = false; // esconde el boton
      this.forma.controls.name.disable();
      this.forma.controls.name.setValue(this.empresa.razon);
      this.forma.controls.cell.setValue(this.empresa.telefono);
      this.forma.controls.email.setValue(this.empresa.correo);
      this.forma.controls.city.setValue(this.empresa.ciudad);
      this.forma.controls.nit.setValue(this.empresa.nit);
      this.forma.controls.contacto.setValue(this.empresa.contacto);


      if (this.empresa.contratante) {
        this.listaSelectArl = [{
          nombre: this.empresa.contratante.nombre,
         _id: this.empresa.contratante._id
        }];

      }

      this.forma.controls.selectArl.setValue(this.listaSelectArl[0]);
    }
     // codigo para llenar el formulario del modal
    if (this.nombre === 'Sede') {

      if (!this.sede) {
        return;
      }

      this.forma.reset();
      this.flag = false; // esconde el boton
      this.forma.controls.name.disable();
      this.forma.controls.name.setValue(this.sede.nombre);
      this.forma.controls.cell.setValue(this.sede.telefono);
      this.forma.controls.email.setValue(this.sede.correo);
      this.forma.controls.city.setValue(this.sede.ciudad);
      this.forma.controls.adress.setValue(this.sede.direccion);
      this.forma.controls.contacto.setValue(this.sede.contacto);

      if (this.sede.empresa.razon) {
        this.listaSelectEmpresa = [{
          razon: this.sede.empresa.razon,
         _id: this.sede.empresa._id
        }];

      }

      this.forma.controls.selectEmpresa.setValue(this.listaSelectEmpresa[0]);


    }
     // codigo para llenar el formulario del modal
    if (this.nombre === 'Especialista') {

      if (!this.especialista) {
        return;
      }

      this.forma.reset();
      this.flag = false; // esconde el boton
      this.forma.controls.name.disable();
      this.forma.controls.name.setValue(this.especialista.nombre);
      this.forma.controls.cell.setValue(this.especialista.telefono);
      this.forma.controls.email.setValue(this.especialista.correo);
      this.forma.controls.city.setValue(this.especialista.ciudad);
      this.forma.controls.adress.setValue(this.especialista.direccion);
      this.forma.controls.licencia.setValue(this.especialista.licencia);
      this.forma.controls.vigencia.setValue(this.especialista.vigencia);

      this.forma.controls.selectProfesion.setValue(this.listaSelectProfesion[0]);



    }


  }

// --------------------------------------------------
// Metodo para Cargar Las ARLs

cargarArls() {

  this.contratantesService.obtenerArlsTodas()
                          .subscribe((resp: any) => {

                           // console.log(resp);

                           if (resp.total > 0) {

                             for (const item of resp.contratante) {
                               this.listaSelectArl.push({nombre: item.nombre, _id: item._id});
                                }

                            }

                           if (resp.total === 0) {
                             this.listaSelectArl.push({nombre: resp.message, _id: 'Default'});
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


// --------------------------------------------------
// Metodo para Cargar Las Empresas

cargarEmpresas() {

  this.empresasService.obtenerEmpresasTodas()
                          .subscribe((resp: any) => {

                           // console.log(resp);

                           if (resp.total > 0) {

                             for (const item of resp.empresa) {
                               this.listaSelectEmpresa.push({razon: item.razon, _id: item._id});
                                }

                            }

                           if (resp.total === 0) {
                             this.listaSelectEmpresa.push({razon: resp.message, _id: 'Default'});
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


// --------------------------------------------------
// Metodo para Cargar Las Empresas

cargarProfesion() {

  this.configuresService.obtenerProfesionTodas()
                        .subscribe((resp: any) => {

                          // console.log(resp);

                          if (resp.total > 0) {

                            for (const item of resp.profesion) {
                              this.listaSelectProfesion.push({nombre: item.nombre, _id: item._id});
                               }

                           }

                          if (resp.total === 0) {
                            this.listaSelectProfesion.push({nombre: resp.message, _id: 'Default'});
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






    // ----------------------
 // metodos para hacer las validaciones del Input Sincronas

get nameNoValido() {
  return this.forma.get('name').invalid && this.forma.get('name').touched;
}
get cellNoValido() {
  return this.forma.get('cell').invalid && this.forma.get('cell').touched;
}
get emailNoValido() {
  return this.forma.get('email').invalid && this.forma.get('email').touched;
}
get countryNoValido() {
  return this.forma.get('adress').invalid && this.forma.get('adress').touched;
}
get cityNoValido() {
  return this.forma.get('city').invalid && this.forma.get('city').touched;
}
get messageNoValido() {
  return this.forma.get('contract').invalid && this.forma.get('contract').touched;
}




// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    name:    ['', [Validators.required, Validators.minLength(3)]],
    cell:    '',
    email:   ['', [Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
    adress:  '',
    city:    ['', [Validators.required, Validators.minLength(3)]],
    contract: '',
    nit: '',
    contacto: '',
    licencia: '',
    vigencia: '',
    selectArl: this.listaSelectArl[0],
    selectEmpresa: this.listaSelectEmpresa[0],
    selectProfesion: this.listaSelectProfesion[0]

    });

}


// ===========================================================
//          ENVIAR DATA DEL FORMULARIO
// ===========================================================
enviarData() {

  if (this.forma.invalid) { // condicion para saber si el formulario es valido

    // codigo para obtener los controles Input del formulario
    return  Object.values( this.forma.controls ).forEach( control => {
      control.markAsTouched(); // marca el input como tocado por el usuario
    });
  }

  // muestra la informacion cuando el formulario es valido
  // console.log(this.forma.value);


  this.DataForma.emit(this.forma);


}


} // END class
