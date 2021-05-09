import { Component } from '@angular/core';
import { SettingsService } from './services/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

// el contructor carga la informacion inicial de la Aplicacion
constructor(public ajusteService: SettingsService){

}


}
