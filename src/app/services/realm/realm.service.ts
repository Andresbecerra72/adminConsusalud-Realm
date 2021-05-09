import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { URL_login, URL_API_Realm, api_Key} from 'src/app/config/config';



@Injectable({
  providedIn: 'root'
})
export class RealmService {


// variables
public access_token: string;
public refresh_token: string;




// -------------------constructor-----------------------------
constructor(private http: HttpClient) {

  console.log('Constructor - Servicio REALM');


 }

// -----------------metodos-------------------------------

   // metodo para cargar las variables token
   Get_Access_Token(){

    if (localStorage.getItem('access_token')) { // si el token existe en el localStorage
        this.access_token = localStorage.getItem('access_token');

    }else { // si el localstorage esta vacio se inicializan con los siguientes datos
      this.access_token = '';

    }
    return;

  }
   Get_Refresh_Token(){

    if (localStorage.getItem('refresh_token')) { // si el token existe en el localStorage
        this.refresh_token = localStorage.getItem('refresh_token');

    }else { // si el localstorage esta vacio se inicializan con los siguientes datos
      this.refresh_token = '';

    }
    return;

  }




// =======================================================================
//                          REALM MONGODB
// =======================================================================

GetaClientAPI_Tokens() {


  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
      });

      const data = {
        key: api_Key
      };


  return this.http.post(URL_login, JSON.stringify(data), {headers})
                  .pipe(
                    map( (resp: any) => {

                      console.log(resp);

                      this.guardarLocalStorage(resp.access_token, resp.refresh_token); // llama el metodo guardarLocalStorage
                      return resp;
                    })
                    );





}


// Metodo para guardear TOKENS en localStorage
guardarLocalStorage(access_token: string, refresh_token: string){

  localStorage.setItem('access_token', access_token );
  localStorage.setItem('refresh_token', refresh_token );
}




} // END class
