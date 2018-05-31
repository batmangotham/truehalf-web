import { Router, ActivatedRoute } from "@angular/router";
import { FbUser } from "./../../../shared/models/item";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChatService, MiscService, UserService } from "app/shared";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  templateUrl: "list.html"
})
export class MessageListComponent implements OnInit, OnDestroy {
  users: any = {};
  _sub;
  trueHalf: any = {};
  constructor(
    private chat: ChatService,
    private afsAuth: AngularFireAuth,
    private _route: ActivatedRoute,
    private _misc: MiscService,
    public _user: UserService
  ) {}

  ngOnInit() {
    this.trueHalf = this._user.getCurrentUser().msg_status;
    this.deleteCheck();
    this.afsAuth.authState.subscribe(res => {
      // console.log(res + "Auth");
      this.chat.getUsers();
      if (this._user.getCurrentUser().subscription) {
        this.userList();
      }
    });
  }

  setHalf(half) {
    this.chat.UpdateHalf(half);
  }

  userList() {
    this.users["loading"] = true;
    this._sub = this.chat.getUserList().subscribe(data => {
      if (data) {
        this.users["data"] = data;
        this.users["loading"] = false;
        this.users["empty"] = false;
      } else {
        this.users["empty"] = true;
      }
    });
  }

  ngOnDestroy() {
    console.log("Message list destroyed");
    if (this._user.getCurrentUser().subscription) {
      this._sub.unsubscribe();
    }
    this.chat.unsubscribe();
  }

  deleteCheck() {
    this._misc.getNodeStatus().subscribe(res => {
      if (!res) {
        console.log(res);
        this.trueHalf = res;
      }
    });
  }
}
