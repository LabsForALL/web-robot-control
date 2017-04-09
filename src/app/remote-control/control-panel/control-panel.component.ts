import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PeerService } from '../../services/peer.service';
import { IPeerServiceObserver, IPeerDataConnectionObserver, IPeerMediaConnectionObserver } from '../../services/peer-service.interfaces'

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, OnDestroy,
 IPeerServiceObserver, IPeerDataConnectionObserver, IPeerMediaConnectionObserver {

  remotePeerID: any = "";
  isConnecting: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peerService : PeerService
  ) { }


  ngOnInit() {
    this.remotePeerID = this.route.snapshot.params['remote-id'];
    this.peerService.setServiceObserver(this);
    this.peerService.setDataConnectionObserver(this);
    this.peerService.startDataConnection(this.remotePeerID);
    console.log("connecting to : " + this.remotePeerID);
  }


  /* Peer service callbacks */

  onPeerServiceOpen(regname: String) {
    // the service usually is already open
  }


  onPeerServiceDisconnected() {
    
  }


  onPeerServiceClosed() {
    
  }


  onPeerServiceError(errMsg: String) {
    this.peerService.terminate();
    this.router.navigate(['/login']);
  }


  /* Data connection callbacks */

  onPeerDataConnectionOpen() {
    this.isConnecting=false;
    console.log("data connection started");
  }


  onPeerDataConnectionData(data: any) {
    console.log(data);
  }


  onPeerDataConnectionClose() {
    console.log("data connection was closed");
  }


  onPeerDataConnectionError(err: any) {
    console.log(err);
  }


  /* Media connection callbacks */

  onPeerMediaConnectionOpen(stream: any) {
    
  }


  onPeerMediaConnectionClosed() {
    console.log("media connection was closed");
  }


  onPeerMediaConnectionError(err: any) {
    console.log(err);
  }


  ngOnDestroy(): void { 
    this.peerService.removeServiceObserver();
    this.peerService.removeDataConnectionObserver();
  }

}
