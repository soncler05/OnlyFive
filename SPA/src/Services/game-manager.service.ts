import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { nextTick } from 'process';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { first, single, take } from 'rxjs/operators';
import { GameResultComponent } from 'src/app/game-result/game-result.component';
import { GeneralModalComponent } from 'src/app/general-modal/general-modal.component';
import { GroundClass } from 'src/tools/GroundClass';
import { Helper } from 'src/tools/Helper';
import { Player } from 'src/tools/player';
import { Game, GameRoundsEnum, LastRound, Round } from 'src/Types/Game';
import { AlertService, MessageSeverity } from './alert.service';
import { AppTranslationService } from './app-translation.service';
import { GameService } from './http/game.service';
import { RoundService } from './http/round.service';

@Injectable({
  providedIn: 'root'
})
export class  GameManagerService {
ground: GroundClass;
game: Game;
host: Player;
guest: Player;
actualRoundStartDate: Date;
bsModalRef?: BsModalRef;
actualUser = Helper.DEFAULT_PLAYER;
constructor(private gameServ: GameService, private roundServ: RoundService, private router: Router, private modalService: BsModalService,
  private translateServ: AppTranslationService, private alertService: AlertService) {
}

start(gameId: string, game: Game): void {
  this.game = game;
  action(game, this.next.bind(this));

  function action(game: Game, callback: any) {
        callback();
  }
}

next(winner = null){
  const now = new Date();
  if(winner) {
    this.setScore(winner)
    this.gameServ.update(this.game);
    var gamePin = Object.assign({}, this.ground.gamePin);
    // @ts-ignore
    gamePin._canvas = undefined;
    this.roundServ.saveLast({
      round: {
      gameId: this.game.id,
      offset: this.game.lastRoundOffset,
      startDate: this.actualRoundStartDate,
      endDate: now,
      pawnMap: JSON.stringify(gamePin)
    } as Round,
    game: Object.assign({}, this.game)
  }).subscribe();
    // alert(` ${winner.userName} ha completado un cinco!!!` );
    // this.openRoundCompletedModal(winner.userName);
  };
  
  const gameNumber = this.game.hostScore + this.game.guestScore;
  this.host = Helper.AUTOMATIC_PLAYER //this.game.host;
  this.guest = Helper.DEFAULT_PLAYER//this.game.guest;
  if (gameNumber < +this.game.gameRound) {
    this.game.lastRoundOffset++;
    this.host.currentTurn = true;
    this.guest.currentTurn = false;
    if (!this.ground)
      this.ground = new GroundClass(this.host, this.guest, this.next.bind(this), this.openRoundCompletedModal.bind(this));
    else
      this.ground.newGame();
  }
  else {
    this.openModalWithComponent(); //alert("Se acabó!")
    this.game.endDate = now;
    this.gameServ.update(this.game).subscribe();
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
private openRoundCompletedModal(userName: string  ) {
  this.alertService.showMessage(this.translateServ.getTranslation('game.RoundCompletedTitle'), 
    this.translateServ.getTranslation('game.RoundCompletedMsg', {userName: userName}), this.actualUser.userName === userName ? MessageSeverity.success : MessageSeverity.error);
  // const initialState: ModalOptions = {
  //   initialState: {
  //     content: {
  //       title: this.translateServ.getTranslation('game.RoundCompletedTitle'),
  //       msg: this.translateServ.getTranslation('game.RoundCompletedMsg', {userName: userName}),
  //       btnConfirm: {
  //         text: "OK",
  //         // action: () => { 
           
  //         // }
  //       },
  //       canClose: false,
  //     }
      
  //   } as Partial<Object>, ignoreBackdropClick: true
  // };

  // this.bsModalRef = this.modalService.show(GeneralModalComponent, initialState);
}

  init(){
    this.ground = undefined;
    this.game = undefined;
    this.host = undefined;
    this.guest = undefined;
  }
}