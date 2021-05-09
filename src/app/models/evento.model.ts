import { Usuario } from 'src/app/models/usuario.model';
import { Orden } from 'src/app/models/orden.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Sede } from 'src/app/models/sede.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Soportes } from 'src/app/models/soportes.model';

export class Evento {


  constructor(
    public title: string,
    public color: string,
    public start: Date,
    public end: Date,
    public resizable?: {
                      beforeStart: true,
                      afterEnd: true,
                      },
    public draggable?: true,
    public actions?: [
                      {
                        label: '<i class="fas fa-fw fa-pencil-alt"></i>'
                      },
                      {
                        label: '<i class="fas fa-fw fa-trash-alt"></i>'
                      },
                  ],
  // Especialistas
    public nombre?: string,
    public correo?: string,
    public especialidad?: string,
    public telefono?: string,
    public ciudad?: string,
    public horas_asignadas?: number,
    public img?: string,
  // Orden
    public fecha?: string,
    public hora_inicio?: string,
    public hora_termino?: string,
    public cronograma?: string,
    public secuencia?: string,
    public horas_programadas?: number,
    public direccion?: string,
    public sede_lugar?: string,
    public contacto?: string,
    public correo_contacto?: string,
    public actividad?: string,
    public tipo_informe?: string,
    public obs_servicio?: string,
    public razon?: string,
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public orden?: Orden,
    public empresa?: Empresa,
    public sede?: Sede,
    public especialista?: Especialista,
    public soporte?: Soportes,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string
  ){}



}
