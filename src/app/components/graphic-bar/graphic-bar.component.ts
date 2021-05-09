import { Component, Input } from '@angular/core';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-graphic-bar',
  templateUrl: './graphic-bar.component.html',
  styles: [
  ]
})
export class GraphicBarComponent {

   // Bar
  @Input('ChartType') barChartType: ChartType = 'bar';
  @Input('ChartLabels') barChartLabels: Label[] = [];
  @Input('ChartData') barChartData: ChartDataSets[] = [
    // { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  @Input('color') colors: Color[] = [
    {backgroundColor: ['#48A533', '#D6B533', '#9B090E', '#42C2CE']} // color por defecto
  ];

  @Input('options') barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLegend = false; // determina el titulo del label: 'Series A' / label: 'Series B'

} // END class
