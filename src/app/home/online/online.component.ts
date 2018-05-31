import { CommonApiService } from "./../../shared/services/common.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { error } from "util";
import { AppError, BadRequestError, UserService } from "app/shared";
import { AngularFirestore } from "angularfire2/firestore";

@Component({
  templateUrl: "online.component.html"
})
export class OnlineComponent implements OnInit {
  data: any = [];
  loading: boolean;
  online: any = {};
  constructor(
    private route: Router,
    private onlineService: CommonApiService,
    private afs: AngularFirestore,
    private _user: UserService
  ) {}

  ngOnInit() {
    this.loading = false;
    this.data["next"] = 1;
    this.data["loadMore"] = false;
    // this.getOnlineUsers();
    this.getFbOnline();
    this.data["userId"] = String(this._user.getCurrentUser().id);
  }

  getOnlineUsers(type = "get") {
    if (type === "get") {
      this.loading = true;
    } else {
      this.data["loadMore"] = true;
    }
    this.onlineService
      .getData("user/online", {
        page: this.data["next"]
      })
      .subscribe(
        res => {
          if (res.status) {
            if (res.data.total > 0) {
              if (type === "load") {
                let data: any[];
                data = res.data.data;
                this.data["item"] = this.data["item"].concat(data);
              } else {
                this.data["item"] = res.data.data;
                this.loading = false;
              }
              this.data["next"] = res.data.current_page + 1;
            } else {
              this.loading = false;
              this.data["item"] = [];
              this.data["next"] = 1;
              this.data["empty"] = true;
            }
            this.data["isNext"] = res.data.last_page > res.data.current_page;
            this.data["loadMore"] = false;
          } else {
            this.loading = false;
            this.data["empty"] = true;
          }
        },
        (error: AppError) => {
          if (error instanceof BadRequestError) {
            console.log(error);
            this.data["upgrade"] = error.originalError.error;
            this.loading = false;
          }
        }
      );
  }

  loadMore() {
    this.getOnlineUsers("load");
  }

  getFbOnline() {
    this.loading = true;
    let userId = [];
    this.afs.firestore
      .collection("users")
      .where("status", "==", "online")
      .onSnapshot(changes => {
        changes.docChanges.forEach(user => {
          if (user.doc.data().id !== this.data["userId"]) {
            if (user.type === "added") {
              userId.push(user.doc.data().id);
            }
            if (user.type === "removed") {
              // console.log(user.doc.data().id);
              for (const item of userId) {
                if (user.doc.data().id == item) {
                  console.log(item);
                  const index = userId.indexOf(item);
                  console.log(index + "index");
                  userId.splice(index, 1);
                }
              }
            }
          }
        });
        this.online["online_id"] = userId;
        console.log(this.online);
        this.getOnlineFbUsers();
      });
  }

  getOnlineFbUsers() {
    this.onlineService
      .postData("user/online-from-firestore", this.online)
      .subscribe(
        res => {
          if (res.status) {
            if (res.data.total > 0) {
              this.data["item"] = res.data.data;
              this.loading = false;
              this.data["next"] = res.data.current_page + 1;
              this.data["empty"] = false;
            } else {
              this.loading = false;
              this.data["item"] = [];
              this.data["next"] = 1;
              this.data["empty"] = true;
            }
            this.data["isNext"] = res.data.last_page > res.data.current_page;
          } else {
            this.loading = false;
            this.data["empty"] = true;
          }
        },
        (error: AppError) => {
          if (error instanceof BadRequestError) {
            console.log(error);
            this.data["upgrade"] = error.originalError.error;
            this.loading = false;
          }
        }
      );
  }
}
