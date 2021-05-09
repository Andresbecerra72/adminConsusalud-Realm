import { Usuario } from 'src/app/models/usuario.model';
import { Orden } from 'src/app/models/orden.model';
import { Contratante } from 'src/app/models/contratante.model';


export class Asesor {


  constructor(
    public nombre: string,
    public correo?: string,
    public telefono?: string,
    public ciudad?: string,
    public direccion?: string,
    public documento?: string,
    public img?: string,
    public calificacion?: string,
    public anotaciones?: string,
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public contratante?: Contratante,
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
