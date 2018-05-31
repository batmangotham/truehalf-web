import { ApiService } from "./api.service";
import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable()
export class CommonApiService extends ApiService {
  public url: string;
  constructor(http: Http, public _api: ApiService) {
    super(http);
    this.url = environment.apiUrl;
  }

  getData(url: string, data) {
    return this._api.get(this.url + url, data);
  }

  postData(url: string, data) {
    return this._api.post(this.url + url, data);
  }

  updateData(url: string, data) {
    return this._api.update(this.url + url, data);
  }

  deleteData(url: string, data) {
    return this._api.delete(this.url + url, data);
  }
}
