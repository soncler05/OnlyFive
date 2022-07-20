import { FormGroup } from "@angular/forms";
import { ComponentHelper } from "./component-helper";

export abstract class FormHelper extends ComponentHelper {
    form: FormGroup;
    get Name() { return this.form.get('name'); }

    

  get f() { return this.form.controls; }

  abstract initForm();

  getEntity(): any {
    const entity = Object.assign({}, this.form.value);
    return entity;
  }
}
