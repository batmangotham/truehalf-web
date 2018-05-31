import { Component, OnInit } from "@angular/core";
import { CommonApiService } from "app/shared";
import { FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-profile-lifestyle",
  templateUrl: "lifestyle.component.html"
})
export class ProfileLifestyleComponent implements OnInit {
  form;
  data: any = {};
  userData: any = {};
  show: boolean;
  loading: boolean;
  life: any = {};
  constructor(
    private profileService: CommonApiService,
    fb: FormBuilder,
    private bSnack: MatSnackBar
  ) {
    this.form = fb.group({
      smoke: ["", Validators.required],
      drink: ["", Validators.required],
      occupation: ["", Validators.required]
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
      smoke: this.userData.smoke ? this.userData.smoke.id : "",
      drink: this.userData.drink ? this.userData.drink.id : "",
      occupation: this.userData.occupation ? this.userData.occupation.id : ""
    });
  }

  getProfile() {
    this.loading = true;
    this.profileService.getData("user/details", {}).subscribe(res => {
      if (res.status) {
        this.data = res.data.options.user_lifestyle;
        this.userData = res.data.user.lifestyle;
        this.life["smoke"] = this.userData.smoke
          ? this.userData.smoke.title
          : "";
        this.life["drink"] = this.userData.drink
          ? this.userData.drink.title
          : "";
        this.life["occupation"] = this.userData.occupation
          ? this.userData.occupation.title
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
      .postData("user/update-user-lifestyle", this.form.value)
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
