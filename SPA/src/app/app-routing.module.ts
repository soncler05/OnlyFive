import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from 'src/app/authentication/authentication.component';
import { HomeGameComponent } from 'src/app/home-game/home-game.component';
import { HomeComponent } from 'src/home/home.component';


const routes: Routes = [
  {path: 'game/:urlId', component: HomeGameComponent, pathMatch: 'full',},
  {path: 'auth', component: AuthenticationComponent},
  // {path: 'Home', component: HomeComponent},
  {path: '', pathMatch: "prefix", component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
