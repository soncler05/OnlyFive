import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Player } from 'src/tools/player';
import { Game } from 'src/Types/Game';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.css']
})
export class GameResultComponent implements OnInit {

result?: {
  game: Game,
  winner: Player,
  actualUser: Player
}

  constructor(public bsModalRef: BsModalRef, private router: Router) { }

  ngOnInit() {
  }

  backHome(){
    this.router.navigate(['/']);
  }
}
