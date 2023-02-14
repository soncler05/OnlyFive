import { AbstractControl, FormGroup } from "@angular/forms";
import { ComponentHelper } from "./component-helper";

export abstract class FormHelper<Type extends {
  [K in keyof Type]: AbstractControl<any>;
} = any> extends ComponentHelper {
    form: FormGroup<Type>;
    get Name() { return this.form.get('name'); }

    

  get f() { return this.form.controls; }

  abstract initForm();

  getEntity(): any {
    const entity = Object.assign({}, this.form.value);
    return entity;
  }
}
