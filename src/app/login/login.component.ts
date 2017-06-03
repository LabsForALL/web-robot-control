import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }


  ngOnInit() {
    console.log('Login component created');
    /*setInterval(() => {
      console.log(this.state);
    }, 1000);*/

  }

  ngOnDestroy() {
    console.log('Login component destroyed');
  }

  onConnect(usrname) {
    // TODO: add some validation checks
    this.router.navigate(['/remote-control', usrname]);
  }

}
