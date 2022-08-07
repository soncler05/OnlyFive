import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-general-modal',
  templateUrl: './general-modal.component.html',
  styleUrls: ['./general-modal.component.scss']
})
export class GeneralModalComponent implements OnInit {

  content: {
    title: string,
    msg: string,
    btnConfirm: Btn, 
    btnCancel: Btn,
    canClose: boolean
  }
  btn: {}
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  execute(action: () => void){
    if(action) action();
  }

}

class Btn{
  class?: string;
  visible?: boolean;
  text?: string;
  action?: () => void;
}