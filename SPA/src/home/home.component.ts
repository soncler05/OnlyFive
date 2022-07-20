import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/Services/http/game.service';
import { Helper } from 'src/tools/Helper';
import { Game, GameRoundsEnum } from 'src/Types/Game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  gameTypes = GameRoundsEnum; 
  constructor(private elementRef: ElementRef, private gameServ: GameService, private router:Router) {}
  ngAfterViewInit() {
      this.elementRef.nativeElement.ownerDocument
          .body.style.backgroundImage = "url('/assets/img/bcg40.jpg')";
  }
  
  ngOnInit() {
  }

  playByMySelf(type: GameRoundsEnum){
    const urlId = Helper.generateUID();
    const game:Game = {
      urlId: urlId,
      startDate: new Date(),
      hostDevice: "", //TODO GetDeviceId
      guestDevice: "",
      hostId: Helper.AUTOMATIC_PLAYER.playerId,
      guestId: Helper.DEFAULT_PLAYER.playerId,
      gameRound: type,
      hostScore: 0,
      guestScore: 0,
    } as Game;
    this.gameServ.create(game).subscribe(resp => {
      game.host = Helper.AUTOMATIC_PLAYER;
      game.guest = Helper.DEFAULT_PLAYER;
      this.openGame(urlId, game);
    });
  }

  private openGame(urlId: string, game: Game){ 
    this.router.navigate([`/game/${urlId}`], {state: game})
  }

}
