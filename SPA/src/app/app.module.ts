import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeGameComponent } from 'src/app/home-game/home-game.component';
import { HomeComponent } from 'src/home/home.component';
import { AuthenticationComponent } from 'src/app/authentication/authentication.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppTranslationService, TranslateLanguageLoader } from 'src/Services/app-translation.service';
// import { AuthConfig, OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthStorage } from 'src/Services/auth.storage';
import { AlertService } from 'src/Services/alert.service';
import { ConfigurationService } from 'src/Services/configuration.service';
import { LocalStoreManager } from 'src/Services/local-store-manager.service';
import { AppErrorHandler } from 'src/app-error';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthService } from 'src/Services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SocialLoginModule, SocialAuthServiceConfig } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { AccountComponent } from './account/account/account.component';
import { SignInComponent } from './account/sign-in/sign-in.component';
import { SignUpComponent } from './account/sign-up/sign-up.component';
import { ResetPwdComponent } from './account/reset-pwd/reset-pwd.component';
import { ChangePwdComponent } from './account/change-pwd/change-pwd.component';
import { NavComponent } from './nav/nav.component';
import { GameConfigComponent } from './game-config/game-config.component';
import { GameResultComponent } from './game-result/game-result.component';
import { GameGuard } from 'src/security/game-guard';
import { GeneralModalComponent } from './general-modal/general-modal.component';
import { ToastaModule } from 'ngx-toasta';


const GUARDS = [GameGuard];
@NgModule({
  declarations: [								
    AppComponent,
      HomeGameComponent,
      HomeComponent,
      AuthenticationComponent,
      AccountComponent,
      SignInComponent,
      SignUpComponent,
      ResetPwdComponent,
      ChangePwdComponent,
      NavComponent,
      GameConfigComponent,
      GameResultComponent,
      GeneralModalComponent
   ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ToastaModule.forRoot(),
    // OAuthModule.forRoot({
    //   resourceServer:{
    //     allowedUrls: [environment.tokenUrl],
    //     sendAccessToken: true
    //   }
    // }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader
      }
    }),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    SocialLoginModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    // { provide: OAuthStorage, useClass: AuthStorage },
    { provide: BsDropdownConfig, useValue: { autoClose: true } },
    AlertService,
    // ThemeManager,
    ConfigurationService,
    // AppTitleService,
    AppTranslationService,
    AlertService,
    // NotificationService,
    // NotificationEndpoint,
    // AccountService,
    // AccountEndpoint,
    LocalStoreManager,
    AuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.openIdConnect.google.clientId
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              environment.openIdConnect.facebook.clientId
            )
          }
        ],
        onError: onError
      } as SocialAuthServiceConfig,
    },
    ...GUARDS
    
  ],
  bootstrap: [AppComponent],
  entryComponents: [GameResultComponent, GeneralModalComponent]
})
export class AppModule { }

export function onError(error) {
  console.log(error);
}
