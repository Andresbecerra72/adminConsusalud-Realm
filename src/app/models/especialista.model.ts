import { Usuario } from 'src/app/models/usuario.model';
import { Orden } from 'src/app/models/orden.model';
import { Evento } from 'src/app/models/evento.model';
import { Archivos } from 'src/app/models/archivos.model';
import { Profesion } from 'src/app/models/profesion';
import { Soportes } from 'src/app/models/soportes.model';




export class Especialista {


  constructor(
    public nombre: string,
    public correo: string,
    public telefono?: string,
    public ciudad?: string,
    public direccion?: string,
    public documento?: string,
    public apellido?: string,
    public especialidad?: string,
    public img?: string,
    public calificacion?: string,
    public anotaciones?: {
                          fecha: Date,
                          reporte: string,
                          usuario: string
                          },
    public server_files?: string,
    public horas_asignadas?: number,
    public licencia?: string,   // licencia Especialista
    public vigencia?: string,   // vigencia Especialista
    public tarifa_hora?: string,   // Tarifa
    public usuario_asignado?: Usuario,
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public profesiones?: Profesion,
    public ordenes?: Orden,
    public soportes?: Soportes,
    public eventos?: Evento,
    public archivos?: Archivos,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string,
  ){}



}
