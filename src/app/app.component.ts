import { Component, OnInit } from '@angular/core';

declare var util : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  ngOnInit(){
    
    if (util.supports.data && util.supports.audioVideo) {
      console.log("browser is ok");
    }
  }
}
