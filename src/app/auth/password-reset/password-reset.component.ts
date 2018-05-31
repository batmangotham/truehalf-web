import { FormBuilder, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { CommonApiService, AppError, BadRequestError } from "app/shared";

@Component({
  templateUrl: "reset.html",
  styleUrls: ["reset.scss"]
})
export class PasswordResetComponent implements OnInit {
  data: any = {};
  form: FormGroup;
  constructor(
    private commonService: CommonApiService,
    private _route: ActivatedRoute,
    fb: FormBuilder
  ) {
    this.form = fb.group({
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
    this.data["loading"] = false;
    this.data["success"] = false;
    this._route.params.subscribe(param => {
      // console.log(param);
      this.data["token"] = param["token"];
      console.log(this.data.token);
    });
    this._route.queryParams.subscribe(qParams => {
      console.log(qParams);
      this.data["email"] = qParams["email"];
    });
  }

  resetPassword() {
    this.data["loading"] = true;
    let formData = this.form.value;
    formData["token"] = this.data.token;
    formData["email"] = this.data.email;
    console.log(formData);
    this.commonService.postData("password/reset", formData).subscribe(
      res => {
        if (res.status) {
          console.log(res);
          this.data["loading"] = false;
          this.data["success"] = true;
        }
      },
      (error: AppError) => {
        if (error instanceof BadRequestError) {
          this.data["loading"] = false;
          this.data["error"] = error.originalError.error;
        }
      }
    );
  }
}
