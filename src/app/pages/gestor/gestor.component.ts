import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { EmpresaService } from 'src/app/services/dashboard/empresa.service';
import { OrdenService } from 'src/app/services/orden/orden.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { BuscadorService } from 'src/app/services/buscador/buscador.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { SoportesService } from 'src/app/services/soportes/soportes.service';

import { Orden } from 'src/app/models/orden.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-gestor',
  templateUrl: './gestor.component.html',
  styles: [
  ]
})
export class GestorComponent implements OnInit {

  // variables
  formaFiltroOrdenes: FormGroup;
  formaOrdenesEdit: FormGroup;
  formaUsuarios: FormGroup;
  formaOrden: FormGroup;

  // variables
  public listaSelectUsuario: any = [];
  public listaSelectEspecialista: any = [];
  public listaSelectEmpresa: any = [];

  public ordenesArray_all: Orden[] = [];
  public ordenesArray_0: Orden[] = [];
  public ordenesArray_1: Orden[] = [];
  public totalRegistros: number = 0;
  public breadcrums: string = '';

  public listaSelectYear = [];
  public listaSelectMonth = [
      {mes: 'Enero', _id: '1'},
      {mes: 'Febrero', _id: '2'},
      {mes: 'Marzo', _id: '3'},
      {mes: 'Abril', _id: '4'},
      {mes: 'Mayo', _id: '5'},
      {mes: 'Junio', _id: '6'},
      {mes: 'Julio', _id: '7'},
      {mes: 'Agosto', _id: '8'},
      {mes: 'Septiembre', _id: '9'},
      {mes: 'Octubre', _id: '10'},
      {mes: 'Noviembre', _id: '11'},
      {mes: 'Diciembre', _id: '12'}
  ];
  public listaSelectEstados: string[] = [ // Cambio General: ADMIN_ROLE
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
    'Archivo',
    'NA'
  ];
  public listaSelectActivo = [
    {nombre: 'Activo', index: '1'},
    {nombre: 'Parcialmente Revisado', index: '2'},
    {nombre: 'Pendiente Dir. Técnica', index: '3'},
    {nombre: 'Eliminado', index: 'x'},

  ];

  public listaSelectTipo = [
    {nombre: 'ASESORIA', index: 'A'},
    {nombre: 'CAPACITACIÓN', index: 'C'},
    {nombre: 'SERVICIO ESPECIALIZADO', index: 'E'},
    {nombre: 'ASISTENCIA TÉCNICA', index: 'T'},
    {nombre: 'CAPACITACIÓN TÉCNICA', index: 'CT'},

  ];

  public flagUsuarios: boolean = false;
  public flagOrdenesAlert: boolean = false;
  public flagOrdenesTable: boolean = false;
  public flagOrdenesFiltro: boolean = false;
  public checkFlag: boolean;


  selectedRowIds: Set<string> = new Set<string>();


  // ---------constructor----------------------------------
  constructor(private fb: FormBuilder,
              private router: Router,
              public usuarioService: UsuarioService,
              private buscadorService: BuscadorService,
              public ordenService: OrdenService,
              public empresasService: EmpresaService,
              // public especialistaService: EspecialistaService,
              // public eventoService: EventosService,
              // public soportesService: SoportesService
              ) { }

  ngOnInit(): void {

    this.cargarYears();
    this.cargarUsuarios();
    this.cargarOrdenes();
    this.cargarEmpresas();
    this.crearFormulario();

  }


  // --------------------metodos-----------------------
cargarYears() { // carga la lista del año para el Select

    this.listaSelectYear = [];

    const year = new Date().getFullYear();
    const opt1 = year;
    const opt2 = year - 1;
    const opt3 = year - 2;
    this.listaSelectYear.push(opt1.toString());
    this.listaSelectYear.push(opt2.toString());
    this.listaSelectYear.push(opt3.toString());

}




  // validaciones de los formularios
get usuarioNoValido() {
  return this.formaUsuarios.get('selectUsuario').invalid && this.formaUsuarios.get('selectUsuario').touched;
}


get yearNoValido() {
  return this.formaOrden.get('selectYear').invalid && this.formaOrden.get('selectYear').touched;
}
get cronogramaNoValido() {
  return this.formaOrden.get('cronograma').invalid && this.formaOrden.get('cronograma').touched;
}
get secuenciaNoValido() {
  return this.formaOrden.get('secuencia').invalid && this.formaOrden.get('secuencia').touched;
}






  // ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.formaUsuarios = this.fb.group({
    // es importante asociar los controles Input
    selectUsuario: ['', Validators.required]

    });

  this.formaOrden = this.fb.group({
    // es importante asociar los controles Input
    selectYear: ['', Validators.required],
    cronograma: ['', [Validators.required, Validators.minLength(1)]],
    secuencia:  ['', [Validators.required, Validators.minLength(1)]]

    });

  this.formaFiltroOrdenes = this.fb.group({
    // es importante asociar los controles Input
    selectYear: '',
    selectMonth: '',
    selectEstados: '',
    selectActivo: '',
    selectEmpresa: '',
    cronograma: '',
    secuencia:  '',
    selectTipo:  ''

    });
  this.formaOrdenesEdit = this.fb.group({
    // es importante asociar los controles Input
    selectYear: '',
    selectMonth: '',
    selectEstados: '',
    selectActivo: ''

    });



}

// ----------------------------------------------------
// metodo para obtener todos los Usuarios
// ----------------------------------------------------
cargarUsuarios() {

this.listaSelectUsuario = [];

this.usuarioService.obtenerUsuariosTodas()
                    .subscribe((resp: any) => {
                       // console.log(resp);

                      if (resp.total > 0) {

                        for (const item of resp.usuario) {

                          this.listaSelectUsuario.push({
                            nombre: item.nombre,
                            apellido: item.apellido,
                            correo: item.correo,
                             _id: item._id
                            });
                           }

                       }

                      if (resp.total === 0) {

                        this.flagUsuarios = true;

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


// =====================================================
// Metodo para obtener toda las Ordenes
// =====================================================

cargarOrdenes() {

  this.ordenesArray_all = [];
  this.ordenesArray_1 = [];
  this.totalRegistros = 0;

  this.flagOrdenesFiltro = true;
  this.flagOrdenesAlert = false;

  // obtiene todas las ordenes para el Gestor BD - SIN FILTROS
  this.ordenService.obtenerOrdenesTodasGestor()
                      .subscribe((resp: any) => {
                        // console.log(resp);

                        if (resp.total > 0) {

                          this.flagOrdenesFiltro = false;

                          this.totalRegistros = resp.total;

                          for (const item of resp.orden) {

                            this.ordenesArray_all.push(item);
                            this.ordenesArray_1.push(item);

                         }
                        }

                        if (resp.total === 0) {
                          this.flagOrdenesAlert = true;
                          this.ordenesArray_1 = [];
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



cargarEmpresas() {

  this.listaSelectEmpresa = [];


  this.empresasService.obtenerEmpresasTodas()
                      .subscribe((resp: any) => {
                        // console.log(resp);


                        if (resp.total > 0) {

                          for (const item of resp.empresa) {

                            this.listaSelectEmpresa.push(item.razon.toString());

                         }
                        }

                        if (resp.total === 0) {

                          this.listaSelectEmpresa.push('No hay registros');

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


// ----------------------------------------------
//     Actualizar seleccion multiple Orden
// ----------------------------------------------
actualizarManyOrdenes(inputForm: InputEditForm, action: string) {


  return new Promise( (resolve, reject) => { // el servicio retorna una promesa

    const arrOrdenes: Orden[] = this.getSelectedRows();

    let count = 1;

    for (const orden of arrOrdenes) {

      if(action === 'EDIT'){ // codicion para editar seleccion

        orden.obs_internas = null;
        orden.anotaciones = null;
        orden.horas_programadas = null;
        orden.sedes = null;
        orden.especialistas = null;
        orden.soportes = null;
        orden.eventos = null;
        orden.archivos = null;

        orden.year = inputForm.year === ''? orden.year : inputForm.year;
        orden.month = inputForm.month === ''? orden.month : inputForm.month;
        orden.estado = inputForm.estado === ''? orden.estado : inputForm.estado;
        orden.activo = inputForm.activo === ''? orden.activo : inputForm.activo;

            this.ordenService.actualizarOrden(orden)
                              .subscribe(() => {



                                  if (count === arrOrdenes.length) {

                                    resolve('Selección Actualizada');

                                  }

                                  count = count + 1;

                                }, err => {
                                  console.log('HTTP Error', err.error);
                                  reject(err.error);

                                });
      }

      if (action === 'DELETE') { // codicion para eliminar seleccion



        this.ordenService.borrarOrdenByGestor(orden._id)
                            .subscribe(() => {


                                if (count === arrOrdenes.length) {

                                  this.cargarOrdenes();

                                  resolve('Selección Eliminada');

                                }

                                count = count + 1;

                              }, err => {
                                console.log('HTTP Error', err.error);
                                reject(err.error);

                              });

      }

    }


  });

}

// metodo para remover un item del array
removeItemFromArr ( arr, item ) {

  return arr.filter( e => e !== item );

};

// --------------------------------------
//     GESTOR USUARIO
// --------------------------------------
  getUsuario() {

    if (this.formaUsuarios.invalid) { // condicion si el formulario es Invalido
      return;
   }

   this.router.navigate([`/gestorusuario/${this.formaUsuarios.controls.selectUsuario.value._id}/gestor`]); // navega a la Pagina

  }

  // -------------------------------------
  //     GETOR ORDEN
  // -------------------------------------


  getOrden() {

    this.ordenesArray_0 = [];


  if (this.formaOrden.invalid) { // condicion para saber si el formulario es valido

    // codigo para obtener los controles Input del formulario
    return  Object.values( this.formaOrden.controls ).forEach( control => {
      control.markAsTouched(); // marca el input como tocado por el usuario
    });
  }


  // si todo OK

  this.flagOrdenesTable = true;
  this.flagOrdenesAlert = false;

   const year = this.formaOrden.controls.selectYear.value;
   const cronograma = this.formaOrden.controls.cronograma.value;
   const secuencia = this.formaOrden.controls.secuencia.value;

   this.buscadorService.busquedaOrdenesByGestor(year, cronograma, secuencia)
                    .subscribe((resp: any) => {

                      // console.log(resp);

                      if (resp.total > 0) {

                        this.flagOrdenesTable = false;

                        for (const item of resp.ordenes) {

                          this.ordenesArray_0.push(item);

                        }

                      }
                      if (resp.total == 0) {

                        this.flagOrdenesAlert = true;

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


// -----------------------------------------------------------------
// metodo para obtener ordenes - busqueda
// -----------------------------------------------------------------

  getOrdenesMultiple() {

    this.ordenesArray_1 = [];
    let arrayFilter: any[] = [];

    this.flagOrdenesFiltro = true;



    // Controles
    const _year = this.formaFiltroOrdenes.value.selectYear || '';
    const _month = this.formaFiltroOrdenes.value.selectMonth._id || '';
    const _estados = this.formaFiltroOrdenes.value.selectEstados || '';
    const _activo = this.formaFiltroOrdenes.value.selectActivo.index || '';
    const _razon = this.formaFiltroOrdenes.value.selectEmpresa || '';
    const _cronograma = this.formaFiltroOrdenes.value.cronograma || '';
    const _secuencia = this.formaFiltroOrdenes.value.secuencia || '';
    const _tipo = this.formaFiltroOrdenes.value.selectTipo.index || '';
    // breadcums data
    const _month_nombre = this.formaFiltroOrdenes.value.selectMonth.mes || '';
    const _activo_nombre = this.formaFiltroOrdenes.value.selectActivo.nombre || '';
    const _tipo_nombre = this.formaFiltroOrdenes.value.selectTipo.nombre || '';

    // muestra los parametros de busqueda
    this.breadcrums = `${_year} / ${_month_nombre} / ${_estados} / ${_activo_nombre} / ${_razon} / ${_cronograma} / ${_secuencia} / ${_tipo_nombre}`;


    // filtros
    const filters: Filters = { // instancia la interface Filters
      year: _year,
      month: _month,
      estado: _estados,
      activo: _activo,
      razon: _razon,
      cronograma: _cronograma,
      secuencia: _secuencia,
      tipo_servicio : _tipo
  };


  // lla la funcion que retorna la busqueda filtrada
  arrayFilter = filterPlainArray(this.ordenesArray_all, filters);



    // llena el array con los los filtros
    if (arrayFilter.length > 0) {

      for (const item of arrayFilter) {
       this.ordenesArray_1.push(item);
      }

      this.flagOrdenesFiltro = false;

    }else {

      this.flagOrdenesAlert = true;

    }

   // console.log(this.ordenesArray_1);

  }


  // --------Reset Forma Filtro Ordenes-------------------------------
  resetForm() {

    this.cargarOrdenes();

    this.formaFiltroOrdenes.reset();
    this.formaFiltroOrdenes.controls.selectYear.setValue("");
    this.formaFiltroOrdenes.controls.selectMonth.setValue("");
    this.formaFiltroOrdenes.controls.selectEstados.setValue("");
    this.formaFiltroOrdenes.controls.selectActivo.setValue("");
    this.formaFiltroOrdenes.controls.selectEmpresa.setValue("");
    this.formaFiltroOrdenes.controls.selectTipo.setValue("");


  }

  // ======================================================================================
  // ---------------METODOS PARA SELECCIONAR FILAS ----------------------
  // ======================================================================================

  onRowClick(id: string) {
    if(this.selectedRowIds.has(id)) {
     this.selectedRowIds.delete(id);
    }
    else {
      this.selectedRowIds.add(id);
    }
  }

  rowIsSelected(id: string) {
    return this.selectedRowIds.has(id);
  }

  getSelectedRows(){ // retorna el array con las filas seleccionadas
    return this.ordenesArray_1.filter(x => this.selectedRowIds.has(x._id));
  }


  // codigo para ejecutar acciones multiples
  onLogClick(action: string) {

    // console.log(this.getSelectedRows());

       // Controles
    const _year = this.formaOrdenesEdit.value.selectYear || '';
    const _month = this.formaOrdenesEdit.value.selectMonth.index || '';
    const _estados = this.formaOrdenesEdit.value.selectEstados || '';
    const _activo = this.formaOrdenesEdit.value.selectActivo.index || '';

    // Inputs de la Forma
    const inputEditForm: InputEditForm = { // instancia la interface Filters
            year: _year,
            month: _month,
            estado: _estados,
            activo: _activo

    };

      // llama la PROMESA  para editar las ordenes seleccionadas
      this.actualizarManyOrdenes(inputEditForm, action)
                                .then( (resp: any) => {

                                  // console.log(resp);

                                  Swal.fire({
                                    title: 'Ordenes',
                                    text: resp,
                                    icon: 'info',
                                    confirmButtonText: 'Cerrar',
                                    scrollbarPadding: false,
                                    allowOutsideClick: false
                                  });
                                   // condicion para deseleccionar el checked 'Seleccionar todo'
                                   if(this.checkFlag) {
                                    this.selecAllRows(false);
                                   }else {
                                     // codigo para deseleccionar las filas de la tabla
                                    const selectedRows = this.getSelectedRows();
                                    for (const item of selectedRows) {
                                      this.onRowClick(item._id);
                                    }
                                   }


                                })
                                .catch(err => { // si falla la promes
                                 console.log(err);
                                });



  }

  // metodo para el CheckBox Input "Selecciona toda la tabla"
  selecAllRows(event: boolean) {
    // console.log(event);

    this.checkFlag = event;

    if (event) {

      for (const item of this.ordenesArray_1) {

        this.onRowClick(item._id);

      }

    }else {

      for (const item of this.ordenesArray_1) {

        this.onRowClick(item._id);

      }

    }


  }


} // END class


// =====================================================================================

// interface se declara fuera de la clase
interface Filters {
     year: string;
     month: string;
     estado: string;
     activo: string;
     razon: string;
     cronograma: string;
     secuencia: string;
     tipo_servicio : string;
}

interface InputEditForm {
     year: string;
     month: string;
     estado: string;
     activo: string;
}



function filterPlainArray(array: any, filters: Filters) {

  // console.log(filters);

  const filterKeys = Object.keys(filters);
  return array.filter(eachObj => {
    return filterKeys.every(eachKey => {
      if (!filters[eachKey].length) {
        return true; // passing an empty filter means that filter is ignored.
      }
      return filters[eachKey].includes(eachObj[eachKey]);
    });
  });
}

// ===========CODIGO NO USADO====================

/*
if ( _year.toString() && _month && _estados && _activo && _razon && _cronograma && _secuencia && _tipo) {

    arreglo = this.ordenesArray_all.filter(element =>
      element.year === _year.toString() && element.month === _month && element.estado === _estados && element.activo === _activo && element.razon === _razon && element.cronograma === _cronograma && element.secuencia === _secuencia && element.tipo_servicio === _tipo
     );

    } else if (_year.toString() && _month && _estados && _activo && _razon && _cronograma && _secuencia && _tipo) {

    }

*/


// this.listaSelectUsuario.push({
                        //   nombre: resp.message,
                        //   apellido: '',
                        //   correo: '',
                        //    _id: 'Default'});


  // this.formaEvent = this.fbEvent.group({
  //     // es importante asociar los controles Input
  //     start:      ['', Validators.required],
  //     end:        ['', Validators.required],
  //     hours:      [0, Validators.required],
  //     actividad:    '',
  //     informe:      '',
  //     obsInternas:  '',
  //     selectEspecialista: ['', Validators.required],
  //     selectEmpresa: ['', Validators.required],
  //     selectOrden: ['', Validators.required],
  //     selectSede: ['', Validators.required],

  //     });
