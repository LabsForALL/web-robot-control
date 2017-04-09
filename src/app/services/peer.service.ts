import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { IPeerServiceObserver } from './peer-service.interfaces'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PeerService {

  private localPeer: any;
  private remoteConn: any;
  private dataConn: any;
  private streamConn: any;
  private serviceObserver: IPeerServiceObserver;

  constructor(
    private http: Http
  ) { }
  
  tryToConnect(usrName, observer : IPeerServiceObserver){

    this.serviceObserver = observer;

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
        this.setUpLocalPeer(name,data.d);
      }, 
      err => {
        this.serviceObserver.onPeerServiceError("XirSys connection failed")
      } 
    )
  }


  setUpLocalPeer(name,data){

    this.localPeer = new Peer(name, {
              key : 'mme0buekacrkvs4i',
              debug: 3,
              config: data
    });

    this.localPeer.on('open',
      (usr) => this.serviceObserver.onPeerServiceOpen(usr)
    )

    this.localPeer.on('disconnected',
      () => this.serviceObserver.onPeerServiceDisconnect()
    )

    this.localPeer.on('close',
      () => this.serviceObserver.onPeerServiceClosed()
    )

    this.localPeer.on('error',
      (err) => this.serviceObserver.onPeerServiceError(err.type)
    )
  }















  connectToRemotePeer(remoteID){

    this.dataConn = this.localPeer.connect(remoteID);
    return this.dataConn;


    this.dataConn.on('open', function () {
    });


    this.dataConn.on('data', function (data) {
    });


    this.dataConn.on('close', function () {
    });


    this.dataConn.on('error', function (err) {
    });

  }



  destroyLocalPeer(){
    if(this.localPeer){
      this.localPeer.disconnect();
      this.localPeer.destroy();
    } 
  }








  
}