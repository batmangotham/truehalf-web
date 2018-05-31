import { MatSnackBar } from "@angular/material";
import { CommonApiService } from "./../../../shared/services/common.service";
import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-profile-appearance",
  templateUrl: "appearance.component.html"
})
export class ProfileAppearanceComponent implements OnInit {
  form;
  data: any = {};
  userData: any = {};
  show: boolean;
  apr: any = {};
  loading: boolean;
  constructor(
    private profileService: CommonApiService,
    fb: FormBuilder,
    private bSnack: MatSnackBar
  ) {
    this.form = fb.group({
      height: ["", Validators.required],
      body_type: ["", Validators.required],
      eye_color: ["", Validators.required],
      hair_color: ["", Validators.required],
      skin_color: ["", Validators.required]
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
      height: this.userData.height ? this.userData.height : "",
      body_type: this.userData.body_type ? this.userData.body_type.id : "",
      eye_color: this.userData.eye_color ? this.userData.eye_color.id : "",
      hair_color: this.userData.hair_color ? this.userData.hair_color.id : "",
      skin_color: this.userData.skin_color ? this.userData.skin_color.id : ""
    });
  }

  getProfile() {
    this.loading = true;
    this.profileService.getData("user/details", {}).subscribe(res => {
      if (res.status && res.data) {
        const data = res.data;
        this.data = data.options.user_appearence;
        this.userData = data.user.appearance;
        this.apr["b_type"] = this.userData.body_type
          ? this.userData.body_type.title
          : "";
        this.apr["e_color"] = this.userData.eye_color
          ? this.userData.eye_color.title
          : "";
        this.apr["h_color"] = this.userData.hair_color
          ? this.userData.hair_color.title
          : "";
        this.apr["s_color"] = this.userData.skin_color
          ? this.userData.skin_color.title
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
      .postData("user/update-user-appearence", this.form.value)
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
