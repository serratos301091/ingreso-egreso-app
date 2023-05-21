import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidbar',
  templateUrl: './sidbar.component.html',
  styles: [
  ]
})
export class SidbarComponent implements OnInit {

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    this.authservice.logout().then( ()=>{
      this.router.navigate(['/login'])
    });
  }

}
