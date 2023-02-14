import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormHelper } from 'src/helpers/form-helper';
import { CommentValidation } from './validation';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent extends FormHelper<CommentValidation> implements OnInit {
  send: (comment) => void;
  constructor(private fb:FormBuilder, public bsModalRef: BsModalRef) { 
    super();
  }

  initForm() {
    this.form = this.fb.group(
      {
        name: this.fb.control('', [Validators.minLength(3), Validators.required]),
        email: this.fb.control('',  [Validators.required, Validators.email]),
        message: this.fb.control('', [Validators.minLength(3), Validators.required])
    });
  }

  ngOnInit() {
    this.initForm();
  }

  submit() {
    this.send(this.getEntity());
    this.bsModalRef.hide();
  }
}