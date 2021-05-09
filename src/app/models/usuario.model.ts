import { Especialista } from 'src/app/models/especialista.model';

export class Usuario {


  constructor(
    public nombre: string,
    public correo: string,
    public password: string,
    public apellido?: string,
    public documento?: string,
    public telefono?: string,
    public ciudad?: string,
    public direccion?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public _id?: string,
    // relacion
    public especialista?: Especialista,
    // data
    public estado?: string,
    public activo?: string,
    public year?: string,
    public month?: string,
    public created_at?: string,
    public updated_at?: string,
     // gestor de permisos
    public flag_admin?: boolean,
    public flag_usuarios?: boolean,
    public flag_especialistas?: boolean,
    public flag_ordenes?: boolean,
    public flag_eventos?: boolean,
    public flag_soportes?: boolean,
    public flag_archivos?: boolean,
    public flag_tarifas?: boolean,
    public flag_empresas?: boolean,
    public flag_graficas?: boolean,
    public flag_datos?: boolean,
    public flag_agenda?: boolean,
    public flag_index?: boolean,
    public flag?: boolean,


  ){}



}
