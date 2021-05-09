import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RealmService } from './realm.service';

import { URL_login, URL_API_Realm, api_Key} from 'src/app/config/config';

import { Sede } from 'src/app/models/sede.model';
import { Usuario } from 'src/app/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class RealmSedeService {

  // variables
access_token: string;
refresh_token: string;

usuario: Usuario;


// -------------------constructor-----------------------------

  constructor(private http: HttpClient,
              private realmService: RealmService) {

                // metodo para obtener los Tokens
                this.realmService.GetaClientAPI_Tokens()
                .subscribe();

                this.usuario = JSON.parse(localStorage.getItem('usuario'));

              }

  // -----------------metodos-------------------------------

  // ----------------------------------------------------------
//    CREAR SEDE
// ----------------------------------------------------------
guardandoSedeRealm(sede: Sede){


  this.access_token = localStorage.getItem("access_token");


  const URL = `${URL_API_Realm}`;

  const headers = new HttpHeaders({
    "Authorization": "Bearer " + this.access_token,
    'Content-Type': 'application/json'
      });

      // "5f89e5cefe905c3524e861b4"
      const body = JSON.stringify(
        {
          query : `
            mutation {
                    insertOneSede(data: {
                      nombre: "${sede.nombre}",
                      correo: "${sede.correo}",
                      telefono: "${sede.telefono}",
                      contacto: "${sede.contacto}",
                      ciudad: "${sede.ciudad}",
                      direccion: "${sede.direccion}",
                      usuario: {
                        link: "${this.usuario._id}"
                      },
                      empresa: {
                        link: "${sede.empresa._id}"
                      },
                      estado: "NA",
                      activo: "1",
                      year: "${new Date().getFullYear()}",
                      month: "${new Date().getMonth() + 1}",
                      created_at: "${new Date().toISOString()}",
                      updated_at: "${new Date().toISOString()}"

                      }) {
                      _id
                      nombre

                    }
                  }
          `
      }
        );

        console.log(body);





  return this.http.post(URL, body , {headers});



}


} // END class
