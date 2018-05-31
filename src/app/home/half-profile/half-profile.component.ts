import { AppError, UserService, BadRequestError } from "app/shared";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonApiService } from "./../../shared/services/common.service";
import { Component, OnInit } from "@angular/core";
import { ProfileImageDialogComponent } from "app/home/common/profileImage-dialog/profileimage-dialog.component";
import { MatDialog, MatSnackBar } from "@angular/material";

@Component({
  templateUrl: "half-profile.component.html"
})
export class HalfProfileComponent implements OnInit {
  id: number;
  user: any = {};
  constructor(
    public dialog: MatDialog,
    private halfService: CommonApiService,
    private route: ActivatedRoute,
    private bSnack: MatSnackBar,
    private _user: UserService,
    private router: Router
  ) {
    this.route.params.subscribe(param => {
      this.id = +param["id"];
    });
  }

  ngOnInit() {
    // this.data["true_half_id"] = this.id;
    // this.postView();
    this.getHalfData();
  }

  getHalfData() {
    this.user["loading"] = true;
    this.halfService.getData("truehalf-details", { id: this.id }).subscribe(
      res => {
        if (res.status) {
          if (res.data) {
            this.user = res.data;
            if (this.user.media.length) {
              const last: any = this.user.media[this.user.media.length - 1];
              this.user["image"] = last.image_path;
            }
            this.user["length"] = this.user.media.length;
            this.user["half_image"] = this.user.media;
            this.user["loading"] = false;
            this.user["blocking"] = false;
          }
        }
      },
      (error: AppError) => {
        if (error instanceof BadRequestError) {
          console.log(error.originalError.error);
          this.user = [];
          this.user["loading"] = true;
          this.user["error"] = error.originalError.error;
        }
      }
    );
  }

  openModal() {
    const dialogRef = this.dialog.open(ProfileImageDialogComponent, {
      height: "auto",
      width: "300px",
      panelClass: "prof-dialog",
      data: this.user
    });
  }

  addWink() {
    if (this._user.getCurrentUser().subscription) {
      if (this.user.winks) {
        this.deleteWink();
        this.user.winks = null;
      } else {
        this.postWink();
        this.user.winks = true;
      }
    } else {
      this.openSnackbar("You are not a premium user", "Close");
    }
  }

  postWink() {
    const data: any = {};
    data["true_half_id"] = this.id;
    this.halfService.postData("winks/add", data).subscribe(
      res => {
        if (res.status) {
          this.openSnackbar("Winked", "Close");
        }
      },
      (error: AppError) => {}
    );
  }

  deleteWink() {
    this.halfService
      .deleteData("winks/delete/" + this.id, {})
      .subscribe(res => {
        console.log(res);
        this.openSnackbar("Wink removed", "Close");
      });
  }

  addFav() {
    if (this._user.getCurrentUser().subscription) {
      if (this.user.favorite) {
        this.deleteFav();
        this.user.favorite = null;
      } else {
        this.postFav();
        this.user.favorite = true;
      }
    } else {
      this.openSnackbar("You are not a premium user", "Close");
    }
  }

  postFav() {
    const data: any = {};
    data["true_half_id"] = this.id;
    this.halfService.postData("favourites/add", data).subscribe(
      res => {
        if (res.status) {
          this.openSnackbar("Added to favourite", "Close");
        }
      },
      (error: AppError) => {}
    );
  }

  deleteFav() {
    this.halfService
      .deleteData("favourites/delete/" + this.id, {})
      .subscribe(res => {
        console.log(res);
        this.openSnackbar("Favourite removed", "Close");
      });
  }

  openSnackbar(message: string, action?: string) {
    this.bSnack.open(message, action, {
      duration: 1000,
      extraClasses: ["snack-home"]
    });
  }

  blockUser() {
    let data: any = {};
    this.user["blocking"] = true;
    data["true_half_id"] = this.id;
    this.halfService.postData("user/block", data).subscribe(res => {
      console.log(res);
      if (res.status) {
        this.getHalfData();
        this.openSnackbar(res.data.message);
      }
    });
  }
}
