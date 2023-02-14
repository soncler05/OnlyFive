import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AlertService, DialogType } from "src/Services/alert.service";
import { AppTranslationService } from "src/Services/app-translation.service";
import { GameManagerService } from "src/Services/game-manager.service";
import { GameService } from "src/Services/http/game.service";
import { Helper } from "src/tools/Helper";
import { Game } from "src/Types/Game";

@Injectable()
export class GameGuard implements CanActivate {
    game: Game;
    
    public get ended() : boolean {
        return this.game.endDate ? true : false; 
    }
    
    constructor(private gameServ: GameService, private gameManagerServ: GameManagerService, private router: Router, private appTranslationServ: AppTranslationService,
        private alertService: AlertService) {
       
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.gameManagerServ.init();
        const urlId = route.params.urlId;
        return this.gameServ.findByUrlId(urlId).pipe(map(result => {
            this.game = result;

            if(!this.game) {
                this.router.navigate(['/']); 
                return false;
            }

            if(this.game.host) {
                this.game.host.deviceId = this.game.hostDevice;
                this.game.host = Helper.completePlayerInfo(this.game.host);
            } 
            if(this.game.guest) {
                this.game.guest.deviceId = this.game.guestDevice;
                this.game.guest = Helper.completePlayerInfo(this.game.guest);
            } 

            this.gameManagerServ.game = this.game;
            
            
            return this.endedAction();
        }));
        
    }
    private endedAction(): boolean{
        if(!this.ended){
            return true;
        } else {
            this.alertService.showDialog(this.appTranslationServ.getTranslation("game.End"), DialogType.alert, () => {
                this.router.navigate(['/']); 
            })
            return false;
        }
    }
}
