import { UpgradeDialogComponent } from "./../upgrade-dialog/upgrade-dialog.component";
import {
  CommonApiService,
  MiscService,
  Subs,
  AppError,
  BadRequestError,
  UserService
} from "app/shared";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";

@Component({
  templateUrl: "upgrade-success.html",
  styleUrls: ["upgrade-success.scss"]
})
export class UpgradeSuccessComponent implements OnInit {
  param: any = {};
  data: any = {};
  type: string;
  constructor(
    public dialog: MatDialog,
    private _route: ActivatedRoute,
    private commonService: CommonApiService,
    private misc: MiscService,
    private _router: Router,
    private user: UserService
  ) {}

  ngOnInit() {
    this._route.params.subscribe(param => {
      this.type = param["status"];
      // check query params
      this._route.queryParams.subscribe(qParam => {
        this.param = qParam;
        if (this.param.token) {
          if (this.type === "success") {
            this.successCheck();
            // this.data["loading"] = true;
          }
        } else {
          this._router.navigate(["/home"]);
        }
      });
    });
  }

  successCheck() {
    let data = this.misc.getPaymentDetails();
    this.data["loading"] = true;
    data["PayerID"] = this.param.PayerID;
    data["paymentId"] = this.param.paymentId;
    data["token"] = this.param.token;
    this.commonService.postData("paypal/return-payment", data).subscribe(
      res => {
        if (res.status) {
          console.log(res);
          this.data["saleId"] = res.data.saleId;
          this.data["loading"] = false;
          this.getUser();
        }
      },
      (error: AppError) => {
        console.log(error);
        this.data["loading"] = false;
        this.data["error"] = true;
        if (error instanceof BadRequestError) {
          this.data["error_msg"] = error.originalError.error.message;
        }
      }
    );
  }

  getUser() {
    this.commonService.getData("get-user", {}).subscribe(res => {
      if (res.status) {
        this.user.updateCurrentUserSubject(res.data);
        this.openDialog();
      }
    });
  }

  openDialog() {
    let dialogRef = this.dialog.open(UpgradeDialogComponent, {
      width: "290px",
      panelClass: "upgrade-dialog"
    });
  }
}
