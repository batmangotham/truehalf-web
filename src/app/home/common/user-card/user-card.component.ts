import { BadRequestError } from "./../../../shared/errors/bad-request-error";
import { ChatThread } from "./../../../shared/models/thread";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import {
  CommonApiService,
  ChatService,
  UserService,
  AppError
} from "app/shared";
import { Component, OnInit, Input, AfterViewChecked } from "@angular/core";
import { environment } from "environments/environment";

@Component({
  selector: "app-user-card",
  templateUrl: "user-card.component.html"
})
export class UserCardComponent implements OnInit {
  @Input() show: boolean;
  @Input() users: any = {};
  data: any = {};
  isWink: boolean;
  type: string;
  empty: string;
  currentUser: any;
  constructor(
    private cardService: CommonApiService,
    private bSnack: MatSnackBar,
    private route: ActivatedRoute,
    private chat: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.type = param["type"];
      console.log(this.type);
    });
    this.currentUser = this.userService.getCurrentUser();
    // console.log(this.currentUser);
  }

  itemRemove(user, i) {
    if (!this.show) {
      if (this.type === "wink") {
        console.log("its wink");
        this.users.splice(i, 1);
        if (!this.users.length) {
          this.empty = "No winks yet";
        }
      }
      if (this.type === "fav") {
        console.log("its fav");
        this.users.splice(i, 1);
        if (!this.users.length) {
          console.log("deleted fav");
          this.empty = "No favourites yet";
        }
      }
    }
  }

  addFav(item) {
    this.data["true_half_id"] = item.id;
    this.cardService.postData("favourites/add", this.data).subscribe(
      res => {
        if (res.status) {
          this.openSnackbar(
            "You added" + " " + item.name + " " + "to favourites",
            "Close"
          );
        }
      },
      (error: AppError) => {
        // if (error instanceof BadRequestError) {
        //   this.openSnackbar("You are not a premium user", "Close");
        // }
      }
    );
  }

  deleteFav(item) {
    this.cardService
      .deleteData("favourites/delete/" + item.id, {})
      .subscribe(res => {
        if (res.status) {
          this.openSnackbar(
            "Removed user" + " " + item.name + " " + "from favourites",
            "Close"
          );
        }
      });
  }

  isFav(user, i) {
    if (this.userService.getCurrentUser().subscription) {
      if (user.favorite) {
        this.deleteFav(user);
        user["favorite"] = 0;
        if (this.type === "fav") {
          this.itemRemove(user, i);
        }
      } else {
        this.addFav(user);
        user["favorite"] = 1;
      }
    } else {
      this.openSnackbar("You are not a premium user", "Close");
    }
  }

  isWinked(user, i) {
    if (this.userService.getCurrentUser().subscription) {
      if (user.winks) {
        this.removeWink(user);
        user["winks"] = 0;
        if (this.type === "wink") {
          this.itemRemove(user, i);
        }
      } else {
        this.addWink(user);
        user["winks"] = 1;
      }
    } else {
      this.openSnackbar("You are not a premium user", "Close");
    }
  }

  addWink(item) {
    this.data["true_half_id"] = item.id;
    this.cardService.postData("winks/add", this.data).subscribe(res => {
      if (res.status) {
        console.log("winked");
        this.openSnackbar("You winked at" + " " + item.name, "Close");
      }
    });
  }

  removeWink(item) {
    this.cardService
      .deleteData("winks/delete/" + item.id, {})
      .subscribe(res => {
        if (res.status) {
          this.openSnackbar(
            "Removed user" + " " + item.name + " " + "from winks",
            "Close"
          );
        }
      });
  }

  openSnackbar(message: string, action?: string) {
    this.bSnack.open(message, action, {
      duration: 1000,
      extraClasses: ["snack-home"]
    });
  }

  hasFav(user) {
    let hasId: boolean;
    hasId = user.favorite ? true : false;
    if (hasId) {
      return true;
    } else {
      return false;
    }
  }
  hasWink(user) {
    let hasId: boolean;
    hasId = user.winks ? true : false;
    if (hasId) {
      return true;
    } else {
      return false;
    }
  }

  addChat(user) {
    const half_id = String(user.id);
    this.chat.createChatNode(half_id);
  }
}
