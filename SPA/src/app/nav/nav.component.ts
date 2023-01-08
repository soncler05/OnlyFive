import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { AccountModeEnum } from 'src/helpers/account/account-mode-enum.enum';
import { ComponentHelper } from 'src/helpers/component-helper';
import { AlertService, DialogType, MessageSeverity } from 'src/Services/alert.service';
import { AppTranslationService } from 'src/Services/app-translation.service';
import { ConfigurationService } from 'src/Services/configuration.service';
import { GameManagerService } from 'src/Services/game-manager.service';
import { GameService } from 'src/Services/http/game.service';
import { LocalStoreManager } from 'src/Services/local-store-manager.service';
import { SignalrService } from 'src/Services/signalr-service';
import { Player } from 'src/tools/player';
import { Game } from 'src/Types/Game';
import { UserTypeEnum } from 'src/Types/Hub';
import { DBkeys } from 'src/Utilities/db-keys';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent extends ComponentHelper implements OnInit {
  @Input() isUp = true;
  constructor(private modalService: BsModalService,  public gameManagerServ: GameManagerService, private alertService: AlertService, private router: Router, 
    private appTranslationServ: AppTranslationService, private localStorage: LocalStoreManager, private gameServ: GameService, private config: ConfigurationService,
    private signalServ: SignalrService, private alertServ: AlertService) {
      super();
      this.deviceId = config.deviceId;
      this.isOneDevice = gameManagerServ.isOneDevice;
    }

  accountModes = AccountModeEnum;
  deviceId: string;
  isOneDevice: boolean;
  isConnectedToHub: boolean;
  modalRef: BsModalRef;
  
  public get isStarted() : boolean {
    return this.gameManagerServ.isStarted;
  }
  
  ngOnInit() {
    if(!this.gameManagerServ.isOneDevice) {
      this.signalServ.connectionObs.pipe(takeUntil(this.unsubscribe$)).subscribe((isConnected) => {
        this.isConnectedToHub = isConnected;
        if(!this.isConnectedToHub) {
          this.alertServ.showMessage(this.appTranslationServ.getTranslation("hub.Disconnected"), "", MessageSeverity.warn);
        }
      });
    }
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
   
  public editUserName(playerId: string){
    const maxLength = 20;
    const minLength = 3;
    this.alertService.showDialog("Editar", DialogType.prompt, (val =>  {
      val = val.trim();
      if(val.length >= minLength && val.length <= maxLength){
        this.localStorage.savePermanentData(val, DBkeys.CURRENT_USER);
        let playerType;
        if(playerId === this.game.host.playerId) {
          this.game.hostName = val;
          playerType = UserTypeEnum.Host
        } else {
          this.game.guestName = val;
          playerType = UserTypeEnum.Guest;
        }
        this.gameServ.newUserName(this.gameManagerServ.game.urlId, val, playerType).pipe(takeUntil(this.unsubscribe$)).subscribe(
          () => {
            this.alertService.showMessage(val, "", MessageSeverity.success);
          });
      } else{
        this.alertService.showMessage("Error", "", MessageSeverity.error);

      }
    }));
  }

  reload() {

    const currentRoute = this.router.url;

    this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
        this.router.navigate([currentRoute], {state : {isReload: true}});
    }); 
}

}
