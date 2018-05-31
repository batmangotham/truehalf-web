import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { CommonApiService } from "app/shared";

@Component({
  templateUrl: "blog-type.component.html"
  // styleUrls: ["../blog.component.scss"]
})
export class BlogTypeComponent implements OnInit {
  type: string;
  url: string;
  data: any = {};
  constructor(
    private commonService: CommonApiService,
    private _route: ActivatedRoute
  ) {
    this.data["loadMore"] = false;
  }

  ngOnInit() {
    this._route.params.subscribe(param => {
      window.scrollTo(0, 0);
      this.type = param["type"];
      this.loadType();
    });
  }

  loadType() {
    switch (this.type) {
      case "events":
        this.url = "events";
        this.data["name"] = "Events";
        break;
      case "home":
        this.url = "blogs";
        this.data["name"] = "Blogs";
        break;
      default:
        this.url = "blogs";
        this.data["name"] = "Blogs";
        break;
    }
    this.data["isNext"] = false;
    this.data["loading"] = false;
    this.data["next"] = 1;
    this.getPosts();
  }

  getPosts(type = "get") {
    if (type === "get") {
      this.data["loading"] = true;
    } else {
      this.data["loadMore"] = true;
    }
    this.commonService
      .getData(this.url, {
        page: this.data["next"]
      })
      .subscribe(res => {
        if (res.status) {
          if (res.data.total > 0) {
            if (type === "load") {
              let data: any[];
              data = res.data.data;
              this.data["item"] = this.data["item"].concat(data);
              this.data["loadMore"] = false;
            } else {
              this.data["item"] = res.data.data;
              this.data["loading"] = false;
            }
            this.data["next"] = res.data.current_page + 1;
          } else {
            this.data["item"] = [];
            this.data["next"] = 1;
            this.data["empty"] = true;
            this.data["loading"] = false;
          }
          this.data["isNext"] = res.data.last_page > res.data.current_page;
          this.data["loadMore"] = false;
        } else {
          this.data["loading"] = false;
          this.data["empty"] = true;
        }
      });
  }

  loadMore() {
    this.getPosts("load");
  }
}
