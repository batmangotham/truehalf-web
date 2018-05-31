import { CommonApiService } from "./../../../shared/services/common.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-half-background",
  templateUrl: "half-background.component.html"
})
export class HalfBackgroundComponent implements OnInit {
  form;
  data: any = {};
  userData: any = {};
  show: boolean;
  loading: boolean;
  bckgd: any = {};
  location: any = {};
  constructor(
    private profileService: CommonApiService,
    fb: FormBuilder,
    private bSnack: MatSnackBar
  ) {
    this.form = fb.group({
      truehalf_language: ["", Validators.required],
      truehalf_education: ["", Validators.required],
      truehalf_religion: ["", Validators.required],
      truehalf_location: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.loading = false;
    this.getLocation();
    this.getProfile();
    this.show = true;
  }

  view() {
    this.show = !this.show;
  }

  setValue() {
    const user = this.userData;
    this.form.patchValue({
      truehalf_language: this.multipleValues(user.truehalf_language),
      truehalf_education: this.multipleValues(user.truehalf_education),
      truehalf_religion: this.multipleValues(user.truehalf_religion),
      truehalf_location: this.multipleValues(user.truehalf_location)
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
        this.data = res.data.options.user_background;
        this.userData = res.data.user.background;
        this.bckgd["language"] = this.userData.truehalf_language;
        this.bckgd["education"] = this.userData.truehalf_education;
        this.bckgd["religion"] = this.userData.truehalf_religion;
        this.bckgd["location"] = this.userData.truehalf_location;
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
      .postData("user/update-truehalf-background", this.form.value)
      .subscribe(res => {
        if (res.status) {
          this.getProfile();
          this.openSnackbar("Profile updated succesfully", "close");
        }
      });
  }

  getLocation() {
    this.profileService.getData("get-location", {}).subscribe(res => {
      if (res.status) {
        this.location = res.data;
        // console.log(this.location);
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
