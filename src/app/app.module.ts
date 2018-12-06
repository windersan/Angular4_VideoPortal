import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent }        from './app.component';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
    
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
