import { NgModule } from '@angular/core';
// pipes
import { ImagenPipe } from './imagen.pipe';




@NgModule({
  declarations: [
    ImagenPipe
  ],
  imports: [ ],
  exports: [
    ImagenPipe
  ]
})
export class PipesModule { }
