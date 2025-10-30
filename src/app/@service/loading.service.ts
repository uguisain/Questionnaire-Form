import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading$ = new BehaviorSubject<string>('遊客');


  constructor() { }

  show() {
    this.loading$.next("loading");
  }

  hide() {
    this.loading$.next("loading");
  }


}
