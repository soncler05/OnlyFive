import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { first, single, take } from 'rxjs/operators';
import { GameResultComponent } from 'src/app/game-result/game-result.component';
import { GroundClass } from 'src/tools/GroundClass';
import { Pin } from 'src/tools/pin';
import { Player } from 'src/tools/player';
import { CompleteRound, Game, GameRoundsEnum, LastRound, NewPin, Round } from 'src/Types/Game';
import { AlertService, MessageSeverity } from './alert.service';
import { AppTranslationService } from './app-translation.service';
import { ConfigurationService } from './configuration.service';
import { GameService } from './http/game.service';
import { RoundService } from './http/round.service';

@Injectable({
  providedIn: 'root'
})
export class  GameManagerService {
ground: GroundClass;
game: Game;
isStarted: boolean = false;
host: Player;
guest: Player;
actualRoundStartDate: Date;
bsModalRef?: BsModalRef;

public  get actualUser() : Player {
  return this.isOneDevice ? 
    this.game.guest : 
    this.PLAYERS.find(p => p.deviceId === this.configurations.deviceId);
}

public get isOneDevice() : boolean {
  return this.game.hostDevice === this.game.guestDevice;
}

constructor(private gameServ: GameService, private roundServ: RoundService, private router: Router, private modalService: BsModalService,
  private translateServ: AppTranslationService, private alertService: AlertService, public configurations: ConfigurationService) {
}

start(): void {
  this.isStarted = true;
  this.next();
}

next(winner = null){
  const now = new Date();
  if(winner) {
    this.setScore(winner)
    this.gameServ.update(this.game);
    if(this.isOneDevice) {
      var gamePin = Object.assign({}, this.ground.gamePin);
      // @ts-ignore
      gamePin._canvas = undefined;
      this.roundServ.saveLast({
        round: {
            gameId: this.game.id,
            offset: this.game.lastRoundOffset,
            startDate: this.actualRoundStartDate,
            endDate: now,
            pawnMap: JSON.stringify(gamePin.pins)
          } as Round,
        game: Object.assign({}, this.game)
      }).subscribe();
    }
    // alert(` ${winner.userName} ha completado un cinco!!!` );
    // this.openRoundCompletedModal(winner.userName);
  };
  
  const gameNumber = this.game.hostScore + this.game.guestScore;
  this.host = this.game.host;
  this.guest = this.game.guest;
  if (gameNumber < +this.game.gameRound) {
    this.game.lastRoundOffset++;
    this.host.currentTurn = true;
    this.guest.currentTurn = false;
    if (!this.ground)
      this.ground = new GroundClass(this.host, this.guest, this.isOneDevice, this.configurations.deviceId, this.next.bind(this), 
      this.openRoundCompletedModal.bind(this), this.newPin.bind(this), this.onTwoDevicesComplete.bind(this));
    else
      this.ground.newGame();
  }
  else {
    this.openModalWithComponent(); //alert("Se acabó!")
    this.game.endDate = now;
    if(this.isOneDevice) this.gameServ.update(this.game).subscribe();
  }

  this.actualRoundStartDate = now;
}

private setScore(player: Player){
  if(this.host.playerId === player.playerId) return this.game.hostScore++;
  if(this.guest.playerId === player.playerId) this.game.guestScore++;
}

private getWinner(): Player{
  if(this.game.hostScore > this.game.guestScore) return this.host;
  if(this.game.hostScore < this.game.guestScore) return this.guest;
  return null;
}

public  get PLAYERS() : Player[] {
  return [this.game.host, this.game.guest];
}
public  getUserName(playerId: string) : string {
  if(playerId === this.game.host.playerId) return this.game.hostName;
  if(playerId === this.game.guest.playerId) return this.game.guestName;
  return null;
}

openModalWithComponent() {
  const initialState: ModalOptions = {
    initialState: {
      result: {
        game: this.game,
        winner: this.getWinner(),
        actualUser: this.actualUser
      }
      
    } as Partial<Object>, ignoreBackdropClick: true
  };

  this.bsModalRef = this.modalService.show(GameResultComponent, initialState);
  this.bsModalRef.content.closeBtnName = 'Close';
}
private openRoundCompletedModal(playerId: string) {
  const player = this.PLAYERS.find(p => p.playerId === playerId)
  this.alertService.showMessage(this.translateServ.getTranslation('game.RoundCompletedTitle'), 
  this.translateServ.getTranslation('game.RoundCompletedMsg', {userName: this.getUserName(player.playerId)}), this.actualUser.playerId === player.playerId ? MessageSeverity.success : MessageSeverity.error);
}

private newPin(pin: Pin): Observable<Pin> {
  return this.roundServ.newPin({
    gameUrlId: this.game.urlId,
    offset: this.game.lastRoundOffset,
    pin: pin
  } as NewPin);
}
private onTwoDevicesComplete(playerId: string) : void {
  if(this.actualUser.playerId == playerId)
    this.roundServ.complete({
      gameUrlId: this.game.urlId,
      offset: this.game.lastRoundOffset,
      playerId: playerId
    } as CompleteRound).subscribe();
}

  init(){
    this.ground = undefined;
    this.game = undefined;
    this.host = undefined;
    this.guest = undefined;
  }
}
