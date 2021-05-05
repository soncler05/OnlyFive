import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeGameComponent } from 'src/home-game/home-game.component';


const routes: Routes = [{path: 'game', component: HomeGameComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
