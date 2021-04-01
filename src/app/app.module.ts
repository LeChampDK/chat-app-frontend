import {Injectable, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Socket, SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';

@Injectable({providedIn: 'root'})
export class SocketChat extends Socket {
  constructor() {
    super({url: 'http://localhost:3000', options: {}});
  }
}
@Injectable({providedIn: 'root'})
export class SocketStock extends Socket {
  constructor() {
    super({url: 'http://localhost:9500', options: {}});
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
