import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: "blog.component.html"
})
export class BlogComponent implements OnInit {
  constructor(private route: Router) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
