import { Usuario } from 'src/app/models/usuario.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Orden } from 'src/app/models/orden.model';
import { Asesor } from 'src/app/models/asesor';



export class Contratante {

  // Modelo para las ARL

  constructor(
    public nombre: string,
    public correo?: string,
    public telefono?: string,
    public ciudad?: string,
    public direccion?: string,
    public contrato?: string,
    public server_files?: string,
    public file_name?: string,
    public file_date?: string,
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public asesores?: Asesor,
    public empresas?: Empresa,
    public ordenes?: Orden,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string,
  ){}



}
