import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService, MiscService, ChatService } from "app/shared";

@Component({
  templateUrl: "create.html"
})
export class CreateChatComponent implements OnInit, OnDestroy {
  constructor(
    public _user: UserService,
    private _misc: MiscService,
    private chat: ChatService
  ) {}

  ngOnInit() {
    // this._user.getCurrentUser().subscription;
    // this._misc.setMessage(false);
    // this.chat.setActiveUser("0");
  }

  ngOnDestroy() {
    // console.log("message destroyed");
    // this._misc.setMessage(true);
  }
}
