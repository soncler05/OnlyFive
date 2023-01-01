import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ComponentHelper } from 'src/helpers/component-helper';  
import { AppTranslationService } from 'src/Services/app-translation.service';
import { ConfigurationService } from 'src/Services/configuration.service';
import { GameManagerService } from 'src/Services/game-manager.service';
import { LocalStoreManager } from 'src/Services/local-store-manager.service';
import { SignalrService } from 'src/Services/signalr-service';
import { Helper } from 'src/tools/Helper';
import { Pin } from 'src/tools/pin';
import { HubCallback, HubDataTypeEnum, HubNewGuest, HubNewUserName, UserTypeEnum } from 'src/Types/Hub';

@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrls: ['./home-game.component.css']
})
export class HomeGameComponent extends ComponentHelper implements OnInit,AfterViewInit, OnDestroy {
  isUp = true;
  isStarted = false;
  @ViewChild('loadingModal') private loadingModal: TemplateRef<any>;
  
  public guestObs: ReplaySubject<HubNewGuest> = new ReplaySubject<HubNewGuest>();
  
  constructor(private activatedRoute:ActivatedRoute, private router: Router, private gameManagerServ: GameManagerService, appTranslationServ: AppTranslationService, 
    private localStorage: LocalStoreManager, private modalService: BsModalService, private signalServ: SignalrService, private configurations: ConfigurationService) {
      super();
      const game = gameManagerServ.game;

    if(!this.gameManagerServ.isOneDevice)
      console.log("Open the channel!!!");
    navigator.clipboard.writeText("router.getCurrentNavigation().extractedUrl").then(() => console.log("Copied")).catch((error) => console.warn("not copied, ", error));
  }
  
  toggleArrow(): void {
    this.isUp = !this.isUp;
  } 

  get currentUserId(){
    if(this.gameManagerServ.game.host.deviceId === this.configurations.deviceId)
      return this.gameManagerServ.game.host.playerId;
      else return this.gameManagerServ.game.guest ? this.gameManagerServ.game.guest.playerId : Helper.DEFAULT_GUEST_PLAYER.playerId;
  }

  ngOnInit() { }
  ngAfterViewInit(): void {
    const urlId = this.activatedRoute.snapshot.paramMap.get("urlId");
    
    if (this.gameManagerServ.isOneDevice) {  
      this.gameManagerServ.start();
    } else {
      this.signalServ.listenRoom(urlId, this.currentUserId, this.configurations.deviceId, this.configurations.userName, this.hubCallbacks);
      
      if (!this.gameManagerServ.game.guest) {

        this.openLoadingModal();
        this.guestObs.pipe(takeUntil(this.unsubscribe$), take(1)).subscribe((data) => {
          // if(this.currentUserId != data.playerId) {
            const additionalData = Helper.PLAYERS.find(p => p.playerId === data.playerId);
            this.gameManagerServ.game.guest = additionalData;
            this.gameManagerServ.game.guest.name = data.userName;
            this.gameManagerServ.game.guestName = data.userName;
            this.gameManagerServ.game.guest.deviceId = data.deviceId;
            this.gameManagerServ.game.guestId = data.playerId;
            this.gameManagerServ.game.guestDevice = data.deviceId;
          //   console.log('home-game ---->',this.gameManagerServ.game)
          // }
          this.gameManagerServ.start();
          this.closeLoadingModal();
    
        })
      } 
      else {
        this.gameManagerServ.start();
      }
    }

  }

  private callBackLog(data){
    console.log(data);
  }

  private processNewGuest(data: HubNewGuest){
    this.guestObs.next(data);   
    this.guestObs.complete();  
  }
  private processhubNewUserName(data: HubNewUserName){
    if(data.playerType === UserTypeEnum.Host && this.configurations.deviceId != this.gameManagerServ.game.hostDevice) {
      this.gameManagerServ.game.hostName = data.userName;
    }    
    
    if(data.playerType === UserTypeEnum.Guest && this.configurations.deviceId != this.gameManagerServ.game.guestDevice) {
      this.gameManagerServ.game.guestName = data.userName;
    }    
  }
  private processhubNewPin(data: Pin){
    const player = this.gameManagerServ.PLAYERS.find(p => p.playerId === data.playerId);
    if(player.deviceId != this.configurations.deviceId)
      this.gameManagerServ.ground.play(data);
       
  }

  private hubCallbacks: HubCallback[] =
  [
    {type: HubDataTypeEnum.Guest, callback: this.processNewGuest.bind(this)},
    {type: HubDataTypeEnum.Host, callback: this.callBackLog},
    {type: HubDataTypeEnum.NewUserName, callback: this.processhubNewUserName.bind(this)},
    {type: HubDataTypeEnum.Pin, callback: this.processhubNewPin.bind(this)},
    {type: HubDataTypeEnum.Ping, callback: this.callBackLog}
  ];


  @HostListener('window:scroll', ['$event'])
  noScroll(event) {
      window.scrollTo(0, 0);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.gameManagerServ.ground.onResize();
  }

  bsModalRef?: BsModalRef;
  private openLoadingModal() {
    this.bsModalRef = this.modalService.show(this.loadingModal,{ignoreBackdropClick: true});
  }
  public closeLoadingModal() {
    this.bsModalRef.hide();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.gameManagerServ.isStarted = false;
  }
}
