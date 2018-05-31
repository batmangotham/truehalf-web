import { CommonApiService } from "./../../../services/common.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { Component, OnInit } from "@angular/core";
// import { CommonApiService } from "app/shared";

@Component({
  templateUrl: "contact.html",
  styleUrls: ["contact.scss"]
})
export class ContactDialogComponent implements OnInit {
  data: any = {};
  form: FormGroup;
  constructor(
    private commonService: CommonApiService,
    fb: FormBuilder,
    public dialogRef: MatDialogRef<ContactDialogComponent>
  ) {
    this.form = fb.group({
      name: ["", Validators.required],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      contact_no: ["", Validators.required],
      message: [
        " ",
        Validators.compose([Validators.required, Validators.minLength(10)])
      ]
    });
  }

  ngOnInit() {
    this.data["sent"] = false;
  }

  postContact() {
    this.data["loading"] = true;
    this.commonService
      .postData("contact-us", this.form.value)
      .subscribe(res => {
        if (res) {
          this.data["loading"] = false;
          this.data["sent"] = true;
        }
      });
  }

  submitContact() {
    console.log(this.form.value);
    this.postContact();
  }

  validateControl(controlName: string) {
    console.log(controlName);
    if (this.form.controls[controlName].invalid) {
      return true;
    }
    return;
  }
}
