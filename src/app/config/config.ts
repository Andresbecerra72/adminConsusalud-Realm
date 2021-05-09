/**************
 *
 * Despliegues del servidor en Heroku y
 * Google Clouds (user: ceo@absoftware.com Proyecto: Consusalud-Backend)
 *
 *
 * Google Cloud =>
 *      # Ajustar el Pipe: imagen.pippe.ts *
 *      # cambiar el PATH en la lista de archivos estatico metodo 'cargarSoporte()'
 *          (orden.component.ts) variable: docArray
 *      # cambiar URL que regresa el servidor en
 *          (datos.component.ts) variable: fileCsv
 *      # cambiar las lineas del Metodo 'setImagen()' en
 *          (especialistas.component.ts) para que la variable: this.imagenUrl
 *          cambie dinamicamente la imagen del usuario asignado *
 *     # cambiar el soporte.path (GOOGLE) > soporte._id (Localhost) para ver la selfie en la orden
 *       archivo(orden.component.html) del especialista
 *
 *
 */



// constante del SERVIDOR (RUTA DONDE EL SERVIDOR SE ENCUENTRA ALOJADO Y FUNCIONANDO)
   export const URL_SERVICIOS = 'https://elemental-shine-294819.uc.r.appspot.com'; // Google cloud CONSUSALUD
  // export const URL_SERVICIOS = 'https://consusalud-backend.uc.r.appspot.com'; // Google cloud abSoftware
  // export const URL_SERVICIOS = 'https://adminconsusalud-backend.herokuapp.com'; // Heroku local server
  // export const URL_SERVICIOS = 'https://consusaludbackup.herokuapp.com'; // Heroku google store
  // export const URL_SERVICIOS = 'http://localhost:8080'; // pruebas con MongoAtlas y Google Storage ** correr el comando >>npm run start:dev en el folder bakcend-server-google-deploy
  // export const URL_SERVICIOS = 'http://localhost:3000';


// constante Storage Static Files (RUTA PARA ACCEDER ALOS ARCHIVOS STATICOS QUE SON SUBIDO EN LA NUBE)
     export const GOOGLE_URL = 'https://storage.googleapis.com/elemental-shine-294819.appspot.com'; // Google Cloud Storage CONSUSALUD
    // export const GOOGLE_URL = 'https://storage.googleapis.com/consusalud-backend.appspot.com'; // Google Cloud Storage abSoftware
    // export const GOOGLE_URL = 'http://localhost:3000'; // para pruebas con localhost




// ----------------------------------------------------------------------------------------------------------------------------------------------------------
// constante para API RELAM MongoDB

export const URL_login = `https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/consusalud-app-pjxuh/auth/providers/api-key/login`; // para obtener los Tokens

export const URL_API_Realm = 'https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/consusalud-app-pjxuh/graphql'; // Produccion

export const api_Key = 'RPjeImFRPWZ666kQNDT3qpv6Woq9UuGDhF6qh5bpP36xv4cEZnuJaE8xMnMnGiHc';
