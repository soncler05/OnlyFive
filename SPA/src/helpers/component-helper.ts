import { OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

export abstract class ComponentHelper implements OnDestroy {
    protected readonly unsubscribe$ = new Subject<void>();
    protected readonly hello = 'HelloOOO!!!';

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
