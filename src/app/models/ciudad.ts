import { Usuario } from 'src/app/models/usuario.model';


export class Ciudad {

  constructor(
    public nombre: string,
    public departamento?: string,
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string,
  ){}



}
