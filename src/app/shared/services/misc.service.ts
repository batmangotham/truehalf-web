import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Injectable } from "@angular/core";

export interface Subs {
  payment_id: number;
  payment_type: number;
  paypal_payment_id: number;
}
@Injectable()
export class MiscService {
  private isOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private ThShow: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isMessage: BehaviorSubject<boolean> = new BehaviorSubject(true);
  onlineList = new BehaviorSubject([]);
  constructor() {}

  setValue(status: boolean) {
    this.isOpen.next(status);
  }

  getValue() {
    return this.isOpen.asObservable();
  }

  setMessage(status: boolean) {
    this.isMessage.next(status);
  }

  checkIfMessage() {
    return this.isMessage.asObservable();
  }

  getOnlineUsers() {
    return this.onlineList.asObservable();
  }

  savePaymentDetails(sub: Subs) {
    window.localStorage["subscription_start"] = JSON.stringify(sub);
  }

  getPaymentDetails(): Subs {
    return JSON.parse(window.localStorage["subscription_start"]);
  }

  deleteNode() {
    this.ThShow.next(false);
  }

  getNodeStatus() {
    return this.ThShow.asObservable();
  }
}
