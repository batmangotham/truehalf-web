import { BadRequestError } from "./../../shared/errors/bad-request-error";
import { MatSnackBar } from "@angular/material";
import { AppError } from "./../../shared/errors/app-error";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TypeaheadMatch } from "ngx-bootstrap";
import { CommonApiService, UnAuthError } from "app/shared";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  loc_id: any;
  locView: boolean;
  form;
  formView = null;
  formData: any = {};
  location: any[] = [];
  isRegister: boolean;
  error: number;
  constructor(
    private registerService: CommonApiService,
    fb: FormBuilder,
    private route: Router,
    private topSnack: MatSnackBar
  ) {
    this.form = fb.group({
      first: fb.group({
        name: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ])
        ],
        dob: ["", Validators.required],
        term: [false, Validators.requiredTrue],
        gender: ["", Validators.required],
        location_id: ["", Validators.required]
      }),
      second: fb.group({
        username: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(10)
          ])
        ],
        email: [
          "",
          Validators.compose([Validators.required, Validators.email])
        ],
        password: [
          "",
          Validators.compose([Validators.required, Validators.minLength(8)])
        ],
        password_confirmation: [
          "",
          Validators.compose([Validators.required, Validators.minLength(8)])
        ]
      })
    });
  }

  ngOnInit() {
    this.isRegister = false;
    console.log(this.form);
    this.getLocation();
    this.loc_id = null;
    this.locView = false;
    console.log(this.loc_id);
  }

  isValid(name: string, type: string) {
    return (
      this.form.controls[type].get(name).invalid &&
      this.form.controls[type].get(name).touched
    );
  }

  showForm() {
    if (this.form.controls.first.valid) {
      console.log(this.loc_id);
      if (this.loc_id) {
        this.locView = false;
        console.log(this.loc_id);
        this.formView = !this.formView;
      } else {
        this.locView = true;
      }
    }
  }

  setValue() {
    let data: any = {};
    const dataToPost = {};
    data = this.form.value;
    for (const index in data) {
      if (data.hasOwnProperty(index)) {
        for (const key in data[index]) {
          if (data[index].hasOwnProperty(key)) {
            dataToPost[key] = data[index][key];
          }
        }
      }
    }
    this.formData = dataToPost;
    this.formData["location_id"] = this.loc_id;
  }

  locValue(e: TypeaheadMatch): void {
    const locValue = e.item.id;
    console.log(locValue);
    this.loc_id = locValue;
    if (this.loc_id) {
      this.locView = false;
    }
  }

  getLocation() {
    this.registerService.getData("get-location", {}).subscribe(res => {
      if (res.status && res.data) {
        const data = res.data;
        for (const item of data) {
          // console.log(item);
          this.location.push(item);
        }
        // console.log(this.location);
        // console.log(this.formData);
      }
    });
  }

  onSubmit() {
    this.isRegister = true;
    this.setValue();
    this.registerService.postData("register", this.formData).subscribe(
      res => {
        // console.log(res);
        if (res.data) {
          this.route.navigate(["success"]);
        }
      },
      (error: AppError) => {
        if (error instanceof UnAuthError) {
          console.log(error);
          this.openSnackbar(error.originalError, "Dismiss");
        }
        if (error instanceof BadRequestError) {
          // console.log(error);
          this.isRegister = false;
          const errorType = error.originalError.error.error_message;
          if (errorType.username && errorType.email) {
            this.error = 1;
            this.openSnackbar("Username and Password already taken", "Dismiss");
          } else if (errorType.username) {
            this.error = 2;
            this.openSnackbar("Username already taken", "Dismiss");
          } else if (errorType.email) {
            this.error = 3;
            this.openSnackbar("Email already taken", "Dismiss");
          }
        } else {
          throw error;
        }
      }
    );
  }
  openSnackbar(message: string, action?: string) {
    this.topSnack.open(message, action, {
      duration: 5000,
      verticalPosition: "top",
      extraClasses: ["snack-bg"]
    });
  }
}
