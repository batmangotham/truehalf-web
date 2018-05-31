import { MatSnackBar } from "@angular/material";
import { Component, OnInit } from "@angular/core";
import { CommonApiService } from "app/shared";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-profile-background",
  templateUrl: "background.component.html"
})
export class ProfileBackgroundComponent implements OnInit {
  form;
  data: any = {};
  userData: any = {};
  show: boolean;
  loading: boolean;
  bckgd: any = {};
  constructor(
    private profileService: CommonApiService,
    fb: FormBuilder,
    private bSnack: MatSnackBar
  ) {
    this.form = fb.group({
      language: ["", Validators.required],
      education: ["", Validators.required],
      religion: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.loading = false;
    this.getProfile();
    this.show = true;
  }

  view() {
    this.show = !this.show;
  }

  setValue() {
    this.form.patchValue({
      language: this.userData.language ? this.userData.language.id : "",
      education: this.userData.education ? this.userData.education.id : "",
      religion: this.userData.religion ? this.userData.religion.id : ""
    });
  }

  getProfile() {
    this.loading = true;
    this.profileService.getData("user/details", {}).subscribe(res => {
      if (res.status) {
        this.data = res.data.options.user_background;
        this.userData = res.data.user.background;
        this.bckgd["language"] = this.userData.language
          ? this.userData.language.title
          : "";
        this.bckgd["education"] = this.userData.education
          ? this.userData.education.title
          : "";
        this.bckgd["religion"] = this.userData.religion
          ? this.userData.religion.title
          : "";
        this.setValue();
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.postData();
    this.show = true;
    this.loading = true;
  }

  postData() {
    this.profileService
      .postData("user/update-user-background", this.form.value)
      .subscribe(res => {
        if (res.status) {
          this.getProfile();
          this.openSnackbar("Profile updated succesfully", "close");
        }
      });
  }

  openSnackbar(message: string, action?: string) {
    this.bSnack.open(message, action, {
      duration: 2000,
      extraClasses: ["snack-home"]
    });
  }
}
