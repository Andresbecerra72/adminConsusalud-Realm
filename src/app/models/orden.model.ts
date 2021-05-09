import { Usuario } from 'src/app/models/usuario.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Sede } from 'src/app/models/sede.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Evento } from 'src/app/models/evento.model';
import { Archivos } from 'src/app/models/archivos.model';
import { Soportes } from 'src/app/models/soportes.model';

export class Orden {


  constructor(

    public razon: string,
    public cronograma: string,
    public secuencia: string,
    public nit?: string,
    public actividad_programa?: string,
    public unidad?: string,
    public descripcion?: string,
    public act_programadas?: string,
    public act_ejecutadas?: string,
    public act_canceladas?: string,
    public act_reprogramadas?: string,
    public tipo_servicio?: string,
    public fecha_programada?: string,
    public valor_transporte?: string,
    public valor_alojamiento?: string,
    public valor_alimentacion?: string,
    public valor_tiempo_muerto?: string,
    public valor_material_complementario?: string,
    public nombre_asesor?: string,
    public observaciones?: string,
    public num_pol?: string,
    public ubicacion_actividad?: string,
    public ciudad?: string,
    public fuente?: string,
    public file_name?: string,
    public file_date?: string,
    public estado?: string,
    public valor_total?: string,
    public obs_internas?: {
                        fecha: Date,
                        reporte: string,
                        usuario: string
                        },
    public anotaciones?: {
                        fecha: Date,
                        reporte: string,
                        usuario: string
                        },
    public horas_programadas?: number,
    public horas_ejecutadas?: number,
    public horas_actividad?: number, // tiempo que reporta el especialista
    public tiempo_informe?: number, // tiempo en el informe - tecnica
    public tiempo_administrativo?: number, // tiempo ajustado para administracion
    public radicado?: {
                        fecha: Date,
                        numero: string,
                        usuario: string
                        },
    public facturacion?: {
                        fecha: Date,
                        numero: string,
                        usuario: string
                        },
    public valida?: boolean, // validacion de Orden Pre -Factura
    public server_files?: string,
    public img?: string,
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public empresa?: Empresa,
    public sedes?: Sede,
    public especialistas?: Especialista,
    public soportes?: Soportes,
    public eventos?: Evento,
    public archivos?: Archivos,
    public revisor?: Especialista, // Profesional que verifica los informes
    public nuevaorden?: Orden, // Para Soportes Fallidos
    // data
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string




  ){}



}
