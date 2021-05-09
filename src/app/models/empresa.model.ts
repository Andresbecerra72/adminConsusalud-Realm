import { Usuario } from 'src/app/models/usuario.model';
import { Contratante } from 'src/app/models/contratante.model';
import { Sede } from 'src/app/models/sede.model';
import { Orden } from 'src/app/models/orden.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Evento } from 'src/app/models/evento.model';
import { Archivos } from 'src/app/models/archivos.model';
import { Soportes } from 'src/app/models/soportes.model';



export class Empresa {


  constructor(
    public razon: string,
    public correo?: string,
    public telefono?: string,
    public nit?: string,
    public ciudad?: string,
    public contacto?: string,
    public img?: string,
    public server_files?: string,
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public contratante?: Contratante,
    public sedes?: Sede,
    public ordenes?: Orden,
    public especialistas?: Especialista,
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
