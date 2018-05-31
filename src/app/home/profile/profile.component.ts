import { ProfileImageDialogComponent } from "./../common/profileImage-dialog/profileimage-dialog.component";
import { MatDialog } from "@angular/material";
import { Validators, FormBuilder } from "@angular/forms";
import { UserService, CommonApiService } from "app/shared";
import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: "profile.component.html"
})
export class ProfileComponent implements OnInit {
  form;
  user: any = {};
  data: any = {};
  loading: boolean;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private profileService: CommonApiService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.getImages();
  }

  getLast() {
    if (this.user.images.length > 0) {
      let last: any = this.user.images[this.user.images.length - 1];
      return last.images;
    }
  }

  openModal(e) {
    if (e === "add") {
      if (
        (!this.user.subscription && this.user.images.length <= 4) ||
        (!this.user.subscription && this.user.images.length <= 11)
      ) {
        console.log(this.user + "first");
        this.data["type"] = true;
        this.getDialog();
      } else {
        console.log(this.user.subscription + "2nd");
        this.data["type"] = true;
        this.getDialog();
      }
    } else {
      this.data["type"] = false;
      this.getDialog();
    }
  }

  getDialog() {
    const dialogRef = this.dialog.open(ProfileImageDialogComponent, {
      height: "auto",
      width: "300px",
      panelClass: "prof-dialog",
      data: this.data
    });
  }

  getImages() {
    this.profileService.getData("get-user", {}).subscribe(res => {
      if (res.status) {
        this.user = res.data;
        this.userService.getCurrentUser().images = res.data.images;
        this.userService.getCurrentUser().profile_pic = res.data.profile_pic;
        let status: boolean;
        status = this.user.age_status ? true : false;
        this.data["show"] = status;
        console.log(this.data.show);
        this.loading = false;
        this.getLast();
      }
    });
  }

  toggleAge() {
    this.data.show = !this.data.show;
    if (this.data.show) {
      let newData = [];
      console.log("age show");
      newData = this.user.dob.split("-");
      console.log(this.user.dob_new);
      this.user.dob_new = this.user.dob_new + "-" + newData[0];
      this.profileService.getData("user/age-status/" + 1, {}).subscribe(res => {
        if (res.status) {
          console.log(res);
          // this.user.dob_new = res.data.dob;
        }
      });
    } else {
      let newData = [];
      console.log("age hide");
      newData = this.user.dob_new.split("-");
      this.user.dob_new = newData[0] + "-" + newData[1];
      this.profileService.getData("user/age-status/" + 0, {}).subscribe(res => {
        if (res.status) {
          console.log(res);
          // this.user.dob_new = res.data.dob;
        }
      });
    }
  }

  getAge() {
    this.profileService.getData("get-user", {}).subscribe(res => {
      if (res.status) {
        this.user.dob = res.data.dob;
      }
    });
  }
}
