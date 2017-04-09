import { Component, OnInit, OnDestroy } from '@angular/core';
import { PeerService } from '../services/peer.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IPeerServiceObserver } from '../services/peer-service.interfaces'
declare var util : any;

@Component({
  selector: 'app-remote-control',
  templateUrl: './remote-control.component.html',
  styleUrls: ['./remote-control.component.scss'],
})
export class RemoteControlComponent implements OnInit, OnDestroy, IPeerServiceObserver {

  isLoading: boolean = true;
  username : any = "";


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peerService : PeerService
  ) { }


  ngOnInit() {
    console.log("Remote control component created");
    //Basically taking the username from the route params and trying to connect
    let usrname = this.route.snapshot.params['usrname'];
    this.peerService.tryToConnect(usrname,this);
  }


  onPeerServiceOpen(regname) {
    //Showing the connection panel
    this.isLoading = false;
    this.username = regname;
  }


  onPeerServiceDisconnect() {
    console.log("peer service disconnected");
  }


  onPeerServiceClosed() {
    console.log("peer service closed (unable to reconnect)");
  }


  onPeerServiceError(errMsg: String) {
    switch (errMsg) {
      case 'browser-incompatible':
          alert("Please use better browser");
          break;
      case 'disconnected':
          alert("Disconnected from the server");
          break;
      case 'invalid-id':
          alert("Invalid ID, try new one");
          break;
      case 'invalid-key':
          alert("Invalid key, get another one");
          break;
      case 'network':
          alert("Network problem occurred, check your connection");
          break;
      case 'peer-unavailable':
          alert("Peer is unavailable");
          break;
      case 'ssl-unavailable':
          alert("SSL is unavailable");
          break;
      case 'server-error':
          alert("Server error occurred");
          break;
      case 'socket-error':
          alert("Socket error occurred");
          break;
      case 'socket-closed':
          alert("Socket was closed");
          break;
      case 'unavailable-id':
          alert("This id was taken");
          break;
      case 'webrtc':
          alert("RTC internal error occurred");
          break;
    }
  }



  onStartRTC(remoteUsr){

    //TODO: add validation

    if (!(util.supports.data && util.supports.audioVideo)) {
      alert("support webrtc!")
      return;
    }

    console.log("starting remote connection");
    this.peerService.connectToRemotePeer(remoteUsr);
    //connect to remoteUsr
    this.router.navigate(['remote-control/control-panel', remoteUsr]);
  }

  onOpen() {
    throw new Error('Method not implemented.');
  }
  onClosed() {
    throw new Error('Method not implemented.');
  }
  onError(errMsg: String) {
    throw new Error('Method not implemented.');
  }

  onDisconnect(errMsg? : any){
    if(errMsg) alert(errMsg);
    this.peerService.destroyLocalPeer();
    this.router.navigate(['/login']);
  }


  ngOnDestroy(){
    console.log("Remote control component destroyed");
    this.peerService.destroyLocalPeer();
  }


}