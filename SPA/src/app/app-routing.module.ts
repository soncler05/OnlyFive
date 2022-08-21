import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from 'src/app/authentication/authentication.component';
import { HomeGameComponent } from 'src/app/home-game/home-game.component';
import { HomeComponent } from 'src/home/home.component';
import { GameGuard } from 'src/security/game-guard';


const routes: Routes = [
  {path: 'game/:urlId', component: HomeGameComponent, pathMatch: 'full', canActivate: [GameGuard]},
  {path: 'auth', component: AuthenticationComponent},
  // {path: 'Home', component: HomeComponent},
  {path: '', pathMatch: "prefix", component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
