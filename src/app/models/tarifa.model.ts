import { Usuario } from 'src/app/models/usuario.model';
import { Contratante } from 'src/app/models/contratante.model';



export class Tarifa {


  constructor(
    public codigo: string,
    public costo: string,
    public fuente?: string,
    public file_name?: string,
    public file_date?: string,
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public contratante?: Contratante,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string,
  ){}



}
