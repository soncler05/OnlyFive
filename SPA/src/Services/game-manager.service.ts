import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { nextTick } from 'process';
import { Observable, Subject } from 'rxjs';
import { first, single, take } from 'rxjs/operators';
import { GameResultComponent } from 'src/app/game-result/game-result.component';
import { GroundClass } from 'src/tools/GroundClass';
import { Helper } from 'src/tools/Helper';
import { Player } from 'src/tools/player';
import { Game, GameRoundsEnum, Round } from 'src/Types/Game';
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
constructor(private gameServ: GameService, private roundServ: RoundService, private router: Router, private modalService: BsModalService) {
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
    this.roundServ.saveLast({
      gameId: this.game.id,
      offset: this.game.hostScore + this.game.guestScore,
      startDate: this.actualRoundStartDate,
      endDate: now,
      pawnMap: JSON.stringify(this.ground.gamePin)
    } as Round).subscribe();
    alert(` ${winner.userName} ha completado un cinco!!!` );
  };
  
  const gameNumber = this.game.hostScore + this.game.guestScore;
  this.host = Helper.AUTOMATIC_PLAYER //this.game.host;
  this.guest = Helper.DEFAULT_PLAYER//this.game.guest;
  if (gameNumber < +this.game.gameRound) {
    this.host.currentTurn = true;
    this.guest.currentTurn = false;
    if (!this.ground)
      this.ground = new GroundClass(this.host, this.guest, this.next.bind(this));
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

init(){
this.ground = undefined;
this.game = undefined;
this.host = undefined;
this.guest = undefined;
}
}