import { FormControl } from "@angular/forms";

export interface CommentValidation{
    name: FormControl<string>;
    email: FormControl<string>;
    message: FormControl<string>;
}