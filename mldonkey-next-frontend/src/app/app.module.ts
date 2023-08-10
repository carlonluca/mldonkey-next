import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './private/home/home.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpinnerComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
