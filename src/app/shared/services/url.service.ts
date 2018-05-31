import { environment } from "./../../../environments/environment.prod";
import { Injectable } from "@angular/core";
import { Location } from "@angular/common";

@Injectable()
export class UrlUtils {
  url;
  constructor(private _location: Location) {
    this.url = environment.baseUrl;
  }

  getImagePath(res) {
    let path: boolean;
    path = res.image ? true : false;
    if (path) {
      return environment.baseUrl + res.image;
    } else {
      return environment.dummyImg;
    }
  }

  getProfileImage(res) {
    let path: boolean;
    path = res.profile_pic ? true : false;
    if (path) {
      return res.profile_pic;
    } else {
      return environment.dummyImg;
    }
  }

  goBack() {
    this._location.back();
  }
}
