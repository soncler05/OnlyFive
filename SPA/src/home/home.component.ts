import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, DialogType, MessageSeverity } from 'src/Services/alert.service';
import { AppTranslationService } from 'src/Services/app-translation.service';
import { ConfigurationService } from 'src/Services/configuration.service';
import { GameService } from 'src/Services/http/game.service';
import { Helper } from 'src/tools/Helper';
import { Game, GameRoundsEnum } from 'src/Types/Game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  public currentLanguage = "";
  gameTypes = GameRoundsEnum; 
  constructor(public configurations: ConfigurationService, private elementRef: ElementRef, private gameServ: GameService, private router:Router, 
    private appTranslationServ: AppTranslationService, private alertService: AlertService) {
     
  }
  ngAfterViewInit() {
      this.elementRef.nativeElement.ownerDocument
          .body.style.backgroundImage = "url('/assets/img/bcg40.jpg')";
  }
  
  ngOnInit() {
    this.currentLanguage = this.configurations.language;
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
  playWithAFriend(){
    this.alertService.showDialog(this.appTranslationServ.getTranslation("home.NotImplemented"));
  }
  playWithARandomPlayer(){
    this.alertService.showDialog(this.appTranslationServ.getTranslation("home.NotImplemented"));
  }

  private openGame(urlId: string, game: Game){ 
    this.router.navigate([`/game/${urlId}`], {state: game})
  }

  setLanguage(value){
    this.currentLanguage = value;
    this.configurations.language = value;
  }

}
