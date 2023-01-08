import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

// TODO: Add Angular decorator.
@Injectable()
export abstract class ComponentHelper implements OnDestroy {
    protected readonly unsubscribe$ = new Subject<void>();

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
