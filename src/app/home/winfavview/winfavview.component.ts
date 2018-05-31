import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonApiService } from "./../../shared/services/common.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AppError, BadRequestError } from "app/shared";

@Component({
  templateUrl: "winfavview.component.html"
})
export class WinFavViewComponent implements OnInit, OnDestroy {
  type: string;
  url: string;
  content: any = {};
  users: any = {};
  checked: boolean;
  loading: boolean;
  empty: boolean;
  isShow: boolean;
  private _sub: Subscription;
  constructor(
    private allservice: CommonApiService,
    private route: ActivatedRoute
  ) {
    this.loading = false;
    this.empty = false;
  }

  ngOnInit() {
    this._sub = this.route.params.subscribe(param => {
      this.type = param["type"];
      this.isShow = false;
      this.checked = false;
      this.users["next"] = 1;
      this.users["loadMore"] = false;
      this.loadType();
    });
  }

  loadType() {
    this.users["upgrade"] = null;
    switch (this.type) {
      case "wink":
        this.url = "winks";
        this.content.heading = "Winks Sent";
        this.content.title = "Winked at you";
        this.content.view = true;
        break;
      case "fav":
        this.url = "favourites";
        this.content.heading = "My Favourites";
        this.content.title = "Favourited me";
        this.content.view = true;
        break;
      case "views":
        this.url = "views";
        this.content.heading = "Viewed me";
        this.checked = true;
        this.content.view = false;
        break;
    }
    if (this.checked) {
      this.users["next"] = 1;
      this.showAll();
    } else {
      this.getAll();
    }
  }

  getAll(type = "get") {
    if (type === "get") {
      this.loading = true;
    }
    this.users["loadMore"] = true;
    this.empty = false;
    this.allservice.getData(this.url, { page: this.users["next"] }).subscribe(
      res => {
        if (res.status) {
          if (res.data.total > 0) {
            if (type === "load") {
              let data: any[];
              data = res.data.data;
              this.users["item"] = this.users["item"].concat(data);
            } else {
              this.users["item"] = res.data.data;
              this.loading = false;
            }
            this.users["next"] = res.data.current_page + 1;
          } else {
            this.users["item"] = [];
            this.users["next"] = 1;
            this.loading = false;
            this.empty = true;
          }
          this.users["isNext"] = res.data.last_page > res.data.current_page;
          this.users["loadMore"] = false;
        } else {
          this.loading = false;
          this.empty = true;
        }
      },
      (error: AppError) => {
        if (error instanceof BadRequestError) {
          console.log(error);
          this.users["item"] = [];
          this.users["upgrade"] = error.originalError.error;
          this.loading = false;
        }
      }
    );
  }

  showAll(type = "get") {
    if (type === "get") {
      this.loading = true;
    }
    this.users["loadMore"] = true;
    this.empty = false;
    this.isShow = true;
    this.allservice
      .getData(this.url + "/show", { page: this.users["next"] })
      .subscribe(
        res => {
          if (res.status) {
            if (res.data.total > 0) {
              if (type === "load") {
                let data: any[];
                data = res.data.data;
                this.users["item"] = this.users["item"].concat(data);
              } else {
                this.users["item"] = res.data.data;
                this.loading = false;
              }
              this.users["next"] = res.data.current_page + 1;
            } else {
              this.users["item"] = [];
              this.users["next"] = 1;
              this.empty = true;
              this.loading = false;
            }
            this.users["isNext"] = res.data.last_page > res.data.current_page;
            this.users["loadMore"] = false;
          } else {
            this.loading = false;
            this.empty = true;
          }
        },
        (error: AppError) => {
          if (error instanceof BadRequestError) {
            console.log(error);
            this.users["upgrade"] = error.originalError.error;
            this.loading = false;
          }
        }
      );
  }

  ifChecked(e) {
    this.checked = !this.checked;
    this.users["next"] = 1;
    this.loadType();
  }

  loadMore() {
    if (this.checked) {
      this.showAll("load");
    } else {
      this.getAll("load");
    }
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
