import { BadRequestError } from "./../../shared/errors/bad-request-error";
import { Component, OnInit } from "@angular/core";
import {
  UserService,
  CommonApiService,
  AppError,
  ContactDialogComponent
} from "app/shared";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { error } from "selenium-webdriver";
import { MatDialog } from "@angular/material";

@Component({
  templateUrl: "settings.component.html",
  styleUrls: ["settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  pswdForm: FormGroup;
  user: any = {};
  constructor(
    private _user: UserService,
    fb: FormBuilder,
    private commonService: CommonApiService,
    public dialog: MatDialog
  ) {
    this.profileForm = fb.group({
      name: [this._user.getCurrentUser().name, Validators.required],
      location: [this._user.getCurrentUser().location_id, Validators.required],
      dob: [this._user.getCurrentUser().dob, Validators.required]
    });

    this.pswdForm = fb.group({
      previous_password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      password_confirmation: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  ngOnInit() {
    this.user["profile_loading"] = false;
    this.user["isProfile"] = true;
    this.user["isPswd"] = true;
    this.getLocations();
    this.getBlockedUsers("get");
  }

  profileSubmit() {
    let data: any = {};
    this.user["profile_loading"] = true;
    data["name"] = this.profileForm.value.name;
    data["location"] = this.profileForm.value.location;
    let newDate = new Date(this.profileForm.value.dob);
    data["dob"] = newDate.toLocaleDateString();
    this.commonService.postData("user/update-profile", data).subscribe(res => {
      if (res.status) {
        this._user.updateCurrentUserSubject(res.data);
        console.log("updated");
        this.user["profile_loading"] = false;
        this.user["isProfile"] = true;
      }
    });
  }

  getLocations() {
    this.commonService.getData("get-location", {}).subscribe(res => {
      if (res.status) {
        console.log(res.data);
        this.user["locations"] = res.data;
      }
    });
  }

  viewProfileEdit() {
    this.user["isProfile"] = false;
  }

  viewPswdEdit() {
    this.user["isPswd"] = false;
  }

  pswdSubmit() {
    this.user["pswd_loading"] = true;
    this.commonService
      .postData("user/update-password", this.pswdForm.value)
      .subscribe(
        res => {
          console.log(res);
          this.user["pswd_loading"] = false;
          this.user["isPswd"] = true;
        },
        (error: AppError) => {
          if (error instanceof BadRequestError) {
            const newError = error.originalError.error;
            if (error.originalError.error.hasOwnProperty(["error_message"])) {
              this.user["error"] = newError.error_message.password;
            } else {
              this.user["error"] = newError;
            }
            this.user["pswd_loading"] = false;
            this.pswdForm.reset();
          }
        }
      );
  }

  cancelSubmit(e?) {
    if (e) {
      this.user["isPswd"] = true;
      this.pswdForm.reset();
    } else {
      this.user["isProfile"] = true;
    }
  }

  getBlockedUsers(arg) {
    this.user["loading"] = true;
    this.commonService.getData("user/view-blocked-users", {}).subscribe(res => {
      console.log(res);
      if (res.status && res.data.length) {
        this.user["blocked"] = res.data;
        console.log("has data");
        this.user["loading"] = false;
      } else {
        console.log("empty");
        this.user["blocked"] = [];
        this.user["loading"] = false;
        this.user["empty"] = true;
      }
    });
  }

  unblockUser(item, index) {
    console.log(index);
    item["loading"] = true;
    this.commonService
      .deleteData("user/unblock/" + item.id, {})
      .subscribe(res => {
        if (res.status) {
          console.log("Unblocked");
          item["loading"] = false;
          this.user["blocked"].splice(index, 1);
          console.log(this.user.blocked);
          if (!this.user.blocked.length) {
            this.user["empty"] = true;
          }
        }
      });
  }

  openContact(): void {
    let dialogRef = this.dialog.open(ContactDialogComponent, {
      height: "auto",
      width: "300px",
      panelClass: "reset-dialog"
    });
  }
}
