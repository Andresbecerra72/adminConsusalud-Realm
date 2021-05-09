import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';
import { Orden } from 'src/app/models/orden.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-orden',
  templateUrl: './card-orden.component.html'

})
export class CardOrdenComponent implements OnInit {

  @Input() orden: Orden;
  @Input() flagObs: boolean; // Observaciones Programacion
  @Input() flagAnot: boolean = true; // Anotaciones Internas


  @Output() Observaciones: EventEmitter<string> = new EventEmitter();
  @Output() Anotaciones: EventEmitter<string> = new EventEmitter();
  @Output() cambioEstado: EventEmitter<string> = new EventEmitter();
  @Output() cambioEstadoGeneral: EventEmitter<string> = new EventEmitter();
  @Output() tiempoAdmin: EventEmitter<number> = new EventEmitter();

  @ViewChild('inputObs') inputObs: ElementRef<any>;
  @ViewChild('inputAnots') inputAnots: ElementRef<any>;

  // variables
  forma: FormGroup;
  usuario: Usuario;
  estado: string = '';
  ROLE: string = '';

  disableBtn: boolean = true;
  flagCanceledaProgramada: boolean = false;


    // Select Element - Estados
    listaEstados1: string[] = [ // Estado : Pendiente Programar
      'En Ejecución',
      'Pendiente Cancelar',
      'Reprogramar'
    ];
    listaEstados2: string[] = [ // Estado: En Ejecucion TIPO: T/E
      'Finalizada',
      'Pendiente Informe'
    ];
    listaEstados3: string[] = [ // Tecnica
      'Informe Revisado',
      'Pendiente Informe'
    ];
    listaEstados4: string[] = [ // Estado: En Ejecucion TIPO: C/A
      'Pendiente Programar',
      'Finalizada'
    ];
    listaEstados: string[] = [ // Cambio General: ADMIN_ROLE
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
      'Facturada Pendiente Programar'
    ];




// ----------------- Constructor --------------------------------
  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.usuario = this.usuarioService.usuario;
    this.ROLE = this.usuario.role;

    if (this.ROLE === 'TECN_ROLE') { // habilita el cambio de estado
      this.disableBtn = false;
    }


    if (this.orden.estado === 'Pendiente Programar' && this.orden.act_canceladas !== '0' ) {
      this.flagCanceledaProgramada = true; // cuando una orden nueva cambia a cancelada desde el SIPAB
    }

    this.crearFormulario();

    // console.log(this.orden);

  }

  // *******Metodo para transformar el Object en un Arreglo ***********
crearArray(anotacionesObj: object) {

  const anotaciones: any[] = [];

  if ( anotacionesObj === null ) { return []; } // condicion si el objeto recibido no tiene informacion

  Object.keys( anotacionesObj ).forEach( key => {

                  // en este punto solo se tienen los datos de cada objeto sin las claves
                  const anotacion = anotacionesObj[key];
                  anotaciones.push(anotacion);

  });

  return anotaciones;
}


// ==========================================================================
//             +++++++++++ METODOS PARA CAMBIAR ESTADO ++++++++++++++
// ==========================================================================
// Metodo usado para cambiar el estado de la Orden
  cambiarEstado(estado: string) {
   // console.log(estado);
   this.cambioEstado.emit(estado);
  }
// Metodo usado para cambiar el estado de la Orden: ROLE_ADMIN
 cambiarEstadoGeneral(estado: string) {
   // console.log(estado);
   this.cambioEstadoGeneral.emit(estado);
  }


// ==========================================================================================
//             +++++++++++ METODO PARA ENVIAR LAS OBSERVACIONES/ANOTACIONES ++++++++++++++
// ==========================================================================================
// Metodo usado para enviar las observaciones y las anotaciones al Padre
enviarText(text: string, nombre: string) {

  if (!text) {
    Swal.fire('', '<div class="alert alert-primary" role="alert">Ingrese Observaciones</div>', 'info');
    return;
  }

  if (nombre === 'Observaciones') {
    this.Observaciones.emit(text);
    this.inputObs.nativeElement.value = '';
    return;
  }

  if (nombre === 'Anotaciones') {
    this.Anotaciones.emit(text);
    this.inputAnots.nativeElement.value = '';
    return;
  }

}

// ---------------------------------
// Este metodo crea el Formulario
crearFormulario() {

  this.forma = this.fb.group({
    // es importante asociar los controles Input
    tiempo_administrativo: 0
    });

}



// -----------Metodo para ajustar los tiempos Horas Ejecuradas de la Orden --------------------------
// PADRE : ORDEN
ajustarTiempos() {

  // console.log(this.forma.value);
  const tiempo = this.forma.controls.tiempo_administrativo.value ? this.forma.controls.tiempo_administrativo.value : null;

  // console.log(tiempo);

  if (tiempo) {
    this.tiempoAdmin.emit(tiempo); // emite el valor
    this.forma.controls.tiempo_administrativo.setValue(0);
  }

}



}// END class
