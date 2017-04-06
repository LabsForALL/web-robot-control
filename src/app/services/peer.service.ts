import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PeerService {

  constructor(
    private http: Http
  ) { }
  
  tryToConnect(usrName, onSuccess:(peer:any)=>any, onError:(errMsg:string)=>any){

    // getting the TURN servers data from xirsys
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({
      ident: "oneforall",
      secret: "f447dbec-1985-11e7-aa4e-23dc7b36f79d",
      domain: "www.webrobot.com",
      application: "default",
      room: "default",
      secure: 1
    });

    this.http.post("https://service.xirsys.com/ice", body, headers)
    .map(res => res.json())
    .toPromise()
    .then(
      (data) => {
        // TURN servers data is ready so lets create the peer
        onSuccess(new Peer(usrName, {
          key : 'mme0buekacrkvs4i',
          debug: 3,
          config: data.d
        }));
      }, 
      err => {
        onError("XirSys connection failed");
      } 
    )
  }
  
}