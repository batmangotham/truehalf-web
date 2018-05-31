import { CommonApiService } from "app/shared";
// import { MiscService } from "./../shared/services/misc.service";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { UserService, ChatService, JwtService, MiscService } from "app/shared";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "angularfire2/firestore";
import * as firebase from "firebase";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  title: string;
  userDetails: any = {};
  expand: boolean;
  count: any = {};
  constructor(
    public _user: UserService,
    private _misc: MiscService,
    private chat: ChatService,
    private afsAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private _jwt: JwtService,
    private commonService: CommonApiService
  ) {
    this.userDetails = this._user.getCurrentUser();
  }

  ngOnInit() {
    this.chat.totalCount(this.userDetails.id);
    // console.log(this.userDetails)
    this._misc.getValue().subscribe(res => {
      this.expand = res;
    });

    this.chat.msgCount.subscribe(res => {
      this.count["blink"] = 1;
      // console.log(this.count);
      this.count["length"] = res.length;
      setTimeout(() => {
        this.count["blink"] = 0;
      }, 1000);
      // console.log(this.count);
    });
  }

  ngAfterViewInit() {
    //  this._misc.checkIfMessage().subscribe(res => {
    //    this.count["visible"] = res;
    //  });
  }

  close() {
    this._misc.setValue(false);
  }

  updateStatus() {
    const userStatusDatabaseRef = this.afs.app
      .database()
      .ref(`users/${this.userDetails.id}`);
    const fbTS = firebase.database.ServerValue.TIMESTAMP;

    userStatusDatabaseRef
      .set({ status: "offline", last_changed: fbTS })
      .then(() => {
        this.logout();
      });
  }

  logout() {
    this.userDetails["white"] = true;
    const token = this._jwt.getToken();
    this.commonService.postData("logout", token).subscribe(res => {
      if (res.success) {
        this.userDetails["white"] = true;
        this.afsAuth.auth.signOut().then(() => {
          window.location.href = "login";
          this._user.clearAuth();
        });
      }
    });
  }
}
