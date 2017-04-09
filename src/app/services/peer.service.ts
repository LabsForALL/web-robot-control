import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { IPeerServiceObserver, IPeerDataConnectionObserver, IPeerMediaConnectionObserver } from './peer-service.interfaces'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PeerService {

  private localPeer: any;
  private dataConnection: any;
  private mediaConnection: any;
  private serviceObserver: IPeerServiceObserver = undefined;
  private dataConnectionObserver : IPeerDataConnectionObserver = undefined;
  private mediaConnectionObserver : IPeerMediaConnectionObserver = undefined;

  constructor(
    private http: Http
  ) { }


  setServiceObserver(observer:IPeerServiceObserver){
    this.serviceObserver = observer;
  }


  removeServiceObserver(){
    this.serviceObserver = undefined;
  }


  setDataConnectionObserver(observer:IPeerDataConnectionObserver){
    this.dataConnectionObserver = observer;
  }


  removeDataConnectionObserver(){
    this.dataConnectionObserver = undefined;
  }


  setMediaConnectionObserver(observer:IPeerMediaConnectionObserver){
    this.mediaConnectionObserver = observer;
  }


  removeMediaConnectionObserver(){
    this.mediaConnectionObserver = undefined;
  }


  /* Methods for handling peer connection to the signalling server */
  
  tryToConnect(usrName){

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
        this.createLocalPeer(usrName,data.d);
      }, 
      err => {
        this.serviceObserver.onPeerServiceError("XirSys connection failed")
      } 
    )
  }


  private createLocalPeer(name,data){

    this.localPeer = new Peer(name, {
              key : 'mme0buekacrkvs4i',
              debug: 3,
              config: data
    });

    this.localPeer.on('open',
      (usr) => {
        if(this.serviceObserver) this.serviceObserver.onPeerServiceOpen(usr);
      }
    );

    this.localPeer.on('disconnected',
      () => {
        if(this.serviceObserver) this.serviceObserver.onPeerServiceDisconnected();
      }
    );

    this.localPeer.on('close',
      () => {
        if(this.serviceObserver) this.serviceObserver.onPeerServiceClosed();
      }
    );

    this.localPeer.on('error',
      (err) => {
        let errorMessage : String = "";
        switch (err.type) {
          case 'browser-incompatible':
              errorMessage = "Please use better browser";
              break;
          case 'disconnected':
              errorMessage = "Disconnected from the server";
              break;
          case 'invalid-id':
              errorMessage = "Invalid ID, try new one";
              break;
          case 'invalid-key':
              errorMessage = "Invalid key, get another one";
              break;
          case 'network':
              errorMessage = "Network problem occurred, check your connection";
              break;
          case 'peer-unavailable':
              errorMessage = "Peer is unavailable";
              break;
          case 'ssl-unavailable':
              errorMessage = "SSL is unavailable";
              break;
          case 'server-error':
              errorMessage = "Server error occurred";
              break;
          case 'socket-error':
              errorMessage = "Socket error occurred";
              break;
          case 'socket-closed':
              errorMessage = "Socket was closed";
              break;
          case 'unavailable-id':
              errorMessage = "This id was taken";
              break;
          case 'webrtc':
              errorMessage = "RTC internal error occurred";
              break;
        }
        if(this.serviceObserver) this.serviceObserver.onPeerServiceError(errorMessage);
      }
    );
  }


  getLocalUsername(){
    if(this.localPeer) return this.localPeer.id
  }


  isDisconnected(){
    if(this.localPeer){
      return this.localPeer.disconnected
    }
    return true;
  }


  private destroyLocalPeer(){
    if(this.localPeer){
      this.localPeer.disconnect();
      this.localPeer.destroy();
    }
  }
  

  /* Methods for handling data connection */

  startDataConnection(remoteID){

    this.dataConnection = this.localPeer.connect(remoteID);

    this.dataConnection.on('open',
      ()=>{
        if(this.dataConnectionObserver)
          this.dataConnectionObserver.onPeerDataConnectionOpen(); 
      }  
    );
    
    this.dataConnection.on('data',
      (data) => {
        if(this.dataConnectionObserver)
          this.dataConnectionObserver.onPeerDataConnectionData(data); 
      }
    );

    this.dataConnection.on('close',
      () => {
        if(this.dataConnectionObserver)
          this.dataConnectionObserver.onPeerDataConnectionClose(); 
      }
    );

    this.dataConnection.on('error',
      (err) => {
        if(this.dataConnectionObserver)
          this.dataConnectionObserver.onPeerDataConnectionError(err); 
      }
    );
  }


  sendData(data:any){
    this.dataConnection.send(data);
  }


  closeDataConnection(){
    this.dataConnection.close();
  }


  /* Methods for handling media connection */
  
  startMediaConnection(remoteID){

    // Trying to get the local streams
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    navigator.getUserMedia({video: true, audio: true},
      (stream)=>{

        // Calling the other user with the local streams
        this.mediaConnection = this.localPeer.call(remoteID,stream);

        this.mediaConnection.on('stream',
          (stream) => {
            if(this.mediaConnectionObserver)
              this.mediaConnectionObserver.onPeerMediaConnectionOpen(stream);
          }
        );

        this.mediaConnection.on('close',
          () => {
            if(this.mediaConnectionObserver)
              this.mediaConnectionObserver.onPeerMediaConnectionClosed();
          }
        );

        this.mediaConnection.on('error',
          (err) => {
            if(this.mediaConnectionObserver)
              this.mediaConnectionObserver.onPeerMediaConnectionError(err);
          }
        );

      },
      (err)=>{
        if(this.mediaConnectionObserver)
          this.mediaConnectionObserver.onPeerMediaConnectionError(err);
      }
    );
  }


  stopMediaConnection(){
    this.mediaConnection.close();
  }
  

  terminate(){
    this.destroyLocalPeer();
    this.removeServiceObserver();
    this.removeDataConnectionObserver();
  }

}