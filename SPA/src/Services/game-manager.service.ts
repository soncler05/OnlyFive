import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { nextTick } from 'process';
import { Observable, Subject } from 'rxjs';
import { first, single, take } from 'rxjs/operators';
import { GameResultComponent } from 'src/app/game-result/game-result.component';
import { GroundClass } from 'src/tools/GroundClass';
import { Helper } from 'src/tools/Helper';
import { Player } from 'src/tools/player';
import { Game, GameRoundsEnum } from 'src/Types/Game';
import { GameService } from './http/game.service';

@Injectable({
  providedIn: 'root'
})
export class  GameManagerService {
ground: GroundClass;
game: Game;
host: Player;
guest: Player;
bsModalRef?: BsModalRef;
actualUser = Helper.DEFAULT_PLAYER;
constructor(private gameServ: GameService, private modalService: BsModalService) {}

start(gameId: string, game?: Game): Subject<void> {

  var obs = new Subject<void>();
  
  if(game) {
    this.game = game;
    action(game, this.next.bind(this));
  } else {
    this.gameServ.findByUrlId(gameId).subscribe(g => {
      this.game = g
      action(game, this.next.bind(this));
    });

  }

  return obs;
  function action(game: Game, callback: any) {
    
    obs.next();
    obs.complete();
    callback();
  }
}

next(winner = null){
  
  if(winner) this.setScore(winner);
  
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
  else this.openModalWithComponent(); //alert("Se acabó!")

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