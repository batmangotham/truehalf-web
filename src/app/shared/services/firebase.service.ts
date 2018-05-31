import { ChatService } from "./chat.service";
import { CommonApiService, UserService } from "app/shared";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFirestore } from "angularfire2/firestore";
import * as firebase from "firebase";

@Injectable()
export class FirebaseService {
  private fbToken;
  private authUser: any;
  constructor(
    private commonService: CommonApiService,
    private fbAuth: AngularFireAuth,
    private _user: UserService,
    private afs: AngularFirestore,
    private chat: ChatService
  ) {}

  getfbToken() {
    this.commonService.getData("authorizing", {}).subscribe(res => {
      console.log(res + "Fb token");
      if (res.fbToken) {
        this.fbToken = res.fbToken;
        this.authenticateUser();
      }
    });
  }

  private authenticateUser() {
    this.fbAuth.auth
      .signInWithCustomToken(this.fbToken)
      .then(res => {
        console.log("FB Authenticated");
        this.loginGoto();
      })
      .catch(err => {
        console.log("Error while authenticating user" + err);
      });
  }

  loginGoto() {
    this._user.currentUser.subscribe(res => {
      this.authUser = res;
      console.log(this.authUser);
      if (this.authUser.update_status) {
        window.location.href = "/home";
      } else {
        window.location.href = "/basic";
      }
    });
  }

  updateStatus(id) {
    // console.log(id + "in update status");
    const userStatusDatabaseRef = this.afs.app.database().ref(`users/${id}`);
    const userStatusFirestoreRef = this.afs.firestore.doc(`users/${id}`);
    const fbTS = firebase.database.ServerValue.TIMESTAMP;
    const fsTS = firebase.firestore.FieldValue.serverTimestamp();
    this.afs.app
      .database()
      .ref(".info/connected")
      .on("value", res => {
        if (res.val() == false) {
          userStatusFirestoreRef.update({
            status: "offline",
            last_changed: fsTS
          });
          return;
        }

        userStatusDatabaseRef
          .onDisconnect()
          .set({ status: "offline", last_changed: fbTS })
          .then(() => {
            userStatusDatabaseRef.set({ status: "online", last_changed: fbTS });
            userStatusFirestoreRef.update({
              status: "online",
              last_changed: fsTS
            });
            // console.log("online");
          });
      });
  }
}
