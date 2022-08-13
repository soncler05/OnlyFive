import { Component, Input, OnInit } from '@angular/core';
import { AccountModeEnum } from 'src/helpers/account/account-mode-enum.enum';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountModes = AccountModeEnum;
  
  @Input() mode: AccountModeEnum = AccountModeEnum.signIn;

  constructor() { }

  ngOnInit() {
  }

  onChangeMode(mode: AccountModeEnum){
    this.mode = mode;
  }

}
