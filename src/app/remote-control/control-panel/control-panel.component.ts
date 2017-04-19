import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
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

  Commands = {
    moveForward : 'f',
    moveBackward : 'b',
    stopMove : 's',
    turnLeft : 'l',
    turnRight : 'r'
  };

  // WebRTC states
  isServerConnected: boolean;
  isDataConnected: boolean;
  isMediaConnected: boolean;

  mediaStream: any = undefined;
  remotePeerID: any = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public changeDetector: ChangeDetectorRef,
    private peerService: PeerService
  ) { }


  ngOnInit() {

    // initial states
    this.isServerConnected = true;
    this.isDataConnected = false;
    this.isMediaConnected = false;

    // taking the peer id
    this.remotePeerID = this.route.snapshot.params['remote-id'];

    // setting up the listeners
    this.peerService.setListener(this);

    // starting connections and waiting for callbacks
    this.peerService.startDataConnection(this.remotePeerID);
    this.peerService.startMediaConnection(this.remotePeerID);

    console.log('connecting to : ' + this.remotePeerID);
  }


  /** Buttons callbacks */

  onDisconnect() {
    this.router.navigate(['/login']);
  }


  onCommand(cmd) {
    console.log('sending command' + cmd);
    this.peerService.sendData({
      type : 'COMMAND',
      command : cmd
    });
  }


  /** Peer service callbacks */

  onPeerServiceOpen(regName: String) {
    // the service usually is already open
    this.isServerConnected = true;
    this.changeDetector.detectChanges();
  }


  onPeerServiceDisconnected() {
    this.isServerConnected = false;
    this.router.navigate(['/login']);
  }


  onPeerServiceClosed() {
    this.isServerConnected = false;
    this.router.navigate(['/login']);
  }


  onPeerServiceError(errMsg: String) {
    this.isServerConnected = false;
    this.router.navigate(['/login']);
  }


  /** Data connection callbacks */

  onPeerDataConnectionOpen() {
    this.isDataConnected = true;
    this.changeDetector.detectChanges();
    console.log('data connection started');
  }


  onPeerDataConnectionData(data: any) {

    console.log(data);
  }


  onPeerDataConnectionClose() {
    this.isDataConnected = false;
    this.changeDetector.detectChanges();
    console.log('data connection was closed');
  }


  onPeerDataConnectionError(err: any) {
    this.isDataConnected = false;
    this.changeDetector.detectChanges();
    console.log(err);
  }


  /** Media connection callbacks */

  onPeerMediaConnectionOpen(stream: any) {
    this.isMediaConnected = true;
    this.mediaStream = stream;
    this.changeDetector.detectChanges();
    console.log('media connection was open');
  }


  onPeerMediaConnectionClosed() {
    this.isMediaConnected = false;
    this.changeDetector.detectChanges();
    console.log('media connection was closed');
  }


  onPeerMediaConnectionError(err: any) {
    this.isMediaConnected = false;
    this.changeDetector.detectChanges();
    console.log(err);
  }


  ngOnDestroy(): void {
    this.peerService.terminate();
  }

}
