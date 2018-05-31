import { CommonApiService } from "./../../shared/services/common.service";
import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-halves",
  templateUrl: "halves.component.html"
})
export class HalvesComponent implements OnInit {
  user: any = {};
  data: any = {};
  constructor(
    private halvesService: CommonApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getHalves();
  }

  getHalves() {
    this.user["loading"] = true;
    this.halvesService.getData("halves", {}).subscribe(res => {
      if (res.status && res.data) {
        this.user = res.data;
        this.user["empty"] = false;
        this.user["loading"] = false;
      } else {
        console.log("empty");
        this.user["loading"] = false;
        this.user["empty"] = true;
      }
    });
  }

  addFav(id) {
    console.log(id);
    this.data["true_half_id"] = id;
    this.halvesService.postData("favourites/add", this.data).subscribe(res => {
      this.getHalves();
    });
  }
}
