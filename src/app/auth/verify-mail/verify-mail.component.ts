import { NotFoundError } from "./../../shared/errors/not-found-error";
import { BadRequestError } from "./../../shared/errors/bad-request-error";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { CommonApiService, AppError } from "app/shared";
import { error } from "util";

@Component({
  selector: "app-verify-mail",
  templateUrl: "verify-mail.component.html",
  styles: ["verify-mail.component.scss"]
})
export class VerifyMailComponent implements OnInit {
  data: any = {};
  constructor(
    private common: CommonApiService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._route.params.subscribe(param => {
      this.data["code"] = param["code"];
      // console.log(this.data["code"]);
      if (this.data["code"]) {
        this.verifyMail();
      }
    });
  }

  verifyMail() {
    this.data["loading"] = true;
    this.common.getData("mail-verification/" + this.data["code"], {}).subscribe(
      res => {
        console.log(res);
        if (res.status) {
          this.data["verify"] = true;
          this.data["loading"] = false;
        }
      },
      (error: AppError) => {
        if (error instanceof BadRequestError) {
          console.log("false");
          this.data["loading"] = false;
          this.data["verify"] = false;
          console.log("Verification Failed");
        }
      }
    );
  }
}
