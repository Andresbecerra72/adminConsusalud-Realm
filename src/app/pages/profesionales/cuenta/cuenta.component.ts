import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { EspecialistaService } from 'src/app/services/dashboard/especialista.service';
import { CuentaService } from 'src/app/services/cuenta/cuenta.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Soportes } from 'src/app/models/soportes.model';
import { Cuenta } from 'src/app/models/cuenta.model';


@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styles: [
  ]
})
export class CuentaComponent implements OnInit {

  @ViewChild('textarea') inputObs: ElementRef<any>;

  // variables
  usuario: Usuario;
  forma: FormGroup;
  flagTable: boolean = false;
  cuenta: Cuenta;
  ordenesArray = [];
  eventosArray = [];
  soportesArray = [];
  cuentaArray = [];
  validar: boolean = false;

  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();

  horas_total_ejecutadas: number = 0;
  total_asistentes: number = 0;
  total_tiempo_informe: number = 0;
  total_tiempo_administrativo: number = 0;
  total_tiempo_valido: number = 0;
  total_valor_transporte: number = 0;
  total_valor_insumos: number = 0;
  total_viaticos: number = 0;
  tarifa_hora: number = 0;
  valor_total_cuenta: number = 0;

  listaSelectEspecialista = [];
  listaSelectMonth = [
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


  // ----------constructor----------------------------

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              public cuentaService: CuentaService,
              public especialistaService: EspecialistaService) {

                this.crearFormulario(); // llama el metodo para crear el formulario
              }

  ngOnInit(): void {


    this.usuario = this.usuarioService.usuario;
    this.cargarEspecialistas(); // Opciones del Select - Especialistas


  }


  // -----------Metodos-------------------------------
  // *******Metodo para transformar el Object en un Arreglo ***********
crearArray( anotacionesObj: object) {

  const anotaciones: any[] = [];

  if ( anotacionesObj === null ) { return []; } // condicion si el objeto recibido no tiene informacion

  Object.keys( anotacionesObj ).forEach( key => {

                  // en este punto solo se tienen los datos de cada objeto sin las claves
                  const anotacion = anotacionesObj[key];
                  anotaciones.push(anotacion);

  });

  return anotaciones;
}

  // ---------- Metodo para Cargar Las Especialistas -----------------
cargarEspecialistas() {

  this.especialistaService.obtenerEspecialistaTodas()
                          .subscribe((resp: any) => {

                           // console.log(resp);

                           if (resp.total > 0) {

                             for (const item of resp.especialista) {
                               this.listaSelectEspecialista.push(item);
                                //  {
                                //  nombre: item.nombre,
                                //  ordenes: item.ordenes,
                                //  eventos: item.eventos,
                                //  soportes: item.soportes,
                                //   _id: item._id
                                // }

                                }

                            }

                           if (resp.total === 0) {
                             this.listaSelectEspecialista.push({nombre: resp.message, _id: 'Default'});
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

// ----------------------------------------------------------------------
//  metodo para obtener las informacion del especialista Seleccionado
// ----------------------------------------------------------------------
  infoEspecialista() {

      // codigo para validar los datos de los Selects
      Object.values( this.forma.controls ).forEach( control => {
        if (control.value._id  === 'Default') {
          return control.setErrors({invalid: true});
        }
      });

      if (this.forma.invalid) { // condicion para saber si el formulario es valido
        // codigo para obtener los controles Input del formulario
        return  Object.values( this.forma.controls ).forEach( control => {
          control.markAsTouched(); // marca el input como tocado por el usuario
        });
      }

      // console.log(this.forma.value);

      // reset variables
      this.eventosArray = [];
      this.ordenesArray = [];
      this.soportesArray = [];
      this.cuentaArray = [];

      this.horas_total_ejecutadas = 0;
      this.total_asistentes = 0;
      this.total_tiempo_informe = 0;
      this.total_tiempo_administrativo = 0;
      this.total_tiempo_valido = 0;
      this.total_valor_transporte = 0;
      this.total_valor_insumos = 0;
      this.total_viaticos = 0;
      this.tarifa_hora = 0;
      this.valor_total_cuenta = 0;


      // si todo Ok
      // const eventosArray = this.forma.controls.selectEspecialista.value.eventos;
      const ordenesArray = this.forma.controls.selectEspecialista.value.ordenes;
      const soportesArray = this.forma.controls.selectEspecialista.value.soportes;

      // eventos del mes
      for (const evento of this.forma.controls.selectEspecialista.value.eventos) {

        if (evento.month === this.forma.controls.selectMonth.value._id && evento.year === this.year.toString() && evento.activo === '0' && evento.soporte) {

          this.eventosArray.push(evento);


          // Filtra ordenes
          const foundOrdenID = ordenesArray.find(element => element._id === evento.orden);
           // Filtra soportes
          const foundSoporteID : Soportes = soportesArray.find(element => element.nombre === evento._id && element.activo === '0');

          // console.log(foundSoporteID);

          let totalEjec = 0;
          let asistentes = 0;
          let tiempoInforme = 0;
          let tiempoAdministrativo = 0;
          let tiempoValido = 0;
          let transporte = 0;
          let insumos = 0;

          if (foundSoporteID) { // condicion para el Soporte
          totalEjec = foundSoporteID.horas_usadas ? foundSoporteID.horas_usadas : 0;
          asistentes = foundSoporteID.asistentes ? parseInt(foundSoporteID.asistentes, 10) : 0;
          tiempoInforme = foundSoporteID.tiempo_informe ? foundSoporteID.tiempo_informe : 0;
          tiempoAdministrativo = foundSoporteID.tiempo_administrativo ? foundSoporteID.tiempo_administrativo : 0;
          tiempoValido = foundSoporteID.tiempo_valido ? foundSoporteID.tiempo_valido : 0;
          transporte = foundSoporteID.valor_transporte ? Number(foundSoporteID.valor_transporte.replace(/[^0-9\.]+/g, "")) : 0;
          insumos = foundSoporteID.valor_insumos ? Number(foundSoporteID.valor_insumos.replace(/[^0-9\.]+/g, "")) : 0;
          }


         if (foundOrdenID) { // condicion para la Orden
          if (foundOrdenID.horas_ejecutadas <= evento.horas_programadas && foundOrdenID.horas_ejecutadas !== 0 ) {
            // totalEjec = foundOrdenID.horas_ejecutadas;
          }
          if (foundOrdenID.horas_ejecutadas >= evento.horas_programadas) {
            // totalEjec = evento.horas_programadas;
          }
         }

          this.horas_total_ejecutadas = this.horas_total_ejecutadas + totalEjec;
          this.total_asistentes = this.total_asistentes + asistentes;
          this.total_tiempo_informe = this.total_tiempo_informe + tiempoInforme;
          this.total_tiempo_administrativo = this.total_tiempo_administrativo + tiempoAdministrativo;
          this.total_tiempo_valido = this.total_tiempo_valido + tiempoValido;
          this.total_valor_transporte = this.total_valor_transporte + transporte;
          this.total_valor_insumos = this.total_valor_insumos + insumos;
          this.total_viaticos = this.total_viaticos + this.total_valor_transporte + this.total_valor_insumos;


          this.cuentaArray.push(
            {
             nombre: evento.nombre,
             razon: evento.razon,
             fecha: evento.fecha,
             cronograma: evento.cronograma,
             secuencia: evento.secuencia,
             horas_programadas: evento.horas_programadas,
             horas_ejecutadas: totalEjec,
             soporte: foundSoporteID, // soporte
             asistentes:  asistentes > 0 ? asistentes : 'NA', // foundSoporteID.asistentes || 'NA',
             valor_transporte: transporte, // foundSoporteID.valor_transporte || '$0.0',
             valor_insumos: insumos, // foundSoporteID.valor_insumos || '$0.0',
             observacion: foundSoporteID ? foundSoporteID.observacion : 'NA',// foundSoporteID.observacion || 'NA',
             actividad: evento.actividad   // actividad del evento
            }

          );

        }

      } // end FOR


      for (const orden of this.forma.controls.selectEspecialista.value.ordenes) {

        if (orden.month === this.forma.controls.selectMonth.value._id) {

          this.ordenesArray.push(orden);

        }

      }

      for (const soporte of this.forma.controls.selectEspecialista.value.soportes) {

        if (soporte.month === this.forma.controls.selectMonth.value._id) {

          this.soportesArray.push(soporte);

        }

      }


       // console.log('EVENTOS: ', this.eventosArray);
       // console.log('ORDENES: ', this.ordenesArray);
       // console.log('SOPORTES', this.soportesArray);
       // console.log(this.cuentaArray);


      this.flagTable = true;

      // TODO: PENDIENTE CAMBIO DE AÑO SELECCION POR AÑO *********************
      // condicion para evitar crear la cuenta del mes actual o posterior
      if (parseInt(this.forma.controls.selectMonth.value._id, 10) >= (this.month + 1) ) {
        this.cuenta = null;
        return;
      }
      // Codigo para consultar si la cuenta exite en la BD
      this.cuentaService.obtenerCuentaByName(`${this.year}-${this.forma.controls.selectMonth.value.mes} ${this.forma.controls.selectEspecialista.value.nombre}`)
                        .subscribe((resp: any) => {

                          // console.log(resp);

                          if (resp.message === "No hay Registros") {
                            this.crearCuentaCobroBD(); // llama el metodo para crear la Cuenta de Cobro en la Base de datos
                          }
                          if (resp.cuenta) {
                            this.cuenta = resp.cuenta;
                            this.validar = resp.cuenta.valida;
                          }


                        },
                        err => {
                        console.log('HTTP Error', err.error);
                      });



  }






// ----------------------------------------------------
//           METODO PARA CREAR CUENTA EN BD
// ----------------------------------------------------
crearCuentaCobroBD() {


  this.tarifa_hora = this.forma.controls.selectEspecialista.value.tarifa_hora || 0;
  this.valor_total_cuenta = this.tarifa_hora * this.horas_total_ejecutadas;

  this.validar = false; // ajusta el radioBTN


  const cuenta = new Cuenta(
    `${this.year}-${this.forma.controls.selectMonth.value.mes} ${this.forma.controls.selectEspecialista.value.nombre}`,
    this.forma.controls.selectEspecialista.value.nombre,
    'NA',
    'NA',
    this.forma.controls.selectEspecialista.value.ciudad,
    this.forma.controls.selectEspecialista.value.horas_asignadas,
    this.horas_total_ejecutadas,
    this.total_asistentes,
    this.total_tiempo_informe,
    this.total_tiempo_administrativo,
    this.total_tiempo_valido,
    this.total_valor_transporte,
    this.total_valor_insumos,
    this.total_viaticos,
    this.tarifa_hora, // tarifa hora
    this.valor_total_cuenta,
    null,
    null,
    this.year.toString(),
    this.forma.controls.selectMonth.value.mes,
    null,
    this.validar, // valida la cuenta
    'NA', // observacion
    null,
    null,
    null,
    this.forma.controls.selectEspecialista.value, //especialista
    null, // ordenes
    null, // empresas
    null, // eventos
    null, // soportes

  );


   // console.log(cuenta);

   this.cuenta = null;


  this.cuentaService.guardandoCuenta(cuenta)
                    .subscribe((resp: any) => {

                      // console.log(resp);

                      if (resp.cuenta) {
                        this.cuenta = resp.cuenta;
                        this.cuenta.anotaciones = null;
                        this.cuenta.empresas = null;
                        this.actualizarCuentaByArrays(this.cuenta); // llama el metodo que ingresa los datos Ordenes - Eventos -soportes
                      }

                    },
                      err => {
                      console.log('HTTP Error', err.error);
                    });




}


// -----------------------------------------------------
//     METODO PARA ACTUALIZAR CUENTA
// -----------------------------------------------------
actualizarCuenta(cuenta: Cuenta, flag: boolean = false) {


  this.cuentaService.actualizarCuenta(cuenta)
                    .subscribe((resp: any) => {

                      // console.log(resp);

                      if (flag) {
                        this.cuenta = resp;
                        this.cuenta.anotaciones = resp.anotaciones.length > 0? resp.anotaciones: null;
                      }

                    },
                    err => {
                    console.log('HTTP Error', err.error);
                  });

}

// ----------------------------------------------------------
//     METODO PARA ACTUALIZAR CUENTA por los Arreglos
// ----------------------------------------------------------
actualizarCuentaByArrays(cuenta: Cuenta) {


  for (const item of this.ordenesArray) {

    cuenta.ordenes = item;
    cuenta.eventos = null;
    cuenta.soportes = null;
    this.actualizarCuenta(cuenta);

   }
   for (const item of this.eventosArray) {

    cuenta.ordenes = null;
    cuenta.eventos = item;
    cuenta.soportes = null;
    this.actualizarCuenta(cuenta);

   }
   for (const item of this.soportesArray) {

    cuenta.ordenes = null;
    cuenta.eventos = null;
    cuenta.soportes = item;
    this.actualizarCuenta(cuenta);

   }

}



// ----------------------------------------------------
//             VALIDAR CUENTA
// ----------------------------------------------------
// metodo para actualizar la cuenta en el campo validar
validarCuenta(validar: boolean) {


  // let valida = validar? true: false; // cuenta valida
  const fechaActual = new Date();


  this.cuenta.valida = validar;
  this.cuenta.fecha = fechaActual;

  // relacion
  this.cuenta.anotaciones = null;
  this.cuenta.ordenes = null;
  this.cuenta.empresas = null;
  this.cuenta.eventos = null;
  this.cuenta.soportes = null;


   // console.log(this.cuenta);

   this.actualizarCuenta(this.cuenta, true);

   Swal.fire({
    title: 'Datos Cuenta de Cobro Actualizados',
    icon: 'success',
    confirmButtonText: 'Cerrar',
    scrollbarPadding: false,
    allowOutsideClick: false
  });


}
// ----------------------------------------------------
//             GUARDAR ANOTACIONES DE LA CUENTA
// ----------------------------------------------------
// metodo para actualizar la cuenta en el campo ANOTACIONES
guardarAnotaciones(anotaciones: string) {

  const fechaActual = new Date();

  this.cuenta.anotaciones = {
     fecha: fechaActual,
     novedad: anotaciones,
     flag: true,
     activo: '1',
     usuario: this.usuario.nombre.toString()
      };

  // relacion
  this.cuenta.ordenes = null;
  this.cuenta.empresas = null;
  this.cuenta.eventos = null;
  this.cuenta.soportes = null;


   // console.log(this.cuenta);

   this.actualizarCuenta(this.cuenta, true);

   this.inputObs.nativeElement.value = ''; // reset al TextArea elemento HTML

   Swal.fire({
    text: 'Observación Cuenta de Cobro Registrada',
    icon: 'success',
    confirmButtonText: 'Cerrar',
    scrollbarPadding: false,
    allowOutsideClick: false
  });


}




// ------------------------------- FORMULARIO ---------------------------------------------------------

    // ----------------------
 // metodos para hacer las validaciones del Input Sincronas

 get especialistaNoValido() {
  return this.forma.get('selectEspecialista').invalid && this.forma.get('selectEspecialista').touched;
}
get monthNoValido() {
  return this.forma.get('selectMonth').invalid && this.forma.get('selectMonth').touched;
}


// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
      // es importante asociar los controles Input
      selectEspecialista: ['', Validators.required],
      selectMonth: ['', Validators.required]

      });

}


} // END class





// *************CODIGO NO USADO************************
/*
const cuenta = new Cuenta(
    `${this.year}-${this.forma.controls.selectMonth.value.mes}/${this.forma.controls.selectEspecialista.value.nombre}`,
    this.forma.controls.selectEspecialista.value.nombre,
    'NA',
    'NA',
    this.forma.controls.selectEspecialista.value.ciudad,
    this.forma.controls.selectEspecialista.value.horas_asignadas,
    this.horas_total_ejecutadas,
    this.total_asistentes,
    this.total_tiempo_informe,
    this.total_tiempo_administrativo,
    this.total_tiempo_valido,
    this.total_valor_transporte,
    this.total_valor_insumos,
    this.total_viaticos,
    this.tarifa_hora, // tarifa hora
    this.valor_total_cuenta,
    null,
    null,
    this.year.toString(),
    this.forma.controls.selectMonth.value.mes,
    null,
    valida, // valida la cuenta
    'NA',
    null,
    null,
    null,
    this.forma.controls.selectEspecialista.value

  );

*/
