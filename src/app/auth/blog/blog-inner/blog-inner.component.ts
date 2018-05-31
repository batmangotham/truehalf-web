import { CommonApiService } from "./../../../shared/services/common.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: "blog-inner.component.html"
})
export class BlogInnerComponent implements OnInit {
  data: any = {};
  type: string;
  slug: string;
  loading: boolean;
  constructor(
    private _route: ActivatedRoute,
    private commonService: CommonApiService
  ) {}

  ngOnInit() {
    this._route.params.subscribe(param => {
      window.scrollTo(0, 0);
      this.type = param["type"];
      this.slug = param["slug"];
      this.loading = false;
      this.getItem();
    });
  }

  getItem() {
    this.loading = true;
    this.commonService
      .getData(this.type + "/" + this.slug, {})
      .subscribe(res => {
        if (res.status) {
          this.data = res.data;
          this.loading = false;
        }else{

        }
      });
  }
}
