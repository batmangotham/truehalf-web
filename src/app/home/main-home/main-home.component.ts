import { Router } from "@angular/router";
import { UrlUtils } from "./../../shared/services/url.service";
import { UserService, CommonApiService, AppError } from "app/shared";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from "@angular/core";

@Component({
  templateUrl: "main.component.html"
})
export class MainHomeComponent implements OnInit, AfterViewInit {
  @ViewChild("blueWrap") upgradeBlock: ElementRef;
  user: any;
  data: any = {};
  halves: any = {};
  pinkHeight: number;
  constructor(
    public userService: UserService,
    private homeService: CommonApiService,
    private route: Router
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.halves["empty"] = true;
    this.data["distance"] = 100;
    this.getEvents();
    this.getHalves();
    this.getNewMembers();
  }

  ngAfterViewInit() {
    if (!this.userService.getCurrentUser().subscription) {
      setTimeout(
        _ => (this.pinkHeight = this.upgradeBlock.nativeElement.offsetHeight)
      );
      console.log("height check");
    }
  }

  getEvents() {
    this.homeService.getData("events", {}).subscribe(res => {
      if (res.status && res.data.total > 0) {
        this.data["events"] = res.data.data;
        this.data["events_empty"] = false;
      } else {
        this.data["events_empty"] = true;
      }
    });
  }

  getHalves() {
    this.homeService.getData("halves", {}).subscribe(res => {
      if (res.status && res.data) {
        this.halves = res.data;
        this.halves["empty"] = false;
      } else {
        this.halves["empty"] = true;
      }
    });
  }

  addFav(id) {
    let fav: any = {};
    fav["true_half_id"] = id;
    this.homeService.postData("favourites/add", fav).subscribe(res => {
      this.route.navigate(["halves"]);
    });
  }

  isDislike() {
    this.route.navigate(["/halves"]);
  }

  sliderValue(e) {
    this.data["distance"] = e.value;
  }

  getNewMembers() {
    this.homeService.getData("new-members", {}).subscribe(res => {
      if (res.status) {
        if (res.data.length) {
          this.data["new"] = res.data;
        }
      }
    });
  }

  upgrade() {
    let data: any = {};
    data["payment_id"] = 1;
    this.homeService.postData("paypal/create-payment", data).subscribe(
      res => {
        if (res.status && res.data) {
          console.log(res.data);
          // window.open(res.data, "_blank");
        }
      },
      (error: AppError) => {
        console.log(error);
      }
    );
  }
}
