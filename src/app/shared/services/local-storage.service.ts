import { Injectable } from "@angular/core";

@Injectable()
export class LocalService {
  setSkipped(item: string, value: number) {
    window.localStorage["skipItem"] = item;
    window.localStorage["skipValue"] = value;
  }

  getSkipped() {
    return window.localStorage["skipValue"];
  }
}
