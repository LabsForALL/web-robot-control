import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ng2-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { PeerService } from './services/peer.service';

import { AppComponent } from './app.component';
import { RemoteControlComponent } from './remote-control/remote-control.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ControlPanelComponent } from './remote-control/control-panel/control-panel.component'

const appRoutes: Routes = [
  { path: 'remote-control/control-panel/:remote-id', component: ControlPanelComponent },
  { path: 'remote-control/:usrname', component: RemoteControlComponent },
  { path: 'login', component: LoginComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    RemoteControlComponent,
    LoginComponent,
    PageNotFoundComponent,
    ControlPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AlertModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [PeerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
