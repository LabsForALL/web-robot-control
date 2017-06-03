import { Component, OnInit, OnDestroy } from '@angular/core';

// App component just holds the router outlet
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor () { }

  ngOnInit() {
    // checking browser support for webrtc
    console.log('app loaded');
  }

  ngOnDestroy() {
    console.log('app comp destroyed');
  }

}
