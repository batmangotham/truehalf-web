import { CommonApiService, AppError, BadRequestError } from "app/shared";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  templateUrl: "reset-dialog.html",
  styleUrls: ["reset-dialog.scss"]
})
export class ResetDialogComponent implements OnInit {
  view: any = {};
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ResetDialogComponent>,
    fb: FormBuilder,
    private commonService: CommonApiService
  ) {
    this.view["sent"] = false;
    this.form = fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnInit() {}

  resetEmail() {
    this.view["loading"] = true;
    console.log(this.form.value);
    this.commonService.postData("password/email", this.form.value).subscribe(
      res => {
        console.log(res);
        this.view["loading"] = false;
        this.view["sent"] = true;
      },
      (error: AppError) => {
        if (error instanceof BadRequestError) {
          this.view["loading"] = false;
          this.form.reset();
          console.log(error.originalError);
          this.view["error"] = error.originalError.error;
        }
      }
    );
  }
}
