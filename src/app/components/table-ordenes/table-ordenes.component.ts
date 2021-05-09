import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { DOCUMENT } from '@angular/common';

import { Orden } from 'src/app/models/orden.model';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-table-ordenes',
  templateUrl: './table-ordenes.component.html'

})
export class TableOrdenesComponent implements OnInit {

  @Input() items: any[] = [];
  @Input() nombre: string;
  @Input() color: string;
  @Input() tarifaValor: number[] = [];


  @Output() DatosArray: EventEmitter<string[]> = new EventEmitter();
  @Output() orden: EventEmitter<Orden> = new EventEmitter();

   // variables
   forma: FormGroup;
   usuario: Usuario;
   ROLE: string = '';
   hide: string = 'hide';
   infoArray: any[] = [];

   total_viaticos: number = 0;

   disabledBtn: boolean = true;

   // no permite que el especialista gestione la Orden hasta el dia de la Actividad
   fechaActual: string = new Date().toDateString();


    // Select Element
    listaEstados1: string[] = [
      'Facturada',
      'En Devolución'
    ];
    listaEstados2: string[] = [
      'Finalizada'
    ];

// --------------------------- Constructor -------------------------------------------------

  constructor(@Inject(DOCUMENT) private document: Document,
              private fb: FormBuilder,
              private usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.usuario = this.usuarioService.usuario;
    this.ROLE = this.usuario.role;

    this.crearFormulario();

    // console.log(this.nombre);
    // console.log(this.items);

  }



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
// *******Metodo para calcular el total de Viaticos de la Orden ***********
getTotalViaticos( transporte: string, alojamiento: string, alimentacion: string, tiempo_muerto: string, material_complementario: string) {

  // const total_viaticos = parseInt(transporte, 10) + parseInt(alojamiento, 10) + parseInt(alimentacion, 10) + parseInt(tiempo_muerto, 10) + parseInt(material_complementario, 10)
  const total_viaticos = Number(transporte.replace(/[^0-9\.]+/g, "")) + Number(alojamiento.replace(/[^0-9\.]+/g, "")) + Number(alimentacion.replace(/[^0-9\.]+/g, "")) + Number(tiempo_muerto.replace(/[^0-9\.]+/g, "")) + Number(material_complementario.replace(/[^0-9\.]+/g, ""))


  return total_viaticos;
}




// =====================Metodo para cambiar del Estado de la Orden ===========================================
// Padre : Estados - Informe Revisado
cambiarEstado(orden: Orden) {

  this.infoArray = [];

  orden.obs_internas = null;
  orden.anotaciones = null;
  orden.horas_programadas = null;
  orden.sedes = null;
  orden.especialistas = null;
  orden.soportes = null;
  orden.eventos = null;
  orden.archivos = null;

  // estado Finalizada
  orden.estado  = !this.forma.controls.selectEstado.value ? orden.estado : this.forma.controls.selectEstado.value;

  this.infoArray.push('Estado');
  this.infoArray.push(orden);

  this.DatosArray.emit(this.infoArray);

}
// ====================== Habilitando el Boton ===============================================

enableBtn(i: string) {
  const botonActualizar: any = this.document.getElementById(`btn-act-${i}`);
  botonActualizar.removeAttribute('disabled');
}



// =====================Metodos para Mostrar OBSERVACIONES PROGRAMACION ===========================================
// Metodo para reportar las observaciones de cada programacion
// Padre : Estados - Pendiente Programar
ObservacionesOrden(orden: Orden) { // muestra el CARD-ORDEN debajo de la tabla

  this.infoArray = [];

  this.infoArray.push('Observaciones');
  this.infoArray.push(orden);

  this.DatosArray.emit(this.infoArray);


  this.scrollview();


}



// =====================Metodos para Mostrar OBSERVACIONES PROGRAMACION ===========================================
// Metodo para reportar las observaciones de cada programacion
// Padre : Estados - En Ejecución
verOrden(orden: Orden) { // muestra la orden completa debajo de la tabla

  this.infoArray = [];

  this.infoArray.push('Ver Orden');
  this.infoArray.push(orden);

  this.DatosArray.emit(this.infoArray);

  this.scrollview();



}

// metodo para hacer el Scroll automatico
scrollview() {

  setTimeout(() => { // Time Delay Scroll

    const scrollDiv =  this.document.getElementById('view').offsetTop;
    window.scrollTo({ top: scrollDiv - 90, behavior: 'smooth'});
    // scrollDiv.scrollIntoView({block: 'start', behavior: 'smooth'});

    }, 500);

}


// =====================Metodos para Calcular la TARIFA===========================================
// Metodo para Calcular la Tarifa
calcularTarifa(codigo: string, cant: string, i: string, orden: Orden) {
  this.infoArray = [];

  this.infoArray.push(codigo);
  this.infoArray.push(cant);
  this.infoArray.push(i);
  this.infoArray.push(orden);

 // Output envia el arreglo con la informacio a padre 'nuevas-ordenes'
  this.DatosArray.emit(this.infoArray);

  const botonValidarOrden: any = this.document.getElementById(`btn-val-${i}`);
  botonValidarOrden.removeAttribute('disabled');

  const botonTarifa: any = this.document.getElementById(`btn-cal-${i}`);
  botonTarifa.setAttribute('style', 'display: none');

}

// =====================Metodos para CAMBIAR ESTADO===========================================
// Metodo para cambiar Estado de la Orden VALIDAR => Pendiente Programar
// Padre - Ordenes Nuevas
validarOrden(orden: Orden) {

  this.orden.emit(orden);

}


// =====================Metodos para Guardar las Anotaciones===========================================
// Metodo para registrar anotaciones en la Orden
// Padre - Estados Ordenes : Finalizadas
guardarAnotacion(orden: Orden, text: string) {


  if (!text) {
    Swal.fire('', '<div class="alert alert-primary" role="alert">Ingrese Observación</div>', 'info');
    return;
  }

  this.infoArray = [];


  orden.obs_internas = null;
  orden.horas_programadas = null;
  orden.sedes = null;
  orden.especialistas = null;
  orden.soportes = null;
  orden.eventos = null;
  orden.archivos = null;

  orden.anotaciones = {  // se envia al padre como un Array
    fecha: new Date(),
    reporte: text,
    usuario: this.usuario.nombre.toString()
  };

  this.infoArray.push('Anotaciones');
  this.infoArray.push(orden);

  this.DatosArray.emit(this.infoArray);

}


// =====================Metodos para RESGISTRAR EL RADICADO===========================================
// Metodo para resgitrar el numero de radicado en las ordenes Finalizadas
// Padre - Estados Ordenes : Finalizadas
enviarRadicado(orden: Orden, texto: string) {

        this.infoArray = [];

        const eventosArray = orden.eventos; // almacena los eventos de la Orden

        orden.obs_internas = null;
        orden.anotaciones = null;
        orden.horas_programadas = null;
        orden.sedes = null;
        orden.especialistas = null;
        orden.soportes = null;
        orden.eventos = null;
        orden.archivos = null;

        orden.radicado = { // se envia al padre como un Array
          fecha: new Date(),
          numero: texto,
          usuario: this.usuario.nombre.toString()
        };

        orden.estado = 'Pre - Factura'; // cambio de estado;

        this.infoArray.push('Radicado');
        this.infoArray.push(orden);
        this.infoArray.push(eventosArray); // emite los eventos de la Orden

        this.DatosArray.emit(this.infoArray);

}


// =====================Metodos para RESGISTRAR FACTURACION/DEVOLUCION===========================================
// Metodo para resgitrar el numero de radicado en las ordenes Finalizadas
// Padre - Estados Ordenes : Finalizadas
enviarFacturacion(orden: Orden) {

    // console.log(this.forma);

    this.infoArray = [];


    orden.obs_internas = null;
    orden.anotaciones = null;
    orden.horas_programadas = null;
    orden.sedes = null;
    orden.especialistas = null;
    orden.soportes = null;
    orden.eventos = null;
    orden.archivos = null;

    const input = !this.forma.controls.facturacion.value ? null : this.forma.controls.facturacion.value;

    if (input){

      orden.facturacion = { // facturacion
        fecha: new Date(),
        numero: input,
        usuario: this.usuario.nombre.toString()
      };

    }
  // validar
    const validar = !this.forma.controls.validar.value ? false : true;
    if (!orden.valida && validar) {
      orden.valida = validar;
    }


    // estado
    orden.estado  = !this.forma.controls.selectEstado.value ? orden.estado : this.forma.controls.selectEstado.value;

    this.infoArray.push('Facturacion');
    this.infoArray.push(orden);

    this.DatosArray.emit(this.infoArray);

    this.forma.controls.facturacion.reset(); // limpia el input

}



// =====================Metodos para RE-CALCULAR VALOR TOTAL===========================================
// Metodo para recalcular el valor total de la Orden en ESTADO: Pre - Factura
// Ajusta el valor de la factura cuando las horas Programadas no coinciden con las Ejecutadas
reCalcularValor(orden: Orden) {

  this.infoArray = [];

  orden.obs_internas = null;
  orden.anotaciones = null;
  orden.horas_programadas = null;
  orden.sedes = null;
  orden.especialistas = null;
  orden.soportes = null;
  orden.eventos = null;
  orden.archivos = null;

  Swal.fire({
      html: `<div class="alert alert-warning" role="alert">¡Aviso! El valor de Horas Ejecutadas es ${orden.horas_ejecutadas}</div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Ajustar Total',
      scrollbarPadding: false,
      allowOutsideClick: false
    }).then((result) => {
          if (result.value) {

             this.infoArray.push('Re-Calcular');
             this.infoArray.push(orden);

             // Output envia el arreglo con la informacio a padre 'Estado Ordenes'
             this.DatosArray.emit(this.infoArray);

                          }
  });


}

// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    facturacion:    '',
    validar: false,
    selectEstado: ''
    });

}



// ======================Metodos para ver y ocultar los detalles=================================

// metodo para ver los detalles de la Orden
verDetalles(i: number) {

  // console.log(i);


  for (let n = 0; n < this.items.length; n++) {

    if (i === n) {

      const selectores: any = this.document.getElementById(`${n}`);
      selectores.classList.remove('hide');
      break;

    }

  }


}


// Metodo para ocultar los detalles
ocultarDetalles(i: number) {

  for (let n = 0; n < this.items.length; n++) {

    if (i === n) {

      const selectores: any = this.document.getElementById(`${n}`);
      selectores.classList.add('hide');
      break;

    }

  }

}
// Metodo para Obtener la suma de las horas
sumarHorasActividad(str_a: string, str_b: string) {

  const a = parseInt(str_a, 10);
  const b = parseInt(str_b, 10);
  const c = a + b;

  return c;

}




} // END class




// *********************CODIGO NO USADO*****************************************

// codigo para Mostrar hasta 10 detalles de Soportes

/*
  if (i === 0) {

    const selectores: any = this.document.getElementById('0');
    selectores.classList.remove('hide');
    // selectores.classList.add('show');
    // console.log(selectores);
  }
  if (i === 1) {

    const selectores: any = this.document.getElementById('1');
    selectores.classList.remove('hide');

  }
  if (i === 2) {
    const selectores: any = this.document.getElementById('2');
    selectores.classList.remove('hide');

  }
  if (i === 3) {
    const selectores: any = this.document.getElementById('3');
    selectores.classList.remove('hide');

  }
  if (i === 4) {
    const selectores: any = this.document.getElementById('4');
    selectores.classList.remove('hide');

  }
  if (i === 5) {
    const selectores: any = this.document.getElementById('5');
    selectores.classList.remove('hide');

  }
  if (i === 6) {
    const selectores: any = this.document.getElementById('6');
    selectores.classList.remove('hide');

  }
  if (i === 7) {
    const selectores: any = this.document.getElementById('7');
    selectores.classList.remove('hide');

  }
  if (i === 8) {
    const selectores: any = this.document.getElementById('8');
    selectores.classList.remove('hide');

  }
  if (i === 9) {
    const selectores: any = this.document.getElementById('9');
    selectores.classList.remove('hide');

  }
*/


// *********************CODIGO NO USADO*****************************************

// codigo para Ocultar hasta 10 detalles de Soportes
/*
  if (i === 0) {
    const selectores: any = this.document.getElementById('0');
    selectores.classList.add('hide');
    // console.log(selectores);
  }
  if (i === 1) {
    const selectores: any = this.document.getElementById('1');
    selectores.classList.add('hide');

  }
  if (i === 2) {
    const selectores: any = this.document.getElementById('2');
    selectores.classList.add('hide');

  }
  if (i === 3) {
    const selectores: any = this.document.getElementById('3');
    selectores.classList.add('hide');

  }
  if (i === 4) {
    const selectores: any = this.document.getElementById('4');
    selectores.classList.add('hide');

  }
  if (i === 5) {
    const selectores: any = this.document.getElementById('5');
    selectores.classList.add('hide');

  }
  if (i === 6) {
    const selectores: any = this.document.getElementById('6');
    selectores.classList.add('hide');

  }
  if (i === 7) {
    const selectores: any = this.document.getElementById('7');
    selectores.classList.add('hide');

  }
  if (i === 8) {
    const selectores: any = this.document.getElementById('8');
    selectores.classList.add('hide');

  }
  if (i === 9) {
    const selectores: any = this.document.getElementById('9');
    selectores.classList.add('hide');

  }
*/
