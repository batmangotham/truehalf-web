import { MatSnackBar } from "@angular/material";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonApiService } from "app/shared";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-half-appearance",
  templateUrl: "half-appearance.component.html"
})
export class HalfAppearanceComponent implements OnInit {
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
      truehalf_min_height: ["", Validators.required],
      truehalf_max_height: ["", Validators.required],
      truehalf_body_type: ["", Validators.required],
      truehalf_eye_color: ["", Validators.required],
      truehalf_hair_color: ["", Validators.required],
      truehalf_skin_color: ["", Validators.required]
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
      truehalf_min_height: user.truehalf_min_height,
      truehalf_max_height: user.truehalf_max_height,
      truehalf_body_type: this.multipleValues(user.truehalf_body_type),
      truehalf_eye_color: this.multipleValues(user.truehalf_eye_color),
      truehalf_hair_color: this.multipleValues(user.truehalf_hair_color),
      truehalf_skin_color: this.multipleValues(user.truehalf_skin_color)
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
      if (res.status && res.data) {
        const data = res.data;
        this.data = data.options.user_appearence;
        this.userData = data.user.appearance;
        this.apr["min_height"] = this.userData.truehalf_min_height;
        this.apr["max_height"] = this.userData.truehalf_max_height;
        this.apr["b_type"] = this.userData.truehalf_body_type;
        this.apr["e_color"] = this.userData.truehalf_eye_color;
        this.apr["h_color"] = this.userData.truehalf_hair_color;
        this.apr["s_color"] = this.userData.truehalf_skin_color;
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
      .postData("user/update-truehalf-appearence", this.form.value)
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
