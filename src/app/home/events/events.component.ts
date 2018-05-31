import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { InternalServerError } from "./../../shared/errors/server.error";
import { NotFoundError } from "./../../shared/errors/not-found-error";
import { AppError } from "./../../shared/errors/app-error";
import { CommonApiService } from "app/shared";
import { Component, OnInit, ViewChild } from "@angular/core";
import { environment } from "environments/environment";
import { MatDatepicker } from "@angular/material";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "events.component.html"
})
export class EventsComponent implements OnInit {
  form;
  data: any = {};
  search: any = {};
  // private _sub: Subscription;
  @ViewChild(MatDatepicker) dp: MatDatepicker<Date>;
  constructor(
    private eventService: CommonApiService,
    fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = fb.group({
      location: ["", Validators.required],
      date: ["", Validators.required]
    });
  }
  ngOnInit() {
    this.data["search"] = false;
    this.data["next"] = 1;
    this.data["loadMore"] = false;
    this.data["loading"] = 0;
    this.getTodaysEvents();
    this.getEvents();
  }

  getEvents(type = "get") {
    this.data["loadMore"] = true;
    this.eventService
      .getData("events", {
        page: this.data["next"],
        date: this.search["date"],
        location: this.search["location"]
      })
      .subscribe(res => {
        if (res.status) {
          if (res.data.total > 0) {
            if (type === "load") {
              let data: any[];
              data = res.data.data;
              this.data["item"] = this.data["item"].concat(data);
            } else {
              this.data["item"] = res.data.data;
              this.data["loading"] = this.data["loading"] + 1;
            }
            this.data["next"] = res.data.current_page + 1;
          } else {
            this.data["loading"] = this.data["loading"] + 1;
            this.data["item"] = [];
            this.data["next"] = 1;
            this.data["empty"] = true;
          }
          this.data["isNext"] = res.data.last_page > res.data.current_page;
          this.data["loadMore"] = false;
        } else {
          this.data["empty"] = true;
          console.log(this.data.empty + "empty");
        }
      });
  }

  eventSearch(type = "get") {
    this.data["isNext"] = false;
    this.data["next"] = 1;
    this.data["loadMore"] = false;
    this.data["search"] = true;
    this.eventService
      .getData("events/search", {
        page: this.data["next"],
        date: this.search["date"],
        location: this.search["location"]
      })
      .subscribe(res => {
        if (res.status) {
          if (res.data.total > 0) {
            if (type === "load") {
              let data: any[];
              data = res.data.data;
              this.data["item"] = this.data["item"].concat(data);
            } else {
              this.data["item"] = res.data.data;
              this.data["search"] = false;
            }
            this.data["next"] = res.data.current_page + 1;
          } else {
            this.data["item"] = [];
            this.data["next"] = 1;
            this.data["search"] = false;
          }
          this.data["isMore"] = res.data.last_page > res.data.current_page;
          this.data["loadMore"] = false;
        } else {
          this.data["empty"] = true;
        }
      });
  }

  getTodaysEvents() {
    this.eventService.getData("events/today", {}).subscribe(
      res => {
        if (res.status && res.data.total > 0) {
          this.data["today"] = res.data.data;
          this.data["loading"] = this.data["loading"] + 1;
        } else {
          this.data["loading"] = this.data["loading"] + 1;
          this.data["today"] = null;
          console.log(this.data);
        }
      },
      (error: AppError) => {
        if (error instanceof NotFoundError) {
          console.log(error);
        } else {
          throw error;
        }
      }
    );
  }

  getBannerImage(res) {
    let path: boolean;
    path = res.banner_image ? true : false;
    if (path) {
      return environment.baseUrl + res.banner_image;
    } else {
      return environment.dummyImg;
    }
  }

  openDp() {
    this.dp.open();
  }
  loadMore(type?) {
    if (type === "search") {
      this.eventSearch("load");
    } else {
      this.getEvents("load");
    }
  }

  setValue() {
    let date = new Date();
    this.search["location"] = this.form.value.location;
    date = this.form.value.date;
    const newDate = date.toLocaleDateString();
    this.search["date"] = newDate;
  }

  onSubmit() {
    if (this.form.valid) {
      this.setValue();
      this.eventSearch();
    }
  }

  // ngOnDestroy() {
  //   this._sub.unsubscribe();
  // }
}
