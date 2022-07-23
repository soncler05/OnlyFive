import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { GameManagerService } from "src/Services/game-manager.service";
import { GameService } from "src/Services/http/game.service";
import { Game } from "src/Types/Game";

@Injectable()
export class GameGuard implements CanActivate {
    game: Game;
    
    public get ended() : boolean {
        return this.game.endDate ? true : false; 
    }
    
    constructor(private gameServ: GameService, private gameManagerServ: GameManagerService, private router: Router) {
       
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.gameManagerServ.init();
        const urlId = route.params.urlId;
        return this.gameServ.findByUrlId(urlId).pipe(map(result => {
            this.game = result;
            this.gameManagerServ.game = this.game;
            return this.endedAction();
        }));
        
    }
    private endedAction(): boolean{
        if(!this.ended){
            return true;
        } else {
            alert("Ya se acabó");
            this.router.navigate(['/']); 
            return false;
        }
    }
}
