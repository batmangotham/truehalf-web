import { ActivatedRoute } from "@angular/router";
import { CommonApiService } from "./../../../shared/services/common.service";
import { Component, OnInit } from "@angular/core";
import { MiscService, AppError, BadRequestError } from "app/shared";

@Component({
  templateUrl: "plans.html",
  styleUrls: ["plans.scss"]
})
export class UpgradePlansComponent implements OnInit {
  url: string;
  data: any = {};
  constructor(
    private _route: ActivatedRoute,
    private commonService: CommonApiService,
    private misc: MiscService
  ) {
    this._route.params.subscribe(param => {
      console.log(param);
      this.url = param["type"];
      this.getPlans();
    });
  }

  ngOnInit() {}

  getPlans() {
    this.data["loading"] = true;
    this.commonService.getData(this.url + "-plans", {}).subscribe(
      res => {
        if (res.status && res.data.length) {
          console.log("have data");
          this.data["plans"] = res.data;
          this.data["loading"] = false;
        } else {
          console.log("no data");
          this.data["loading"] = false;
          this.data["empty"] = true;
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

  paypal(item?) {
    console.log(item);
    item.loading = true;
    let data = {};
    data["payment_type"] = item.payment_type;
    data["payment_id"] = item.id;
    this.commonService.postData("paypal/create-payment", data).subscribe(
      res => {
        if (res.data) {
          item.loading = false;
          this.misc.savePaymentDetails(res.data.subscription_start);
          window.location.href = res.data.url;
        }
      },
      (error: AppError) => {
        if (error instanceof BadRequestError) {
          item.loading = false;
        }
      }
    );
  }
}
