import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { CommentComponent } from 'src/app/home-game/comment/comment.component';
import { ComponentHelper } from 'src/helpers/component-helper';
import { AlertService } from 'src/Services/alert.service';
import { AppTranslationService } from 'src/Services/app-translation.service';
import { ConfigurationService } from 'src/Services/configuration.service';
import { CommentService } from 'src/Services/http/comment.service';
import { GameService } from 'src/Services/http/game.service';
import { Helper } from 'src/tools/Helper';
import { Comment } from 'src/Types/comment';
import { Game, GameRoundsEnum } from 'src/Types/Game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends ComponentHelper implements OnInit, AfterViewInit {

  public currentLanguage = "";
  public deviceId = "";
  gameTypes = GameRoundsEnum; 
  public isReload = false;
  commentModalRef?: BsModalRef<CommentComponent>;

  constructor(public configurations: ConfigurationService, private elementRef: ElementRef, private gameServ: GameService, private router:Router, 
    private appTranslationServ: AppTranslationService, private alertService: AlertService, private modalService: BsModalService,
    private commentServ: CommentService, private translateServ: AppTranslationService) {   
      super();
  }
  ngAfterViewInit() {
      this.elementRef.nativeElement.ownerDocument
          .body.style.backgroundImage = "url('/assets/img/bcg40.jpg')";
  }
  
  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.isReload = state ? true : false;
    this.currentLanguage = this.configurations.language;
    this.deviceId = this.configurations.deviceId;
    
  }

  playByMySelf(type: GameRoundsEnum){
    this.play(true, type)
    
  }
  playWithAFriend(type: GameRoundsEnum){
    this.play(false, type)
  }
  playWithARandomPlayer(){
    this.alertService.showDialog(this.appTranslationServ.getTranslation("home.NotImplemented"));
  }
  private play(isOnePlayer: boolean, type: GameRoundsEnum): void{
    const urlId = Helper.generateUID();
    const host =  isOnePlayer ?  Helper.AUTOMATIC_PLAYER : Helper.DEFAULT_PLAYER;
    const guest = isOnePlayer ? Helper.DEFAULT_PLAYER : null;
    const guestName = isOnePlayer ? this.configurations.userName : null;
    const hostName = isOnePlayer ? Helper.AUTOMATIC_PLAYER.userName : this.configurations.userName;
    const game:Game = {
      urlId: urlId,
      startDate: new Date(),
      hostDevice: this.deviceId,
      guestDevice: isOnePlayer ? this.deviceId : null,
      hostId: host.playerId,
      guestId: guest?.playerId,
      hostName: hostName,
      guestName: guestName,
      gameRound: type,
      hostScore: 0,
      guestScore: 0,
    } as Game
    this.gameServ.create(game).subscribe(resp => {
      game.host = Helper.completePlayerInfo(game.host);
      game.guest = Helper.completePlayerInfo(game.guest);
      this.openGame(urlId, game);
    });
  }
  private openGame(urlId: string, game: Game){ 
    this.router.navigate([`/game/${urlId}`], {state: game})
  }
  
  setLanguage(value){
    this.currentLanguage = value;
    this.configurations.language = value;
  }

  private SendComment(comment: Comment) {
    this.commentServ.send(comment).pipe(takeUntil(this.unsubscribe$)).subscribe(() => 
    this.alertService.showMessage(this.translateServ.getTranslation('game.comment.Thanks')));
  }

  openCommentModal(){
    this.commentModalRef = this.modalService.show(CommentComponent, {initialState: {
        send: this.SendComment.bind(this)
      }});
  }
}
