import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";

@Injectable()
export class ConnectivityService {
  isConnected: Observable<boolean>;
  constructor() {
    this.isConnected = Observable.merge(
      Observable.of(navigator.onLine),
      Observable.fromEvent(window, "online").map(() => true),
      Observable.fromEvent(window, "offline").map(() => false)
    );
  }
}
