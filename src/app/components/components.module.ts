import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

// ng2 - charts
import { ChartsModule } from 'ng2-charts';

// Pipes Module
import { PipesModule } from '../pipes/pipes.module';


// Componentes
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraphicDoughnutComponent } from '../components/graphic-doughnut/graphic-doughnut.component';
import { GraphicBarComponent } from './graphic-bar/graphic-bar.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { TableOrdenesComponent } from '../components/table-ordenes/table-ordenes.component';
import { CardOrdenComponent } from '../components/card-orden/card-orden.component';
import { FormOrdenComponent } from '../components/form-orden/form-orden.component';
import { TableComponent } from '../components/dashboard/table/table.component';
import { FormComponent } from '../components/dashboard/form/form.component';
import { CardsGroupComponent } from '../components/cards-group/cards-group.component';
import { ReportFormatComponent } from './report-format/report-format.component';



@NgModule({
  declarations: [
    IncrementadorComponent,
    GraphicDoughnutComponent,
    GraphicBarComponent,
    ModalUploadComponent,
    TableOrdenesComponent,
    CardOrdenComponent,
    FormOrdenComponent,
    FormComponent,
    TableComponent,
    CardsGroupComponent,
    ReportFormatComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    PipesModule,
    RouterModule
  ],
  exports: [
    IncrementadorComponent,
    GraphicDoughnutComponent,
    GraphicBarComponent,
    ModalUploadComponent,
    TableOrdenesComponent,
    CardOrdenComponent,
    FormOrdenComponent,
    FormComponent,
    TableComponent,
    CardsGroupComponent,
    ReportFormatComponent
  ]
})
export class ComponentsModule { }
