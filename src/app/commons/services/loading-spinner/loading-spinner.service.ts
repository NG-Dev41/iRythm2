import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {
  public isLoading: Subject<boolean> = new BehaviorSubject(false);
  public message: Subject<string> = new BehaviorSubject('');

  constructor() { }

  /**
   * This function sets the isloading to true and set message using the BehaviourSubject.
   * @param message 
   */
  show(message: string = ''): void {
    this.message.next(message);
    this.isLoading.next(true);
  }

  /**
   * This function sets the isloading to false and set message to '' using the BehaviourSubject.
   */
  hide(): void {
    this.message.next('');
    this.isLoading.next(false);
  }
}
