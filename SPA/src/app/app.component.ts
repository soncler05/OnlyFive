import { OnInit } from '@angular/core';
import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'OnlyFive';

  /**
   *
   */
  constructor(public router: Router, private authService: AuthService, ) {
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  

}
