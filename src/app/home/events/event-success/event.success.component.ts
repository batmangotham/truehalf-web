import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { CommonApiService, AppError } from "app/shared";

@Component({
  templateUrl: "success.html",
  styleUrls: ["success.scss"]
})
export class EventSuccessComponent implements OnInit {
  _sub: Subscription;
  _sub2: Subscription;
  status: string;
  qParams: any = {};
  data: any = {};
  constructor(
    private _route: ActivatedRoute,
    private commonService: CommonApiService
  ) {
    this._sub = _route.params.subscribe(param => {
      this.status = param["status"];
      // console.log(`status ${this.status}`);
    });
    this._sub2 = _route.queryParams.subscribe(qParams => {
      this.qParams = qParams;
    });
  }

  ngOnInit() {
    if (this.qParams) {
      this.checkStatus();
    }
  }

  checkStatus() {
    this.data["loading"] = true;
    let data = {};
    data = JSON.parse(window.localStorage["current_event"]);
    data["PayerID"] = this.qParams["PayerID"];
    data["paymentId"] = this.qParams["paymentId"];
    data["token"] = this.qParams["token"];
    console.log(data);
    this.commonService.postData("paypal/return-payment", data).subscribe(
      res => {
        if (res.status) {
          this.data["loading"] = false;
          this.data["saleId"] = res.data.saleId;
        }
      },
      (error: AppError) => {
        console.log("error");
        this.data["loading"] = false;
        this.data["error"] = true;
      }
    );
  }
}
