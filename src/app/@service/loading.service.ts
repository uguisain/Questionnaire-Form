import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading$ = new BehaviorSubject<boolean>(false);


  constructor() { }

  show() {
    this.loading$.next(true);
    setTimeout(() => {
      this.hide();
    }, 5000)
  }

  hide() {
    this.loading$.next(false);
  }


}
