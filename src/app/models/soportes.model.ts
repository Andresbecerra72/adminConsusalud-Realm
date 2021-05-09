import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Orden } from 'src/app/models/orden.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Archivos } from 'src/app/models/archivos.model';
import { Evento } from 'src/app/models/evento.model';




export class Soportes {

  constructor(
    public nombre?: string,
    public especialista_nombre?: string,
    public empresa_nombre?: string,
    public sede_nombre?: string,
    public cronograma?: string,
    public secuencia?: string,
    public tipo_servicio?: string,
    public actividad?: string,
    public tipo_informe?: string,
    public horas_asignadas?: number,
    public horas_usadas?: number,
    public asistentes?: string,
    public tiempo_informe?: number,
    public tiempo_administrativo?: number,
    public tiempo_valido?: number, // tiempo validado por Dir Técnica
    public valor_transporte?: string,
    public valor_insumos?: string,
    public observacion?: string,
    public img_llegada?: string, // Selfie llegada
    public fecha_llegada?: Date,
    public img_salida?: string, // Selfie salida
    public fecha_salida?: Date,
    public tarifa_hora?: string,
    public valor_total?: string,
    public path?: string,
    public fecha?: Date,
    public ciudad?: string,
    public fallida?: boolean,
    public server_files?: string,
    public _id?: string,
    public anotaciones?: { // usado para las novedades de los archivos
      fecha: Date,
      reporte: string,
      flag: boolean,
      activo: string,
      usuario: string
      },
    // relacion
    public usuario?: Usuario,
    public especialista?: Especialista,
    public orden?: Orden,
    public empresa?: Empresa,
    public evento?: Evento,
    public archivos?: Archivos,
    public nuevaorden?: Orden,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string,
  ){}



}
