import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Orden } from 'src/app/models/orden.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Evento } from 'src/app/models/evento.model';
import { Soportes } from './soportes.model';





export class Cuenta {

  constructor(
    public cuenta?: string,
    public especialista_nombre?: string,
    public empresa_nombre?: string,
    public sede_nombre?: string,
    public ciudad?: string,
    public horas_total_asignadas?: number,
    public horas_total_ejecutadas?: number,
    public total_asistentes?: number,
    public total_tiempo_informe?: number,
    public total_tiempo_administrativo?: number,
    public total_tiempo_valido?: number, // tiempo validado por Dir Técnica
    public total_valor_transporte?: number,
    public total_valor_insumos?: number,
    public total_viaticos?: number,
    public tarifa_hora?: number, // tarifa asignada al especialista
    public valor_total_cuenta?: number,
    public fecha_pago?: Date,
    public fecha_spare?: Date,
    public year_cuenta?: string,
    public month_cuenta?: string,
    public fecha?: Date,
    public valida?: boolean,
    public observacion?: string,
    public anotaciones?: { // usado para las anotaciones de las cuentas
      fecha: Date,
      novedad: string,
      flag: boolean,
      activo: string,
      usuario: string
      },
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public especialista?: Especialista,
    public ordenes?: Orden,
    public empresas?: Empresa,
    public eventos?: Evento,
    public soportes?: Soportes,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string,
  ){}



}
