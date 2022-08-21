import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { takeUntil } from 'rxjs/operators';
import { AccountModeEnum } from 'src/helpers/account/account-mode-enum.enum';
import { FormHelper } from 'src/helpers/form-helper';
import { AlertService, DialogType, MessageSeverity } from 'src/Services/alert.service';
import { AuthService } from 'src/Services/auth.service';
import { ConfigurationService } from 'src/Services/configuration.service';
import { UserLogin } from 'src/Types/UserLogin';
import { Utilities } from 'src/Utilities/Utilities';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends FormHelper implements OnInit {

  userLogin = new UserLogin();
  isLoading = false;
  formResetToggle = true;
  modalClosedCallback: () => void;
  loginStatusSubscription: any;
  accountModeEnum = AccountModeEnum;

  @Input()
  isModal = false;

  @Output() 
  changeMode = new EventEmitter<AccountModeEnum>(); 

  constructor(private alertService: AlertService,
     private authService: AuthService, 
     private socialAuthService: SocialAuthService,
     private fb: UntypedFormBuilder,
     private httpClient: HttpClient,
     private configurations: ConfigurationService) {
       super();
       
  }


  ngOnInit() {

    this.userLogin.rememberMe = this.authService.rememberMe;
    this.initForm();

    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
    } else {
      this.loginStatusSubscription = this.authService.getLoginStatusEvent().pipe(takeUntil(this.unsubscribe$)).subscribe(isLoggedIn => {
        if (this.getShouldRedirect()) {
          this.authService.redirectLoginUser();
        }
      });
    }
  }

  leaveMode(mode: AccountModeEnum){
    this.changeMode.emit(mode);
  }

  initForm() {
    this.form = this.fb.group({
      userName: this.fb.control('', [Validators.minLength(3), Validators.required]),
      password: this.fb.control('',  [Validators.minLength(3), Validators.required]),
      rememberMe: this.fb.control(this.userLogin.rememberMe,  [Validators.minLength(3), Validators.required]),
      // value: this.fb.control('', [Validators.required, Validators.pattern(NUMBERS_PATTERN)]),
    });
  }

  
  getShouldRedirect() {
    return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }


  showErrorAlert(caption: string, message: string) {
    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }

  closeModal() {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }

  externalLogin(providerStr){

    let provider;
    switch (providerStr) {
      case 'google':
        provider = GoogleLoginProvider;
        break;
      case 'facebook':
        provider = FacebookLoginProvider;
        break;
      default:
        break;
    }

    this.socialAuthService.signIn(provider.PROVIDER_ID).then(
      resp => {
        console.log(resp);
        this.authService.loginExternal(providerStr, resp.idToken, "external", true )
        // .subscribe(r => console.log(r), er => console.error(er));
      }
    );
  }

  login() {
    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Attempting login...');

    let formEntity = this.getEntity();
    this.userLogin.userName = formEntity.userName; 
    this.userLogin.password = formEntity.password; 
    this.userLogin.rememberMe = formEntity.rememberMe; 

    this.authService.login(this.userLogin.userName, this.userLogin.password, this.userLogin.rememberMe)
      // .subscribe(
      //   user => {
      //     setTimeout(() => {
      //       this.alertService.stopLoadingMessage();
      //       this.isLoading = false;
      //       this.reset();

      //       if (!this.isModal) {
      //         this.alertService.showMessage('Login', `Welcome ${user.userName}!`, MessageSeverity.success);
      //       } else {
      //         this.alertService.showMessage('Login', `Session for ${user.userName} restored!`, MessageSeverity.success);
      //         setTimeout(() => {
      //           this.alertService.showStickyMessage('Session Restored', 'Please try your last operation again', MessageSeverity.default);
      //         }, 500);

      //         this.closeModal();
      //       }
      //     }, 500);
      //   },
      //   error => {

      //     this.alertService.stopLoadingMessage();

      //     if (Utilities.checkNoNetwork(error)) {
      //       this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
      //       this.offerAlternateHost();
      //     } else {
      //       const errorMessage = Utilities.getHttpResponseMessage(error);

      //       if (errorMessage) {
      //         this.alertService.showStickyMessage('Unable to login', this.mapLoginErrorMessage(errorMessage), MessageSeverity.error, error);
      //       } else {
      //         this.alertService.showStickyMessage('Unable to login', 'An error occured whilst logging in, please try again later.\nError: ' + Utilities.getResponseBody(error), MessageSeverity.error, error);
      //       }
      //     }

      //     setTimeout(() => {
      //       this.isLoading = false;
      //     }, 500);
      //   });
  }


  offerAlternateHost() {

    if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {
      this.alertService.showDialog('Dear Developer!\nIt appears your backend Web API service is not running...\n' +
        'Would you want to temporarily switch to the online Demo API below?(Or specify another)',
        DialogType.prompt,
        (value: string) => {
          this.configurations.baseUrl = value;
          this.configurations.tokenUrl = value;
          this.alertService.showStickyMessage('API Changed!', 'The target Web API has been changed to: ' + value, MessageSeverity.warn);
        },
        null,
        null,
        null,
        this.configurations.fallbackBaseUrl);
    }
  }


  mapLoginErrorMessage(error: string) {

    if (error == 'invalid_username_or_password') {
      return 'Invalid username or password';
    }

    if (error == 'invalid_grant') {
      return 'This account has been disabled';
    }

    return error;
  }


  reset() {
    this.formResetToggle = false;

    setTimeout(() => {
      this.formResetToggle = true;
    });
  }


  a: "hola" | "nia" = "hola";
  b : {
    n: number;
    m: string,
    o:[]
  }


}
