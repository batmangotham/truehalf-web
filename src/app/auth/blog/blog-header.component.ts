import { UserService } from "app/shared";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-blog-header",
  templateUrl: "blog-header.component.html",
  styleUrls: ["blog.component.scss"]
})
export class BlogHeaderComponent implements OnInit {
  auth: boolean;
  constructor(private _user: UserService) {
    this._user.isAuthenticated.subscribe(res => {
      this.auth = res;
    });
  }

  ngOnInit() {}
}
