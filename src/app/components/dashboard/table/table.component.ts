import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { Contratante } from 'src/app/models/contratante.model';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {

  @Input() nombre: string;
  @Input() items: any[] = [];



  @Output() Index: EventEmitter<any> = new EventEmitter();


  // variables
  indexArray: string[] = [];
  button: string = '';
  contratante: Contratante;
  flag: boolean = false;
  coutn: number = 0;





  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
   // console.log(this.items);

  }



// ==========================================================================
//             +++++++++++ EDITAR REGISTRO: PUT ++++++++++++++
// ==========================================================================
editarRegistro(item: any, btn: string) {


  this.indexArray = [];

  if (btn === 'Sede') {

    this.button = 'Edit-Sede';
    this.indexArray.push(this.button);
    this.indexArray.push(item);

    this.Index.emit(this.indexArray);


    }

  if (btn === 'Asesor') {

    this.button = 'Edit-Asesor';
    this.indexArray.push(this.button);
    this.indexArray.push(item);

    this.Index.emit(this.indexArray);


    }

  if (btn !== 'Sede') {
      if (btn !== 'Asesor') {
        this.button = 'Edit';
        this.indexArray.push(this.button);
        this.indexArray.push(item);

        this.Index.emit(this.indexArray);
      }
  }


}

// ==========================================================================
//             +++++++++++ ELIMINAR REGISTRO: DELETE ++++++++++++++
// ==========================================================================
eliminarRegistro(item: any, btn: string) {

  if (btn === 'Sede') {

    this.indexArray = [];
    this.button = 'Delete-Sede';
    this.indexArray.push(this.button);
    this.indexArray.push(item);

    this.Index.emit(this.indexArray);

  }

  if (btn === 'Asesor') {

    this.indexArray = [];
    this.button = 'Delete-Asesor';
    this.indexArray.push(this.button);
    this.indexArray.push(item);

    this.Index.emit(this.indexArray);

  }

  if (btn !== 'Sede') {
    if (btn !== 'Asesor') {

      this.indexArray = [];
      this.button = 'Delete';
      this.indexArray.push(this.button);
      this.indexArray.push(item);

      this.Index.emit(this.indexArray);
    }

  }



}


// ==========================================================================
//             +++++++++++ CAMBIAR LOGO EMPRESA ++++++++++++++
// ==========================================================================
// Metodo para cambiar la imagen del la empresa
mostrarModalImg( id: string) {

  this.indexArray = [];
  this.button = 'Image';
  this.indexArray.push(this.button);
  this.indexArray.push(id);

  this.Index.emit(this.indexArray); // emite el Id de la empresa


}


// ======================Metodos para ver y ocultar los detalles=================================

// metodo para ver los detalles de la Orden
verDetalles(i: number) {

  // console.log(i);


  if (i === 0) {
    const selectores: any = this.document.getElementById('0');
    selectores.classList.remove('hide');
    // selectores.classList.add('show');
    // console.log(selectores);

    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-0');
      for (const data of  this.items[i].sedes) {
        table.classList.remove('hide');
        break;
      }

    }
    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-0');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }
  if (i === 1) {
    const selectores: any = this.document.getElementById('1');
    selectores.classList.remove('hide');
    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-1');
      for (const data of  this.items[i].sedes) {
       table.classList.remove('hide');
       break;
      }

    }
    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-1');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }
  if (i === 2) {
    const selectores: any = this.document.getElementById('2');
    selectores.classList.remove('hide');
    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-2');
      for (const data of  this.items[i].sedes) {
        table.classList.remove('hide');
        break;
      }

    }
    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-2');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }
  if (i === 3) {
    const selectores: any = this.document.getElementById('3');
    selectores.classList.remove('hide');
    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-3');
      for (const data of  this.items[i].sedes) {
        table.classList.remove('hide');
        break;
      }

    }
    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-3');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }
  if (i === 4) {
    const selectores: any = this.document.getElementById('4');
    selectores.classList.remove('hide');
    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-4');
      for (const data of  this.items[i].sedes) {
        table.classList.remove('hide');
        break;
      }

    }
    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-4');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }
  if (i === 5) {
    const selectores: any = this.document.getElementById('5');
    selectores.classList.remove('hide');
    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-5');
      for (const data of  this.items[i].sedes) {
        table.classList.remove('hide');
        break;
      }

    }
    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-5');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }
  if (i === 6) {
    const selectores: any = this.document.getElementById('6');
    selectores.classList.remove('hide');
    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-6');
      for (const data of  this.items[i].sedes) {
        table.classList.remove('hide');
        break;
      }

    }
    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-6');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }
  if (i === 7) {
    const selectores: any = this.document.getElementById('7');
    selectores.classList.remove('hide');
    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-7');
      for (const data of  this.items[i].sedes) {
        table.classList.remove('hide');
        break;
      }

    }
    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-7');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }
  if (i === 8) {
    const selectores: any = this.document.getElementById('8');
    selectores.classList.remove('hide');
    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-8');
      for (const data of  this.items[i].sedes) {
        table.classList.remove('hide');
        break;
      }

    }
    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-8');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }
  if (i === 9) {
    const selectores: any = this.document.getElementById('9');
    selectores.classList.remove('hide');
    if (this.nombre === 'Empresa') {
      const table: any = this.document.getElementById('table-9');
      for (const data of  this.items[i].sedes) {
        table.classList.remove('hide');
        break;
      }

    }

    if (this.nombre === 'Contratante') {
      const table: any = this.document.getElementById('table-9');
      for (const data of  this.items[i].asesores) {
        table.classList.remove('hide');
        break;
      }

    }

  }



}


// Metodo para ocultar los detalles
ocultarDetalles(i: number) {

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


}





} // END class
