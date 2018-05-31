import { CommonApiService } from "./../../../shared/services/common.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-half-lifestyle",
  templateUrl: "half-lifestyle.component.html"
})
export class HalfLifestyleComponent implements OnInit {
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
      truehalf_drink: ["", Validators.required],
      truehalf_occupation: ["", Validators.required],
      truehalf_smoke: ["", Validators.required]
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
    const user = this.userData;
    this.form.patchValue({
      truehalf_drink: this.multipleValues(user.truehalf_drink),
      truehalf_occupation: this.multipleValues(user.truehalf_occupation),
      truehalf_smoke: this.multipleValues(user.truehalf_smoke)
    });
  }

  multipleValues(type) {
    let data: any[] = [];
    if (type) {
      for (const item of type) {
        data.push(item.id);
      }
      return data;
    } else {
      return null;
    }
  }

  getProfile() {
    this.loading = true;
    this.profileService.getData("user/details", {}).subscribe(res => {
      if (res.status) {
        this.data = res.data.options.user_lifestyle;
        this.userData = res.data.user.lifestyle;
        this.life["drink"] = this.userData.truehalf_drink;
        this.life["occupation"] = this.userData.truehalf_occupation;
        this.life["smoke"] = this.userData.truehalf_smoke;
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
      .postData("user/update-truehalf-lifestyle", this.form.value)
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
