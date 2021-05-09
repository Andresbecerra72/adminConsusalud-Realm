import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';


import { OrdenService } from 'src/app/services/orden/orden.service';

import { Orden } from '../../../models/orden.model';


@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styles: [
  ]
})


export class GraphicsComponent implements OnInit {

  // variables

  ordenesArray: Orden[] = [];

  // fecha
  year: string = '';
  month: string = '';

  dataIndicador: number[] = []; // Pre-Factura(validada) VS valor total
  dataIndicador1: number[] = []; // Facturada VS valor total
  dataGrafico1: number[] = [];
  dataGrafico2: number[] = [];
  dataGrafico3: number[] = [];
  graficos: any = {};

  // Ordenes
  OrdenNuevas: number = 0;
  OrdenCanceladas: number = 0;
  OrdenReprogramadas: number = 0;
  OrdenEjecutadas: number = 0;

  // Estados
  EstadoPendProgramar: number = 0;
  EstadoEjecucion: number = 0;
  EstadoPendInforme: number = 0;
  EstadoInfoRevisado: number = 0;
  EstadoFinalizado: number = 0;
  EstadoPreFactura: number = 0;
  EstadoFacturadas: number = 0;
  EstadoDevolucion: number = 0;
  EstadoPendCancelar: number = 0;
  EstadoReprogramar: number = 0;

  // Opciones para la grafica con datos Currency
  chartOptions: any = {
    responsive: true,
    legend: {
        display: false,
        labels: {
            display: false
        }
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: (tooltipItem, data) => {
          let label = data.labels[tooltipItem.index];
          let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          let currencyPipe = new CurrencyPipe('en');
          let formattedNumber = currencyPipe.transform(datasetLabel, 'USD', 'symbol');
          return label + ': ' + formattedNumber;
        }
      }
    }
};




// -------------------constructor-----------------------------------
  constructor(private ordenesServices: OrdenService) { }

  ngOnInit() {

    this.cargarDatos();
    this.obtenerDatosFecha();

  }


  // metodo para capturar la fecha
  obtenerDatosFecha() {

      const fecha_actual = new Date();
      this.year = fecha_actual.getFullYear().toString();
      this.month = fecha_actual.getMonth().toString();


  }


// -------------------------------------------------------------------------------
// --------------METODO PARA CARGAR DATOS EN LAS GRAFICAS------------------------
// -------------------------------------------------------------------------------
  cargarDatos() {

    this.ordenesArray = [];

    this.ordenesServices.obtenerOrdenesTodas()
                        .subscribe((resp: any) => {
                          // console.log(resp);

                          if (resp.orden) {

                            for (const item of resp.orden) {

                              this.ordenesArray.push(item);

                            }
                            this.resolveData(); // llama el metodo para cargar las tablas Pre-Factura y Facturada
                          }
                        });


    // Ordenes --------------------------------------
    this.ordenesServices.obtenerOrdenesConsulta(0, 'nuevas')
                            .subscribe((resp: any) => this.OrdenNuevas = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'canceladas')
                            .subscribe((resp: any) => this.OrdenCanceladas = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'ejecutadas')
                            .subscribe((resp: any) => this.OrdenEjecutadas = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'reprogramadas')
                            .subscribe((resp: any) => this.OrdenReprogramadas = resp.total);

    // Estados -------------------
    this.ordenesServices.obtenerOrdenesConsulta(0, 'Pendiente Programar')
                            .subscribe((resp: any) => this.EstadoPendProgramar = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'En Ejecución')
                            .subscribe((resp: any) => this.EstadoEjecucion = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Finalizada')
                            .subscribe((resp: any) => this.EstadoFinalizado = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Pre - Factura')
                            .subscribe((resp: any) => this.EstadoPreFactura = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Facturada')
                            .subscribe((resp: any) => this.EstadoFacturadas = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Pendiente Cancelar')
                            .subscribe((resp: any) => this.EstadoPendCancelar = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Reprogramar')
                            .subscribe((resp: any) => this.EstadoReprogramar = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'En Devolución')
                            .subscribe((resp: any) => this.EstadoDevolucion = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Pendiente Informe')
                            .subscribe((resp: any) => this.EstadoPendInforme = resp.total);

    this.ordenesServices.obtenerOrdenesConsulta(0, 'Informe Revisado')
                            .subscribe((resp: any) => this.EstadoInfoRevisado = resp.total);

  }

  resolveData() {

    setTimeout(() => { // **** Time Delay ********

      // indicadores

      // console.log(this.ordenesArray);

      let totalENE = 0;
      let totalFEB = 0;
      let totalMAR = 0;
      let totalABR = 0;
      let totalMAY = 0;
      let totalJUN = 0;
      let totalJUL = 0;
      let totalAGO = 0;
      let totalSEP = 0;
      let totalOCT = 0;
      let totalNOV = 0;
      let totalDIC = 0;

      let totalENE1 = 0;
      let totalFEB1 = 0;
      let totalMAR1 = 0;
      let totalABR1 = 0;
      let totalMAY1 = 0;
      let totalJUN1 = 0;
      let totalJUL1 = 0;
      let totalAGO1 = 0;
      let totalSEP1 = 0;
      let totalOCT1 = 0;
      let totalNOV1 = 0;
      let totalDIC1 = 0;

      const preFacturaArray = [];
      const FacturadaArray = [];


      for (const item of this.ordenesArray) {
        if (item.estado === 'Pre - Factura' && item.valida) { // Obtiene solo Ordenes Pre-Factura con flag Valida
          preFacturaArray.push(item);
        }
        if (item.estado === 'Facturada' && item.valida) { // Obtiene solo Ordenes Facturada con flag Valida
          FacturadaArray.push(item);
        }
      }

       // Obtiene solo Ordenes Pre-Factura del Año Actual

      for (const item of preFacturaArray) {


        if (item.year === this.year.toString()) {

          if (item.month === '1') {

            totalENE = totalENE + parseInt(item.valor_total, 10);

          }
          if (item.month === '2') {

            totalFEB = totalFEB + parseInt(item.valor_total, 10);

          }
          if (item.month === '3') {

            totalMAR = totalMAR + parseInt(item.valor_total, 10);

          }
          if (item.month === '4') {

            totalABR = totalABR + parseInt(item.valor_total, 10);

          }
          if (item.month === '5') {

            totalMAY = totalMAY + parseInt(item.valor_total, 10);

          }
          if (item.month === '6') {

            totalJUN = totalJUN + parseInt(item.valor_total, 10);

          }
          if (item.month === '7') {

            totalJUL = totalJUL + parseInt(item.valor_total, 10);

          }
          if (item.month === '8') {

            totalAGO = totalAGO + parseInt(item.valor_total, 10);

          }
          if (item.month === '9') {

            totalSEP = totalSEP + parseInt(item.valor_total, 10);

          }
          if (item.month === '10') {

            totalOCT = totalOCT + parseInt(item.valor_total, 10);

          }
          if (item.month === '11') {

            totalNOV = totalNOV + parseInt(item.valor_total, 10);

          }
          if (item.month === '12') {

            totalDIC = totalDIC + parseInt(item.valor_total, 10);

          }

        }

      }

      for (const item of FacturadaArray) {


        if (item.year === this.year.toString()) {

          if (item.month === '1') {

            totalENE1 = totalENE1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '2') {

            totalFEB1 = totalFEB1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '3') {

            totalMAR1 = totalMAR1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '4') {

            totalABR1 = totalABR1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '5') {

            totalMAY1 = totalMAY1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '6') {

            totalJUN1 = totalJUN1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '7') {

            totalJUL1 = totalJUL1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '8') {

            totalAGO1 = totalAGO1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '9') {

            totalSEP1 = totalSEP1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '10') {

            totalOCT1 = totalOCT1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '11') {

            totalNOV1 = totalNOV1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '12') {

            totalDIC1 = totalDIC1 + parseInt(item.valor_total, 10);

          }

        }

      }

      // indicador Pre-Factura VS Valor Total Mensual
      this.dataIndicador.push(totalENE);
      this.dataIndicador.push(totalFEB);
      this.dataIndicador.push(totalMAR);
      this.dataIndicador.push(totalABR);
      this.dataIndicador.push(totalMAY);
      this.dataIndicador.push(totalJUN);
      this.dataIndicador.push(totalJUL);
      this.dataIndicador.push(totalAGO);
      this.dataIndicador.push(totalSEP);
      this.dataIndicador.push(totalOCT);
      this.dataIndicador.push(totalNOV);
      this.dataIndicador.push(totalDIC);

      // indicador Facturada VS Valor Total Mensual
      this.dataIndicador1.push(totalENE1);
      this.dataIndicador1.push(totalFEB1);
      this.dataIndicador1.push(totalMAR1);
      this.dataIndicador1.push(totalABR1);
      this.dataIndicador1.push(totalMAY1);
      this.dataIndicador1.push(totalJUN1);
      this.dataIndicador1.push(totalJUL1);
      this.dataIndicador1.push(totalAGO1);
      this.dataIndicador1.push(totalSEP1);
      this.dataIndicador1.push(totalOCT1);
      this.dataIndicador1.push(totalNOV1);
      this.dataIndicador1.push(totalDIC1);

      // console.log(this.dataIndicador);



      // Ordenes
      this.dataGrafico1.push(this.OrdenNuevas);
      this.dataGrafico1.push(this.OrdenEjecutadas);
      this.dataGrafico1.push(this.OrdenCanceladas);
      this.dataGrafico1.push(this.OrdenReprogramadas);

      // Estados
      this.dataGrafico2.push(this.EstadoPendProgramar);
      this.dataGrafico2.push(this.EstadoEjecucion);
      this.dataGrafico2.push(this.EstadoFinalizado);

      this.dataGrafico3.push(this.EstadoFacturadas);
      this.dataGrafico3.push(this.EstadoDevolucion);


      // Codigo para definir los datos de cada grafica
      this.graficos = {
        indicador: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          data: [
            { data: this.dataIndicador, label: 'Promedio Mensual'}
          ],
          type: 'bar',
          leyenda: `Promedio Mensual Ordenes Pre - Factura ${this.year}`,
          color: [
            {backgroundColor: ['#93C187', '#D3BC67', '#C9686B', '#42C2CE', '#93C187', '#D3BC67', '#C9686B', '#42C2CE', '#93C187', '#D3BC67', '#C9686B', '#42C2CE']} // define el color de la grafica
          ]
        },
        indicador1: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          data: [
            { data: this.dataIndicador1, label: 'Promedio Mensual'}
          ],
          type: 'bar',
          leyenda: `Promedio Mensual Ordenes Facturada ${this.year}`,
          color: [
            {backgroundColor: ['#93C187', '#D3BC67', '#C9686B', '#42C2CE', '#93C187', '#D3BC67', '#C9686B', '#42C2CE', '#93C187', '#D3BC67', '#C9686B', '#42C2CE']} // define el color de la grafica
          ]
        },
        grafico1: {
          labels: ['Nuevas', 'Ejecutadas', 'Canceladas', 'Reprogramadas'],
          data: [
            { data: this.dataGrafico1, label: 'Ordenes' }
          ],
          type: 'bar',
          leyenda: 'Ordenes Ingresadas',
          color: [
            {backgroundColor: ['#93C187', '#D3BC67', '#C9686B', '#42C2CE']} // define el color de la grafica
          ]
        },
        grafico2: {
          labels: ['Pendiente Programar', 'En Ejecución', 'Finalizada'],
          data:  this.dataGrafico2,
          type: 'doughnut',
          leyenda: 'Relación Estados'
        },
        grafico3: {
          labels: ['Facturadas', 'Devolucion'],
          data:  this.dataGrafico3,
          type: 'doughnut',
          leyenda: 'Relación Estados',
          color: [
            {backgroundColor: ['#18AD1A', '#EACF35']} // define el color de la grafica
          ]
        }
      };


    }, 3000);  // **** Time Delay 5 Seg ********



  }



} // END class


// ****************CODIGO NO USADO*****************************
/*

  // Data para los graficos
  graficos: any = {
    grafico1: {
      labels: ['En Ejecución', 'Facturadas', 'Devolucion'],
      data:  [40, 20, 30 ],
      type: 'doughnut',
      leyenda: 'Ordenes'
    },
    grafico2: {
      labels: ['Hombres', 'Mujeres', 'Niños'],
      data:  this.data,
      type: 'doughnut',
      leyenda: 'Entrevistados'
    },
    grafico3: {
      labels: ['Si',  'No'],
      data:  [90, 10],
      type: 'doughnut',
      leyenda: '¿Le dan gases los frijoles?'
    },
    grafico4: {
      labels: ['No',  'Si'],
      data:  [85, 15],
      type: 'doughnut',
      leyenda: '¿Le importa que le den gases?'
    },
  };

*/


/*

  setTimeout(() => { // **** Time Delay ********

      // indicadores

      // console.log(this.ordenesArray);

      let totalENE = 0;
      let totalFEB = 0;
      let totalMAR = 0;
      let totalABR = 0;
      let totalMAY = 0;
      let totalJUN = 0;
      let totalJUL = 0;
      let totalAGO = 0;
      let totalSEP = 0;
      let totalOCT = 0;
      let totalNOV = 0;
      let totalDIC = 0;

      let totalENE1 = 0;
      let totalFEB1 = 0;
      let totalMAR1 = 0;
      let totalABR1 = 0;
      let totalMAY1 = 0;
      let totalJUN1 = 0;
      let totalJUL1 = 0;
      let totalAGO1 = 0;
      let totalSEP1 = 0;
      let totalOCT1 = 0;
      let totalNOV1 = 0;
      let totalDIC1 = 0;

      const preFacturaArray = [];
      const FacturadaArray = [];


      for (const item of this.ordenesArray) {
        if (item.estado === 'Pre - Factura' && item.valida) { // Obtiene solo Ordenes Pre-Factura con flag Valida
          preFacturaArray.push(item);
        }
        if (item.estado === 'Facturada' && item.valida) { // Obtiene solo Ordenes Facturada con flag Valida
          FacturadaArray.push(item);
        }
      }

       // Obtiene solo Ordenes Pre-Factura del Año Actual

      for (const item of preFacturaArray) {


        if (item.year === this.year.toString()) {

          if (item.month === '1') {

            totalENE = totalENE + parseInt(item.valor_total, 10);

          }
          if (item.month === '2') {

            totalFEB = totalFEB + parseInt(item.valor_total, 10);

          }
          if (item.month === '3') {

            totalMAR = totalMAR + parseInt(item.valor_total, 10);

          }
          if (item.month === '4') {

            totalABR = totalABR + parseInt(item.valor_total, 10);

          }
          if (item.month === '5') {

            totalMAY = totalMAY + parseInt(item.valor_total, 10);

          }
          if (item.month === '6') {

            totalJUN = totalJUN + parseInt(item.valor_total, 10);

          }
          if (item.month === '7') {

            totalJUL = totalJUL + parseInt(item.valor_total, 10);

          }
          if (item.month === '8') {

            totalAGO = totalAGO + parseInt(item.valor_total, 10);

          }
          if (item.month === '9') {

            totalSEP = totalSEP + parseInt(item.valor_total, 10);

          }
          if (item.month === '10') {

            totalOCT = totalOCT + parseInt(item.valor_total, 10);

          }
          if (item.month === '11') {

            totalNOV = totalNOV + parseInt(item.valor_total, 10);

          }
          if (item.month === '12') {

            totalDIC = totalDIC + parseInt(item.valor_total, 10);

          }

        }

      }

      for (const item of FacturadaArray) {


        if (item.year === this.year.toString()) {

          if (item.month === '1') {

            totalENE1 = totalENE1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '2') {

            totalFEB1 = totalFEB1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '3') {

            totalMAR1 = totalMAR1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '4') {

            totalABR1 = totalABR1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '5') {

            totalMAY1 = totalMAY1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '6') {

            totalJUN1 = totalJUN1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '7') {

            totalJUL1 = totalJUL1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '8') {

            totalAGO1 = totalAGO1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '9') {

            totalSEP1 = totalSEP1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '10') {

            totalOCT1 = totalOCT1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '11') {

            totalNOV1 = totalNOV1 + parseInt(item.valor_total, 10);

          }
          if (item.month === '12') {

            totalDIC1 = totalDIC1 + parseInt(item.valor_total, 10);

          }

        }

      }

      // indicador Pre-Factura VS Valor Total Mensual
      this.dataIndicador.push(totalENE);
      this.dataIndicador.push(totalFEB);
      this.dataIndicador.push(totalMAR);
      this.dataIndicador.push(totalABR);
      this.dataIndicador.push(totalMAY);
      this.dataIndicador.push(totalJUN);
      this.dataIndicador.push(totalJUL);
      this.dataIndicador.push(totalAGO);
      this.dataIndicador.push(totalSEP);
      this.dataIndicador.push(totalOCT);
      this.dataIndicador.push(totalNOV);
      this.dataIndicador.push(totalDIC);

      // indicador Facturada VS Valor Total Mensual
      this.dataIndicador1.push(totalENE1);
      this.dataIndicador1.push(totalFEB1);
      this.dataIndicador1.push(totalMAR1);
      this.dataIndicador1.push(totalABR1);
      this.dataIndicador1.push(totalMAY1);
      this.dataIndicador1.push(totalJUN1);
      this.dataIndicador1.push(totalJUL1);
      this.dataIndicador1.push(totalAGO1);
      this.dataIndicador1.push(totalSEP1);
      this.dataIndicador1.push(totalOCT1);
      this.dataIndicador1.push(totalNOV1);
      this.dataIndicador1.push(totalDIC1);

      // console.log(this.dataIndicador);



      // Ordenes
      this.dataGrafico1.push(this.OrdenNuevas);
      this.dataGrafico1.push(this.OrdenEjecutadas);
      this.dataGrafico1.push(this.OrdenCanceladas);
      this.dataGrafico1.push(this.OrdenReprogramadas);

      // Estados
      this.dataGrafico2.push(this.EstadoPendProgramar);
      this.dataGrafico2.push(this.EstadoEjecucion);
      this.dataGrafico2.push(this.EstadoFinalizado);

      this.dataGrafico3.push(this.EstadoFacturadas);
      this.dataGrafico3.push(this.EstadoDevolucion);


      // Codigo para definir los datos de cada grafica
      this.graficos = {
        indicador: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          data: [
            { data: this.dataIndicador, label: 'Promedio Mensual'}
          ],
          type: 'bar',
          leyenda: `Promedio Mensual Ordenes Pre - Factura ${this.year}`,
          color: [
            {backgroundColor: ['#93C187', '#D3BC67', '#C9686B', '#42C2CE', '#93C187', '#D3BC67', '#C9686B', '#42C2CE', '#93C187', '#D3BC67', '#C9686B', '#42C2CE']} // define el color de la grafica
          ]
        },
        indicador1: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          data: [
            { data: this.dataIndicador1, label: 'Promedio Mensual'}
          ],
          type: 'bar',
          leyenda: `Promedio Mensual Ordenes Facturada ${this.year}`,
          color: [
            {backgroundColor: ['#93C187', '#D3BC67', '#C9686B', '#42C2CE', '#93C187', '#D3BC67', '#C9686B', '#42C2CE', '#93C187', '#D3BC67', '#C9686B', '#42C2CE']} // define el color de la grafica
          ]
        },
        grafico1: {
          labels: ['Nuevas', 'Ejecutadas', 'Canceladas', 'Reprogramadas'],
          data: [
            { data: this.dataGrafico1, label: 'Ordenes' }
          ],
          type: 'bar',
          leyenda: 'Ordenes Ingresadas',
          color: [
            {backgroundColor: ['#93C187', '#D3BC67', '#C9686B', '#42C2CE']} // define el color de la grafica
          ]
        },
        grafico2: {
          labels: ['Pendiente Programar', 'En Ejecución', 'Finalizada'],
          data:  this.dataGrafico2,
          type: 'doughnut',
          leyenda: 'Relación Estados'
        },
        grafico3: {
          labels: ['Facturadas', 'Devolucion'],
          data:  this.dataGrafico3,
          type: 'doughnut',
          leyenda: 'Relación Estados',
          color: [
            {backgroundColor: ['#18AD1A', '#EACF35']} // define el color de la grafica
          ]
        }
      };


    }, 3000);  // **** Time Delay 5 Seg ********



*/
