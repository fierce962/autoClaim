import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Secrets } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  secrets: Secrets[] = [];

  modal: string = 'claim';

  errorSecrets: Secrets[] = [];

  private next: Subject<boolean> = new Subject();
  private nextAction: Subject<string> = new Subject();

  constructor() { }

  getNext(): Observable<boolean>{
    return this.next;
  };

  setNext(processEnd: boolean): void{
    this.next.next(processEnd);
  };

  getNextAction(): Observable<string>{
    return this.nextAction;
  };

  setNextAction(action: string): void{
    this.nextAction.next(action);
  };
}
