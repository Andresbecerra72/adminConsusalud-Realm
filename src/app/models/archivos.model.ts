import { Usuario } from 'src/app/models/usuario.model';
import { Orden } from 'src/app/models/orden.model';
import { Empresa } from 'src/app/models/empresa.model';
import { Especialista } from 'src/app/models/especialista.model';
import { Evento } from 'src/app/models/evento.model';



export class Archivos {


  constructor(
    public nombre: string,
    public file_name?: string,
    public file_date?: Date,
    public file_ext?: string,
    public tipo?: string, // define la collection
    public path?: string,
    public img?: string,
    public server_files?: string,
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public orden?: Orden,
    public empresa?: Empresa,
    public especialista?: Especialista,
    public evento?: Evento,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string,
  ){}



}
