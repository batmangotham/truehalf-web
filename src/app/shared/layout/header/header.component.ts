import { JwtService } from "./../../services/jwt.service";
import { AngularFirestore } from "angularfire2/firestore";
import { MiscService } from "./../../services/misc.service";
import { CommonApiService } from "./../../services/common.service";
import { Router } from "@angular/router";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { UserService } from "./../../services/user.service";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  isAuth: boolean;
  user: any = {};
  token;
  data: any = {};
  constructor(
    private _jwt: JwtService,
    public _user: UserService,
    private route: Router,
    private loginService: CommonApiService,
    private sidebarService: MiscService,
    private afsAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.user = this._user.getCurrentUser();
  }

  logout() {
    this.token = this._jwt.getToken();
    this.loginService.postData("logout", this.token).subscribe(res => {
      if (res.success) {
        this.afsAuth.auth.signOut().then(() => {
          this.data["white"] = true;
          window.location.href = "login";
          this._user.clearAuth();
        });
      }
    });
  }

  updateStatus() {
    const userStatusDatabaseRef = this.afs.app
      .database()
      .ref(`users/${this.user.id}`);
    const fbTS = firebase.database.ServerValue.TIMESTAMP;

    userStatusDatabaseRef
      .set({ status: "offline", last_changed: fbTS })
      .then(() => {
        this.logout();
      });
  }

  openSideBar() {
    console.log("open");
    this.sidebarService.setValue(true);
  }
}
