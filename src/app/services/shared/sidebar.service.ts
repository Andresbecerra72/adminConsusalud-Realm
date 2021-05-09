import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // variables
  menu: any = [ // Menu - Dashboard
    {
      role: 'VISIT_ROLE',
      titulo: 'Dashboard',
      icono: 'metismenu-icon pe-7s-rocket',
      submenu: [
        {titulo: 'General', url: '/dashboard'}
      ]
  },
    {
      role: 'ESPEC_ROLE',
      titulo: 'Dashboard',
      icono: 'metismenu-icon pe-7s-rocket',
      submenu: [
        {titulo: 'General', url: '/dashboard'}
      ]
  },
    {
      role: 'USER_ROLE',
      titulo: 'Dashboard',
      icono: 'metismenu-icon pe-7s-rocket',
      submenu: [
        {titulo: 'General', url: '/dashboard'},
        {titulo: 'ARL', url: '/contratante'},
        {titulo: 'Empresas', url: '/empresa'},
        {titulo: 'Especialistas', url: '/especialista'},
        {titulo: 'Configuraciones', url: '/configures'}
      ]
  },
    {
      role: 'TECN_ROLE',
      titulo: 'Dashboard',
      icono: 'metismenu-icon pe-7s-rocket',
      submenu: [
        {titulo: 'General', url: '/dashboard'},

      ]
  },
    {
      role: 'ADMIN_ROLE',
      titulo: 'Dashboard',
      icono: 'metismenu-icon pe-7s-rocket',
      submenu: [
        {titulo: 'General', url: '/dashboard'},
        {titulo: 'Gráficas', url: '/graphics'},
        // {titulo: 'Progreso', url: '/progress'},
        {titulo: 'ARL', url: '/contratante'},
        {titulo: 'Empresas', url: '/empresa'},
        {titulo: 'Especialistas', url: '/especialista'},
        {titulo: 'Configuraciones', url: '/configures'},
        {titulo: 'Gestor BD', url: '/gestor'}
      ]
  }
];

ordenes: any = [ // Menu - Administracion
   {

    role: 'ESPEC_ROLE',
    titulo: 'Mis Ordenes',
    icono: 'metismenu-icon pe-7s-display2',
    submenu: [
      {titulo: 'Ordenes Nuevas', url: '/newordenes'},
      {titulo: 'Ordenes Gestión', url: '/endordenes'}
    ]

  },
  {

    role: 'USER_ROLE',
    titulo: 'Gestión Ordenes',
    icono: 'metismenu-icon pe-7s-display2',
    submenu: [
      {titulo: 'Cargar Datos', url: '/ordenes'},
      {titulo: 'Ordenes Nuevas', url: '/nuevasordenes'},
      {titulo: 'Ordenes Ejecutadas', url: '/ejecutadas'},
      {titulo: 'Ordenes Reprogramadas', url: '/reprogramadas'},
      {titulo: 'Ordenes Canceladas', url: '/canceladas'},
      {titulo: 'Consultar Estados', url: '/estados'},
      {titulo: 'Acta Bolívar', url: '/reporte'},
      {titulo: 'Unir Ordenes', url: '/unificar'}
    ]

  },
  {

    role: 'TECN_ROLE',
    titulo: 'Gestión Ordenes',
    icono: 'metismenu-icon pe-7s-display2',
    submenu: [
      {titulo: 'Consultar Estados', url: '/estados'}
    ]

  },
  {

  role: 'ADMIN_ROLE',
  titulo: 'Gestión Ordenes',
  icono: 'metismenu-icon pe-7s-display2',
  submenu: [
    {titulo: 'Cargar Datos', url: '/ordenes'},
    {titulo: 'Ordenes Nuevas', url: '/nuevasordenes'},
    {titulo: 'Ordenes Ejecutadas', url: '/ejecutadas'},
    {titulo: 'Ordenes Reprogramadas', url: '/reprogramadas'},
    {titulo: 'Ordenes Canceladas', url: '/canceladas'},
    {titulo: 'Consultar Estados', url: '/estados'},
    {titulo: 'Buscar', url: '/buscarordenes'},
    {titulo: 'Acta Bolívar', url: '/reporte'},
    {titulo: 'Unir Ordenes', url: '/unificar'}
  ]

  }
];

informes: any = [ // Menu - Tecnica
  {
    role: 'ESPEC_ROLE', // Especialista
    titulo: 'Gestión Informes',
    icono: 'metismenu-icon pe-7s-note2',
    submenu: [
      {titulo: 'Pendiente Informes', url: '/pendingordenes'}

    ]
},
//   {
//     role: 'USER_ROLE',
//     titulo: 'Gestión Informes',
//     icono: 'metismenu-icon pe-7s-note2',
//     submenu: [
//       {titulo: 'Pendiente Informes', url: '/pendienteinforme'},
//       {titulo: 'Ordenes', url: '/buscarordenes'}

//     ]
// },
  {
    role: 'TECN_ROLE',
    titulo: 'Gestión Informes',
    icono: 'metismenu-icon pe-7s-note2',
    submenu: [
      {titulo: 'Pendiente Informes', url: '/pendienteinforme'},
      {titulo: 'Ordenes', url: '/buscarordenes'},
      {titulo: 'Empresas', url: '/buscarempresas'}

    ]
},
  {
    role: 'ADMIN_ROLE',
    titulo: 'Gestión Informes',
    icono: 'metismenu-icon pe-7s-note2',
    submenu: [
      {titulo: 'Pendiente Informes', url: '/pendienteinforme'},
      {titulo: 'Empresas', url: '/buscarempresas'}

    ]
},

];


profesionales: any = [ // Menu - Tecnica

  {
    role: 'ADMIN_ROLE',
    titulo: 'Gestión Profesionales',
    icono: 'metismenu-icon pe-7s-id',
    submenu: [
      {titulo: 'Buscador', url: '/profesionales'},
      {titulo: 'Cuentas', url: '/cuenta'}


    ]
},
  {
    role: 'USER_ROLE',
    titulo: 'Gestión Profesionales',
    icono: 'metismenu-icon pe-7s-id',
    submenu: [
      {titulo: 'Buscador', url: '/profesionales'},
      {titulo: 'Cuentas', url: '/cuenta'}

    ]
},

];

// ------------------------menu de usuarios con PERMISOS--------------------------------------------
permisos: any = [ // Menu - Permisos

  {
    // Permisos Gestor BD
    flag_admin: true,
    titulo: 'Administrador',
    icono: 'metismenu-icon pe-7s-unlock',
    submenu: [
      {titulo: 'Configuraciones', url: '/configures'},
      {titulo: 'Gestor BD', url: '/gestor'}
    ]

  },
  {
    // Permiso Usuarios
    flag_usuarios: true,
    titulo: 'Gestión Usuarios',
    icono: 'metismenu-icon pe-7s-unlock',
    submenu: [
      {titulo: 'Usuarios', url: '/usuarios'}

    ]

  },
  {
    // Permiso Especialistas
    flag_especialistas: true,
    titulo: 'Gestión Especialistas',
    icono: 'metismenu-icon pe-7s-unlock',
    submenu: [
      {titulo: 'Especialistas', url: '/especialista'},

    ]

  },
  {
    // Permiso Ordenes
    flag_ordenes: true,
    titulo: 'Gestión Ordenes',
    icono: 'metismenu-icon pe-7s-unlock',
    submenu: [
      {titulo: 'Buscar Orden', url: '/buscarordenes'}

    ]

  },
  {
    // Permisos Empresas
    flag_empresas: true,
    titulo: 'Gestión Empresas',
    icono: 'metismenu-icon pe-7s-unlock',
    submenu: [
      {titulo: 'Empresas', url: '/empresa'},
    ]

  },
  {
    // Permisos Graficas
    flag_graficas: true,
    titulo: 'Graficas',
    icono: 'metismenu-icon pe-7s-unlock',
    submenu: [
      {titulo: 'Ver Gráficas', url: '/graphics'}
    ]

  },
  {
    // Permisos Datos
    flag_datos: true,
    titulo: 'Datos',
    icono: 'metismenu-icon pe-7s-unlock',
    submenu: [
      {titulo: 'Ver Datos', url: '/datos'}
    ]

  },
  {
    // Permisos Agenda
    flag_agenda: true,
    titulo: 'Agenda',
    icono: 'metismenu-icon pe-7s-unlock',
    submenu: [
      {titulo: 'Ver Agenda', url: '/agenda'}
    ]

  },


];

  constructor() {
    console.log('Constructor - Servicio SideBar');
   }
}
