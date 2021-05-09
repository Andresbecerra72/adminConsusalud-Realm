import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


// http
import { HttpClientModule } from '@angular/common/http';

// routes
import { APP_ROUTES } from './app.routes';

// modules
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';

// components
import { AppComponent } from './app.component';
import { jsPDF } from 'jspdf';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    APP_ROUTES,
    PagesModule,
    AuthModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
