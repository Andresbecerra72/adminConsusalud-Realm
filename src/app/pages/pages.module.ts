import { NgModule } from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// calendar
import { DateAdapter, CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { CalendarUtilsComponent } from '../components/calendar-utils/calendar-utils.component';

// Pipes Module
import { PipesModule } from '../pipes/pipes.module';

// get PDF File
import { jsPDF } from 'jspdf';

// main components Pages
import { PagesComponent } from './pages.component';

// Routes for Pages
import { PAGES_ROUTES } from './pages.routes';

// modulo of Shared Components
import { SharedModule } from '../shared/shared.module';

// Modulo de componentes
import { ComponentsModule } from '../components/components.module';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContratantesComponent } from './dashboard/contratantes/contratantes.component';
import { EmpresasComponent } from './dashboard/empresas/empresas.component';
import { EspecialistasComponent } from './dashboard/especialistas/especialistas.component';
import { ConfiguresComponent } from './dashboard/configures/configures.component';
import { ProgressComponent } from './dashboard/progress/progress.component';
import { GraphicsComponent } from './dashboard/graphics/graphics.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
// Usuarios
import { ProfileComponent } from './usuarios/profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
// Ordenes
import { OrdenComponent } from './ordenes/orden/orden.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { BuscarOrdenesComponent } from './ordenes/buscador/buscar-ordenes.component';
import { NuevasOrdenesComponent } from './ordenes/nuevas-ordenes/nuevas-ordenes.component';
import { EjecutadasOrdenesComponent } from './ordenes/ejecutadas-ordenes/ejecutadas-ordenes.component';
import { CanceladasOrdenesComponent } from './ordenes/canceladas-ordenes/canceladas-ordenes.component';
import { ReprogramadasOrdenesComponent } from './ordenes/reprogramadas-ordenes/reprogramadas-ordenes.component';
import { EstadosOrdenesComponent } from './ordenes/estados-ordenes/estados-ordenes.component';
import { ReporteComponent } from './ordenes/reporte/reporte.component';
// Programacion
import { AgendaComponent } from './programacion/agenda.component';
// Profesionales
import { ProfesionalesComponent } from './profesionales/profesionales.component';
import { PerfilComponent } from './profesionales/perfil/perfil.component';
import { NewOrdenesComponent } from './profesionales/misordenes/nuevas-ordenes/new-ordenes.component';
import { EndOrdenesComponent } from './profesionales/misordenes/end-ordenes/end-ordenes.component';
import { PendingOrdenesComponent } from './profesionales/misordenes/pending-ordenes/pending-ordenes.component';
import { MiagendaComponent } from './profesionales/miprogramacion/miagenda.component';
import { HistorialComponent } from './profesionales/historial/historial.component';
import { CuentaComponent } from './profesionales/cuenta/cuenta.component';
import { ActaComponent } from './profesionales/misordenes/acta/acta.component';
import { UnirOrdenesComponent } from './ordenes/unir-ordenes/unir-ordenes.component';
// Tecnica
import { InformesComponent } from './tecnica/informes/informes.component';
import { InformeOrdenesComponent } from './tecnica/ordenes/informe-ordenes.component';
import { AgendaTecnicaComponent } from './tecnica/programacion/agenda-tecnica.component';
// Datos
import { DatosComponent } from './datos/datos.component';
// Empresas
import { EmpresaComponent } from './empresas/empresa/empresa.component';
import { BuscarEmpresasComponent } from './empresas/buscador/buscar-empresas.component';
// Buscador Global
import { BuscadorGlobalComponent } from './buscador-global/buscador-global.component';
// Gestor de Novedades
import { GestorEspecialistaComponent } from './gestor/especialistas/gestor-especialista.component';
import { GestorOrdenComponent } from './gestor/ordenes/gestor-orden.component';
import { GestorUsuarioComponent } from './gestor/usuarios/gestor-usuario.component';
import { GestorComponent } from './gestor/gestor.component';








@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    GraphicsComponent,
    AccountSettingsComponent,
    ProfileComponent,
    UsuariosComponent,
    OrdenesComponent,
    BuscarOrdenesComponent,
    NuevasOrdenesComponent,
    EjecutadasOrdenesComponent,
    CanceladasOrdenesComponent,
    ReprogramadasOrdenesComponent,
    EstadosOrdenesComponent,
    AgendaComponent,
    CalendarUtilsComponent,
    ContratantesComponent,
    EmpresasComponent,
    EspecialistasComponent,
    InformesComponent,
    ProfesionalesComponent,
    PerfilComponent,
    ConfiguresComponent,
    NewOrdenesComponent,
    EndOrdenesComponent,
    MiagendaComponent,
    HistorialComponent,
    PendingOrdenesComponent,
    InformeOrdenesComponent,
    OrdenComponent,
    DatosComponent,
    EmpresaComponent,
    BuscarEmpresasComponent,
    BuscadorGlobalComponent,
    CuentaComponent,
    ReporteComponent,
    ActaComponent,
    AgendaTecnicaComponent,
    GestorEspecialistaComponent,
    GestorOrdenComponent,
    GestorUsuarioComponent,
    GestorComponent,
    UnirOrdenesComponent,


  ],
   imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DragAndDropModule,
    PAGES_ROUTES,
    SharedModule,
    ComponentsModule,

  ],

  providers: [CurrencyPipe] // pipe del input Tarifa
})

export class PagesModule{}
