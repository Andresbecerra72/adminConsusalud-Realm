import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient) { }


  // ==========================================================================
//        COPIAR IMAGEN DE USUARIO EN DIRECTORIO DEL ESPECIALISTA: PUT
// ==========================================================================
// metodo copiar el archivo imagen del usuario y asignarlo al especialista - en BD
downloadFile(collection: string) {


  const url = URL_SERVICIOS + '/download/' + collection ;

  return this.http.put(url, null)
                  .pipe(
                    map( (resp: any) => {
                      // console.log(resp);
                      return resp;
                    })

                  );


}





} // END class
