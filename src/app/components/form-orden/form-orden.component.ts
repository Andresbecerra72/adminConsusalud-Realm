import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { TarifaService } from 'src/app/services/tarifa/tarifa.service';
import { EmpresaService } from 'src/app/services/dashboard/empresa.service';

import { Tarifa } from 'src/app/models/tarifa.model';
import { Orden } from 'src/app/models/orden.model';


@Component({
  selector: 'app-form-orden',
  templateUrl: './form-orden.component.html',
  styles: [
  ]
})
export class FormOrdenComponent implements OnInit {

  // Elementos
  @Input() tipo: string;
  @Input() orden: Orden;
  @Output() DataForma: EventEmitter<FormGroup> = new EventEmitter();


  // variables
  forma: FormGroup;
  tarifa: Tarifa;

  flagEmpresaNoValido: boolean = false;
  flagDisable: boolean = false;
  flagSelectTarifa: boolean = false;

  listaSelectTarifa = [];
  listaSelectEmpresa = [];
  listaSelectUnidad = [
    'HORAS',
    'UNIDADES'
  ];
  listaSelectTipo = [
    {nombre: 'ASESORIA', index: 'A'},
    {nombre: 'CAPACITACIÓN', index: 'C'},
    {nombre: 'SERVICIO ESPECIALIZADO', index: 'E'},
    {nombre: 'ASISTENCIA TÉCNICA', index: 'T'},
    {nombre: 'CAPACITACIÓN TÉCNICA', index: 'CT'},

  ];
  listaSelectEstados: string[] = [ // Cambio General: ADMIN_ROLE
    'Pendiente Programar',
    'En Ejecución',
    'Finalizada',
    'Pre - Factura',
    'Facturada',
    'Pendiente Cancelar',
    'Cancelada - Programada',
    'Reprogramar',
    'En Devolución',
    'Pendiente Informe',
    'Informe Revisado',
    'Facturada Pendiente Programar',
    'NA'
  ];



  constructor(private fb: FormBuilder,
              private currencyPipe: CurrencyPipe,
              private empresaService: EmpresaService,
              private tarifaService: TarifaService) { }

  ngOnInit(): void {

    this.cargarTarifas(); // Opciones del Select - Tarifas
    this.cargarEmpresas(); // Opciones del Select - Tarifas
    this.crearFormulario(); // llama el metodo para crear el formulario

  }



  // --------------------------------------------------------------------------
// -------------- Metodo para Cargar Las Empresas --------------------

cargarEmpresas() {

 if (this.tipo === 'Particulares') {
   return;
 }

 this.empresaService.obtenerEmpresasTodas()
                     .subscribe((resp: any) => {

                      // console.log(resp);

                      if (resp.total > 0) {

                        for (const item of resp.empresa) {
                          this.listaSelectEmpresa.push({
                                                  razon: item.razon,
                                                  nit: item.nit,
                                                  _id: item._id
                                                 });
                       }

                        if (resp.total === 0) {
                        this.listaSelectEmpresa.push({
                          razon: resp.message,
                          nit: 'NA',
                           _id: 'Default'});
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


// -------------- Metodo para Cargar Las Tarifas --------------------
cargarTarifas() {


  this.tarifaService.obtenerTarifaTodas()
                          .subscribe((resp: any) => {

                          // console.log(resp);

                           if (resp.total > 0) {

                             for (const item of resp.tarifa) {
                               this.listaSelectTarifa.push({
                                                       codigo: item.codigo,
                                                       costo: item.costo,
                                                       _id: item._id
                                                      });
                            }
                          }

                             if (resp.total === 0) {
                             this.listaSelectTarifa.push({
                               codigo: resp.message,
                               costo: '0',
                                _id: 'Default'});
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

// ------- Metodo para cambiar el valor del Input Tafica a Currency -----------------
// Currency Transforme
transformAmount(){

  const costo = this.currencyPipe.transform(this.forma.controls.tarifa.value, '$');
  this.forma.controls.tarifa.setValue(costo);

}


// --------- Metodo para Seleccionar el valor de la Tarifa --------------------
seleccionTarifaCosto() {
  // console.log(this.forma.controls.selectEmpresa.value);

  this.flagSelectTarifa = false;

  if (!this.forma.controls.selectTarifa.value){
    return;
  }

  this.forma.controls.tarifa.setValue('');

  const costo = this.forma.controls.selectTarifa.value.costo;

  this.forma.controls.tarifa.setValue(costo);

}
// ---------------------------------------
// Promesa para cargar las tarifas
// ---------------------------------------
getTarifasArray() {

  return new Promise( (resolve, reject) => { // el servicio retorna una promesa

                this.tarifaService.obtenerTarifaTodas()
                                  .subscribe((resp: any) => {

                                  // console.log(resp);

                                  const tarifasArray = [];

                                   if (resp.total > 0) {

                                     for (const item of resp.tarifa) {
                                       tarifasArray.push({
                                                          codigo: item.codigo,
                                                          costo: item.costo,
                                                          _id: item._id
                                                        });
                                    }
                                  }

                                   if(tarifasArray.length > 0) {

                                    resolve(tarifasArray); // resuelve la promesa

                                  }else {

                                    reject('Error');

                                  }

                                  }, err => {
                                       console.log('HTTP Error', err.error);
                                       Swal.fire({
                                        title: '¡Error cargando las Tarifas!',
                                        text: JSON.stringify(err.error.message),
                                        icon: 'error',
                                        confirmButtonText: 'Cerrar',
                                        scrollbarPadding: false,
                                        allowOutsideClick: false
                                      });
                                    });

                      });


}





    // ----------------------
 // metodos para hacer las validaciones del Input Sincronas

get tarifaNoValido() {
  return this.forma.get('tarifa').invalid && this.forma.get('tarifa').touched;
}
get cronogramaNoValido() {
  return this.forma.get('cronograma').invalid && this.forma.get('cronograma').touched;
}
get secuenciaNoValido() {
  return this.forma.get('secuencia').invalid && this.forma.get('secuencia').touched;
}
get empresaNoValido() {
  return this.forma.get('empresa').invalid && this.forma.get('empresa').touched;
}
get ciudadNoValido() {
  return this.forma.get('ciudad').invalid && this.forma.get('ciudad').touched;
}
get sedeNoValido() {
  return this.forma.get('sede').invalid && this.forma.get('sede').touched;
}
get direcconNoValido() {
  return this.forma.get('direccion').invalid && this.forma.get('direccion').touched;
}
get actividadNoValido() {
  return this.forma.get('actividad').invalid && this.forma.get('actividad').touched;
}
get horasNoValido() {
  return this.forma.get('horas').invalid && this.forma.get('horas').touched;
}
get fechaNoValido() {
  return this.forma.get('fecha').invalid && this.forma.get('fecha').touched;
}
get transporteNoValido() {
  return this.forma.get('valor_transporte').invalid && this.forma.get('valor_transporte').touched;
}
get alojamientoNoValido() {
  return this.forma.get('valor_alojamiento').invalid && this.forma.get('valor_alojamiento').touched;
}
get alimentacionNoValido() {
  return this.forma.get('valor_alimentacion').invalid && this.forma.get('valor_alimentacion').touched;
}
get tiempoNoValido() {
  return this.forma.get('valor_tiempo_muerto').invalid && this.forma.get('valor_tiempo_muerto').touched;
}
get materialNoValido() {
  return this.forma.get('valor_material_complementario').invalid && this.forma.get('valor_material_complementario').touched;
}
// selects
get selectTarifaNoValido() {
  if (this.forma.controls.tarifa.value) {
    return;
  }
  return this.forma.get('selectTarifa').invalid && this.forma.get('selectTarifa').touched;
}
get selectUnidadNoValido() {
  return this.forma.get('selectUnidad').invalid && this.forma.get('selectUnidad').touched;
}
get selectTipoNoValido() {
  return this.forma.get('selectTipo').invalid && this.forma.get('selectTipo').touched;
}
get selectEmpresaNoValido() {

  this.forma.controls.empresa.setValue('');
  this.forma.controls.ciudad.setValue('-');
  this.forma.controls.sede.setValue('-');
  this.forma.controls.direccion.setValue('-');
  this.forma.controls.empresa.setValue('-');

  return this.flagEmpresaNoValido = false;
}


// validaciones para Gestor BD
get act_programadasNoValido() {
  return this.forma.get('act_programadas').invalid && this.forma.get('act_programadas').touched;
}
get act_ejecutadasNoValido() {
  return this.forma.get('act_ejecutadas').invalid && this.forma.get('act_ejecutadas').touched;
}
get act_reprogramadasNoValido() {
  return this.forma.get('act_reprogramadas').invalid && this.forma.get('act_reprogramadas').touched;
}
get act_canceladasNoValido() {
  return this.forma.get('act_canceladas').invalid && this.forma.get('act_canceladas').touched;
}




// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    tarifa:     ['', [Validators.required, Validators.minLength(1)]],
    cronograma: ['', [Validators.required, Validators.minLength(1)]],
    secuencia:  ['', [Validators.required, Validators.minLength(1)]],
    empresa:    ['', [Validators.required, Validators.minLength(1)]], // razon
    ciudad:     ['', [Validators.required, Validators.minLength(1)]],
    sede:       ['', [Validators.required, Validators.minLength(1)]],
    direccion:  ['', [Validators.required, Validators.minLength(1)]], // ubicacion_actividad
    actividad:  ['', [Validators.required, Validators.minLength(1)]],
    horas:      [0, [Validators.required, Validators.minLength(1)]],
    fecha:      ['', [Validators.required, Validators.minLength(1)]],
    descripcion:   '',
    observaciones: '',
    selectTarifa:  '',
    selectUnidad: ['', Validators.required],
    selectTipo: ['', Validators.required],
    selectEmpresa: '',
    valor_transporte: ['0', Validators.required],
    valor_alojamiento: ['0', Validators.required],
    valor_alimentacion: ['0', Validators.required],
    valor_tiempo_muerto: ['0', Validators.required],
    valor_material_complementario: ['0', Validators.required],
    tipo: '', // **Envia el tipo (ARL, Particulares , GESTOR) como un valor del formulario
    // Gestor
    selectEstados:   '',
    nit:   '',
    nombre_asesor:   '',
    num_pol:   '',
    act_programadas:   '',
    act_ejecutadas:   '',
    act_reprogramadas:   '',
    act_canceladas:   '',
    tiempo_administrativo:   '',
    tiempo_informe:   '',
    horas_programadas:   '',
    horas_ejecutadas:   '',
    horas_actividad:   '',
    valida:   false,
    valor_total:   '',
    created_at:   '',
    updated_at:   '',
    activo:   '',

    });


  if (this.tipo === 'ARL') {
    this.forma.get('tarifa').disable();
  }

  // ---------------------------------------------------------------------------------
  // condicion que coloca los datos en el formulario cuando viene desde el Gestor BD
  // ---------------------------------------------------------------------------------
  if (this.tipo === 'GESTOR') {

    this.setDatabyGestorDB();

  }

}






// ===========================================================
//          ENVIAR DATA DEL FORMULARIO
// ===========================================================
enviarData() {

  this.forma.controls.tipo.setValue(this.tipo); // emite el tipo de formulario Particulare/ARL

  if ((!this.forma.get('selectEmpresa').value || this.forma.get('selectEmpresa').value._id === 'Default' ) && this.tipo === 'ARL') {

    this.flagEmpresaNoValido = true;
    return;
  }

  if((!this.forma.get('selectTarifa').value || this.forma.get('selectTarifa').value._id === 'Default') && this.tipo === 'ARL') {

    Swal.fire({
      html: '<div class="alert alert-warning" role="alert">Falta seleccionar la Tarifa</div>',
      icon: 'warning',
      scrollbarPadding: false,
      allowOutsideClick: false
    });

    this.flagSelectTarifa = true;
    return;
  }


  if (this.forma.invalid) { // condicion para saber si el formulario es valido
    // codigo para obtener los controles Input del formulario
    return  Object.values( this.forma.controls ).forEach( control => {
      control.markAsTouched(); // marca el input como tocado por el usuario
    });
  }

  // si todo OK

  // muestra la informacion cuando el formulario es valido
  this.DataForma.emit(this.forma);



}
// ---------------------------------------------------------------------------
//  Metodo para editar la orden desde el GESTOR
// ---------------------------------------------------------------------------

setDatabyGestorDB() {

    this.forma.get('tarifa').disable(); // disable Tarifa Input
    this.forma.get('horas_programadas').disable(); // disable Horas Programadas Input
    this.forma.get('created_at').disable(); // disable Horas Programadas Input
    this.forma.get('updated_at').disable(); // disable Horas Programadas Input

    const index_unidad = this.orden.unidad === 'HORAS' ? 0 : 1;
    const str_fecha = new Date(this.orden.fecha_programada).toISOString();
    let index_fecha = '';
    let index_tipo = 0;
    let index_tarifa = 0;
    let index_estado = 0;

    // set Fecha
    if (str_fecha.length > 10) {
      const arr = str_fecha.split('T');
      index_fecha = arr[0];
    }else {
      index_fecha = this.orden.fecha_programada;
    }

    // set Tipo
    for (let i = 0; i < this.listaSelectTipo.length; i++) {
      if (this.listaSelectTipo[i].index === this.orden.tipo_servicio) {
        index_tipo = i;
        break;
      }
    }

    // set Estado
    for (let i = 0; i < this.listaSelectEstados.length; i++) {
      if (this.listaSelectEstados[i] === this.orden.estado) {
        index_estado = i;
        break;
      }
    }


  // codigo para datos de la tarifa en el Form
   this.getTarifasArray() // llama la promesa
        .then( (resp: any) => {
          // console.log(resp);

          let array = [];
          array = resp;

          for (let i = 0; i < array.length; i++) {
            if (array[i].codigo === this.orden.actividad_programa) { //actividad_programa es elcodigo de la tarifa
              index_tarifa = i;
              break;
            }
          }

          this.forma.get('selectTarifa').setValue(this.listaSelectTarifa[index_tarifa]); // codigo tarifa
          this.seleccionTarifaCosto(); // llama el metodo para colocar el valor en el Input

        })
        .catch(err => { // si falla la promes
         console.log(err);
        });



  // Llenando los datos en el FORM


    this.forma.get('cronograma').setValue(this.orden.cronograma);
    this.forma.get('secuencia').setValue(this.orden.secuencia);
    this.forma.get('empresa').setValue(this.orden.razon); // razon
    this.forma.get('direccion').setValue(this.orden.ubicacion_actividad); // ubicacion actividad
    this.forma.get('actividad').setValue(this.orden.descripcion); // descripcion es la actividad
    this.forma.get('horas').setValue(this.orden.act_programadas);
    this.forma.get('fecha').setValue(index_fecha);
    this.forma.get('selectTipo').setValue(this.listaSelectTipo[index_tipo]);
    this.forma.get('selectUnidad').setValue(this.listaSelectUnidad[index_unidad]);
    this.forma.get('valor_transporte').setValue(this.orden.valor_transporte);
    this.forma.get('valor_alojamiento').setValue(this.orden.valor_alojamiento);
    this.forma.get('valor_alimentacion').setValue(this.orden.valor_alimentacion);
    this.forma.get('valor_tiempo_muerto').setValue(this.orden.valor_tiempo_muerto);
    this.forma.get('valor_material_complementario').setValue(this.orden.valor_material_complementario);
    this.forma.get('observaciones').setValue(this.orden.observaciones);
    // Campos del Gestor
    this.forma.get('selectEstados').setValue(this.listaSelectEstados[index_estado]);
    this.forma.get('nit').setValue(this.orden.nit);
    this.forma.get('nombre_asesor').setValue(this.orden.nombre_asesor);
    this.forma.get('num_pol').setValue(this.orden.num_pol);
    this.forma.get('act_programadas').setValue(this.orden.act_programadas);
    this.forma.get('act_ejecutadas').setValue(this.orden.act_ejecutadas);
    this.forma.get('act_reprogramadas').setValue(this.orden.act_reprogramadas);
    this.forma.get('act_canceladas').setValue(this.orden.act_canceladas);
    this.forma.get('tiempo_administrativo').setValue(this.orden.tiempo_administrativo);
    this.forma.get('tiempo_informe').setValue(this.orden.tiempo_informe);
    this.forma.get('horas_programadas').setValue(this.orden.horas_programadas);
    this.forma.get('horas_ejecutadas').setValue(this.orden.horas_ejecutadas);
    this.forma.get('horas_actividad').setValue(this.orden.horas_actividad);
    this.forma.get('valida').setValue(this.orden.valida);
    this.forma.get('valor_total').setValue(this.orden.valor_total);
    this.forma.get('created_at').setValue(this.orden.created_at);
    this.forma.get('updated_at').setValue(this.orden.updated_at);
    this.forma.get('activo').setValue(this.orden.activo);

    // Invalid Field

    this.forma.get('ciudad').setValue('-');
    this.forma.get('sede').setValue('-');




}


} // END class
