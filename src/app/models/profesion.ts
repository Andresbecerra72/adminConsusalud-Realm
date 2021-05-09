import { Usuario } from 'src/app/models/usuario.model';
import { Especialista } from 'src/app/models/especialista.model';

export class Profesion {

  constructor(
    public nombre: string,
    public color?:{
      primary: string,
      secondary: string,
    },
    public _id?: string,
    // relacion
    public usuario?: Usuario,
    public especialistas?: Especialista,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string,
  ){}



}
