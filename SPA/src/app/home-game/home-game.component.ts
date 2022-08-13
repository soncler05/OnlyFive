import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTranslationService } from 'src/Services/app-translation.service';
import { GameManagerService } from 'src/Services/game-manager.service';
import { GroundClass } from 'src/tools/GroundClass';
import { Helper } from "src/tools/Helper";
import { Game } from 'src/Types/Game';

@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrls: ['./home-game.component.css']
})
export class HomeGameComponent implements OnInit,AfterViewInit {
  isUp = true;
  game: Game;
  ground: GroundClass;
  constructor(private activatedRoute:ActivatedRoute, private router: Router, private gameManagerServ: GameManagerService, appTranslationServ: AppTranslationService) {
    this.game = gameManagerServ.game;
    
  }
  

  toggleArrow(): void {
    this.isUp = !this.isUp;
  } 


  ngOnInit() { }
  ngAfterViewInit(): void {
    const urlId = this.activatedRoute.snapshot.paramMap.get("urlId");
    this.gameManagerServ.start(urlId, this.game);
  }
  
  @HostListener('window:scroll', ['$event'])
  noScroll(event) {
      window.scrollTo(0, 0);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
     this.ground.onResize();
  }

  
}
