import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

import { OrdenService } from 'src/app/services/orden/orden.service';
import { TarifaService } from 'src/app/services/tarifa/tarifa.service';
import { ContratanteService } from 'src/app/services/dashboard/contratante.service';
import { AsesorService } from 'src/app/services/dashboard/asesor.service';
import { EmpresaService } from 'src/app/services/dashboard/empresa.service';
import { SedeService } from 'src/app/services/dashboard/sede.service';

import { Orden } from 'src/app/models/orden.model';
import { Tarifa } from 'src/app/models/tarifa.model';
import { Contratante } from 'src/app/models/contratante.model';
import { Asesor } from 'src/app/models/asesor';
import { Empresa } from 'src/app/models/empresa.model';
import { Sede } from 'src/app/models/sede.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';



@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styles: [
  ]
})
export class OrdenesComponent implements OnInit {

  @ViewChild('inputFileArl') inputFileArl: ElementRef;
  @ViewChild('inputFileBase') inputFileBase: ElementRef;

   // variables
   orden: Orden;
   tarifa: Tarifa;
   contratante: Contratante;
   asesor: Asesor;
   empresa: Empresa;
   sede: Sede;

   archivoName: string = '';
   archivoFecha: string = '';
   dataHojas: string[] = [];
   totalceldas: number = 0;
   contador: number = 0;
   dataArray: string[] = [];
   sheetName: string;

   usuario: Usuario;

   obs: Observable<any>;
   input: string = '';

   formArlHide: boolean = false;
   formParticularesHide: boolean = false;

   // Alert Element
   message: string;
   alert: string = 'hide'; // mensaje Alert
   info: string = 'hide'; // mensaje Info
   alertBase: string = 'hide'; // mensaje Alert
   infoBase: string = 'hide'; // mensaje Info

   // Select Elment
   listaArls: string[] = ['Seleccionar ARL', 'ARL Bolivar', 'ARL Sura'];
   fuenteArl: string = 'Seleccionar ARL';
   listaBase: string[] = ['Seleccionar Base', 'Tarifas Bolivar', 'Tarifas Particulares'];
   base: string = 'Seleccionar Base';
   inputArl: boolean = true;
   inputBase: boolean = true;

   willDownload = false;

  constructor(public ordenService: OrdenService,
              public tarifaService: TarifaService,
              public contratanteService: ContratanteService,
              public asesorService: AsesorService,
              public empresaService: EmpresaService,
              public sedeService: SedeService,
              public usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.usuario = this.usuarioService.usuario;

  }

  // Metodos


// ==========================================================================
//             +++++++++++ LEER ARCHIVO EXCEL++++++++++++++
// ==========================================================================
  onFileChange(ev, select: string) {

    // console.log(select);
    if ( select === 'Seleccionar ARL' || select === 'Seleccionar Base' || select === '') {
      Swal.fire(
        '',
        'Falta seleccionar una Opcion'
      );
      return;
    }

     // se inicializan las variables
    this.dataArray = [];
    this.dataHojas = [];
    this.totalceldas = 0;
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];

// ===============Valida si no selecciona Archivo=====================
    if (!file) {
      Swal.fire(
        '',
        'Falta Seleccionar el Archivo'
      );
      return;
     }
// ===============Valida si el Archivo no es Excel=====================

    // console.log(file); // datos del archivo


    const nombreCortado = file.name.split('.'); // divide el nombre del archivo para extraer el tipo de extension
    const extensionArchivo = nombreCortado[nombreCortado.length - 1]; // solo toma la extension del archivo

    // validar las extenciones del Archivo
    const extensionesValidas = ['xlsx', 'xls', 'csv'];
    // condicion para validar el tipo de extension DATA
    if (extensionesValidas.indexOf(extensionArchivo) < 0 &&  (select === 'ARL Bolivar' || select === 'ARL Sura' || select === 'ARL Comeva')) {
      this.message = 'ERROR Archivo no valido, Seleccione un archivo de Excel';
      this.alert = '';
      return;
    }
    // condicion para validar el tipo de extension TARIFA
    if (extensionesValidas.indexOf(extensionArchivo) < 0 &&  (select === 'Tarifas Bolivar' || select === 'Tarifas Particulares') ) {
      this.message = 'ERROR Archivo no valido, Seleccione un archivo de Excel';
      this.alertBase = '';
      return;
    }

    this.archivoName = file.name; // Asigna el nombre del Archivo
    if (file.lastModified) {
      this.archivoFecha = new Date(file.lastModified).toString();
    } else if (file.lastModifiedDate) {
    this.archivoFecha = file.lastModifiedDate.toString(); // Asigna la fecha del Archivo
    } else {
      this.archivoFecha = new Date().toString(); // Asigna la fecha del Archivo
    }


// ==========Codigo si el Archivo es Valido===============

    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);

        this.sheetName = name;

        // valida solo las hojas con datos
        if ( initial[name].length > 0 ) {
          this.dataArray.push(initial[name]); // guarda solo hojas con datos en el Arreglo 'dataArray'
          this.totalceldas += initial[name].length;
        }

        this.dataHojas.push(name);

        return initial;
      }, {});

      const hojas = this.dataHojas.join(' / ');
      // condicion para mostrar hojas y celdas DATA
      if (this.totalceldas > 0 ) {
        // valida datos para DATA
        if (select === 'ARL Bolivar' || select === 'ARL Sura' || select === 'ARL Comeva') {
          this.message = `El libro contiene la Hoja (${hojas}) y (${this.totalceldas}) Registros Totales`;
          this.info = '';
                }
        // valida datos para TARIFAS
        if (select === 'Tarifas Bolivar' || select === 'Tarifas Particulares') {
        this.message = `El libro contiene la Hoja (${hojas}) y (${this.totalceldas}) Registros Totales`;
        this.infoBase = '';
              }

      }else{
         // valida datos para DATA
         if (select === 'ARL Bolivar' || select === 'ARL Sura' || select === 'ARL Comeva') {
          this.message = `El libro contiene la ${this.dataHojas} y ${this.totalceldas} Registros`;
          this.alert = '';
                }
        // valida datos para TARIFAS
         if (select === 'Tarifas Bolivar' || select === 'Tarifas Particulares') {
          this.message = `El libro contiene la ${this.dataHojas} y ${this.totalceldas} Registros`;
          this.alertBase = '';
              }

       }




      // console.log(this.dataArray); // ver datos del excel
      //  return; // *** PRUEBAS





     // +++ codigo para llamar el metodo setDownload - para descargar archivo JSON +++++
     // const dataString = JSON.stringify(jsonData); // la informacion del archivo convertida en string
     // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat('...');
     // this.setDownload(dataString); // llama la funcion para descargar el archivo Json
    };

    reader.readAsBinaryString(file);
  }


// ==========================================================================
//             +++++++++++ EXTRAER DATA Y ALMACENAR en DB ++++++++++++++
// ==========================================================================
extraerData(data: string[]) {

          return new Promise( (resolve, reject) => { // el servicio retorna una promesa

          if ( data.length === 0) {
            return;
           }

          // console.log(data);

          Object.keys(data).forEach(key => {
            // console.log(key);



            data[key].forEach((celda: any) => {

             // console.log(celda);

             if (this.fuenteArl === 'ARL Bolivar') { // ARL Bolivar
                  this.orden = new Orden(
                    celda['Razon Social'],
                    celda['Numero Cronograma'],
                    celda['Actividad Cronograma'],
                    celda['Nit Empresa'],
                    celda['Actividad Programa'],
                    celda['Unidad Medida'],
                    celda['Descripcion'],
                    celda['Act Programadas'],
                    celda['Act Ejecutadas'],
                    celda['Act Canceladas'],
                    celda['Act Reprogramadas'],
                    celda['Tipo Servicio'],
                    this.ExcelDateToJSDate(celda['Fecha Programada']),
                    celda['Valor Transporte'],
                    celda['Valor Alojamiento'],
                    celda['Valor Alimentacion'],
                    celda['Valor Tiempo Muerto'],
                    celda['Valor Material Complementario'],
                    celda['Nombre Asesor Gestion Riesgos'],
                    celda['Observaciones'],
                    celda['Num pol'],
                    celda['Ubicacion Actividad'],
                    this.getCiudad(celda['Ubicacion Actividad']), // ciudad
                    this.fuenteArl, // select Arl
                    this.archivoName,
                    this.archivoFecha,
                   'NA' // estado


              );

             }
             if (this.fuenteArl === 'ARL Sura') { // ARL Sura
                  this.orden = new Orden(
                    celda['EMPRESA'],
                    celda['ORDEN'],
                    this.getSecuencia(celda['MUNICIPIO DESTINO'].trim(), celda['FECHA ENTREGA INICIAL'], celda['TAREA'].trim() ), // secuencia
                    celda['CONTRATO'],
                    'S-0001', // codigo Tarifa
                    'HORAS',
                    celda['TAREA'], // actividad/descripcion
                    parseInt(celda['CANTIDAD PEDIDA'], 10).toString(), // Act Programadas
                    '0', // this.getCant_Ejecutadas(celda['CANTIDAD PEDIDA'], celda['CANTIDAD SIN PROGRAMAR']), // Act Ejecutadas
                    '0', // Act Canceladas
                    '0', // Act Reprogramadas
                    this.getTipoServicio(celda['TAREA'].trim()), // Tipo Servicio
                    this.ExcelDateToJSDate(celda['FECHA ENTREGA INICIAL']),
                    '0', // Valor Transporte
                    '0', // Valor Alojamiento'
                    '0', // Valor Alimentacion'
                    '0', // Valor Tiempo Muerto'
                    '0', // Valor Material Complementario
                    'Orden SURA', // nombre Asesor
                    celda['OBSERVACIONES CRONOGRAMA'], // observaciones
                    '0', // Numero Poliza
                    `${celda['MUNICIPIO DESTINO']}`, // Ubicacion Actividad
                    celda['MUNICIPIO DESTINO'], // ciudad
                    this.fuenteArl, // select Arl
                    this.archivoName,
                    this.archivoFecha,
                   'NA' // estado


              );

             }


               // ======Enviando a DB Orden=====================
              this.ordenService.guardandoOrdenes(this.orden)
                               .subscribe((resp: any) => {

                               if (resp.update) { // cuando la Orden se Actualiza: POST

                                // console.log(resp.update);

                                console.log(this.totalceldas);

                                this.contador += 1;

                                console.log(this.contador);

                                if (this.totalceldas === this.contador){
                                     resolve('ok'); // resuelve la promesa
                                     }

                                }
                               if (resp.orden) { // cuando la Orden se Guarda: POST


                                      // ======= Guarda las Ordenes en la ARL ===========
                                      this.contratanteService.obtenerArlByName(resp.orden.fuente.toString())
                                                              .subscribe((res: any) => {
                                                                  if (res.contratante) {
                                                                    this.contratante = res.contratante;
                                                                    this.contratante.ordenes = resp.orden;
                                                                    this.contratante.asesores = null;
                                                                    this.contratante.empresas = null;
                                                                    this.contratanteService.actualizarArl(this.contratante)
                                                                                        .subscribe();

                                                                  }
                                                              });
                                       // ======= Guarda las Ordenes en la Empresa ===========
                                      this.empresaService.obtenerEmpresaByName(resp.orden.razon.toString())
                                       .subscribe((res: any) => {
                                           if (res.empresa) {
                                             this.empresa = res.empresa;
                                             this.empresa.ordenes = resp.orden;
                                             this.empresa.especialistas = null;
                                             this.empresa.eventos = null;
                                             this.empresa.soportes = null;
                                             this.empresa.archivos = null;
                                             this.empresaService.actualizarEmpresa(this.empresa)
                                                                 .subscribe();
                                           }
                                       });
                                      // ======= Guarda las Ordenes en el ASESOR ===========
                                      this.asesorService.obtenerAsesorByName(resp.orden.nombre_asesor.toString())
                                                        .subscribe((resAsesor: any) => {
                                                          // console.log(resAsesor);
                                                          if (resAsesor.asesor) {
                                                                this.asesor = resAsesor.asesor;
                                                                this.asesor.ordenes = resp.orden;
                                                                this.asesorService.actualizarAsesor(this.asesor)
                                                                                  .subscribe( resAsesorUpdate => {

                                                                                         console.log(this.totalceldas);

                                                                                         this.contador += 1;

                                                                                         console.log(this.contador);


                                                                                         if (this.totalceldas === this.contador){
                                                                                               resolve('ok'); // resuelve la promesa
                                                                                               }

                                                                                          });

                                                          }

                                                          if (!resAsesor.asesor) {
                                                            this.contador += 1;
                                                            if (this.totalceldas === this.contador){
                                                                  resolve('ok'); // resuelve la promesa
                                                                  }
                                                          }

                                                         });


                                }

                               },
                               err => reject(err) // reject la promesa
                               );


             });


          });


        });


}

// -------------------------------------------------
//  metodo para hallar la Ciudad ARL Boliva
// ------------------------------------------------
getCiudad(str: string){

  const flag = str? true: false;

  if (flag) {

    if(str.charAt(0) === 'D') {

      const arr =  str.split('-');
      const new_arr = arr[1];
      const ciudad = new_arr.split(':');

      return `${ciudad[1]}`;

    }else {

      return '---';

    }

  }else {

    return '---';

  }



}
// -------------------------------------------------
//  metodo para hallar la secuencia ARL SURA
// ------------------------------------------------
getSecuencia(ciudad: string, fecha: string, tarea: string){

  const codeDate =  Date.parse(fecha);
  const codeCity = ciudad.length;
  const codeTask = tarea.length;

return `${codeCity}${codeDate}${codeTask}`;


}
// -------------------------------------------------
//  metodo para hallar el tipo de Servicio ARL SURA
// ------------------------------------------------
getTipoServicio(tarea: string){

  const str = tarea.split(' ');
  let tipo = 'T'

  if (str[0] === 'PAUSAS') {
    tipo = 'CT';
  }
  // if (str[0] === 'ERGONOMIA') {
  //   tipo = 'T';
  // }

  return tipo ;

}

// -------------------------------------------------
//  metodo para hallar cantidad Horas Ejecutadas ARL SURA
// ------------------------------------------------
getCant_Ejecutadas(Act_Programadas: string, Act_Ejecutadas: string){

  const horas_ejecutadas =  parseInt(Act_Programadas, 10) - parseInt(Act_Ejecutadas, 10);


return horas_ejecutadas.toString();


}



// ==========================================================================
//             +++++++++++ CAMBIANDO EL FORMATO DE LA FECHA ++++++++++++++
// ==========================================================================
// Metodo para cambiar el formato de la fecha
// xlSerialToJsDate(xlSerial){
//   return new Date(-2209075200000 + (xlSerial - (xlSerial < 61 ? 0 : 1)) * 86400000).toString();
// }

ExcelDateToJSDate(serial) {

  if (typeof serial === 'string') {
    return serial;
  }

  const utcdays  = Math.floor(serial - 25569);
  const utcvalue = utcdays * 86400;
  const dateinfo = new Date(utcvalue * 1000);

  const fractionalday = serial - Math.floor(serial) + 0.0000001;

  let totalseconds = Math.floor(86400 * fractionalday);

  const seconds = totalseconds % 60;

  totalseconds -= seconds;

  const hours = Math.floor(totalseconds / (60 * 60));
  const minutes = Math.floor(totalseconds / 60) % 60;

  // FULL Date Format return **Original
  // return new Date(dateinfo.getFullYear(), dateinfo.getMonth(), dateinfo.getDate(), hours, minutes, seconds);
  const dateShort = new Date(dateinfo.getFullYear(), dateinfo.getMonth(), dateinfo.getDate());
  return dateShort.toString();
/*
    const year = dateinfo.getFullYear().toString();
    let month = dateinfo.getMonth().toString();
    if (month === '0'){
      month = 'ene';
    }
    if (month === '1'){
      month = 'feb';
    }
    if (month === '2'){
      month = 'mar';
    }
    if (month === '3'){
      month = 'abr';
    }
    if (month === '4'){
      month = 'may';
    }
    if (month === '5'){
      month = 'jun';
    }
    if (month === '6'){
      month = 'jul';
    }
    if (month === '7'){
      month = 'ago';
    }
    if (month === '8'){
      month = 'sep';
    }
    if (month === '9'){
      month = 'oct';
    }
    if (month === '10'){
      month = 'nov';
    }
    if (month === '11'){
      month = 'dic';
    }
    let day = dateinfo.getDate() + 1;
    if (day === 32) {
      day = 31;
    }


    // Fecha corta
    const dateShort = `${day}/${month}/${year}`;
    return dateShort;
*/

}



// ===================================================================================
//               Metodo para cargar el archivo a la Based de Datos
// ===================================================================================
// metodo para subir los datos de archivo excel a la DB
cargarData() {

        this.inputFileArl.nativeElement.value = ''; // reset del input File

        if (this.archivoName !== 'Base ARL Bolivar.xlsx' && this.archivoName !== 'Base ARL SURA.xlsx' )  {
          Swal.fire('', 'El archivo "' + this.archivoName + '" No es Valido');
          return;
        }



  Swal.fire({
    title: '¿Esta Seguro?',
    text: 'Desea subir el Archivo "' + this.archivoName + '"',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Subir',
    scrollbarPadding: false,
    allowOutsideClick: false
  }).then((result) => {
          if (result.value) {

              Swal.fire({
                title: 'Guardando Informaciòn',
                icon: 'info',
                scrollbarPadding: false,
                allowOutsideClick: false
              });
              Swal.showLoading();

              this.registrarArl(); // llama el metodo para crear la ARL

              setTimeout(() => { // **** Time Delay ********

                this.extraerData(this.dataArray) // la variable dataArray tiene toda la informacion del archivo Excel
                    .then( (resp: any) => {

                        console.log(resp);

                        // inicializando las variables
                        this.totalceldas = 0;
                        this.contador = 0;
                        this.info = 'hide';

                        Swal.fire(
                          'Guardado',
                          'El Archivo fue Almacenado',
                          'success'
                        );

                    })
                    .catch(err => { // si falla guardando el archivo
                     console.log(err);
                     Swal.fire(
                      '¡Error!',
                      'Subir el Archivo Nuevamente',
                      'error'
                    );

                     });

                  }, 5000);  // **** Time Delay 5 Seg ********


          }
  });


}






// ==========================================================================
//    +++++++++++ EXTRAER DATA DE LAS TARIFAS Y ALMACENA en DB ++++++++++++++
// ==========================================================================
extraerDataTarifa(data: string[]) {

  return new Promise( (resolve, reject) => { // el servicio retorna una promesa

  if ( data.length === 0) {
    return;
   }

  // console.log(data);

  Object.keys(data).forEach(key => {
    // console.log(key);

    data[key].forEach((celda: any) => {
     // console.log(celda);


      this.tarifa = new Tarifa(
        celda['Codigo Programa'],
        celda.Costo,
        this.base, // select Tarifa
        this.archivoName,
        this.archivoFecha
      );

      // console.log(this.orden);

 // ======Enviando a DB Orden=====================
      this.tarifaService.guardandoTarifas(this.tarifa)
                       .subscribe(resp => {

                       this.contador += 1;

                       if (this.totalceldas === this.contador){
                            resolve('ok');
                            }

                       },
                       err => reject(err)
                       );
     });

  });

});


}





// ==========================================================================
//             +++++++++++ METODO PARA CARGAR TARIFAS ++++++++++++++
// ==========================================================================

// metodo para descargar el archivo Json

  cargarTarifa() {

    this.inputFileBase.nativeElement.value = ''; // reset del input File

    if (this.archivoName !== 'Costo Codigos SIPAB.xlsx'){
      Swal.fire('', 'El archivo "' + this.archivoName + '" No es Valido');
      return;
    }

   // console.log(this.archivoName);
   // return; // *** PRUEBAS

    Swal.fire({
      title: '¿Esta Seguro?',
      text: 'Desea subir el Archivo "' + this.archivoName + '"',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Subir',
      scrollbarPadding: false,
      allowOutsideClick: false
    }).then((result) => {
            if (result.value) {
                Swal.fire({
                  text: 'Guardando Información',
                  icon: 'info',
                  scrollbarPadding: false,
                  allowOutsideClick: false
                });
                Swal.showLoading();

                this.extraerDataTarifa(this.dataArray)
                    .then( (resp: any) => {

                        console.log(resp);

                        // inicializando las variables
                        this.totalceldas = 0;
                        this.contador = 0;
                        this.infoBase = 'hide';

                        Swal.fire(
                          'Guardado',
                          'El Archivo Costos fue Almacenado',
                          'success'
                        );

                    })
                    .catch(resp => { // si falla guardando el archivo
                      console.log(resp);
                      Swal.fire(
                        '!Error!',
                        'Elimine la BD y Cargue el Archivo Nuevamente',
                        'error'
                      );

                     });


            }
    });




  }





// ==========================================================================
//             +++++++++++ Registrar ARL en BD ++++++++++++++
// ==========================================================================
// Metodo para crear Contratante - ARL
registrarArl() {


        this.contratante = new Contratante(
                                  this.fuenteArl
                                );

        this.contratanteService.obtenerArlByName(this.fuenteArl)
                                .subscribe((res: any) => {
                                  // console.log(res);
                                  if (!res.contratante) { // condicion SI el contratante - NO EXISTE
                                      this.contratanteService.guardandoArl(this.contratante)
                                                             .subscribe(resp => {

                                                              this.contratante = resp.contratante;

                                                              this.registrarEmpresas(this.contratante);  // Registra EMPRESA

                                                              setTimeout(() => { // **** Time Delay ********
                                                                  this.registrarAsesores(this.contratante);  // Registra ASESOR
                                                               }, 2000);  // **** Time Delay 2 Seg ********

                                                             },
                                                             err => {
                                                              //     console.log('HTTP Error', err.error);
                                                              return;
                                                               },
                                                             // () => console.log('HTTP request completed.')
                                                             );
                                  }

                                  if (res.contratante) { // condicion SI el contratante - EXISTE

                                    // console.log(res.contratante);
                                    this.contratante = res.contratante;
                                    this.registrarEmpresas(this.contratante);  // Registra ASESOR y EMPRESA cuando se Actualiza el archivo

                                    setTimeout(() => { // **** Time Delay ********
                                      this.registrarAsesores(this.contratante);  // Registra ASESOR y EMPRESA cuando se Actualiza el archivo
                                    }, 2000);  // **** Time Delay 2 Seg ********

                                  }


                                });




}


// ==========================================================================
//  +++++++++++ Registrar NUEVO ASESOR Y NUEVA EMPRESA en BD ++++++++++++++
// ==========================================================================
// Metodo para crear los Asesores

registrarEmpresas(contratante: Contratante) {

  const data = this.dataArray;

  Object.keys(data).forEach(key => {
    // console.log(key);

    data[key].forEach((celda: any) => {

    if (this.fuenteArl === 'ARL Bolivar') { // ARL Bolivar
     this.empresa = new Empresa(
      celda['Razon Social'],
      null,
      null,
      celda['Nit Empresa'],
      null,
      null,
      null,
      null,
      null,
      null,
      contratante
         );
     }


     if (this.fuenteArl === 'ARL Sura') { // Arl Sura
      this.empresa = new Empresa(
       celda['EMPRESA'],
       null,
       null,
       celda['CONTRATO'],
       null,
       null,
       null,
       null,
       null,
       null,
       contratante
          );
      }

    // console.log(this.empresa);

    // Registra la EMPRESA
     this.empresaService.guardandoEmpresa(this.empresa)
                         .subscribe((resp: any) => {

                            if (resp.empresa) {

                                 // ======= Guarda las Empresas en la ARL ===========
                              this.contratanteService.obtenerArlByName(contratante.nombre.toString())
                                                     .subscribe((res: any) => {

                                                         if (res.contratante) {
                                                           this.contratante = res.contratante;
                                                           this.contratante.empresas = resp.empresa;
                                                           this.contratante.ordenes = null;
                                                           this.contratante.asesores = null;
                                                           this.contratanteService.actualizarArl(this.contratante)
                                                                               .subscribe();

                                                         }
                                                     });

                            }


                           },
                            err => {
                              //     console.log('HTTP Error', err.error);

                               },
                              // () => console.log('HTTP request completed.')
                         );





    });
  });


}

registrarAsesores(contratante: Contratante) {

  const data = this.dataArray;

  Object.keys(data).forEach(key => {
    // console.log(key);

    data[key].forEach((celda: any) => {

      if (this.fuenteArl === 'ARL Bolivar') { // ARL Bolivar
       this.asesor = new Asesor(
        celda['Nombre Asesor Gestion Riesgos'],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        contratante
           );

     }
      if (this.fuenteArl === 'ARL Sura') { // ARL Sura
       this.asesor = new Asesor(
        celda['PRESTADOR'],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        contratante
           );

     }




     // Registra el ASESOR
     this.asesorService.guardandoAsesor(this.asesor)
                       .subscribe(
                        (resp: any) => {

                          if (resp.asesor) {

                                // ======= Guarda los Asesores en la ARL ===========
                            this.contratanteService.obtenerArlByName(contratante.nombre.toString())
                                                  .subscribe((res: any) => {
                                                      if (res.contratante) {
                                                        this.contratante = res.contratante;
                                                        this.contratante.asesores = resp.asesor;
                                                        this.contratante.empresas = null;
                                                        this.contratante.ordenes = null;
                                                        this.contratanteService.actualizarArl(this.contratante)
                                                                            .subscribe();

                                                      }
                                                  });


                          }


                         },
                          err => {
                            //     console.log('HTTP Error', err.error);

                             },
                        // () => console.log('HTTP request completed.')
                       );




    });
  });


}

// ==========================================================================
//  +++++++++++ Registrar ORDEN MANUAL en BD ++++++++++++++
// ==========================================================================
// Metodo para crear la Orden Manualmente
registrarOrdenManual(event: FormGroup) { // recibe los datos desde el formulario

  // console.log('Click on Button ', event.value);


  if (event.value.tipo === 'Particulares') {

    this.registrarOrdenParticular(event);

  } else if (event.value.tipo === 'ARL') {

    this.registrarOrdenARL(event);

  } else {

    return;

  }

}

// ------ Crea una Orden Manual de ARL -----

registrarOrdenARL(event: FormGroup) {

    // console.log('registrarOrdenARL'); // Pruebas
    // console.log(event.value); // Pruebas

  Swal.fire({
    title: 'Guardando Informaciòn',
    icon: 'info',
    scrollbarPadding: false,
    allowOutsideClick: false
  });
  Swal.showLoading();

  this.orden = null;
  this.empresa = null;

  const razon = event.value.selectEmpresa.razon;
  let actividad = event.value.actividad; //  es el campo de actividad ***

  if (actividad){
    actividad = actividad.toUpperCase();
  }

// esta orden no guarda el campo Descripcion del formulario **
  const orden = new Orden(
    razon.toUpperCase(),
    event.value.cronograma,
    event.value.secuencia,
    event.value.selectEmpresa.nit,
    event.value.selectTarifa.codigo, // codigo de la Tarifa
    event.value.selectUnidad,
    actividad, // descripcion en Mayuscula
    event.value.horas,
    '0',
    '0',
    '0',
    event.value.selectTipo.index,
    event.value.fecha,
    event.value.valor_transporte,
    event.value.valor_alojamiento,
    event.value.valor_alimentacion,
    event.value.valor_tiempo_muerto,
    event.value.valor_material_complementario,
    'Orden Manual', // asesor
    `${event.value.descripcion} - ${event.value.observaciones}`, // une la informacion de los TextArea - Form Orden
    'NA', // No Poliza
    '-',
    '-',
    'Orden Manual', // fuente
    'Orden Manual', // fileName
    'Orden Manual', // fileDate
    'NA' // estado

  );



  // crea los registros
  this.ordenService.guardandoOrdenes(orden)
                  .subscribe(resp => {
                    this.orden = resp.orden;

                    if (resp.orden) {

                      Swal.fire(
                        'Orden',
                        'No ' + this.orden.cronograma + ' Creada correctamente',
                        'success'
                      );

                      this.empresaService.obtenerEmpresaByID(event.value.selectEmpresa._id)
                      .subscribe((resEmpresa: any) => {

                        if (resEmpresa.empresa) {

                          this.empresa = resEmpresa.empresa;
                          this.empresa.ordenes = this.orden;
                          this.empresa.especialistas = null;
                          this.empresa.eventos = null;
                          this.empresa.soportes = null;
                          this.empresa.archivos = null;

                          this.empresaService.actualizarEmpresa(this.empresa)
                                              .subscribe();
                        }
                      });
                    }

                  }, err => {
                    //     console.log('HTTP Error', err.error);
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



// ------ Crea una Orden Manual de particulares -----------------

registrarOrdenParticular(event: FormGroup) {

  // console.log(event.value);


  Swal.fire({
    title: 'Guardando Informaciòn',
    icon: 'info',
    scrollbarPadding: false,
    allowOutsideClick: false
  });
  Swal.showLoading();

  const currency = event.value.tarifa;
  // tslint:disable-next-line: quotemark
  const costo = Number(currency.replace(/[^0-9\.]+/g, ""));
  let total = costo * event.value.horas;

  this.orden = null;
  this.empresa = null;
  this.sede = null;

  const lugar = `Ciudad: ${event.value.ciudad} Sede: ${event.value.sede} Dirección: ${event.value.direccion}`; // ubicacion_actividad
  const razon = event.value.empresa;

  let actividad = event.value.actividad; // actividad

  if (actividad){
    actividad = actividad.toUpperCase();
  }

  // obtener el valor de la tarifa

  let valor_tarifa = '';
  if(event.value.selectTarifa.codigo) {
    valor_tarifa = event.value.selectTarifa.codigo;
    total = null;
  }



  const orden = new Orden(
    razon.toUpperCase(),
    event.value.cronograma,
    event.value.secuencia,
    'NA',
    valor_tarifa, // codigo de la Tarifa
    event.value.selectUnidad,
    actividad, // descripcion en Mayuscula  campo Actividad
    event.value.horas,
    '0',
    '0',
    '0',
    event.value.selectTipo.index,
    event.value.fecha,
    '0',
    '0',
    '0',
    '0',
    '0',
    'Orden Manual', // asesor
    `${event.value.descripcion} - ${event.value.observaciones}`, // observacion + descripcion
    'NA', // No Poliza
    lugar,
    event.value.ciudad, // ciudad
    'Orden Manual', // fuente
    'Orden Manual', // fileName
    'Orden Manual', // fileDate
    'NA' // estado

  );

  const empresa = new Empresa(
    razon.toUpperCase(),
    null,
    null,
    null,
    event.value.ciudad

  );

  const sede = new Sede(
    event.value.sede,
    null,
    null,
    null,
    event.value.ciudad,
    event.value.direccion,
  );



  // crea los registros
  this.ordenService.guardandoOrdenes(orden)
                  .subscribe(resp => this.orden = resp.orden);


  this.empresaService.guardandoEmpresa(empresa)
                  .subscribe(resp => this.empresa = resp.empresa);


  this.sedeService.guardandoSede(sede)
                  .subscribe(resp => this.sede = resp.sede);



// actualiza las Tablas
  setTimeout(() => { // **** Time Delay ********

    if (this.orden && this.empresa && this.sede) {

      this.formArlHide = false; // oculta la forma
      this.formParticularesHide = false; // oculta la forma

      this.empresa.ordenes = this.orden;
      this.empresa.especialistas = null;
      this.empresa.eventos = null;
      this.empresa.soportes = null;
      this.empresa.archivos = null;

      this.empresaService.actualizarEmpresa(this.empresa)
                          .subscribe();

      const fechaActual = new Date();

      this.orden.valor_total =  total? total.toString(): null // valor total Tarifa
      this.orden.obs_internas = {fecha: fechaActual, reporte: event.value.observaciones, usuario: this.usuario.nombre.toString() };
      this.orden.anotaciones = null;
      this.orden.horas_programadas = null;
      this.orden.sedes = null;
      this.orden.especialistas = null;
      this.orden.soportes = null;
      this.orden.eventos = null;
      this.orden.archivos = null;

      this.ordenService.actualizarOrden(this.orden)
                        .subscribe();




      this.sede.empresa = this.empresa;

      this.sedeService.actualizarSede(this.sede)
                      .subscribe(res => {
                        if (this.empresa) { // codigo para crear la Sede en la Empresa
                          this.empresa.sedes = res;
                          this.empresa.ordenes = null;
                          this.empresaService.ingresarSedeOrdenIntoEmpresa(this.empresa)
                                             .subscribe();

                        }


                      });


      Swal.fire(
        'Orden',
        'No ' + this.orden.cronograma + ' Creada correctamente',
        'success'
      );



    }else {

      Swal.fire(
        'Error',
        'Intentelo más tarde',
        'error'
      );

    }



  }, 5000); // **** Time Delay 5 Seg ********



}



// ==========================================================================
//             +++++++++++ Descargar JSON ++++++++++++++
// ==========================================================================

// metodo para descargar el archivo Json
setDownload(data) {
  this.willDownload = true;
  setTimeout(() => {
    const el = document.querySelector('#download');
    el.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
    el.setAttribute('download', 'xlsxtojson.json');
  }, 1000);
}





} // END Class
