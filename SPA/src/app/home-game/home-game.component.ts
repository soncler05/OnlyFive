import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private activatedRoute:ActivatedRoute, private router: Router, private gameManagerServ: GameManagerService) { 
    gameManagerServ.init();
    var nav = this.router.getCurrentNavigation(); 
    if(nav && nav.extras && nav.extras.state)
      this.game = nav.extras.state as Game;
  }
  

  toggleArrow(): void {
    this.isUp = !this.isUp;
  } 


  ngOnInit() {
    // let autoPlayer = Helper.AUTOMATIC_PLAYER;
    // autoPlayer.currentTurn = true;
    // this.ground = new GroundClass(
    //   // {
    //   //   userName: 'soncler05',
    //   //   color: Helper.COLORS[1],
    //   //   currentTurn: false,
    //   //   name: 'CCVV',
    //   //   playerId: Helper.uuidv4(),
    //   //   device: ''
    //   // }, 
    //   autoPlayer,
    //   Helper.DEFAULT_PLAYER
    // )
  }
  ngAfterViewInit(): void {
    const urlId = this.activatedRoute.snapshot.paramMap.get("urlId");
    this.gameManagerServ.start(urlId, this.game).subscribe();
      
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
