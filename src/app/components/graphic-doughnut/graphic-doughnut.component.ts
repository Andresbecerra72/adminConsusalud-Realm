import { Component, Input } from '@angular/core';

import { Label, MultiDataSet, Color } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-graphic-doughnut',
  templateUrl: './graphic-doughnut.component.html',
  styles: [
  ]
})
export class GraphicDoughnutComponent {

   // Doughnut
 @Input('ChartType') doughnutChartType: ChartType = 'doughnut';
 @Input('ChartLabels') doughnutChartLabels: Label[] = [];
 @Input('ChartData') doughnutChartData: MultiDataSet = [];

 @Input('color') colors: Color[] = [
   {backgroundColor: ['#6857E6', '#009FEE', '#F02059']} // color por defecto
 ];



} // END class
