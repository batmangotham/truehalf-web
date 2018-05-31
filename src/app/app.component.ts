import { FirebaseService } from "app/shared/services/firebase.service";
import { AngularFireAuth } from "angularfire2/auth";
import { ConnectivityService } from "./shared/services/connectivity.service";
import { Observable } from "rxjs/Rx";
import { CommonApiService, ChatService } from "app/shared";
import { Component, OnInit } from "@angular/core";
import { UserService } from "./shared";
import { MatSnackBar } from "@angular/material";
import { log } from "util";
import { AngularFirestore } from "angularfire2/firestore";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title: string;
  auth;
  online: boolean;
  constructor(
    private _user: UserService,
    private commonService: CommonApiService,
    private connected: ConnectivityService,
    private bSnack: MatSnackBar,
    private afsAuth: AngularFireAuth,
    private chat: ChatService,
    private afs: AngularFirestore,
    private _fb: FirebaseService
  ) {
    this._user.isAuthenticated.subscribe(res => {
      this.auth = res;
      if (this.auth) {
        this.geoLocation();
        this.afsAuth.authState.subscribe(fb => {
          if (fb) {
            // console.log(fb.uid + "FB");
            this.chat.userId = fb.uid;
            this._fb.updateStatus(fb.uid);
          }
        });
      }
    });
  }
  ngOnInit() {
    this.title = "kmkdsmfs";
    this._user.initializeUser();
    this.connected.isConnected.subscribe(res => {
      this.online = res;
      if (this.online) {
        this.bSnack.dismiss();
      } else {
        this.openSnackbar("No internet connection", "Close");
      }
    });
  }

  geoLocation() {
    this.commonService.getData("user/geo-loc", {}).subscribe(res => {});
  }

  openSnackbar(message: string, action?: string) {
    this.bSnack.open(message, action, {
      extraClasses: ["snack-internet"]
    });
  }
}
