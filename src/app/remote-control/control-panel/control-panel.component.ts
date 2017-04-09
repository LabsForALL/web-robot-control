import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PeerService } from '../../services/peer.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peerService : PeerService
  ) { }

  ngOnInit() {
    let remoteID = this.route.snapshot.params['remote-id'];
    console.log("connecting to : " + remoteID);



  }






}
