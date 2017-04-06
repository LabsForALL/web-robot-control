import { Component, OnInit, OnDestroy } from '@angular/core';
import { PeerService } from '../services/peer.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var util : any;

@Component({
  selector: 'app-remote-control',
  templateUrl: './remote-control.component.html',
  styleUrls: ['./remote-control.component.scss'],
  providers: [PeerService]
})
export class RemoteControlComponent implements OnInit, OnDestroy {
  private isLoading: boolean = true;
  private connection : any = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peerService : PeerService,
  ) { }


  ngOnInit() {

    console.log("Remote control component created");

    //Basically taking the username from the route params and trying to connect
    let usrname = this.route.snapshot.params['usrname'];

    this.peerService.tryToConnect(
      usrname,
      (conn)=>{
        //The service returns the connction witch we have to subscribe for events
        this.subscribeToConnection(conn);
      },
      (errMsg)=>{
        //Ooops ... back to the login page
        this.onDisconnect(errMsg);
      }
    );

  }


  subscribeToConnection(conn){

    this.connection = conn;

    this.connection.on('open',
      (regName) =>{
        //Showing the connection panel
        this.isLoading = false;
        //TODO
        // Ready to connect to remote users ....
        console.log("registration ready " + regName);
      }
    )

    this.connection.on('disconnected',
      () =>{
        // Peer can reconnect to server and establish connections
        console.log("peer was disconnected");
      }
    )

    this.connection.on('close',
      () =>{
        // Peer is destroyed and can't connect anymore
        console.log("peer was closed");
      }
    )

    this.connection.on('error',
      (err) =>{
        // most of the errors are fatal
        this.onDisconnect(err.type);
        
        switch (err.type) {
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
    )

  }

  onDataConnection(){
    if (util.supports.data && util.supports.audioVideo) {

    }
  }

  ngOnDestroy(){
     console.log("Remote control component destroyed");
  }


  onDisconnect(errMsg? : any){
    if(errMsg) alert(errMsg);
    if(this.connection){
      this.connection.disconnect();
      this.connection.destroy();
    } 
    this.router.navigate(['/login']);
  }

}