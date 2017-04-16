import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PeerService } from '../../services/peer.service';
import { IPeerServiceListener, IPeerDataConnectionListener,
  IPeerMediaConnectionListener } from '../../services/peer-service.interfaces';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, OnDestroy,
 IPeerServiceListener, IPeerDataConnectionListener, IPeerMediaConnectionListener {

  remotePeerID: any = '';
  isConnecting: boolean;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peerService: PeerService
  ) { }


  ngOnInit() {
    // taking the peer id
    this.remotePeerID = this.route.snapshot.params['remote-id'];

    // setting up the listeners
    this.peerService.setServiceListener(this);
    this.peerService.setDataConnectionListener(this);
    this.peerService.setMediaConnectionListener(this);

    // starting connections
    this.peerService.startDataConnection(this.remotePeerID);
    this.peerService.startMediaConnection(this.remotePeerID);

    console.log('connecting to : ' + this.remotePeerID);
  }


  /** Peer service callbacks */

  onPeerServiceOpen(regName: String) {
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


  /** Data connection callbacks */

  onPeerDataConnectionOpen() {
    this.isConnecting = false;
    console.log('data connection started');
  }


  onPeerDataConnectionData(data: any) {
    console.log(data);
  }


  onPeerDataConnectionClose() {
    console.log('data connection was closed');
  }


  onPeerDataConnectionError(err: any) {
    console.log(err);
  }


  /** Media connection callbacks */

  onPeerMediaConnectionOpen(stream: any) {

  }


  onPeerMediaConnectionClosed() {
    console.log('media connection was closed');
  }


  onPeerMediaConnectionError(err: any) {
    console.log(err);
  }


  ngOnDestroy(): void {
    this.peerService.removeServiceListener();
    this.peerService.removeDataConnectionListener();
    this.peerService.removeMediaConnectionListener();
  }

}
