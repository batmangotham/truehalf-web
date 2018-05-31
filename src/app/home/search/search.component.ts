import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { CommonApiService, UserService } from "app/shared";
import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  templateUrl: "search.component.html",
  styleUrls: ["search.scss"]
})
export class SearchComponent implements OnInit, OnDestroy {
  form;
  search: any = {};
  loading: boolean;
  data: any = {};
  moreForm;
  sub;
  constructor(
    private onlineService: CommonApiService,
    public dialog: MatDialog,
    fb: FormBuilder,
    private _route: ActivatedRoute,
    public _user: UserService
  ) {
    this.form = fb.group({
      min: ["", Validators.required],
      max: ["", Validators.required]
    });
    this.moreForm = fb.group({
      religion: ["", Validators.required],
      education: ["", Validators.required],
      occupation: ["", Validators.required],
      smoke: ["", Validators.required],
      drink: ["", Validators.required],
      skin_color: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.sub = this._route.queryParams.subscribe(res => {
      if (res.distance) {
        console.log(res.distance);
        this.search["distance"] = res.distance;
      } else {
        this.search["distance"] = 100;
      }
    });
    this.loading = false;
    this.search["isExpand"] = false;
    this.search["online"] = true;
    this.data["next"] = 1;
    this.data["loadMore"] = false;
    this.setValue();
    this.getUserSearch();
    // this.getLocations();
    this.getOptions();
  }

  isChecked() {
    this.search["online"] = !this.search["online"];
    this.getUserSearch();
  }

  getUserSearch(type = "get") {
    if (type === "get") {
      this.data["next"] = 1;
      this.loading = true;
    } else {
      this.data["loadMore"] = true;
    }
    this.onlineService
      .getData("user/search", {
        page: this.data["next"],
        online_status: this.search["online"],
        min_age: this.form.value.min,
        max_age: this.form.value.max,
        religion: this.getMultipleValues(this.moreForm.value.religion),
        education: this.getMultipleValues(this.moreForm.value.education),
        occupation: this.getMultipleValues(this.moreForm.value.occupation),
        smoke: this.getMultipleValues(this.moreForm.value.smoke),
        drink: this.getMultipleValues(this.moreForm.value.drink),
        skin_color: this.getMultipleValues(this.moreForm.value.skin_color),
        distance: this.search["distance"]
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
              this.loading = false;
              this.data["empty"] = false;
            }
            this.data["next"] = res.data.current_page + 1;
          } else {
            this.loading = false;
            this.data["item"] = [];
            this.data["next"] = 1;
            this.data["empty"] = true;
          }
          this.data["isNext"] = res.data.last_page > res.data.current_page;
          this.data["loadMore"] = false;
        } else {
          this.loading = false;
          this.data["empty"] = true;
        }
      });
  }

  // getLocations() {
  //   this.onlineService.getData("get-location", {}).subscribe(res => {
  //     if (res.status && res.data) {
  //       const data = res.data;
  //       let location: any[] = [];
  //       for (const item of data) {
  //         location.push(item);
  //       }
  //       this.data["location"] = location;
  //       console.log(this.data);
  //     }
  //   });
  // }

  getOptions() {
    this.onlineService.getData("user/details", {}).subscribe(res => {
      if (res.status && res.data) {
        const data = res.data.options;
        this.data["religion"] = data.user_background.all_religion;
        this.data["education"] = data.user_background.all_education;
        this.data["occupation"] = data.user_lifestyle.all_occupation;
        this.data["smoke"] = data.user_lifestyle.all_smoke_type;
        this.data["drink"] = data.user_lifestyle.all_drink_type;
        this.data["skin_color"] = data.user_appearence.all_skin_color;
      }
    });
  }

  sliderValue(e) {
    this.search["distance"] = e.value;
    this.getUserSearch();
  }

  ageSubmit(e) {
    this.getUserSearch();
  }

  setValue() {
    this.form.setValue({
      min: 19,
      max: 30
    });
  }

  ageReset() {
    this.form.reset({
      min: "",
      max: ""
    });
    this.getUserSearch();
  }

  religionSubmit(e) {
    this.getUserSearch();
  }

  educationSubmit(e) {
    this.getUserSearch();
  }

  occupationSubmit(e) {
    this.getUserSearch();
  }

  smokeSubmit(e) {
    this.getUserSearch();
  }

  drinkSubmit(e) {
    this.getUserSearch();
  }
  skinSubmit(e) {
    this.getUserSearch();
  }

  moreFormReset(type) {
    type.reset("");
  }

  getMultipleValues(searchData) {
    let data: any[] = [];
    for (const item of searchData) {
      data.push(item.id);
    }
    return data;
  }

  expand() {
    this.search["isExpand"] = !this.search["isExpand"];
  }

  distanceReset() {
    this.search["distance"] = 0;
    this.getUserSearch();
  }

  loadMore() {
    this.getUserSearch("load");
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
