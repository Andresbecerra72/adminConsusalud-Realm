import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './dashboard/progress/progress.component';
import { GraphicsComponent } from './dashboard/graphics/graphics.component';
import { ContratantesComponent } from './dashboard/contratantes/contratantes.component';
import { EmpresasComponent } from './dashboard/empresas/empresas.component';
import { EspecialistasComponent } from './dashboard/especialistas/especialistas.component';
import { ConfiguresComponent } from './dashboard/configures/configures.component';
// Settings - Usuarios
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProfileComponent } from './usuarios/profile/profile.component';
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
// Empresas
import { EmpresaComponent } from './empresas/empresa/empresa.component';
import { BuscarEmpresasComponent } from './empresas/buscador/buscar-empresas.component';
// Datos
import { DatosComponent } from './datos/datos.component';
// Buscador Global
import { BuscadorGlobalComponent } from './buscador-global/buscador-global.component';
// Gestor de Novedades
import { GestorComponent } from './gestor/gestor.component';
import { GestorOrdenComponent } from './gestor/ordenes/gestor-orden.component';
import { GestorEspecialistaComponent } from './gestor/especialistas/gestor-especialista.component';
import { GestorUsuarioComponent } from './gestor/usuarios/gestor-usuario.component';




const childRoutes: Routes = [

          {path: 'dashboard', component: DashboardComponent, data: {titulo: 'Dashboard'}},
          {path: 'configures', component: ConfiguresComponent, data: {titulo: 'Configuraciones - Datos'}},
          {path: 'contratante', component: ContratantesComponent, data: {titulo: 'ARL'}},
          {path: 'empresa', component: EmpresasComponent, data: {titulo: 'Empresas'}},
          {path: 'especialista', component: EspecialistasComponent, data: {titulo: 'Especialistas'}},
          {path: 'accountSettings', component: AccountSettingsComponent, data: {titulo: 'Ajustes del Tema'}},
          {path: 'profile', component: ProfileComponent, data: {titulo: 'Perfil de Usuario'}},
          {path: 'progress', component: ProgressComponent, data: {titulo: 'Progreso'}},
          {path: 'graphics', component: GraphicsComponent, data: {titulo: 'Graficas'}},
          // Ordenes
          {path: 'ordenes', component: OrdenesComponent, data: {titulo: 'Ordenes'}},
          {path: 'orden/:id/:page', component: OrdenComponent, data: {titulo: 'Información Orden'}},
          {path: 'buscarordenes', component: BuscarOrdenesComponent, data: {titulo: 'Buscar Ordenes'}},
          {path: 'nuevasordenes', component: NuevasOrdenesComponent, data: {titulo: 'Ordenes Nuevas'}},
          {path: 'ejecutadas', component: EjecutadasOrdenesComponent, data: {titulo: 'Ordenes Ejecutadas'}},
          {path: 'canceladas', component: CanceladasOrdenesComponent, data: {titulo: 'Ordenes Canceladas'}},
          {path: 'reprogramadas', component: ReprogramadasOrdenesComponent, data: {titulo: 'Ordenes Reprogramadas'}},
          {path: 'estados', component: EstadosOrdenesComponent, data: {titulo: 'Consultar Estados'}},
          {path: 'reporte', component: ReporteComponent, data: {titulo: 'Acta Bolívar'}},
          {path: 'unificar', component: UnirOrdenesComponent, data: {titulo: 'Unificar Ordenes'}},
          // Profesionales
          {path: 'profesionales', component: ProfesionalesComponent, data: {titulo: 'Consultar Especialista'}},
          {path: 'newordenes', component: NewOrdenesComponent, data: {titulo: 'Mis Ordenes Programadas'}},
          {path: 'endordenes', component: EndOrdenesComponent, data: {titulo: 'Mis Ordenes Finalizadas'}},
          {path: 'profesionales/:id/:page', component: ProfesionalesComponent, data: {titulo: 'Consultar Especialista'}},
          {path: 'perfil/:id/:page', component: PerfilComponent, data: {titulo: 'Perfil Profesional'}},
          {path: 'pendingordenes', component: PendingOrdenesComponent, data: {titulo: 'Ordenes Pendiente Informes'}},
          {path: 'miagenda', component: MiagendaComponent, data: {titulo: 'Mi Programación'}},
          {path: 'historial', component: HistorialComponent, data: {titulo: 'Historial'}},
          {path: 'cuenta', component: CuentaComponent, data: {titulo: 'Cuentas de Cobro'}},
          {path: 'acta/:id/:page', component: ActaComponent, data: {titulo: 'Acta Bolívar'}},
          // Tecnica
          {path: 'informes/:id/:page', component: InformesComponent, data: {titulo: 'Gestión Informes'}},
          {path: 'pendienteinforme', component: InformeOrdenesComponent, data: {titulo: 'Ordenes Pendiente Informe'}},
          {path: 'agendatecnica', component: AgendaTecnicaComponent, data: {titulo: 'Agenda'}},
          // Empresas
          {path: 'empresas/:id/:page', component: EmpresaComponent, data: {titulo: 'Gestión Empresas'}},
          {path: 'buscarempresas', component: BuscarEmpresasComponent, data: {titulo: 'Buscar Empresas'}},
          // Programacion
          {path: 'agenda', component: AgendaComponent, data: {titulo: 'Programación Agenda'}},
          // Datos
          {path: 'datos', component: DatosComponent, data: {titulo: 'Datos'}},
          // Buscador Global
          {path: 'buscador/:termino', component: BuscadorGlobalComponent, data: {titulo: 'Buscador Global'}},
          // Gestor de Novedades
          {path: 'gestor', component: GestorComponent, data: {titulo: 'Gestor de Datos'}},
          {path: 'gestororden/:id/:page', component: GestorOrdenComponent, data: {titulo: 'Gestor de Orden'}},
          {path: 'gestorespecialista/:id/:page', component: GestorEspecialistaComponent, data: {titulo: 'Gestor de Especialista'}},
          {path: 'gestorusuario/:id/:page', component: GestorUsuarioComponent, data: {titulo: 'Gestor de Usuario'}},

          // Usuarios
          {path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Gestion de Usuarios'}},
          {path: '', pathMatch: 'full', redirectTo: '/dashboard'}


];



@NgModule({
  imports: [ RouterModule.forChild(childRoutes)  ],
  exports: [ RouterModule ]
})


export class ChildRoutesModule { }
