import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccountModeEnum } from 'src/helpers/account/account-mode-enum.enum';
import { AlertService, DialogType, MessageSeverity } from 'src/Services/alert.service';
import { AppTranslationService } from 'src/Services/app-translation.service';
import { GameManagerService } from 'src/Services/game-manager.service';
import { LocalStoreManager } from 'src/Services/local-store-manager.service';
import { Helper } from 'src/tools/Helper';
import { Player } from 'src/tools/player';
import { Game } from 'src/Types/Game';
import { DBkeys } from 'src/Utilities/db-keys';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input() isUp = true;
  constructor(private modalService: BsModalService,  public gameManagerServ: GameManagerService, private alertService: AlertService, 
    appTranslationServ: AppTranslationService, private localStorage: LocalStoreManager) { }

  accountModes = AccountModeEnum;
  
  modalRef: BsModalRef;
  
  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  public get hostScore() : number {
    return this.gameManagerServ.game ? this.gameManagerServ.game.hostScore : 0;
  }
  
  public get guestScore() : number {
    return this.gameManagerServ.game ? this.gameManagerServ.game.guestScore : 0;
  }
  
  public get host() : Player {
    return this.gameManagerServ.game ? this.gameManagerServ.game.host : null;
  }
  
  public get guest() : Player {
    return this.gameManagerServ.game ? this.gameManagerServ.game.guest : null;
  }
  
  public get game() : Game {
    return this.gameManagerServ.game;
  }
   
  public editUserName(){
    this.alertService.showDialog("Editar", DialogType.prompt, (val =>  {
      this.localStorage.savePermanentData(val, DBkeys.CURRENT_USER);
      Helper.DEFAULT_PLAYER.userName = val;
      this.game.guest.userName = val;
      this.alertService.showStickyMessage(val, "", MessageSeverity.info);
    }));
  }

}
