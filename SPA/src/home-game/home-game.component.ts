import { Component, OnInit } from '@angular/core';
import { GroundClass } from 'src/tools/GroundClass';
import { Helper } from 'src/tools/player';

@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrls: ['./home-game.component.css']
})
export class HomeGameComponent implements OnInit {

  constructor() { }
  ground: GroundClass;
  

  ngOnInit() {
    let autoPlayer = Helper.AUTOMATICPLAYER;
    autoPlayer.currentTurn = true;
    this.ground = new GroundClass(
      {
        userName: 'soncler05',
        color: Helper.COLORS[1],
        currentTurn: false,
        name: 'CCVV',
        playerId: Helper.uuidv4(),
        device: ''
      }, autoPlayer
    )
  }

}
