import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { PeerService } from '../services/peer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPeerServiceListener} from '../services/peer-service.interfaces';
declare var util: any;

@Component({
  selector: 'app-remote-control',
  templateUrl: './remote-control.component.html',
  styleUrls: ['./remote-control.component.scss'],
})
export class RemoteControlComponent implements OnInit, OnDestroy, IPeerServiceListener {

  isLoading = true;
  username: any = '';
  keepServiceConnected = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peerService: PeerService
  ) { }


  ngOnInit() {

    this.peerService.setServiceListener(this);

    if (this.peerService.isDisconnected()) {
      // Basically taking the username from the route params and trying to connect
      const usrname = this.route.snapshot.params['usrname'];
      // connecting and setting up the observer
      this.peerService.tryToConnect(usrname);
      console.log('Remote control component created');
    } else {
      this.isLoading = false;
      this.username = this.peerService.getLocalUsername();
      console.log('Remote control component recreated');
    }

  }


  onPeerServiceOpen(regname) {
    // Showing the connection panel
    this.isLoading = false;
    this.username = regname;
    console.log('Registration completed');
  }


  onPeerServiceDisconnected() {
    console.log('peer service disconnected');
  }


  onPeerServiceClosed() {
    console.log('peer service closed (unable to reconnect)');
  }


  onPeerServiceError(errMsg: String) {
    /*Almost all errors are critical so we have
    to clean and back to the login component */
    if (errMsg.length > 0) { alert(errMsg); }
    this.router.navigate(['/login']);
  }


  onDisconnect() {
    this.router.navigate(['/login']);
  }


  onStartRTC(remoteUsr) {

    // TODO: add validation
    if (!(util.supports.data && util.supports.audioVideo)) {
      alert('support webrtc!');
      return;
    }

    console.log('starting remote connection');
    this.keepServiceConnected = true;
    this.router.navigate(['remote-control/control-panel', remoteUsr]);
  }


  ngOnDestroy() {
    if (this.keepServiceConnected) {
      // only remove the service observer
      console.log('Remote control component destroyed with keeping the connection');
    }else {
      // closes the connection and removes the observer
      this.peerService.terminate();
      console.log('Remote control component destroyed wothout keeping the connection');
    }
    this.peerService.removeServiceListener();
  }

}
